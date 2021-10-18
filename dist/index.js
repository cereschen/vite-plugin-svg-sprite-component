"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var htmlparser2_1 = require("htmlparser2");
var dom_serializer_1 = __importDefault(require("dom-serializer"));
var path_1 = require("path");
var magic_string_1 = __importDefault(require("magic-string"));
function createPlugin(options) {
    var _this = this;
    if (options === void 0) { options = {}; }
    var symbolId = options.symbolId, component = options.component, removeAttrs = options.removeAttrs, transform = options.transform;
    var cache = new Map();
    return {
        name: 'svg-sprite-component',
        transform: function (source, path) { return __awaiter(_this, void 0, void 0, function () {
            var tmp, code, svgName, finalSymbolId, svgCode, svgNode, _a, width, height, childElements, removeAttrList, componentCode, exportName, defaultExport, componentName, htmlCode, transformedCode, s, result;
            return __generator(this, function (_b) {
                if (!path.match(/\.svg$/i)) {
                    return [2 /*return*/, { code: source, map: { mappings: '' } }];
                }
                tmp = cache.get(path);
                if (tmp) {
                    return [2 /*return*/, tmp];
                }
                code = fs_1.readFileSync(path).toString();
                svgName = path_1.basename(path, '.svg');
                finalSymbolId = symbolId ? symbolId(svgName, path) : svgName;
                svgCode = code.match(/<svg[^]*<\/svg>/);
                if (!svgCode)
                    return [2 /*return*/, source];
                svgNode = htmlparser2_1.parseDOM(svgCode[0], { lowerCaseAttributeNames: false })[0];
                svgNode.name = 'symbol';
                svgNode.attribs.id = finalSymbolId;
                if (!Reflect.has(svgNode.attribs, 'viewBox')) {
                    _a = svgNode.attribs, width = _a.width, height = _a.height;
                    svgNode.attribs.viewBox = "0 0 " + (width || 200) + " " + (height || 200);
                }
                childElements = htmlparser2_1.DomUtils.getElementsByTagName('*', svgNode);
                removeAttrList = removeAttrs || ['width', 'height'];
                childElements.map(function (element) {
                    var styleObj = {};
                    var hasStyle = Reflect.has(element.attribs, 'style');
                    if (hasStyle) {
                        var style = element.attribs['style'].split(';');
                        var keys_1 = [];
                        style.map(function (item) {
                            var kv = item.split(':');
                            if (kv[0]) {
                                keys_1.push(kv[0]);
                                styleObj[kv[0]] = kv[1];
                            }
                        });
                    }
                    if (transform) {
                        transform(element, styleObj);
                    }
                    removeAttrList.map(function (attr) {
                        if (['width', 'height'].includes(attr) && element.name !== 'symbol') {
                            return;
                        }
                        Reflect.deleteProperty(element.attribs, attr);
                    });
                    if (hasStyle) {
                        removeAttrList.map(function (attr) {
                            Reflect.deleteProperty(styleObj, attr);
                        });
                        var styleStr = '';
                        for (var i in styleObj) {
                            styleStr += i + ":" + styleObj[i] + ";";
                        }
                        if (styleStr.trim()) {
                            element.attribs['style'] = styleStr;
                        }
                        else {
                            Reflect.deleteProperty(element.attribs, 'style');
                        }
                    }
                });
                componentCode = '';
                if (component) {
                    exportName = component.exportName, defaultExport = component.defaultExport;
                    componentName = '';
                    if (exportName) {
                        componentName = exportName(svgName, path);
                    }
                    else {
                        componentName = finalSymbolId.substr(0, 1).toUpperCase() + finalSymbolId.substr(1).replace(/-([a-z])?/g, function (val, $1) {
                            return $1 ? $1.toUpperCase() : '';
                        });
                    }
                    if (component.type === 'vue') {
                        componentCode = "\n        import {h} from \"vue\";\n        export const " + componentName + " = (props)=> h('svg',props,h('use',{'xlink:href':'#" + finalSymbolId + "'}));\n        " + (defaultExport ? "export default " + componentName : source) + ";\n        ";
                    }
                }
                htmlCode = "\n      let node = document.getElementById('" + finalSymbolId + "');\n      let wrap  = document.getElementById('svg-sprite-component-wrap');\n      if(!wrap){\n        wrap = document.createElementNS('http://www.w3.org/2000/svg', 'svg')\n        wrap.id = 'svg-sprite-component-wrap';\n        wrap.style.setProperty('display', 'none');\n        document.body.appendChild(wrap);\n      }\n      if(!node){\n        let symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol')\n        wrap.appendChild(symbol);\n        " + Object.entries(svgNode.attribs).map(function (_a) {
                    var k = _a[0], v = _a[1];
                    return "symbol.setAttribute(\"" + k + "\",\"" + v + "\");";
                }).join('') + "\n        symbol.innerHTML = `" + dom_serializer_1.default(svgNode.childNodes) + "`;\n      }\n\n      ";
                transformedCode = htmlCode + componentCode;
                s = new magic_string_1.default(source);
                s.overwrite(0, source.length, transformedCode);
                result = { code: transformedCode, map: s.generateMap() };
                cache.set(path, result);
                return [2 /*return*/, result];
            });
        }); }
    };
}
;
exports.default = createPlugin;
