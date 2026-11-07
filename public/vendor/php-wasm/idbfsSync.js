"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enableIncrementalIdbfs = enableIncrementalIdbfs;
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/**
 * Pending changes use the existing IDBFS FILE_DATA format. Hydration still uses
 * IDBFS reconciliation; flushing writes only paths changed through MEMFS ops.
 * The caller owns filesystem serialization (the browser wrappers use Web Locks).
 */

var installed = new WeakSet();

/**
 * Installs incremental persistence on an Emscripten MEMFS/IDBFS filesystem.
 * Other backends, including WasmFS and NODEFS, keep their existing behavior.
 * @param {object} FS Native Emscripten filesystem object.
 * @returns {void} Installs once per runtime, without changing the database schema.
 */
function enableIncrementalIdbfs(FS) {
  var _FS$root;
  if (!(FS !== null && FS !== void 0 && (_FS$root = FS.root) !== null && _FS$root !== void 0 && _FS$root.mount) || typeof FS.getMounts !== 'function' || installed.has(FS)) return;
  var backends = new Set(FS.getMounts(FS.root.mount).map(function (mount) {
    return mount.type;
  }).filter(function (type) {
    return (type === null || type === void 0 ? void 0 : type.DB_STORE_NAME) === 'FILE_DATA' && ['getDB', 'getLocalSet', 'loadLocalEntry', 'storeLocalEntry', 'removeLocalEntry', 'syncfs'].every(function (name) {
      return typeof type[name] === 'function';
    });
  }));
  if (!backends.size) return;
  installed.add(FS);
  var states = new WeakMap();
  var wrapped = new WeakMap();
  var applying = 0;
  var join = function join(parent, name) {
    return parent.replace(/\/$/, '') + '/' + name;
  };

  /**
   * Records a path's final state, retaining subtree deletion across recreation.
   * @param {object} state Mount persistence state.
   * @param {string} path Absolute path in that mount.
   * @param {object|null} node Current node, or null after deletion.
   * @param {boolean} [tree] Remove the prior persisted subtree before writing.
   */
  function record(state, path, node) {
    var _state$pending$get;
    var tree = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    if (applying || path === state.mount.mountpoint) return;
    if (tree) {
      var _iterator = _createForOfIteratorHelper(state.pending.keys()),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var key = _step.value;
          if (key.startsWith(path + '/')) state.pending["delete"](key);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    state.pending.set(path, {
      node: node,
      tree: tree || ((_state$pending$get = state.pending.get(path)) === null || _state$pending$get === void 0 ? void 0 : _state$pending$get.tree) || false
    });
  }

  /**
   * Tests that an open node still has a name in this filesystem.
   * Writes through an unlinked or overwritten file descriptor must not resurrect it.
   * @param {object} node MEMFS node.
   * @returns {boolean} Whether every parent still names this node.
   */
  function linked(node) {
    for (var current = node; current.parent !== current; current = current.parent) {
      var _current$parent$conte;
      if (((_current$parent$conte = current.parent.contents) === null || _current$parent$conte === void 0 ? void 0 : _current$parent$conte[current.name]) !== current) return false;
    }
    return true;
  }

  /**
   * Records a live node after a content or metadata mutation.
   * @param {object} node MEMFS node, possibly outside an IDBFS mount.
   */
  function mark(node) {
    var state = states.get(node === null || node === void 0 ? void 0 : node.mount);
    if (state && linked(node)) record(state, FS.getPath(node), node);
  }

  /**
   * Traverses nodes without repeatedly resolving their absolute paths.
   * @param {object} node Subtree root.
   * @param {string} path Root's absolute path.
   * @param {(node: object, path: string) => void} callback Visitor.
   */
  function visit(node, path, callback) {
    var pending = [[node, path]];
    while (pending.length) {
      var _pending$pop = pending.pop(),
        _pending$pop2 = _slicedToArray(_pending$pop, 2),
        child = _pending$pop2[0],
        childPath = _pending$pop2[1];
      callback(child, childPath);
      if (FS.isDir(child.mode)) {
        for (var _i = 0, _Object$values = Object.values(child.contents); _i < _Object$values.length; _i++) {
          var entry = _Object$values[_i];
          pending.push([entry, join(childPath, entry.name)]);
        }
      }
    }
  }

  /**
   * Attaches native mutation hooks once to each shared MEMFS operations table.
   * @param {object} node Existing or newly created filesystem node.
   */
  function attach(node) {
    for (var _i2 = 0, _arr = [[node.node_ops, ['mknod', 'symlink', 'rename', 'unlink', 'rmdir', 'setattr']], [node.stream_ops, ['write', 'allocate', 'msync', 'mmap', 'setattr']]]; _i2 < _arr.length; _i2++) {
      var _arr$_i = _slicedToArray(_arr[_i2], 2),
        ops = _arr$_i[0],
        names = _arr$_i[1];
      if (!ops) continue;
      if (!wrapped.has(ops)) wrapped.set(ops, new Set());
      var _iterator2 = _createForOfIteratorHelper(names),
        _step2;
      try {
        var _loop = function _loop() {
          var name = _step2.value;
          if (typeof ops[name] !== 'function' || wrapped.get(ops).has(name)) return 1; // continue
          wrapped.get(ops).add(name);
          var original = ops[name];
          ops[name] = function () {
            var _args$0$node, _args$;
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }
            var target = (_args$0$node = (_args$ = args[0]) === null || _args$ === void 0 ? void 0 : _args$.node) !== null && _args$0$node !== void 0 ? _args$0$node : args[0];
            var state = states.get(target === null || target === void 0 ? void 0 : target.mount);
            if (!state) return original.apply(this, args);
            var oldParent = target.parent;
            var oldPath = name === 'rename' ? FS.getPath(target) : null;
            var result;
            try {
              result = original.apply(this, args);
            } finally {
              // Also retain metadata/partial writes if a mutating operation throws.
              if (['write', 'allocate', 'msync', 'setattr'].includes(name)) mark(target);
            }
            if (name === 'mknod' || name === 'symlink') {
              attach(result);
              mark(target);
              mark(result);
            } else if (name === 'unlink' || name === 'rmdir') {
              record(state, join(FS.getPath(target), args[1]), null, name === 'rmdir');
              mark(target);
            } else if (name === 'rename') {
              var newPath = join(FS.getPath(args[1]), args[2]);
              record(state, oldPath, null, FS.isDir(target.mode));
              record(state, newPath, null, FS.isDir(target.mode));
              visit(target, newPath, function (node, path) {
                return record(state, path, node);
              });
              mark(oldParent);
              mark(args[1]);
            } else if (name === 'mmap' && !result.allocated && args[3] & 2 && !(args[4] & 2)) {
              // Writable MAP_SHARED views can change bytes without another FS call.
              state.aliased.add(target);
            }
            return result;
          };
        };
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          if (_loop()) continue;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }

  /**
   * Tracks a mount before its first synchronization. The first sync still
   * establishes a full baseline, including files created before installation.
   * @param {object} mount IDBFS mount.
   * @returns {object} Per-mount journal and synchronization queue.
   */
  function stateFor(mount) {
    if (!states.has(mount)) {
      states.set(mount, {
        mount: mount,
        ready: false,
        failed: false,
        pending: new Map(),
        aliased: new Set(),
        tail: Promise.resolve()
      });
      visit(mount.root, mount.mountpoint, attach);
    }
    return states.get(mount);
  }

  /**
   * Removes only generations actually committed; concurrent mutations stay dirty.
   * @param {object} state Mount persistence state.
   * @param {Map<string, object>} changes Snapshot at synchronization start.
   */
  function acknowledge(state, changes) {
    var _iterator3 = _createForOfIteratorHelper(changes),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var _step3$value = _slicedToArray(_step3.value, 2),
          path = _step3$value[0],
          change = _step3$value[1];
        if (state.pending.get(path) === change) state.pending["delete"](path);
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
  }

  /**
   * Commits changed records atomically within one IDBFS mount.
   * @param {object} backend Existing IDBFS backend.
   * @param {object} state Mount persistence state.
   * @returns {Promise<void>} Resolves on transaction completion, not request success.
   */
  function flush(_x, _x2) {
    return _flush.apply(this, arguments);
  }
  function _flush() {
    _flush = _asyncToGenerator(function* (backend, state) {
      var _iterator6 = _createForOfIteratorHelper(state.aliased),
        _step6;
      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var node = _step6.value;
          if (linked(node)) mark(node);else state.aliased["delete"](node);
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
      var changes = new Map(state.pending);
      if (!changes.size) return;
      try {
        var entries = [];
        var _iterator7 = _createForOfIteratorHelper(changes),
          _step7;
        try {
          var _loop2 = function* _loop2() {
            var _step7$value = _slicedToArray(_step7.value, 2),
              path = _step7$value[0],
              change = _step7$value[1];
            if (!change.node) return 1; // continue
            var entry = yield new Promise(function (resolve, reject) {
              return backend.loadLocalEntry(path, function (error, entry) {
                return error ? reject(error) : resolve(entry);
              });
            });
            // Freeze payloads while getDB/IndexedDB is pending. Later writes retain
            // their own journal entries and cannot change this transaction's data.
            entries.push([path, _objectSpread(_objectSpread({}, entry), entry.contents && {
              contents: entry.contents.slice()
            })]);
          };
          for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
            if (yield* _loop2()) continue;
          }
        } catch (err) {
          _iterator7.e(err);
        } finally {
          _iterator7.f();
        }
        var db = yield new Promise(function (resolve, reject) {
          return backend.getDB(state.mount.mountpoint, function (error, db) {
            return error ? reject(error) : resolve(db);
          });
        });
        yield new Promise(function (resolve, reject) {
          var transaction = db.transaction([backend.DB_STORE_NAME], 'readwrite');
          var failure;
          transaction.oncomplete = function () {
            return resolve();
          };
          transaction.onabort = function () {
            var _ref, _failure;
            return reject((_ref = (_failure = failure) !== null && _failure !== void 0 ? _failure : transaction.error) !== null && _ref !== void 0 ? _ref : new Error('IDBFS transaction aborted.'));
          };
          transaction.onerror = function (event) {
            var _failure2;
            (_failure2 = failure) !== null && _failure2 !== void 0 ? _failure2 : failure = event.target.error;
            // An explicitly aborted transaction settles only after onabort.
            event.preventDefault();
            try {
              transaction.abort();
            } catch (_unused) {/* An abort already in progress also rejects outstanding requests. */}
          };
          try {
            var store = transaction.objectStore(backend.DB_STORE_NAME);
            var _iterator8 = _createForOfIteratorHelper(changes),
              _step8;
            try {
              for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
                var _step8$value = _slicedToArray(_step8.value, 2),
                  _path = _step8$value[0],
                  change = _step8$value[1];
                if (!change.node || change.tree) store["delete"](_path);
                if (change.tree) store["delete"](IDBKeyRange.bound(_path + '/', _path + '0', false, true));
              }
            } catch (err) {
              _iterator8.e(err);
            } finally {
              _iterator8.f();
            }
            for (var _i3 = 0, _entries = entries; _i3 < _entries.length; _i3++) {
              var _entries$_i = _slicedToArray(_entries[_i3], 2),
                path = _entries$_i[0],
                entry = _entries$_i[1];
              store.put(entry, path);
            }
          } catch (error) {
            failure = error;
            transaction.abort();
          }
        });
        acknowledge(state, changes);
        state.failed = false;
      } catch (error) {
        state.failed = true;
        throw error;
      }
    });
    return _flush.apply(this, arguments);
  }
  var _iterator4 = _createForOfIteratorHelper(backends),
    _step4;
  try {
    var _loop3 = function _loop3() {
      var backend = _step4.value;
      var originalSync = backend.syncfs;
      var originalLocal = backend.getLocalSet;
      var _loop4 = function _loop4() {
        var name = _arr2[_i4];
        var original = backend[name];
        backend[name] = function () {
          applying++;
          try {
            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = arguments[_key2];
            }
            if (name !== 'storeLocalEntry' || !FS.isLink(args[1].mode)) return original.apply(void 0, args);
            // IDBFS's chmod/utime follow links, which fails for a dangling link
            // or a target hydrated later. Apply metadata to the link itself.
            var path = args[0],
              entry = args[1],
              callback = args[2];
            try {
              var node;
              try {
                node = FS.lookupPath(path).node;
              } catch (error) {
                if (error.errno !== 44) throw error;
              }
              if (node && (!FS.isLink(node.mode) || node.link !== entry.link)) {
                if (FS.isDir(node.mode)) FS.rmdir(path);else FS.unlink(path);
                node = null;
              }
              if (!node) node = FS.symlink(entry.link, path);
              var timestamp = entry.timestamp.getTime();
              node.node_ops.setattr(node, {
                mode: entry.mode,
                atime: timestamp,
                mtime: timestamp,
                ctime: timestamp,
                timestamp: timestamp
              });
            } catch (error) {
              return callback(error);
            }
            callback(null);
          } finally {
            applying--;
          }
        };
      };
      for (var _i4 = 0, _arr2 = ['storeLocalEntry', 'removeLocalEntry']; _i4 < _arr2.length; _i4++) {
        _loop4();
      }
      backend.getLocalSet = function (mount, callback) {
        var _mount$mounts;
        if ((_mount$mounts = mount.mounts) !== null && _mount$mounts !== void 0 && _mount$mounts.length) return originalLocal(mount, callback);
        var entries = Object.create(null);
        try {
          visit(mount.root, mount.mountpoint, function (node, path) {
            if (node !== mount.root) entries[path] = {
              timestamp: node.node_ops.getattr(node).mtime
            };
          });
        } catch (error) {
          return callback(error);
        }
        callback(null, {
          type: 'local',
          entries: entries
        });
      };
      backend.syncfs = function (mount, populate, callback) {
        var state = stateFor(mount);
        var fullSync = /*#__PURE__*/function () {
          var _ref2 = _asyncToGenerator(function* (populate) {
            var changes = new Map(state.pending);
            try {
              var _mount$mounts2;
              yield new Promise(function (resolve, reject) {
                return originalSync(mount, populate, function (error) {
                  return error ? reject(error) : resolve();
                });
              });
              state.ready = !((_mount$mounts2 = mount.mounts) !== null && _mount$mounts2 !== void 0 && _mount$mounts2.length);
              state.failed = false;
              acknowledge(state, changes);
            } catch (error) {
              if (!populate) state.failed = true;
              throw error;
            }
          });
          return function fullSync(_x3) {
            return _ref2.apply(this, arguments);
          };
        }();
        var operation = state.tail.then(/*#__PURE__*/_asyncToGenerator(function* () {
          var _mount$mounts3;
          // A subsequent hydration must not discard writes whose commit failed.
          if (populate && state.failed) {
            if (state.ready) yield flush(backend, state);else yield fullSync(false);
          }
          if (populate || !state.ready || (_mount$mounts3 = mount.mounts) !== null && _mount$mounts3 !== void 0 && _mount$mounts3.length) yield fullSync(populate);else yield flush(backend, state);
        }));
        state.tail = operation["catch"](function () {});
        operation.then(function () {
          return callback(null);
        }, function (error) {
          return callback(error);
        });
      };
    };
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      _loop3();
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
  var _iterator5 = _createForOfIteratorHelper(FS.getMounts(FS.root.mount)),
    _step5;
  try {
    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
      var mount = _step5.value;
      if (backends.has(mount.type)) stateFor(mount);
    }
  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }
}