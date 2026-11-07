"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PhpWeb = void 0;
var _PhpWebBase2 = require("./PhpWebBase.js");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
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
var defaultVersion = '8.4';

/**
 * Browser-hosted PHP wrapper.
 */
var PhpWeb = exports.PhpWeb = /*#__PURE__*/function (_PhpWebBase) {
  /**
   * Creates a browser-hosted PHP runtime.
   * @param {PhpRuntimeArgs} args Runtime configuration.
   */
  function PhpWeb() {
    var _args$version;
    var _this;
    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, PhpWeb);
    var version = (_args$version = args.version) !== null && _args$version !== void 0 ? _args$version : defaultVersion;
    var constructorArgs = _objectSpread({
      version: version
    }, args);
    switch (version) {
      case '8.5':
        _this = _callSuper(this, PhpWeb, [function (specifier) {
          return new Promise(function (r) {
            return r(specifier);
          }).then(function (s) {
            return _interopRequireWildcard(require(s));
          });
        }("./php8.5-web.mjs"), constructorArgs]);
        break;
      case '8.4':
        _this = _callSuper(this, PhpWeb, [function (specifier) {
          return new Promise(function (r) {
            return r(specifier);
          }).then(function (s) {
            return _interopRequireWildcard(require(s));
          });
        }("./php8.4-web.mjs"), constructorArgs]);
        break;
      case '8.3':
        _this = _callSuper(this, PhpWeb, [function (specifier) {
          return new Promise(function (r) {
            return r(specifier);
          }).then(function (s) {
            return _interopRequireWildcard(require(s));
          });
        }("./php8.3-web.mjs"), constructorArgs]);
        break;
      case '8.2':
        _this = _callSuper(this, PhpWeb, [function (specifier) {
          return new Promise(function (r) {
            return r(specifier);
          }).then(function (s) {
            return _interopRequireWildcard(require(s));
          });
        }("./php8.2-web.mjs"), constructorArgs]);
        break;
      case '8.1':
        _this = _callSuper(this, PhpWeb, [function (specifier) {
          return new Promise(function (r) {
            return r(specifier);
          }).then(function (s) {
            return _interopRequireWildcard(require(s));
          });
        }("./php8.1-web.mjs"), constructorArgs]);
        break;
      case '8.0':
        _this = _callSuper(this, PhpWeb, [function (specifier) {
          return new Promise(function (r) {
            return r(specifier);
          }).then(function (s) {
            return _interopRequireWildcard(require(s));
          });
        }("./php8.0-web.mjs"), constructorArgs]);
        break;
      default:
        throw new Error("Unsupported PHP runtime: ".concat(version));
    }
    return _assertThisInitialized(_this);
  }
  _inherits(PhpWeb, _PhpWebBase);
  return _createClass(PhpWeb);
}(_PhpWebBase2.PhpWebBase);