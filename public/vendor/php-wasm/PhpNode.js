"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PhpNode = void 0;
var _PhpBase2 = require("./PhpBase.js");
var _nodePath = _interopRequireDefault(require("node:path"));
var _nodeUrl = _interopRequireDefault(require("node:url"));
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _process$versions;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var defaultVersion = process.env.PHP_VERSION === '8.5' || process.env.PHP_VERSION === '8.4' || process.env.PHP_VERSION === '8.3' || process.env.PHP_VERSION === '8.2' || process.env.PHP_VERSION === '8.1' || process.env.PHP_VERSION === '8.0' ? process.env.PHP_VERSION : '8.4';
var normalizeRuntimeModule = function normalizeRuntimeModule(runtime) {
  return runtime && _typeof(runtime) === 'object' && 'default' in runtime ? runtime : {
    "default": runtime
  };
};
var isBun = typeof process !== 'undefined' && Boolean((_process$versions = process.versions) === null || _process$versions === void 0 ? void 0 : _process$versions.bun);
var loadRuntime = function loadRuntime(specifier) {
  if (typeof require === 'function' && !isBun) {
    return Promise.resolve(normalizeRuntimeModule(require(specifier.replace(/\.mjs$/, '.js'))));
  }
  return function (specifier) {
    return new Promise(function (r) {
      return r("".concat(specifier));
    }).then(function (s) {
      return _interopRequireWildcard(require(s));
    });
  }(specifier).then(normalizeRuntimeModule);
};

/**
 * Node.js-hosted PHP wrapper.
 */
var PhpNode = exports.PhpNode = /*#__PURE__*/function (_PhpBase) {
  /**
   * Creates a Node.js-hosted PHP runtime.
   * @param {PhpRuntimeArgs} args Runtime configuration.
   */
  function PhpNode() {
    var _args$version;
    var _this;
    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, PhpNode);
    var locateFile = function locateFile(name, dir) {
      if (name.substr(0, 7) === 'file://') {
        name = new URL(name).pathname;
      }
      if (dir === '') {
        if (typeof __dirname === 'undefined') {
          dir = _nodePath["default"].dirname(_nodeUrl["default"].fileURLToPath((undefined /*import.meta*/).url));
        } else {
          dir = __dirname;
        }
      }
      var located = _nodePath["default"].resolve(_nodePath["default"].format({
        dir: dir,
        name: name
      }));
      if (_nodeFs["default"].existsSync(located)) {
        return located;
      }
    };
    var version = (_args$version = args.version) !== null && _args$version !== void 0 ? _args$version : defaultVersion;
    var constructorArgs = _objectSpread({
      locateFile: locateFile,
      version: version
    }, args);
    switch (version) {
      case '8.5':
        _this = _callSuper(this, PhpNode, [loadRuntime('./php8.5-node.mjs'), constructorArgs]);
        break;
      case '8.4':
        _this = _callSuper(this, PhpNode, [loadRuntime('./php8.4-node.mjs'), constructorArgs]);
        break;
      case '8.3':
        _this = _callSuper(this, PhpNode, [loadRuntime('./php8.3-node.mjs'), constructorArgs]);
        break;
      case '8.2':
        _this = _callSuper(this, PhpNode, [loadRuntime('./php8.2-node.mjs'), constructorArgs]);
        break;
      case '8.1':
        _this = _callSuper(this, PhpNode, [loadRuntime('./php8.1-node.mjs'), constructorArgs]);
        break;
      case '8.0':
        _this = _callSuper(this, PhpNode, [loadRuntime('./php8.0-node.mjs'), constructorArgs]);
        break;
      default:
        throw new Error("Unsupported PHP runtime: ".concat(version));
    }
    return _assertThisInitialized(_this);
  }
  _inherits(PhpNode, _PhpBase);
  return _createClass(PhpNode);
}(_PhpBase2.PhpBase);