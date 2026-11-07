"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commitTransaction = commitTransaction;
exports.requestWebLock = requestWebLock;
exports.startTransaction = startTransaction;
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * @typedef {object} PersistentPhpRuntime
 * @property {boolean} [persist] Indicates whether the runtime has persistent storage enabled.
 * @property {{syncfs?: (populate: boolean, callback: (error?: Error) => void) => void}} [FS] Filesystem bridge exposed by the runtime.
 */

/**
 * @typedef {object} TransactionalWrapper
 * @property {Promise<PersistentPhpRuntime>} binary Deferred runtime instance used for transaction work.
 * @property {boolean|Promise<void>} transactionStarted Tracks the currently active transaction, if any.
 * @property {PersistentPhpRuntime|null} [transactionRuntime] Runtime captured when the active transaction started.
 */

var fallbackLocks = new Map();

/**
 * Clears transaction state if it still belongs to the supplied transaction.
 * @param {TransactionalWrapper} wrapper Runtime wrapper coordinating FS transactions.
 * @param {boolean|Promise<void>} transactionStarted Transaction state whose identity should be cleared.
 */
var clearTransaction = function clearTransaction(wrapper, transactionStarted) {
  if (wrapper.transactionStarted === transactionStarted) {
    wrapper.transactionStarted = false;
    wrapper.transactionRuntime = null;
  }
};

/**
 * Runs a callback while holding a named Web Lock when the API is available.
 *
 * Browsers without Web Locks use a FIFO lock scoped to the current JavaScript
 * realm. This preserves in-page runtime serialization, but cannot coordinate
 * filesystem access with other tabs or workers.
 * @template T
 * @param {string} name Lock name.
 * @param {() => T|Promise<T>} callback Work to perform while holding the lock.
 * @returns {Promise<T>} Resolves with the callback result after acquiring the lock.
 */
function requestWebLock(name, callback) {
  var _globalThis$navigator, _fallbackLocks$get;
  var lockManager = (_globalThis$navigator = globalThis.navigator) === null || _globalThis$navigator === void 0 ? void 0 : _globalThis$navigator.locks;
  if (typeof (lockManager === null || lockManager === void 0 ? void 0 : lockManager.request) === 'function') {
    return lockManager.request(name, callback);
  }
  var previous = (_fallbackLocks$get = fallbackLocks.get(name)) !== null && _fallbackLocks$get !== void 0 ? _fallbackLocks$get : Promise.resolve();
  var operation = previous.then(callback);
  var tail = operation["catch"](function () {
    return undefined;
  });
  fallbackLocks.set(name, tail);
  tail.then(function () {
    if (fallbackLocks.get(name) === tail) {
      fallbackLocks["delete"](name);
    }
  });
  return operation;
}

/**
 * Starts a persisted filesystem transaction for a runtime wrapper.
 * @param {TransactionalWrapper} wrapper Runtime wrapper coordinating FS transactions.
 * @returns {Promise<void>} Resolves when the transaction has been started.
 */
function startTransaction(_x) {
  return _startTransaction.apply(this, arguments);
}
/**
 * Commits a persisted filesystem transaction for a runtime wrapper.
 * @param {TransactionalWrapper} wrapper Runtime wrapper coordinating FS transactions.
 * @param {boolean} readOnly Indicates whether the transaction only performed reads.
 * @returns {Promise<void>} Resolves when the transaction has been committed.
 */
function _startTransaction() {
  _startTransaction = _asyncToGenerator(function* (wrapper) {
    if (wrapper.transactionStarted) {
      yield wrapper.transactionStarted;
      return;
    }
    var php = yield wrapper.binary;
    if (!php.persist) {
      return;
    }
    if (wrapper.transactionStarted) {
      yield wrapper.transactionStarted;
      return;
    }

    /** @type {(value?: void) => void} */
    var acceptStart;
    /** @type {(reason?: unknown) => void} */
    var rejectStart;
    var transactionStarted = new Promise(function (accept, reject) {
      acceptStart = accept;
      rejectStart = reject;
    });
    wrapper.transactionRuntime = php;
    wrapper.transactionStarted = transactionStarted;
    try {
      php.FS.syncfs(true, function (error) {
        if (error) {
          rejectStart(error);
        } else {
          acceptStart();
        }
      });
    } catch (error) {
      rejectStart(error);
    }
    try {
      return yield transactionStarted;
    } catch (error) {
      clearTransaction(wrapper, transactionStarted);
      throw error;
    }
  });
  return _startTransaction.apply(this, arguments);
}
function commitTransaction(_x2) {
  return _commitTransaction.apply(this, arguments);
}
function _commitTransaction() {
  _commitTransaction = _asyncToGenerator(function* (wrapper) {
    var readOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var transactionStarted = wrapper.transactionStarted;
    if (!transactionStarted) {
      var _php = yield wrapper.binary;
      if (!_php.persist) {
        return;
      }
      throw new Error('No transaction initialized.');
    }
    var php = wrapper.transactionRuntime;
    if (!php) {
      clearTransaction(wrapper, transactionStarted);
      throw new Error('No transaction initialized.');
    }
    try {
      yield transactionStarted;
      if (readOnly) {
        return;
      }
      return yield new Promise(function (accept, reject) {
        return php.FS.syncfs(false, function (error) {
          if (error) {
            reject(error);
          } else {
            accept();
          }
        });
      });
    } finally {
      clearTransaction(wrapper, transactionStarted);
    }
  });
  return _commitTransaction.apply(this, arguments);
}