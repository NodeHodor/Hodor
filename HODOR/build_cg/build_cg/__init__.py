from importlib.util import module_for_loader
import logging
import json
import os
import copy
import re
from sys import builtin_module_names
import ast


import sys
sys.path.append(f"{your_dataset}/test")
import comp as cp

logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s %(filename)s [line:%(lineno)d] %(levelname)s %(message)s',
                    datefmt='%Y/%m/%d %H:%M:%S')

from subprocess import call
def shell(cmd, out = None, err = None):
    return call(cmd, shell = True, stdout = out, stderr = err)



class build_cg():
    def __init__(self, dir_path, init_path="", get_exports=False, aim="", comp=False):
        self.comp = comp

        self.dir_path = dir_path
        self.init_path = init_path
        self.get_exports = get_exports

        self.ast = dict()
        self.source_code = dict()
        self.module_list = list()

        self.module_main_mapping = dict()
        self.scope_id = ""
        self.module_name = ""

        if True:
            if init_path:
                self.module_list.append(init_path)
            else:
                if os.path.exists(f"{dir_path}/package.json"):
                    with open(f"{dir_path}/package.json", "r") as f_package:
                        j_package = json.load(f_package)
                        dependencies = j_package["dependencies"]
                        for key in dependencies.keys():
                            module_path = self.calc_module_main_path(key)
                            self.init_path = module_path
                            self.module_list.append(module_path)
                else:
                    for file in os.listdir(dir_path):
                        if file.endswith(".js"):
                            self.init_path = module_path
                            self.module_list.append(file)

        self.aim = ""
        if aim:
            self.aim = aim
        self.function_table = dict()
        self.module_exports = dict()

        self.scope_list = list()
        self.func_node = list()
        self.scopes = dict() 
        self.tmp_scopes = dict()
    
        self.module_scopeid_stack = list()
        self.calc_require_path_dict = dict()

        self.func_id = dict()
        self.static_cg = {
            "node": set(),
            "edge": dict(),
            "global_call" : dict()
        }

        self.native_methods = ['Array',
             'ArrayBuffer',
             'Attr',
             'Audio',
             'Boolean',
             'CDATASection',
             'CSSRule',
             'CSSStyleDeclaration',
             'CSSStyleSheet',
             'CanvasGradient',
             'CanvasPattern',
             'CanvasRenderingContext2D',
             'CharacterData',
             'Comment',
             'DOMException',
             'DOMImplementation',
             'DOMParser',
             'DOMStringList',
             'DataView',
             'Date',
             'Document',
             'DocumentFragment',
             'DocumentType',
             'Element',
             'Error',
             'EvalError',
             'Event',
             'Float32Array',
             'Float64Array',
             'Function',
             'HTMLAnchorElement',
             'HTMLAppletElement',
             'HTMLAreaElement',
             'HTMLAudioElement',
             'HTMLBRElement',
             'HTMLBaseElement',
             'HTMLBaseFontElement',
             'HTMLBodyElement',
             'HTMLButtonElement',
             'HTMLCanvasElement',
             'HTMLCollection',
             'HTMLDListElement',
             'HTMLDirectoryElement',
             'HTMLDivElement',
             'HTMLElement',
             'HTMLEmbedElement',
             'HTMLFieldSetElement',
             'HTMLFontElement',
             'HTMLFormElement',
             'HTMLFrameElement',
             'HTMLFrameSetElement',
             'HTMLHRElement',
             'HTMLHeadElement',
             'HTMLHeadingElement',
             'HTMLHtmlElement',
             'HTMLIFrameElement',
             'HTMLImageElement',
             'HTMLInputElement',
             'HTMLKeygenElement',
             'HTMLLIElement',
             'HTMLLabelElement',
             'HTMLLinkElement',
             'HTMLMapElement',
             'HTMLMenuElement',
             'HTMLMetaElement',
             'HTMLModElement',
             'HTMLOListElement',
             'HTMLObjectElement',
             'HTMLOptGroupElement',
             'HTMLOptionElement',
             'HTMLOutputElement',
             'HTMLParagraphElement',
             'HTMLParamElement',
             'HTMLPreElement',
             'HTMLQuoteElement',
             'HTMLScriptElement',
             'HTMLSelectElement',
             'HTMLSourceElement',
             'HTMLSpanElement',
             'HTMLStyleElement',
             'HTMLTableCaptionElement',
             'HTMLTableColElement',
             'HTMLTableElement',
             'HTMLTableRowElement',
             'HTMLTableSectionElement',
             'HTMLTextAreaElement',
             'HTMLTitleElement',
             'HTMLUListElement',
             'HTMLUnknownElement',
             'HTMLVideoElement',
             'Image',
             'ImageData',
             'Int16Array',
             'Int32Array',
             'Int8Array',
             'MimeType',
             'MouseEvent',
             'Node',
             'NodeList',
             'Number',
             'Object',
             'Option',
             'Plugin',
             'ProcessingInstruction',
             'Range',
             'RangeError',
             'RangeException',
             'ReferenceError',
             'RegExp',
             'String',
             'SyntaxError',
             'Text',
             'TextMetrics',
             'TypeError',
             'UIEvent',
             'URIError',
             'UTC',
             'Uint16Array',
             'Uint32Array',
             'Uint8Array',
             'Window',
             'XMLHttpRequest',
             'XMLSerializer',
             'XPathResult',
             'XSLTProcessor',
             'abort',
             'abs',
             'acos',
             'add',
             'addColorStop',
             'addEventListener',
             'addRule',
             'adoptNode',
             'alert',
             'anchor',
             'appendChild',
             'appendData',
             'apply',
             'arc',
             'arcTo',
             'asin',
             'atan',
             'atan2',
             'atob',
             'attachEvent',
             'beginPath',
             'bezierCurveTo',
             'big',
             'bind',
             'blink',
             'blur',
             'bold',
             'btoa',
             'call',
             'canPlayType',
             'captureEvents',
             'captureStackTrace',
             'caretRangeFromPoint',
             'ceil',
             'charAt',
             'charCodeAt',
             'checkValidity',
             'clearInterval',
             'clearParameters',
             'clearRect',
             'clearShadow',
             'clearTimeout',
             'click',
             'clip',
             'cloneContents',
             'cloneNode',
             'cloneRange',
             'close',
             'closePath',
             'collapse',
             'compareBoundaryPoints',
             'compareDocumentPosition',
             'compareNode',
             'comparePoint',
             'compile',
             'concat',
             'confirm',
             'contains',
             'cos',
             'create',
             'createAttribute',
             'createAttributeNS',
             'createCDATASection',
             'createCSSStyleSheet',
             'createCaption',
             'createComment',
             'createContextualFragment',
             'createDocument',
             'createDocumentFragment',
             'createDocumentType',
             'createElement',
             'createElementNS',
             'createEntityReference',
             'createEvent',
             'createExpression',
             'createHTMLDocument',
             'createImageData',
             'createLinearGradient',
             'createNSResolver',
             'createNodeIterator',
             'createPattern',
             'createProcessingInstruction',
             'createRadialGradient',
             'createRange',
             'createTBody',
             'createTFoot',
             'createTHead',
             'createTextNode',
             'createTreeWalker',
             'decodeURI',
             'decodeURIComponent',
             'defineProperties',
             'defineProperty',
             'deleteCaption',
             'deleteCell',
             'deleteContents',
             'deleteData',
             'deleteRow',
             'deleteRule',
             'deleteTFoot',
             'deleteTHead',
             'detach',
             'detachEvent',
             'dispatchEvent',
             'doScroll',
             'drawImage',
             'drawImageFromRect',
             'elementFromPoint',
             'encodeURI',
             'encodeURIComponent',
             'error',
             'eval',
             'evaluate',
             'every',
             'execCommand',
             'exp',
             'expand',
             'extractContents',
             'fill',
             'fillRect',
             'fillText',
             'filter',
             'find',
             'fixed',
             'floor',
             'focus',
             'fontcolor',
             'fontsize',
             'forEach',
             'freeze',
             'fromCharCode',
             'getAllResponseHeaders',
             'getAttribute',
             'getAttributeNS',
             'getAttributeNode',
             'getAttributeNodeNS',
             'getBoundingClientRect',
             'getCSSCanvasContext',
             'getClientRects',
             'getComputedStyle',
             'getContext',
             'getDate',
             'getDay',
             'getElementById',
             'getElementsByClassName',
             'getElementsByName',
             'getElementsByTagName',
             'getElementsByTagNameNS',
             'getFloat32',
             'getFloat64',
             'getFullYear',
             'getHours',
             'getImageData',
             'getInt16',
             'getInt32',
             'getInt8',
             'getMatchedCSSRules',
             'getMilliseconds',
             'getMinutes',
             'getMonth',
             'getOverrideStyle',
             'getOwnPropertyDescriptor',
             'getOwnPropertyNames',
             'getParameter',
             'getPropertyCSSValue',
             'getPropertyPriority',
             'getPropertyShorthand',
             'getPropertyValue',
             'getPrototypeOf',
             'getResponseHeader',
             'getSVGDocument',
             'getSeconds',
             'getSelection',
             'getTime',
             'getTimezoneOffset',
             'getUTCDate',
             'getUTCDay',
             'getUTCFullYear',
             'getUTCHours',
             'getUTCMilliseconds',
             'getUTCMinutes',
             'getUTCMonth',
             'getUTCSeconds',
             'getUint16',
             'getUint32',
             'getUint8',
             'getYear',
             'hasAttribute',
             'hasAttributeNS',
             'hasAttributes',
             'hasChildNodes',
             'hasFeature',
             'hasOwnProperty',
             'importNode',
             'importStylesheet',
             'indexOf',
             'initEvent',
             'initMouseEvent',
             'initUIEvent',
             'insertAdjacentElement',
             'insertAdjacentHTML',
             'insertAdjacentText',
             'insertBefore',
             'insertCell',
             'insertData',
             'insertNode',
             'insertRow',
             'insertRule',
             'intersectsNode',
             'is',
            #  'isArray',
             'isDefaultNamespace',
             'isEqualNode',
             'isExtensible',
             'isFinite',
             'isFrozen',
             'isNaN',
             'isPointInPath',
             'isPointInRange',
             'isPropertyImplicit',
             'isPrototypeOf',
             'isSameNode',
             'isSealed',
             'isSupported',
             'italics',
             'item',
             'iterateNext',
             'join',
             'keys',
             'lastIndexOf',
             'lineTo',
             'link',
             'load',
             'localeCompare',
             'log',
             'lookupNamespaceURI',
             'lookupPrefix',
             'map',
             'match',
             'matchMedia',
             'max',
             'measureText',
             'min',
             'moveBy',
             'moveTo',
             'namedItem',
             'normalize',
             'now',
             'open',
             'openDatabase',
             'overrideMimeType',
             'parse',
             'parseFloat',
             'parseFromString',
             'parseInt',
             'pause',
             'play',
             'pop',
             'postMessage',
             'pow',
             'preventDefault',
             'preventExtensions',
             'print',
             'prompt',
             'propertyIsEnumerable',
             'prototype',
            #  'push',
             'putImageData',
             'quadraticCurveTo',
             'queryCommandEnabled',
             'queryCommandIndeterm',
             'queryCommandState',
             'queryCommandSupported',
             'queryCommandValue',
             'querySelector',
             'querySelectorAll',
             'random',
             'rect',
             'reduce',
             'reduceRight',
             'releaseEvents',
             'remove',
             'removeAttribute',
             'removeAttributeNS',
             'removeAttributeNode',
             'removeChild',
             'removeEventListener',
             'removeParameter',
             'removeProperty',
             'removeRule',
             'replace',
             'replaceChild',
             'replaceData',
             'replaceWholeText',
             'reset',
             'resizeBy',
             'resizeTo',
             'restore',
             'reverse',
             'rotate',
             'round',
             'save',
             'scale',
             'scroll',
             'scrollBy',
             'scrollByLines',
             'scrollByPages',
             'scrollIntoView',
             'scrollIntoViewIfNeeded',
             'scrollTo',
             'seal',
             'search',
             'select',
             'selectNode',
             'selectNodeContents',
             'send',
             'serializeToString',
             'set',
             'setAlpha',
             'setAttribute',
             'setAttributeNS',
             'setAttributeNode',
             'setAttributeNodeNS',
             'setCompositeOperation',
             'setCustomValidity',
             'setDate',
             'setEnd',
             'setEndAfter',
             'setEndBefore',
             'setFillColor',
             'setFloat32',
             'setFloat64',
             'setFullYear',
             'setHours',
             'setInt16',
             'setInt32',
             'setInt8',
             'setInterval',
             'setLineCap',
             'setLineJoin',
             'setLineWidth',
             'setMilliseconds',
             'setMinutes',
             'setMiterLimit',
             'setMonth',
             'setParameter',
             'setProperty',
             'setRequestHeader',
             'setSeconds',
             'setSelectionRange',
             'setShadow',
             'setStart',
             'setStartAfter',
             'setStartBefore',
             'setStrokeColor',
             'setTime',
             'setTimeout',
             'setTransform',
             'setUTCDate',
             'setUTCFullYear',
             'setUTCHours',
             'setUTCMilliseconds',
             'setUTCMinutes',
             'setUTCMonth',
             'setUTCSeconds',
             'setUint16',
             'setUint32',
             'setUint8',
             'setYear',
             'shift',
             'showModalDialog',
             'sin',
             'slice',
             'small',
             'snapshotItem',
             'some',
             'sort',
             'splice',
             'split',
             'splitText',
             'sqrt',
             'stepDown',
             'stepUp',
             'stop',
             'stopImmediatePropagation',
             'stopPropagation',
             'strike',
             'stringify',
             'stroke',
             'strokeRect',
             'strokeText',
             'sub',
             'subarray',
             'submit',
             'substr',
             'substring',
             'substringData',
             'sup',
             'surroundContents',
             'tan',
             'test',
             'toDataURL',
             'toDateString',
             'toExponential',
             'toFixed',
             'toGMTString',
             'toISOString',
             'toJSON',
             'toLocaleDateString',
             'toLocaleLowerCase',
             'toLocaleString',
             'toLocaleTimeString',
             'toLocaleUpperCase',
             'toLowerCase',
             'toPrecision',
             'toString',
             'toTimeString',
             'toUTCString',
             'toUpperCase',
             'transform',
             'transformToDocument',
             'transformToFragment',
             'translate',
             'trim',
             'trimLeft',
             'trimRight',
             'unshift',
             'valueOf',
             'warn',
             'webkitCancelAnimationFrame',
             'webkitCancelFullScreen',
             'webkitCancelRequestAnimationFrame',
             'webkitConvertPointFromNodeToPage',
             'webkitConvertPointFromPageToNode',
             'webkitEnterFullScreen',
             'webkitEnterFullscreen',
             'webkitExitFullScreen',
             'webkitExitFullscreen',
             'webkitGetFlowByName',
             'webkitGetImageDataHD',
             'webkitMatchesSelector',
             'webkitPostMessage',
             'webkitPutImageDataHD',
             'webkitRequestAnimationFrame',
             'webkitRequestFileSystem',
             'webkitRequestFullScreen',
             'webkitRequestFullscreen',
             'webkitResolveLocalFileSystemURL'
        ]

        self.builtins = [
            'assert',
            'assert/strict',
            'async_hooks',
            'buffer',
            'child_process',
            'cluster',
            'console',
            'constants',
            'crypto',
            'dgram',
            'diagnostics_channel',
            'dns',
            'dns/promises',
            'domain',
            'events',
            'fs',
            'fs/promises',
            'http',
            'http2',
            'https',
            'inspector',
            'module',
            'net',
            'os',
            'path',
            'path/posix',
            'path/win32',
            'perf_hooks',
            'process',
            'punycode',
            'querystring',
            'readline',
            'readline/promises',
            'repl',
            'stream',
            'stream/consumers',
            'stream/promises',
            'stream/web',
            'string_decoder',
            'sys',
            'timers',
            'timers/promises',
            'tls',
            'trace_events',
            'tty',
            'url',
            'util',
            'util/types',
            'v8',
            'vm',
            'wasi',
            'worker_threads',
            'zlib',
            'path'
            ]

        self.total_call_mem_expression = list()

        self.analysis_Identifier_dict = dict()

        self.builtin_js = set()
        self.builtin_node = set()

        self.dynamic_cg = {
            "node2scope": dict(),
            "node": dict(),
            "edge": dict()
        }

        self.combined_cg = {
            "node": dict(),
            "edge": dict()
        }
        
        self.dependency_cg = dict()
        
        self.stage = ""

    def calc_path(self, now_path, module_path):
        if self.module_name.startswith("/"):
            now_path = os.path.dirname(os.path.join(self.dir_path, self.module_name[1:]))
        else:
            now_path = os.path.dirname(os.path.join(self.dir_path, self.module_name))
        if module_path.startswith("/"):
            r = os.path.abspath(os.path.join(self.dir_path, module_path[1:])).replace("//", "/")
        else:
            r = os.path.abspath(os.path.join(self.dir_path, module_path)).replace("//", "/")      
        if os.path.exists(r):
            if r.startswith(self.dir_path):
                return r[len(self.dir_path)+1:]
            else:
                logging.error("calc path error") 
        if not r.endswith(".js"):
            r += ".js"
        if os.path.exists(r):
            if r.startswith(self.dir_path):
                return r[len(self.dir_path)+1:]
            else:
                logging.error("calc path error")

        if module_path.startswith("/"):
            r = os.path.abspath(os.path.join(now_path, module_path[1:])).replace("//", "/")
        else:
            r = os.path.abspath(os.path.join(now_path, module_path)).replace("//", "/")       
        if os.path.isdir(r):
            r += "/index.js"
            if os.path.exists(r.replace("//", "/")):
                if r.startswith(self.dir_path):
                    return r[len(self.dir_path)+1:]
                else:
                    logging.error("calc path error")    
        else:
            if os.path.exists(r):
                if r.startswith(self.dir_path):
                    return r[len(self.dir_path)+1:]
                else:
                    logging.error("calc path error")     
            if not r.endswith(".js"):
                r += ".js"
            if os.path.exists(r):
                if r.startswith(self.dir_path):
                    return r[len(self.dir_path)+1:]
                else:
                    logging.error("calc path error")       
        logging.error("calc path error")

    def calc_module_main_path(self, module_name):
        if module_name in self.module_main_mapping:
            return self.module_main_mapping[module_name][len(self.dir_path)+1:]
        else:
            _path = os.path.abspath(f"{self.dir_path}/node_modules/{module_name}")
            if os.path.exists(_path):
                if os.path.exists(f"{self.dir_path}/node_modules/{module_name}/package.json"):
                    with open(f"{self.dir_path}/node_modules/{module_name}/package.json", "r") as f_package:
                        j_package = json.load(f_package)
                        if "main" in j_package:
                            main_path = os.path.abspath(f"{self.dir_path}/node_modules/{module_name}/{j_package['main']}")
                            if not main_path.endswith(".js"):
                                main_path = main_path + ".js"
                            if os.path.exists(main_path):
                                self.module_main_mapping[module_name] = main_path
                                if self.module_main_mapping[module_name].startswith(self.dir_path):
                                    return self.module_main_mapping[module_name][len(self.dir_path)+1:]
                        else:
                            main_path = os.path.abspath(f"{self.dir_path}/node_modules/{module_name}/index.js")
                            if os.path.exists(main_path):
                                self.module_main_mapping[module_name] = main_path
                                if self.module_main_mapping[module_name].startswith(self.dir_path):
                                    return self.module_main_mapping[module_name][len(self.dir_path)+1:]
                            else:
                                logging.error(f"{self.dir_path}/node_modules/{module_name}/index.js not exists")
                else:
                    if os.path.isdir(_path):
                        main_path = f"{_path}/index.js"
                        if os.path.exists(main_path):
                            self.module_main_mapping[module_name] = main_path
                            if self.module_main_mapping[module_name].startswith(self.dir_path):
                                return self.module_main_mapping[module_name][len(self.dir_path)+1:]
                        else:
                            logging.error(f"{main_path} error")
                    elif os.path.exists(f"{_path}.js"):
                        main_path = f"{_path}.js"
                        self.module_main_mapping[module_name] = main_path
                        if self.module_main_mapping[module_name].startswith(self.dir_path):
                            return self.module_main_mapping[module_name][len(self.dir_path)+1:]
                    else:
                        logging.error("still error~")
            elif os.path.exists(f"{_path}"):
                main_path = f"{_path}"
                self.module_main_mapping[module_name] = main_path
                if self.module_main_mapping[module_name].startswith(self.dir_path):
                    return self.module_main_mapping[module_name][len(self.dir_path)+1:]
            elif os.path.exists(f"{_path}.js"):
                main_path = f"{_path}.js"
                self.module_main_mapping[module_name] = main_path
                if self.module_main_mapping[module_name].startswith(self.dir_path):
                    return self.module_main_mapping[module_name][len(self.dir_path)+1:]
            else:
                logging.error(f"{self.dir_path}/node_modules/{module_name} not exists")

    def calc_require_path(self, require_path):
        absModule_path = self.calc_path(now_path=self.module_name, module_path=require_path)
        if absModule_path:
            return absModule_path
        else:
            absModule_path = self.calc_module_main_path(require_path)
            if absModule_path:
                return absModule_path
            else:
                logging.error(f"{require_path} error~")

    def calc_require_pointer(self, module_exports_list, node):
        r = list()
        for module_exports_p in module_exports_list:
            module_exports_p_node = self.scopes[module_exports_p[0]][module_exports_p[1][0]][module_exports_p[1][1]]
            module_exports_p_node_type = module_exports_p_node["type"]
            module_exports_p_node_edge_list = module_exports_p_node["edge"]
            if module_exports_p_node_type == "obj":
                if module_exports_p[1][1] in self.scopes[module_exports_p[0]]:
                    for obj_node_key in self.scopes[module_exports_p[0]][module_exports_p[1][1]]:
                        if node["type"] == "Identifier":
                            node_name = node["name"]
                            if node_name == obj_node_key[1][0]:
                                r.append((module_exports_p[0], (module_exports_p[1][1], obj_node_key)))
                        else:
                            logging.error(f"node type error {node['type']}")
                elif module_exports_p_node_edge_list:
                    for module_exports_p_node_edge in module_exports_p_node_edge_list:
                        try:
                            r.append(module_exports_p_node_edge)
                        except:
                            pass
                        try:
                            r.append(module_exports_p_node_edge)
                        except:
                            pass
                else:
                    logging.error(f"module_exports_p error~")
            else:
                logging.error(f"{module_exports_p_node_type} error")
        return r

    def find_node(self, p_edge_list, node):
        r_list = list()
        for p_edge in p_edge_list:
            if p_edge[1][1] in self.scopes[p_edge[0]]:
                for key in self.scopes[p_edge[0]][p_edge[1][1]]:
                    if key in ["this", "prop"]:
                        for node_key in self.scopes[p_edge[0]][p_edge[1][1]][key]:
                            if "name" in node:
                                if node_key[1][0] == node["name"]:
                                    r_list.append((p_edge[0], (p_edge[1][1], (key, node_key))))
                            else:
                                logging.error(f"TO-DO")
                    else:
                        if "name" in node:
                            if key[1][0] == node["name"]:
                                r_list.append((p_edge[0], (p_edge[1][1], key)))
                        else:
                            logging.error(f"TO-DO")
            else:
                logging.error("TO-DO")
        return r_list

    def find_return_node(self, func_p):
        for key in self.scopes[func_p[0]][func_p[1][1]]:
            func_node = self.scopes[func_p[0]][func_p[1][1]][key]

    def record_function_table(self, name, id):
        if name not in self.function_table:
            self.function_table[name] = dict()
        if id[1] not in self.function_table[name]:
            self.function_table[name][id[1]] = {
                "params": list(),
                "return": list(),
                "alias": set(),
                "key": (self.module_name, id)
            }

    def get_source_code(self, module_name, block):
        return self.source_code[self.module_name][block["start"]:block["end"]]

    def build_nodes(self):
        analysised_module = set()
        while self.module_list:
            
            module_name = self.module_list.pop()
            
            if module_name in analysised_module:
                analysised_module.add(module_name)
                continue
            self.module_name = module_name
            self.scopes[self.module_name] = dict()
            if not module_name:
                continue

            if not os.path.exists(f"{self.dir_path}/{module_name}"):
                logging.error(f"file not exist {self.dir_path}/{module_name}")
                continue
            
            if not os.path.exists(f"../tmp/{module_name}on"):
                logging.error(f"file not exist ../tmp/{module_name}on")
                continue

            with open(f"{self.dir_path}/{module_name}", encoding='UTF-8') as f_js:
                self.source_code[module_name] = f_js.read()
            # ast
            with open(f"../tmp/{module_name}on", encoding='UTF-8') as f_json:
                self.ast[module_name] = json.load(f_json)

            self.scope_list.append(
                (("global", (self.ast[self.module_name]["start"],self.ast[self.module_name]["end"])), 
                ("global", self.ast[self.module_name]))
            )

            self.func_id[(self.ast[self.module_name]["start"],self.ast[self.module_name]["end"])] = \
                f"{'global'}@{self.module_name}, {self.ast[self.module_name]['start']}"

            analysised_scope_list = list()
            while self.scope_list:
                scope = self.scope_list[0]
                if scope in analysised_scope_list:
                    del(self.scope_list[0])
                    continue
                analysised_scope_list.append(scope)
                self.scope_id = (scope[0], (scope[1][0], (scope[1][1]["start"], scope[1][1]["end"])))
                if self.scope_id not in self.scopes[self.module_name]:
                    self.scopes[self.module_name][self.scope_id] = dict()
                    
                scope_type = scope[1][1]["type"]
                if scope_type in ["Program", "BlockStatement"]:
                    body = scope[1][1]["body"]
                    for block in body:
                        if "Statement" in block["type"]:
                            self.analysis_Statement(block, block["type"])
                        elif "Declaration" in block["type"]:
                            self.analysis_Declaration(block, block["type"])
                        else:
                            logging.error("Program type error")
                elif "Declaration" in scope_type:
                    if scope_type in ["ClassDeclaration", "FunctionDeclaration"]:
                        self.analysis_Declaration(scope[1][1], scope_type, f=1)
                    else:
                        logging.error("Declaration type error")
                elif "Expression" in scope_type:
                    if scope_type in ["ClassExpression", "FunctionExpression", "ArrowFunctionExpression", "ObjectExpression"]:
                        self.analysis_Expression(scope[1][1], scope[1][1]["type"], 1)
                    else:
                        logging.error("Expression type error")
                else:
                    logging.error("scope type error")

                del(self.scope_list[0])
            self.add_intra_edge()
            
    def analysis_params(self, params):
        _sid = self.scope_id
        func_table_key = ""
        if self.scope_id[1][0] in self.function_table:
            if self.scope_id in self.function_table[self.scope_id[1][0]]:
                func_table_key = self.function_table[self.scope_id[1][0]][self.scope_id]
        if not func_table_key:
            logging.error("could not ")

        for param_num in range(0, len(params)):
            param = params[param_num]
            if param["type"] == "Identifier":
                _key = (self.scope_id[1], (param["name"], (param["start"], param["end"])))
                param_name = param["name"]
                self.scopes[self.module_name][_sid][_key] = {
                    "name": param_name,
                    "type": "param",
                    "blck": [],
                    "edge": [],
                    "loc": param["loc"],
                    "start": param["start"],
                    "end": param["end"],
                    "call": [],
                    "mem": [],
                    # "asgn": [],
                    "num": param_num
                }
                if func_table_key:
                    func_table_key["params"].append((self.module_name, (_sid, _key)))
                else:
                    logging.error("could not ")
            elif param["type"] == "Literal":
                pass
            elif param["type"] == "AssignmentPattern":
                left = param["left"]
                right = param["right"]
                if left["type"] == "Identifier":
                    _key = (self.scope_id[1], (left["name"], (left["start"], left["end"])))
                    param_name = left["name"]
                    self.scopes[self.module_name][_sid][_key] = {
                        "name": param_name,
                        "type": "param",
                        "blck": [right,],
                        "edge": [],
                        "loc": left["loc"],
                        "start": left["start"],
                        "end": left["end"],
                        "call": [],
                        "mem": [],
                        # "asgn": [],
                        "num": param_num
                    }
                    if func_table_key:
                        func_table_key["params"].append((self.module_name, (_sid, _key)))
                    else:
                        logging.error("could")

                elif left["type"] == "ObjectPattern":
                    properties = left["properties"]
                    for property in properties:
                        property_key = property["key"]
                        if property_key["type"] == "Identifier":
                            _key = (self.scope_id[1], (property_key["name"], (property_key["start"], property_key["end"])))
                            param_name = property_key["name"]
                            self.scopes[self.module_name][_sid][_key] = {
                                "name": property_key["name"],
                                "type": "param",
                                "blck": [right,],
                                "edge": [],
                                "loc": property_key["loc"],
                                "start": left["start"],
                                "end": left["end"],
                                "call": [],
                                "mem": [],
                                # "asgn": [],
                                "num": param_num
                            }
                            if func_table_key:
                                func_table_key["params"].append((self.module_name, (_sid, _key)))
                        else:
                            logging.error("[-] Function Declaration param error1", left["type"])
                else:
                    logging.error(f"left type error {left['type']}")
            elif param["type"] == "ObjectPattern":
                properties = param["properties"]
                for property in properties:
                    if property["type"] == "Property":
                        property_key = property["key"]
                        if property_key["type"] == "Identifier":
                            _key = (self.scope_id[1], (property_key["name"], (property_key["start"], property_key["end"])))
                            param_name = property_key["name"]
                            self.scopes[self.module_name][_sid][_key] = {
                                "name": property_key["name"],
                                "type": "param",
                                "blck": [],
                                "edge": [],
                                "loc": property_key["loc"],
                                "start": property_key["start"],
                                "end": property_key["end"],
                                "call": [],
                                "mem": [],
                                # "asgn": [],
                                "num": param_num
                            }
                            if func_table_key:
                                func_table_key["params"].append((self.module_name, (_sid, _key)))
                        elif property_key["type"] == "Literal":
                            pass
                        else:
                            logging.error("[-] Function Declaration param error2", property_key["type"])
                    else:
                        logging.error("ohhhhhhhhhhhhhhno")
            elif param["type"] == "RestElement":
                argument = param["argument"]
                if argument["type"] == "Identifier":
                    _key = (self.scope_id[1], (argument["name"], (argument["start"], argument["end"])))
                    param_name = argument["name"]
                    self.scopes[self.module_name][_sid][_key] = {
                        "name": param_name,
                        "type": "param",
                        "blck": [],
                        "edge": [],
                        "loc": argument["loc"],
                        "start": argument["start"],
                        "end": argument["end"],
                        "call": [],
                        "mem": [],
                        "num": param_num
                    }
                    if func_table_key:
                        func_table_key["params"].append((self.module_name, (_sid, _key)))
                else:
                    logging.error("[-] Function Declaration param type error3")
            else:              
                logging.error("[-] Function Declaration params error! ")

    def analysis_objmem(self, node):
        r_list = list()
        node_edge_list = node["edge"]
        node_blck = node["blck"]
        for objmem_blck in node_blck:
            property_list = list()
            while type(objmem_blck) == tuple:     
                property_list.append(objmem_blck[1])       
                objmem_blck = objmem_blck[0]
                
            if not node_edge_list and node_blck:
                node_edge_list.extend(self.analysis_Expression(objmem_blck, objmem_blck["type"], f=1, p=node))
            else:
                if node_edge_list:
                    p_list = copy.deepcopy(node_edge_list) 
                    _analysised_p = list()
                    while p_list and property_list:
                        p = p_list.pop()
                        if p in _analysised_p:
                            continue
                        _analysised_p.append(p)         
                        if p[0] in self.builtins:
                            r_list.append(p)     
                            continue       
                        if p[0] in ["undefined", "primordials", "binding", "internalBinding"]:
                            continue
                        if p[-1] in ["func", "class"]:
                            _type = p[-1]
                            p = p[0]
                            if p[1][1][0] in ["this", "prop"]:
                                p_node = self.scopes[p[0]][p[1][0]][p[1][1][0]][p[1][1][1]]
                            else:
                                p_node = self.scopes[p[0]][p[1][0]][p[1][1]]
                        else:
                            if p[1][1][0] in ["this", "prop"]:
                                p_node = self.scopes[p[0]][p[1][0]][p[1][1][0]][p[1][1][1]]
                            else:
                                p_node = self.scopes[p[0]][p[1][0]][p[1][1]]

                        p_node_type = p_node["type"]
                        p_node_edge_list = p_node["edge"]
                        p_node_blck = p_node["blck"]
                        if p_node_type == "var":
                            p_list.extend(p_node_edge_list)
                        elif p_node_type in ["func", "class"]:
                            if p[1][1] in self.scopes[p[0]]:
                                if "prop" in self.scopes[p[0]][p[1][1]]:
                                    _property = property_list.pop()
                                    for func_key in self.scopes[p[0]][p[1][1]]["prop"]:
                                        if _property[1][0] == func_key[1][0]:
                                            if property_list:
                                                p_list.append((p[0], (p[1][1], ("prop", func_key))))
                                            else:
                                                r_list.append((p[0], (p[1][1], ("prop", func_key))))
                                else:
                                    _property = property_list.pop()
                                    for func_key in self.scopes[p[0]][p[1][1]]:
                                        if _property == func_key[1][0]:
                                            if property_list:
                                                p_list.append(p[0], (p[1][1], func_key))
                                            else:
                                                r_list.append((p[0], (p[1][1], func_key)))
                        elif p_node_type == "obj":
                            found = 0
                            if p[1][1] in self.scopes[p[0]]:
                                _property = property_list.pop()
                                for obj_key in self.scopes[p[0]][p[1][1]]:
                                    if _property == obj_key[1][0]:
                                        if property_list:
                                            p_list.append((p[0], (p[1][1], obj_key)))
                                            found = 1
                                        else:
                                            r_list.append((p[0], (p[1][1], obj_key)))
                                            found = 1
                                if not found:
                                    property_list.append(_property)
                            if p_node_edge_list:
                                p_list.extend(p_node_edge_list)
                        elif p_node_type == "call":
                            if not p_node_edge_list and p_node_blck:
                                for _blck in p_node_blck:
                                    self.push_module_scopeid_stack()
                                    self.module_name = p[0]
                                    self.scope_id = p[1][0]
                                    p_node_edge_list.extend(self.analysis_Expression(_blck, _blck["type"], f=1, p=p))
                                    self.pop_module_scopeid_stack()
                            if p_node_edge_list:
                                p_list.extend(p_node_edge_list)
                            
                        else:
                            pass
                    pass
        return r_list

    def add_intra_edge_4_node(self, node):
        node_type = node["type"]
        node_edge = node["edge"]
        node_blck_s = node["blck"]
        if "analysised" not in node:
            node["analysised"] = 1
        else:
            return
        tmp_blck_s = list()
        if node_type == "obj_mem":
            for node_blck in node_blck_s:
                _block = node_blck
                property_list = list()
                while type(_block) == tuple:
                    property_list.append(_block[1])
                    _block = _block[0]
                tmp_blck_s.append(_block)
        else:
            tmp_blck_s = copy.deepcopy(node_blck_s)

        if not node_edge and node_blck_s:
            while tmp_blck_s:
                tmp_blck = tmp_blck_s[0]
                tmp_blck_type = tmp_blck["type"]
                if tmp_blck_type in ["BinaryExpression", "Literal", "LogicalExpression", "UnaryExpression", "TaggedTemplateExpression", "UpdateExpression", "AssignmentExpression"]:
                    del(node_blck_s[0])
                    self.analysis_Expression(tmp_blck, tmp_blck["type"])
                elif tmp_blck_type in ["FunctionExpression", "ArrowFunctionExpression"]:
                    node_edge.extend(self.analysis_Expression(tmp_blck, tmp_blck["type"]))
                elif tmp_blck_type in ["NewExpression", "ObjectExpression"]:
                    node_edge.extend(self.analysis_Expression(tmp_blck, tmp_blck["type"]))
                elif tmp_blck_type in ["ClassExpression"]:
                    node_edge.extend(self.analysis_Expression(tmp_blck, tmp_blck["type"]))
                elif tmp_blck_type in ["CallExpression"]:
                    node_edge.extend(self.analysis_Expression(tmp_blck, tmp_blck["type"]))
                elif tmp_blck_type in ["MemberExpression"]:
                    node_edge.extend(self.analysis_Expression(tmp_blck, tmp_blck["type"]))
                elif tmp_blck_type in ["Identifier"]:
                    node_edge.extend(self.analysis_Expression(tmp_blck, tmp_blck["type"]))
                elif tmp_blck_type in ["TemplateLiteral", "AwaitExpression", "SpreadElement"]:
                    node_edge.extend(self.analysis_Expression(tmp_blck, tmp_blck["type"]))
                elif tmp_blck_type in ["ArrayExpression", "ConditionalExpression", "ChainExpression"]:
                    node_edge.extend(self.analysis_Expression(tmp_blck, tmp_blck["type"]))
                elif tmp_blck_type in ["ThisExpression"]:
                    pass
                elif tmp_blck_type in ["YieldExpression"]:
                    pass
                elif tmp_blck_type in ["SequenceExpression"]:
                    node_edge.extend(self.analysis_Expression(tmp_blck, tmp_blck["type"]))
                    block_source_code = self.get_source_code(self.module_name, tmp_blck)
                else:
                    logging.error(f"tmp blck type error {tmp_blck_type}")
                del(tmp_blck_s[0]) 
        
    def add_intra_edge(self, scope_id=None):
        self.stage = "intra"
        if scope_id:
            self.scope_id = scope_id
            node_id_list = list(self.scopes[self.module_name][scope_id].keys())
            for num in range(0, len(node_id_list)):
                node_id = node_id_list[num]
                if node_id == "this" or node_id == "prop":
                    for key in self.scopes[self.module_name][scope_id][node_id]:
                        node = self.scopes[self.module_name][scope_id][node_id][key]
                        node_type = node["type"]
                        if node_type not in ["call", "new", "mem"]:
                            self.add_intra_edge_4_node(node)
                else:
                    node = self.scopes[self.module_name][scope_id][node_id]
                    node_type = node["type"]
                    if node_type not in ["call", "new", "mem"]:
                        self.add_intra_edge_4_node(node)
        else:
            for scope_id in list(self.scopes[self.module_name].keys()):
                self.scope_id = scope_id

                node_id_list = list(self.scopes[self.module_name][scope_id].keys())
                for num in range(0, len(node_id_list)):
                    node_id = node_id_list[num]
                    if node_id == "this" or node_id == "prop":
                        for key in self.scopes[self.module_name][scope_id][node_id]:
                            node = self.scopes[self.module_name][scope_id][node_id][key]
                            node_type = node["type"]
                            if node_type not in ["call", "new", "mem"]:
                                self.add_intra_edge_4_node(node)
                    else:
                        node = self.scopes[self.module_name][scope_id][node_id]
                        node_type = node["type"]
                        if node_type not in ["call", "new", "mem"]:
                            self.add_intra_edge_4_node(node)

    def push_module_scopeid_stack(self):
        self.module_scopeid_stack.append(self.module_name)
        self.module_scopeid_stack.append(self.scope_id)

    def pop_module_scopeid_stack(self):
        self.scope_id = self.module_scopeid_stack.pop()
        self.module_name = self.module_scopeid_stack.pop()

    def add_inter_edge(self):
        self.stage = "inter"
        while self.tmp_scopes != self.scopes:
            self.tmp_scopes = copy.deepcopy(self.scopes)
            for self.module_name in self.tmp_scopes:
                for self.scope_id in self.tmp_scopes[self.module_name]:
                    for key in self.tmp_scopes[self.module_name][self.scope_id]:
                        if key in ["this", "prop"]:
                            for _key in self.scopes[self.module_name][self.scope_id][key]:
                                node = self.scopes[self.module_name][self.scope_id][key][_key]
                                node_type = node["type"]
                                node_blck = node["blck"]
                                node_edge = node["edge"]
                                if node_type in ["new", "call", "mem"]:
                                    if not node_edge and node_blck:
                                        for blck in node_blck:
                                            self.push_module_scopeid_stack()
                                            r_list = self.analysis_Expression(blck, blck["type"], f=1, p=(self.module_name, (self.scope_id, (key, _key))))
                                            if r_list:
                                                node_edge.extend(r_list)
                                            self.pop_module_scopeid_stack()
                        else:
                            node = self.scopes[self.module_name][self.scope_id][key]
                            node_type = node["type"]
                            node_blck = node["blck"]
                            node_edge = node["edge"]
                            if node_type in ["new", "call", "mem"]:
                                if not node_edge and node_blck:
                                    for blck in node_blck:
                                        self.push_module_scopeid_stack()
                                        r_list = self.analysis_Expression(blck, blck["type"], f=1, p=(self.module_name, (self.scope_id, key)))
                                        if r_list:
                                            node_edge.extend(r_list)
                                        self.pop_module_scopeid_stack()
            continue_flag = 1
            for key in self.scopes:
                for _sid in self.scopes[key]:
                    if _sid not in self.tmp_scopes[key]:
                        break
                    else:
                        if self.scopes[key][_sid] != self.tmp_scopes[key][_sid]:
                            for node in self.scopes[key][_sid]:
                                if node not in self.tmp_scopes[key][_sid]:
                                    break
                                else:
                                    if self.scopes[key][_sid][node] != self.tmp_scopes[key][_sid][node]:
                                        if "edge" in self.scopes[key][_sid][node]:
                                            if (self.scopes[key][_sid][node]["edge"] != self.tmp_scopes[key][_sid][node]["edge"]) and \
                                                (set(self.scopes[key][_sid][node]["edge"]) == set(self.tmp_scopes[key][_sid][node]["edge"])):
                                                continue_flag = 0
                                                continue
            if not continue_flag:
                break

    def statistic_builtin(self, module_name, sour_node, dest_node, edge):
        _sour_code = self.get_source_code(module_name, sour_node)
        if "Promise(" in _sour_code or \
            ".then(" in _sour_code or \
            ".all(" in _sour_code or \
            ".allSettled(" in _sour_code or \
            ".any(" in _sour_code or \
            ".catch(" in _sour_code or \
            ".finally(" in _sour_code or \
            ".race(" in _sour_code or \
            ".reject(" in _sour_code or \
            ".resolve(" in _sour_code or \
            ".forEach(" in _sour_code or \
            ".map(" in _sour_code:
            self.builtin_js.add(edge)

        if ".access(" in _sour_code or \
            ".close(" in _sour_code or \
            ".stat(" in _sour_code or \
            ".lstat(" in _sour_code or \
            ".fstat(" in _sour_code or \
            ".readlink(" in _sour_code or \
            ".ftruncate(" in _sour_code or \
            ".fdatesync(" in _sour_code or \
            ".fsync(" in _sour_code or \
            ".unlink(" in _sour_code or \
            ".rmdir(" in _sour_code or \
            ".mkdir(" in _sour_code or \
            ".realpath(" in _sour_code or \
            ".readdir(" in _sour_code or \
            ".open(" in _sour_code or \
            ".openfilehandle(" in _sour_code or \
            ".writebuffer(" in _sour_code or \
            ".writeBuffers(" in _sour_code or \
            ".read(" in _sour_code or \
            ".readbuffers(" in _sour_code or \
            ".chmod(" in _sour_code or \
            ".fchmod(" in _sour_code or \
            ".chown(" in _sour_code or \
            ".fchown(" in _sour_code or \
            ".lchown(" in _sour_code or \
            ".utimes(" in _sour_code or \
            ".futimes(" in _sour_code or \
            ".lutimes(" in _sour_code or \
            ".mkdtemp(" in _sour_code or \
            ".getaddrinfo(" in _sour_code or \
            ".getnameinfo(" in _sour_code:
            self.builtin_node.add(edge)

        # _dest
        if "func" in dest_node or "obj" in dest_node:
            self.builtin_js.add(edge)
        
    def build_builtin_module_method(self, builtin_module_method):
        r = ""
        if builtin_module_method[-1]:
            module = builtin_module_method[0]
            r = f"@{module}"
            if len(builtin_module_method) > 1:
                r = f"{builtin_module_method[1]}{r}"
        return r

    def build_cg_static(self):
        for module_name in self.scopes:
            for sid in self.scopes[module_name]:
                for node_key in self.scopes[module_name][sid]:
                    if node_key in ["this", "prop"]:
                        for this_prop_node_key in self.scopes[module_name][sid][node_key]:
                            _node = self.scopes[module_name][sid][node_key][this_prop_node_key]
                            _node_type = _node["type"]
                            _node_edge_list = _node["edge"]
                            if _node_type in ["call", "mem", "new"]:
                                if type(node_key[0]) == str:
                                    continue

                                if node_key[0][1] not in self.func_id:
                                    continue
                                        
                                _sour_scope = f"{self.func_id[node_key[0][1]]}"
                                if _sour_scope.startswith("global"):
                                    if module_name not in self.static_cg["global_call"]:
                                        self.static_cg["global_call"][module_name] = _sour_scope
                                _sour_node = f"{_node['name']}@{module_name}, {_node['loc']['start']['line']}"
                                
                                if _sour_node not in self.dynamic_cg["node2scope"]:
                                    self.dynamic_cg["node2scope"][_sour_node] = _sour_scope

                                _sour = _sour_scope
                                if "arguments_key" in _node:
                                    node_argument_p_dict = _node["arguments_key"]["id"]
                                    for key in node_argument_p_dict:
                                        node_argument_p_list = node_argument_p_dict[key]
                                        for node_argument_p in node_argument_p_list:
                                            node_argument_list = list()
                                            node_argument_list.append(node_argument_p)
                                            while node_argument_list:
                                                _node_argument_p = node_argument_list.pop()
                                                if _node_argument_p[1][1][0] in ["prop", "this"]:
                                                    _node_argument = self.scopes[_node_argument_p[0]][_node_argument_p[1][0]][_node_argument_p[1][1][0]][_node_argument_p[1][1][1]]
                                                else:
                                                    _node_argument = self.scopes[_node_argument_p[0]][_node_argument_p[1][0]][_node_argument_p[1][1]]
                                                node_argument_type = _node_argument["type"]
                                                if node_argument_type == "func":
                                                    if _node_argument_p[1][1][0] == "prop" or _node_argument_p[1][1][0] == "this":
                                                        _edge_scope = _node_edge[1][1][1][1][1]
                                                    else:
                                                        _edge_scope = _node_argument_p[1][1][1][1]
                                                    if _edge_scope in self.func_id:
                                                        _dest = f"{self.func_id[_edge_scope]}"
                                                        self.static_cg["node"].add(_sour)
                                                        self.static_cg["node"].add(_dest)
                                                        if _sour not in self.static_cg["edge"]:
                                                            self.static_cg["edge"][_sour] = set()
                                                        self.static_cg["edge"][_sour].add(_dest)
                                                        _edge = f"{_sour} -> {_dest}"
                                                        self.statistic_builtin(module_name, _node, _node_argument, _edge)
                                                elif node_argument_type == "obj":
                                                    logging.error("TO-DO")

                                source_code = self.get_source_code(module_name, _node)

                                for _node_edge in _node_edge_list:
                                    if self.aim == "internal":
                                        if _node_edge[0] == "internalBinding":
                                            _dest = self.build_builtin_module_method(_node_edge)
                                            if _sour not in self.static_cg["edge"]:
                                                self.static_cg["edge"][_sour] = set()
                                            self.static_cg["edge"][_sour].add(_dest)
                                            continue
                                    
                                    if self.aim == "built-in": 
                                        if _node_edge[0] in self.built_in_list:
                                            _dest = self.build_builtin_module_method(_node_edge)
                                            if _sour not in self.static_cg["edge"]:
                                                self.static_cg["edge"][_sour] = set()
                                            self.static_cg["edge"][_sour].add(_dest)
                                            continue

                                    if _node_edge[1][1][0] in ["prop", "this"]:
                                        _edge_node = self.scopes[_node_edge[0]][_node_edge[1][0]][_node_edge[1][1][0]][_node_edge[1][1][1]]
                                    else:
                                        _edge_node = self.scopes[_node_edge[0]][_node_edge[1][0]][_node_edge[1][1]]
                                    _edge_edge_list = _edge_node["edge"]
                                    _edge_node_type = _edge_node["type"]
                                    if _edge_node_type == "func":
                                        if _node_edge[1][1][0] == "prop" or _node_edge[1][1][0] == "this":
                                            _edge_scope = _node_edge[1][1][1][1]
                                        else:
                                            _edge_scope = _node_edge[1][1][1]
                                        if _edge_scope in self.func_id:
                                            _dest = f"{self.func_id[_edge_scope]}"
                                            self.static_cg["node"].add(_sour)
                                            self.call_graph["node"].add(_dest)
                                            if _sour not in self.static_cg["edge"]:
                                                self.static_cg["edge"][_sour] = set()
                                            self.static_cg["edge"][_sour].add(_dest)
                                            _edge = f"{_sour} -> {_dest}"
                                            self.statistic_builtin(module_name, _node, _edge_node, _edge)
                                        else:
                                            logging.error("func_scope not in func_id")
                                    else:
                                        pass
                    else:
                        _node = self.scopes[module_name][sid][node_key]
                        _node_type = _node["type"]
                        _node_edge_list = _node["edge"]
                        if _node_type in ["call", "mem", "new"]:
                            self.module_name = module_name
                            source_code = self.get_source_code(module_name, _node)
                            if type(node_key[0]) == str:
                                continue

                            if node_key[0][1] not in self.func_id:
                                continue

                            _sour_scope = f"{self.func_id[node_key[0][1]]}"
                            if _sour_scope.startswith("global"):
                                if module_name not in self.static_cg["global_call"]:
                                    self.static_cg["global_call"][module_name] = _sour_scope
                            _sour_node = f"{_node['name']}@{module_name}, {_node['loc']['start']['line']}"
                            if _sour_node not in self.dynamic_cg["node2scope"]:
                                self.dynamic_cg["node2scope"][_sour_node] = _sour_scope

                            _sour = _sour_scope
                            if "arguments_key" in _node:
                                node_argument_p_dict = _node["arguments_key"]["id"]
                                for key in node_argument_p_dict:
                                    node_argument_p_list = node_argument_p_dict[key]
                                    for node_argument_p in node_argument_p_list:
                                        if node_argument_p[1][1][0] in ["prop", "this"]:
                                            node_argument = self.scopes[node_argument_p[0]][node_argument_p[1][0]][node_argument_p[1][1][0]][node_argument_p[1][1][1]]
                                        else:
                                            node_argument = self.scopes[node_argument_p[0]][node_argument_p[1][0]][node_argument_p[1][1]]
                                        node_argument_edge_list = node_argument["edge"]
                                        if node_argument_edge_list:
                                            p_list = list()
                                            p_list.extend(node_argument_edge_list)
                                            analysised_p_set = set()
                                            while p_list:
                                                _node_argument_p = p_list.pop()
                                                if _node_argument_p in analysised_p_set:
                                                    continue
                                                analysised_p_set.add(_node_argument_p)
                                                if _node_argument_p[0] in ["undefined", "primordials", "binding"]:
                                                    continue
                                                
                                                if _node_argument_p[0] in self.builtins:
                                                    _dest = self.build_builtin_module_method(_node_argument_p)
                                                    if _sour not in self.static_cg["edge"]:
                                                        self.static_cg["edge"][_sour] = set()
                                                    self.static_cg["edge"][_sour].add(_dest)
                                                    continue
                                                if _node_argument_p[0] == "internalBinding":
                                                    _dest = self.build_builtin_module_method(_node_argument_p)
                                                    if _sour not in self.static_cg["edge"]:
                                                        self.static_cg["edge"][_sour] = set()
                                                    self.static_cg["edge"][_sour].add(_dest)
                                                    continue
                                                if _node_argument_p[-1] in ["func", "obj"]:
                                                    _node_argument_builtin = _node_argument_p[-1]
                                                    _node_argument_p = _node_argument_p[0]
                                                    if _node_argument_p[1][1][0] in ["prop", "this"]:
                                                        _node_argument = self.scopes[_node_argument_p[0]][_node_argument_p[1][0]][_node_argument_p[1][1][0]][_node_argument_p[1][1][1]]
                                                    else:                                                   
                                                        _node_argument = self.scopes[_node_argument_p[0]][_node_argument_p[1][0]][_node_argument_p[1][1]]
                                                    _node_argument[_node_argument_builtin] = True
                                                else:
                                                    if _node_argument_p[1][1][0] in ["prop", "this"]:
                                                        _node_argument = self.scopes[_node_argument_p[0]][_node_argument_p[1][0]][_node_argument_p[1][1][0]][_node_argument_p[1][1][1]]
                                                    else:                                                   
                                                        _node_argument = self.scopes[_node_argument_p[0]][_node_argument_p[1][0]][_node_argument_p[1][1]]
                                                
                                                _node_argument_type = _node_argument["type"]
                                                if _node_argument_type == "func":
                                                    if _node_argument_p[1][1][0] == "prop" or _node_argument_p[1][1][0] == "this":
                                                        _edge_scope = _node_argument_p[1][1][1][1][1]
                                                    else:
                                                        _edge_scope = _node_argument_p[1][1][1][1]
                                                    if _edge_scope in self.func_id:
                                                        _dest = f"{self.func_id[_edge_scope]}"
                                                        self.static_cg["node"].add(_sour)
                                                        self.static_cg["node"].add(_dest)
                                                        if _sour not in self.static_cg["edge"]:
                                                            self.static_cg["edge"][_sour] = set()
                                                        self.static_cg["edge"][_sour].add(_dest)
                                                        _edge = f"{_sour} -> {_dest}"
                                                        self.statistic_builtin(module_name, _node, _node_argument, _edge)
                                                elif _node_argument_type == "obj":
                                                    if _node_argument_p[1][1] in self.scopes[_node_argument_p[0]]:
                                                        for _key in self.scopes[_node_argument_p[0]][_node_argument_p[1][1]]:
                                                            _obj_node = self.scopes[_node_argument_p[0]][_node_argument_p[1][1]][_key]
                                                            p_list.extend(_obj_node["edge"])
                                                    else:
                                                        p_list.extend(_node_argument["edge"])

                            for _node_edge in _node_edge_list:
                                if self.aim == "internal":
                                    if _node_edge[0] == "internalBinding":
                                        _dest = self.build_builtin_module_method(_node_edge)
                                        if _sour not in self.static_cg["edge"]:
                                            self.static_cg["edge"][_sour] = set()
                                        self.static_cg["edge"][_sour].add(_dest)
                                        continue
                                
                                if _node_edge[0] in ["undefined", "primordials", "binding"]:
                                    continue

                                if self.aim == "built-in":
                                    if _node_edge[0] in self.builtins:
                                        _dest = self.build_builtin_module_method(_node_edge)
                                        if _sour not in self.static_cg["edge"]:
                                            self.static_cg["edge"][_sour] = set()
                                        self.static_cg["edge"][_sour].add(_dest)
                                        continue
                                
                                if _node_edge[1][1][0] in ["prop", "this"]:
                                    _edge_node = self.scopes[_node_edge[0]][_node_edge[1][0]][_node_edge[1][1][0]][_node_edge[1][1][1]]
                                else:
                                    _edge_node = self.scopes[_node_edge[0]][_node_edge[1][0]][_node_edge[1][1]]
                                _edge_edge_list = _edge_node["edge"]
                                _edge_node_type = _edge_node["type"]
                                if _edge_node_type == "func":
                                    if _node_edge[1][1][0] == "prop" or _node_edge[1][1][0] == "this":
                                        _edge_scope = _node_edge[1][1][1][1][1]
                                    else:
                                        _edge_scope = _node_edge[1][1][1][1]
                                    if _edge_scope in self.func_id:
                                        _dest = f"{self.func_id[_edge_scope]}"
                                        self.static_cg["node"].add(_sour)
                                        self.static_cg["node"].add(_dest)
                                        if _sour not in self.static_cg["edge"]:
                                            self.static_cg["edge"][_sour] = set()
                                        self.static_cg["edge"][_sour].add(_dest)
                                        _edge = f"{_sour} -> {_dest}"
                                        self.statistic_builtin(module_name, _node, _edge_node, _edge)
                                    else:
                                        logging.error("func_scope not in func_id")
                                if _edge_node_type == "class":
                                    if _node_edge[1][1] in self.scopes[_node_edge[0]]:
                                        for _class_key in self.scopes[_node_edge[0]][_node_edge[1][1]]:
                                            if _class_key[1][0] == "constructor":
                                                if self.scopes[_node_edge[0]][_node_edge[1][1]][_class_key]["type"] == "func":
                                                    _edge_scope = _class_key[1][1]
                                                    if _edge_scope in self.func_id:
                                                        _dest = f"{self.func_id[_edge_scope]}"
                                                        self.static_cg["node"].add(_sour)
                                                        self.static_cg["node"].add(_dest)
                                                        if _sour not in self.static_cg["edge"]:
                                                            self.static_cg["edge"][_sour] = set()
                                                        self.static_cg["edge"][_sour].add(_dest)
                                                        _edge = f"{_sour} -> {_dest}"
                                                        self.statistic_builtin(module_name, _node, _edge_node, _edge)
                                elif _edge_node_type == "var":
                                    if _edge_edge_list:
                                        for _edge_edge in _edge_edge_list:
                                            if _edge_edge[0] in ["undefined", "primordials", "binding"]:
                                                continue
                                            if _edge_edge[0] in self.builtins:
                                                _dest = self.build_builtin_module_method(_edge_edge)
                                                if _sour not in self.static_cg["edge"]:
                                                    self.static_cg["edge"][_sour] = set()
                                                self.static_cg["edge"][_sour].add(_dest)
                                                continue
                                            if _edge_edge[-1] in ["func", "obj"]:
                                                _type = _edge_edge[-1]
                                                _edge_edge = _edge_edge[0]
                                                if _edge_edge[-1] in ["func", "obj"]:
                                                    continue
                                                if _edge_edge[1][1][0] in ["prop", "this"]:
                                                    _edge_edge_node = self.scopes[_edge_edge[0]][_edge_edge[1][0]][_edge_edge[1][1][0]][_edge_edge[1][1][1]]
                                                else:
                                                    _edge_edge_node = self.scopes[_edge_edge[0]][_edge_edge[1][0]][_edge_edge[1][1]]
                                                _edge_edge_node[_type] = True
                                            else:
                                                if _edge_edge[1][1][0] in ["prop", "this"]:
                                                    _edge_edge_node = self.scopes[_edge_edge[0]][_edge_edge[1][0]][_edge_edge[1][1][0]][_edge_edge[1][1][1]]
                                                else:
                                                    _edge_edge_node = self.scopes[_edge_edge[0]][_edge_edge[1][0]][_edge_edge[1][1]]
                                            if _edge_edge_node["type"] == "func":
                                                if _edge_edge[1][1][0] == "prop" or _edge_edge[1][1][0] == "this":
                                                    _edge_scope = _edge_edge[1][1][1][1][1]
                                                else:
                                                    _edge_scope = _edge_edge[1][1][1][1]
                                                if _edge_scope in self.func_id:
                                                    _dest = f"{self.func_id[_edge_scope]}"
                                                    self.static_cg["node"].add(_sour)
                                                    self.static_cg["node"].add(_dest)
                                                    if _sour not in self.static_cg["edge"]:
                                                        self.static_cg["edge"][_sour] = set()
                                                    self.static_cg["edge"][_sour].add(_dest)
                                                    _edge = f"{_sour} -> {_dest}"
                                                    self.statistic_builtin(module_name, _node, _edge_edge_node, _edge)

                                                else:
                                                    logging.error("func_scope not in func_id")
                                else:
                                    pass
        # add dependency graph
        for start in self.dependency_cg:
            start_node = f"global@{start}, 0"
            self.static_cg["node"].add(start_node)
            end_list = self.dependency_cg[start]
            for end in end_list:
                end_node = f"global@{end}, 0"
                self.static_cg["node"].add(end_node)
                if start_node not in self.static_cg["edge"]:
                    self.static_cg["edge"][start_node] = set()
                self.static_cg["edge"][start_node].add(end_node)

    def calc_source_code(self, filepath, start_location_row, start_location_column, end_location_row, end_location_column):
        start_location_row = start_location_row
        start_location_column = start_location_column - 1
        end_location_row = end_location_row
        end_location_column = end_location_column - 1
        print(filepath)
        node = ""
        try:
            num = start_location_row
            f_r = open(f"{filepath}", "r")
            code = f_r.readlines()
            node = ""
            while num <= end_location_row:
                if num == start_location_row and num == end_location_row:
                    node += code[num-1][start_location_column:end_location_column]
                elif num == start_location_row:
                    node += code[num-1][start_location_column:]
                elif num == end_location_row:
                    node += code[num-1][:end_location_column]
                else:
                    node += code[num-1]
                num += 1
        except Exception as e:
            print(e)
        return node

    def generate_fs_cg_dynamic(self, file_path):
        with open(f"{file_path}", "r") as f_r:
            lines = f_r.readlines()
            line_num = 0
            for line in lines:
                line_num += 1
                if "//" in line:
                    num = line.strip().split(" ")[1][:-1]
                    filepath_loction = line.strip().split(" ")[-1][1:-1]
                    filepath = filepath_loction.split(":")[0]
                    start_location_row = filepath_loction.split(":")[1]
                    start_location_column = filepath_loction.split(":")[2]
                    if start_location_column[-1] == ")":
                        start_location_column = start_location_column[:-1]
                        continue
                    end_location_row = filepath_loction.split(":")[3]
                    end_location_column = filepath_loction.split(":")[4]
                    if 'structured-stack' in filepath or "A1" in filepath or "evalmachine" in filepath:
                        continue
                    if 'get_global' in filepath:
                        continue
                    if 'fs' in filepath:
                        continue
                    node_name = self.calc_source_code(filepath, 
                                        int(start_location_row), 
                                        int(start_location_column), 
                                        int(end_location_row), 
                                        int(end_location_column))
                    if filepath.startswith(self.dir_path):
                        filepath = filepath[len(self.dir_path)+1:]
                    self.dynamic_cg["node"][num] = (filepath, node_name, ((int(start_location_row), 
                                                                int(start_location_column)), 
                                                                (int(end_location_row), 
                                                                int(end_location_column))))
                elif "->" in line:
                    start = line.strip().split(" ")[0]
                    end = line.strip().split(" ")[-1][:-1]
                    if start in self.dynamic_cg["node"] and end in self.dynamic_cg["node"]:
                        try:
                            node_start = self.dynamic_cg["node"][start]
                            _start = re.search(r"(\S*?)\(.*?\)", self.dynamic_cg["node"][start][1]).group(1)
                            end_re = []
                            _end = ""
                            with open(f'{self.dir_path}/{self.dynamic_cg["node"][end][0]}', "r") as f_r:
                                file = f_r.read()
                                if file == self.dynamic_cg["node"][end][1]:
                                    _end = "global"
                                else:
                                    node_end = self.dynamic_cg["node"][end][1]
                                    _end = re.search(r"function(.*)?\(.*?\)", self.dynamic_cg["node"][end][1]).group(1).strip()
                                    if not _end:
                                        _end = "anonymous"

                            if _end:
                                if _end == "global":
                                    start_node = f"{_start}@{self.dynamic_cg['node'][start][0]}, {self.dynamic_cg['node'][start][2][0][0]-1}"
                                    if start_node in self.dynamic_cg["node2scope"]:
                                        start_scope = self.dynamic_cg["node2scope"][start_node]
                                        end_node = f"{_end}@{self.dynamic_cg['node'][end][0]}, {self.dynamic_cg['node'][end][2][0][0]-1}"
                                        if start_scope not in self.dynamic_cg["edge"]:
                                            self.dynamic_cg["edge"][start_scope] = set()
                                        self.dynamic_cg["edge"][start_scope].add(end_node)
                                    else:
                                        logging.error("not found!", start_node)
                                else:
                                    start_node = f"{_start}@{self.dynamic_cg['node'][start][0]}, {self.dynamic_cg['node'][start][2][0][0]}"
                                    if start_node in self.dynamic_cg["node2scope"]:
                                        start_scope = self.dynamic_cg["node2scope"][start_node]
                                        end_node = f"{_end}@{self.dynamic_cg['node'][end][0]}, {self.dynamic_cg['node'][end][2][0][0]}"
                                        if start_scope not in self.dynamic_cg["edge"]:
                                            self.dynamic_cg["edge"][start_scope] = set()
                                        self.dynamic_cg["edge"][start_scope].add(end_node)
                                    else:
                                        logging.error("not found!")
                            else:
                                logging.error(_end, "error")
                                  
                        except Exception as e:
                            end_re = re.findall(r"function.*\(.*?\)", self.dynamic_cg['node'][end][1])
                    else:
                        logging.error(start)
        
    def build_cg_dynamic(self):
        package_name = self.init_path.split(".")[0]
        poc_file_path = f"./tmp/dynamic/{package_name}.poc.js.re"
        if os.path.exists(poc_file_path):
            self.generate_fs_cg_dynamic(poc_file_path)
        tests_file_path = f"{your_dataset}/{package_name}/tests"
        if os.path.exists(tests_file_path):
            for test in os.listdir(tests_file_path):
                test_file_path =  f"./tmp/dynamic/{package_name}.{test}.re"
                self.generate_fs_cg_dynamic(test_file_path)
        test_file_path = f"./tmp/dynamic/{package_name}.test.js.re"
        if os.path.exists(test_file_path):
            self.generate_fs_cg_dynamic(test_file_path)

        try:
            package_name = self.init_path.split("/")[1]
            poc_file_path = f"./tmp/dynamic/{package_name}.poc.js.re"
            if os.path.exists(poc_file_path):
                self.generate_fs_cg_dynamic(poc_file_path)
            tests_file_path = f"{your_dataset}/{package_name}/tests"
            if os.path.exists(tests_file_path):
                for test in os.listdir(tests_file_path):
                    test_file_path =  f"./tmp/dynamic/{package_name}.{test}.re"
                    self.generate_fs_cg_dynamic(test_file_path)
            test_file_path = f"./tmp/dynamic/{package_name}.test.js.re"
            if os.path.exists(test_file_path):
                self.generate_fs_cg_dynamic(test_file_path)
        except Exception as e:
            logging.error(e)

    def combined_static_dynamic_cg(self):
        for dynamic_start in self.dynamic_cg["edge"]:
            dynamic_end_nodes = self.dynamic_cg["edge"][dynamic_start]
            if dynamic_start not in self.combined_cg["edge"]:
                self.combined_cg["edge"][dynamic_start] = set()
            for dynamic_end_node in dynamic_end_nodes:
                self.combined_cg["edge"][dynamic_start].add(dynamic_end_node)

        for static_start in self.static_cg["edge"]:
            static_end_nodes = self.static_cg["edge"][static_start]
            if static_start not in self.combined_cg["edge"]:
                self.combined_cg["edge"][static_start] = set()
            for static_end_node in static_end_nodes:
                self.combined_cg["edge"][static_start].add(static_end_node)

    def tranverse_static_cg(self, node):
        work_list = [node,]
        analysis_ed = set()
        node_s = list()
        edge_s = list()
        native_resuilt = list()
        while work_list:
            _node = work_list.pop()
            node_s.append(_node)
            if "," not in _node:
                native_resuilt.append(_node)
            else:
                if _node in self.static_cg["edge"]:
                    for _des in self.static_cg["edge"][_node]:
                        node_s.append(_des)
                        _edge = f"{_node} -> {_des}"
                        edge_s.append(_edge)
                        if _des not in analysis_ed:
                            if "@" in _des:
                                if "," in _des.split("@")[1]:
                                    module = _des.split(",")[0].split("@")[1]
                                else:
                                    module = _des.split("@")[1]
                                # if module == "internalBinding":
                                #     (_des)
                                if module in self.static_cg["global_call"]:
                                    work_list.append(self.static_cg["global_call"][module])
                            work_list.append(_des)
                            analysis_ed.add(_des)
        return [list(set(node_s)), list(set(edge_s)), native_resuilt]

    def tranverse_dynamic_cg(self, node):
        work_list = [node,]
        analysis_ed = set()
        node_s = list()
        edge_s = list()
        native_resuilt = list()
        while work_list:
            _node = work_list.pop()
            node_s.append(_node)
            if "," not in _node:
                native_resuilt.append(_node)
            else:
                if _node in self.dynamic_cg["edge"]:
                    for _des in self.dynamic_cg["edge"][_node]:
                        node_s.append(_des)
                        _edge = f"{_node} -> {_des}"
                        edge_s.append(_edge)
                        if _des not in analysis_ed:
                            if "@" in _des:
                                if "," in _des.split("@")[1]:
                                    module = _des.split(",")[0].split("@")[1]
                                else:
                                    module = _des.split("@")[1]
                            work_list.append(_des)
                            analysis_ed.add(_des)
        return [list(set(node_s)), list(set(edge_s)), native_resuilt]

    def calc_diff(self):
        node_static_s = set()
        edge_static_s = set()
        node_dynamic_s = set()
        edge_dynamic_s = set()
        
        for static_node in self.static_cg["node"]:
            node_static_s.add(static_node)
        for _start in self.static_cg["edge"]:
            for _end in self.static_cg["edge"][_start]:
                e = f"{_start} -> {_end}"
                edge_static_s.add(e)
        
        for _start in self.dynamic_cg["edge"]:
            for _end in self.dynamic_cg["edge"][_start]:
                e = f"{_start} -> {_end}"
                edge_dynamic_s.add(e)
                node_dynamic_s.add(_start)
                node_dynamic_s.add(_end)

        diff_node = set()
        diff_edge = set()
        for dynamic_node in node_dynamic_s:
            if dynamic_node not in node_static_s:
                diff_node.add(dynamic_node)

        f_dynamic = open("f_dynamic", "w")
        f_static = open("f_static", "w")
        f_diff = open("f_diff", "w")

        for dynamic_edge in edge_dynamic_s:
            line = f"{dynamic_edge}\n"
            f_dynamic.write(line)

        for static_edge in edge_static_s:
            line = f"{static_edge}\n"
            f_static.write(line)

        for dynamic_edge in edge_dynamic_s:
            if dynamic_edge not in edge_static_s:
                diff_edge.add(dynamic_edge)
                line = f"{dynamic_edge}\n"
                f_diff.write(line)
    
    def tranverse_combined_cg(self, node):
        work_list = [node,]
        analysis_ed = set()
        node_s = list()
        edge_s = list()
        native_resuilt = list()
        while work_list:
            _node = work_list.pop()
            node_s.append(_node)
            if "," not in _node:
                native_resuilt.append(_node)
            else:
                if _node in self.combined_cg["edge"]:
                    for _des in self.combined_cg["edge"][_node]:
                        node_s.append(_des)
                        _edge = f"{_node} -> {_des}"
                        edge_s.append(_edge)
                        if _des not in analysis_ed:
                            if "@" in _des:
                                if "," in _des.split("@")[1]:
                                    module = _des.split("@")[1].split(",")[0]
                                else:
                                    module = _des.split("@")[1]
                                if module in self.static_cg["global_call"]:
                                    work_list.append(self.static_cg["global_call"][module])
                            work_list.append(_des)
                            analysis_ed.add(_des)
        return [list(set(node_s)), list(set(edge_s)), native_resuilt]

    def get_built_in(self):
        built_in_list = list()
        node_combined_s = list()
        edge_combined_s = list()
        # static
        if self.init_path:
            if self.init_path in self.module_exports:
                for exports_edge in self.module_exports[self.init_path]:
                    if exports_edge[1][1][0] in ["prop", "this"]:
                        exports_edge_node = self.scopes[exports_edge[0]][exports_edge[1][0]][exports_edge[1][1][0]][exports_edge[1][1][1]]
                    else:
                        exports_edge_node = self.scopes[exports_edge[0]][exports_edge[1][0]][exports_edge[1][1]]
                    exports_edge_node_edge_list = exports_edge_node["edge"]
                    for exports_edge_node_edge in exports_edge_node_edge_list:
                        if exports_edge_node_edge[1][1][0] in ["prop", "this"]:
                            exports_edge_node = self.scopes[exports_edge_node_edge[0]][exports_edge_node_edge[1][0]][exports_edge_node_edge[1][1][0]][exports_edge_node_edge[1][1][1]]
                        else:
                            exports_edge_node = self.scopes[exports_edge_node_edge[0]][exports_edge_node_edge[1][0]][exports_edge_node_edge[1][1]]
                        _node = exports_edge_node
                        _node_type = _node["type"]
                        if _node_type == "func":
                            _sour = f"{self.func_id[exports_edge_node_edge[1][1][1][1]]}"
                            _result = self.tranverse_combined_cg(_sour)
                            node_combined_s.extend(_result[0])
                            edge_combined_s.extend(_result[1])
                            built_in_list.extend(_result[-1])
                        elif _node_type == "obj":
                            if exports_edge_node_edge[1][1] in self.scopes[exports_edge_node_edge[0]]:
                                for obj_key in self.scopes[exports_edge_node_edge[0]][exports_edge_node_edge[1][1]]:
                                    obj_key_node = self.scopes[exports_edge_node_edge[0]][exports_edge_node_edge[1][1]][obj_key]
                                    if obj_key_node["type"] == "var":
                                        obj_key_node_edge_list = obj_key_node["edge"]
                                        for obj_key_node_edge in obj_key_node_edge_list:
                                            if obj_key_node_edge[0] == "undefined":
                                                continue
                                            if obj_key_node_edge[1][1][1][1] in self.func_id:
                                                _sour = f"{self.func_id[obj_key_node_edge[1][1][1][1]]}"
                                                _result = self.tranverse_combined_cg(_sour)
                                                node_combined_s.extend(_result[0])
                                                edge_combined_s.extend(_result[1])
                                                built_in_list.extend(_result[-1])
                                            else:
                                                logging.error(f"nononono{obj_key_node_edge}")

                        else:
                            pass
            else:
                module_name = self.init_path
                for scope_id in self.scopes[module_name]:
                    for key in self.scopes[module_name][scope_id]:
                        if key in ["this", "prop"]:
                            for _key in self.scopes[module_name][scope_id][key]:
                                node = self.scopes[module_name][scope_id][key][_key]
                                node_type = node["type"]
                                node_edge_list = node["edge"]
                                if node_type in ["new", "call", "mem"]:
                                    for node_edge in node_edge_list:
                                        if node_edge[1][1][0] in ["prop", "this"]:
                                            exports_edge_node = self.scopes[node_edge[0]][node_edge[1][0]][node_edge[1][1][0]][node_edge[1][1][1]]
                                        else:
                                            exports_edge_node = self.scopes[node_edge[0]][node_edge[1][0]][node_edge[1][1]]
                                        _node = exports_edge_node
                                        _node_type = _node["type"]
                                        if _node_type == "func":
                                            _sour = f"{self.func_id[exports_edge_node_edge[1][1][1][1]]}"
                                            _result = self.tranverse_combined_cg(_sour)
                                            node_combined_s.extend(_result[0])
                                            edge_combined_s.extend(_result[1])
                                            built_in_list.extend(_result[-1])
                                        if _node_type in "class":
                                            if node_edge[1][1] in self.scopes[node_edge[0]]:
                                                for _class_key in self.scopes[node_edge[0]][node_edge[1][1]]:
                                                    if _class_key[1][0] == "constructor":
                                                        if self.scopes[node_edge[0]][node_edge[1][1]][_class_key]["type"] == "func":
                                                            _sour = f"{self.func_id[_class_key[1][1]]}"
                                                            _result = self.tranverse_combined_cg(_sour)
                                                            node_combined_s.extend(_result[0])
                                                            edge_combined_s.extend(_result[1])
                                                            built_in_list.extend(_result[-1])
                                        else:
                                            logging.error(f"_node_type error {_node_type}")
                        else:
                            node = self.scopes[module_name][scope_id][key]
                            node_type = node["type"]
                            node_edge_list = node["edge"]
                            if node_type in ["new", "call", "mem"]:
                                for node_edge in node_edge_list:
                                    if node_edge[0] in self.builtins:
                                        continue
                                    if node_edge[1][1][0] in ["prop", "this"]:
                                        exports_edge_node = self.scopes[node_edge[0]][node_edge[1][0]][node_edge[1][1][0]][node_edge[1][1][1]]
                                    else:
                                        exports_edge_node = self.scopes[node_edge[0]][node_edge[1][0]][node_edge[1][1]]
                                    _node = exports_edge_node
                                    _node_type = _node["type"]
                                    if _node_type in ["func", "class"]:
                                        _sour = f"{self.func_id[node_edge[1][1][1][1]]}"
                                        _result = self.tranverse_combined_cg(_sour)
                                        node_combined_s.extend(_result[0])
                                        edge_combined_s.extend(_result[1])
                                        built_in_list.extend(_result[-1])
                                    if _node_type in "class":
                                        if node_edge[1][1] in self.scopes[node_edge[0]]:
                                            for _class_key in self.scopes[node_edge[0]][node_edge[1][1]]:
                                                if _class_key[1][0] == "constructor":
                                                    if self.scopes[node_edge[0]][node_edge[1][1]][_class_key]["type"] == "func":
                                                        _sour = f"{self.func_id[_class_key[1][1]]}"
                                                        _result = self.tranverse_combined_cg(_sour)
                                                        node_combined_s.extend(_result[0])
                                                        edge_combined_s.extend(_result[1])
                                                        built_in_list.extend(_result[-1])
                                    else:
                                        logging.error(f"_node_type error {_node_type}")
                for _start in self.combined_cg["edge"]:
                    if self.init_path in _start:
                        for _end in self.combined_cg["edge"][_start]:
                            _result = self.tranverse_combined_cg(_end)
                            node_combined_s.extend(_result[0])
                            edge_combined_s.extend(_result[1])
                            built_in_list.extend(_result[-1])  
        else:
            pass

        dynamic_node_set = set()
        dynamic_edge_set = set()
        for start in self.dynamic_cg["edge"]:
            dynamic_node_set.add(start)
            for end in self.dynamic_cg["edge"][start]:
                dynamic_node_set.add(end)
                _edge = f"{start} -> {end}"
                dynamic_edge_set.add(_edge)
        
        module_set = set()
        for node in node_combined_s:
            module = node.split("@")[1].split(",")[0].strip()
            if module not in self.builtins:
                module_set.add(module)

        return built_in_list

    from ._analysis_Declaration import analysis_Declaration, \
        analysis_VariableDeclaration, \
        analysis_FunctionDeclaration, \
        analysis_ClassDeclaration

    from ._analysis_Statement import analysis_Statement, \
        analysis_BlockStatement, \
        analysis_ExpressionStatement, \
        analysis_ThrowStatement, \
        analysis_IfStatement, \
        analysis_ForStatement, \
        analysis_ForOfStatement, \
        analysis_TryStatement, \
        analysis_ReturnStatement,\
        analysis_SwitchStatement,\
        analysis_ContinueStatement,\
        analysis_WhileStatement,\
        analysis_BreakStatement,\
        analysis_DoWhileStatement,\
        analysis_ForInStatement,\
        analysis_EmptyStatement

    from ._analysis_Expression import analysis_Expression, \
        analysis_AssignmentExpression, \
        analysis_CallExpression, \
        analysis_ClassExpression, \
        analysis_FunctionExpression, \
        analysis_ArrowFunctionExpression, \
        analysis_ArrayExpression, \
        analysis_BinaryExpression, \
        analysis_ConditionalExpression, \
        analysis_LogicalExpression, \
        analysis_MemberExpression, \
        analysis_ObjectExpression, \
        analysis_TaggedTemplateExpression, \
        analysis_UnaryExpression, \
        analysis_UpdateExpression, \
        analysis_AwaitExpression, \
        analysis_ChainExpression, \
        analysis_NewExpression, \
        analysis_Identifier, \
        analysis_SpreadElement, \
        analysis_TemplateLiteral, \
        record_MemberExpression, \
        assignment_memberexpression, \
        analysis_memberexpression_pointer, \
        analysis_SequenceExpression, \
        analysis_object, \
        analysis_func

