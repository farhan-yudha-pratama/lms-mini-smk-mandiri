"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveDependencies = void 0;
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/**
 * A preload file definition.
 * @typedef {object} FileDef
 * @property {string} url URL used to preload the file.
 * @property {string} path Virtual filesystem path where the file should be mounted.
 * @property {string} [name] Optional explicit filename for the mounted file.
 */

/**
 * A shared library dependency definition.
 * @typedef {string|object} LibDef
 * @property {string} [name] Shared library filename.
 * @property {string|URL} [url] URL used to preload the shared library.
 * @property {boolean} [ini] Indicates whether the library should be loaded via `php.ini`.
 * @property {(wrapper: object) => LibDef[]} [getLibs] Returns additional dependent shared libraries.
 * @property {(wrapper: object) => FileDef[]} [getFiles] Returns additional dependent preload files.
 */

/**
 * An object representing files, libs and urlLibs for a shared library.
 * @typedef {object} ResolvedDependencies
 * @property {FileDef[]} files Normalized preload file definitions.
 * @property {LibDef[]} libs Normalized shared library definitions.
 * @property {{[key: string]: string|URL}} urlLibs Mapping of resource names to URLs.
 */

/**
 * Resolves dependencies related to dynamically loaded shared libs.
 * Normalizes LibDefs & FileDefs, and extracts URLs to specified resources.
 * @param {LibDef[]} sharedLibs List of LibDefs to resolve dependencies for.
 * @param {object} wrapper PHP object to resolve dependencies for.
 * @returns {ResolvedDependencies} Normalized LibDefs, FileDefs, and their URLs.
 */
var resolveDependencies = exports.resolveDependencies = function resolveDependencies(sharedLibs, wrapper) {
  var _files = [];
  var _libs = [];
  (sharedLibs || []).flat().forEach(function (libDef) {
    if (_typeof(libDef) === 'object') {
      if (typeof libDef.getLibs === 'function') {
        _libs.push.apply(_libs, _toConsumableArray(libDef.getLibs(wrapper)));
      } else {
        _libs.push(libDef);
      }
      if (typeof libDef.getFiles === 'function') {
        _files.push.apply(_files, _toConsumableArray(libDef.getFiles(wrapper)));
      }
    } else {
      _libs.push(libDef);
    }
  });
  var files = _files.map(function (fileDef) {
    var url = new URL(fileDef.url).href;
    var path = fileDef.path;
    var name = fileDef.name || path.split('/').pop();
    var parent = path.substr(0, path.length - name.length);
    return {
      parent: parent,
      name: name,
      path: path,
      url: url
    };
  });

  /** @type {{[key: string]: string|URL}} */
  var urlLibs = {};
  var libs = _libs.map(function (libDef) {
    if (typeof libDef === 'string' || libDef instanceof URL) {
      libDef = String(libDef);
      if (libDef.substr(0, 1) == '/' || libDef.substr(0, 2) == './' || libDef.substr(0, 2) == '../' || libDef.substr(0, 8) == 'https://' || libDef.substr(0, 7) == 'http://' || libDef.substr(0, 7) == 'file://') {
        var name = libDef.split('/').pop();
        var url = libDef;
        urlLibs[name] = url;
        return {
          name: name,
          url: url,
          ini: true
        };
      }
      return libDef;
    } else if (_typeof(libDef) === 'object') {
      var _libDef$name;
      var _name = (_libDef$name = libDef.name) !== null && _libDef$name !== void 0 ? _libDef$name : String(libDef.url).split('/').pop();
      urlLibs[_name] = String(libDef.url);
      libDef.url = String(libDef.url);
      return libDef;
    }
  });
  return {
    files: files,
    libs: libs,
    urlLibs: urlLibs
  };
};