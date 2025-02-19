(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react'), require('react-dom'), require('@mui/material'), require('@emotion/styled'), require('@emotion/react'), require('@mui/x-date-pickers/LocalizationProvider'), require('@mui/x-date-pickers/AdapterDateFns'), require('@mui/x-date-pickers/DateCalendar'), require('date-fns/locale'), require('date-fns')) :
	typeof define === 'function' && define.amd ? define(['react', 'react-dom', '@mui/material', '@emotion/styled', '@emotion/react', '@mui/x-date-pickers/LocalizationProvider', '@mui/x-date-pickers/AdapterDateFns', '@mui/x-date-pickers/DateCalendar', 'date-fns/locale', 'date-fns'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.AIChatWidget = factory(global.React, global.ReactDOM, global.MaterialUI, global.emotionStyled, global.emotionReact, global.MUIDatePickers.LocalizationProvider, global.MUIDatePickers.AdapterDateFns, global.MUIDatePickers.DateCalendar, global.locale, global.dateFns));
})(this, (function (React$1, require$$0$1, material, emStyled, react, LocalizationProvider, AdapterDateFns, DateCalendar, locale, dateFns) { 'use strict';

	function _interopNamespaceDefault(e) {
		var n = Object.create(null);
		if (e) {
			Object.keys(e).forEach(function (k) {
				if (k !== 'default') {
					var d = Object.getOwnPropertyDescriptor(e, k);
					Object.defineProperty(n, k, d.get ? d : {
						enumerable: true,
						get: function () { return e[k]; }
					});
				}
			});
		}
		n.default = e;
		return Object.freeze(n);
	}

	var React__namespace = /*#__PURE__*/_interopNamespaceDefault(React$1);

	function getAugmentedNamespace(n) {
	  if (n.__esModule) return n;
	  var f = n.default;
		if (typeof f == "function") {
			var a = function a () {
				if (this instanceof a) {
	        return Reflect.construct(f, arguments, this.constructor);
				}
				return f.apply(this, arguments);
			};
			a.prototype = f.prototype;
	  } else a = {};
	  Object.defineProperty(a, '__esModule', {value: true});
		Object.keys(n).forEach(function (k) {
			var d = Object.getOwnPropertyDescriptor(n, k);
			Object.defineProperty(a, k, d.get ? d : {
				enumerable: true,
				get: function () {
					return n[k];
				}
			});
		});
		return a;
	}

	var m = require$$0$1;
	{
	  m.createRoot;
	  m.hydrateRoot;
	}

	/**
	 * WARNING: Don't import this directly.
	 * Use `MuiError` from `@mui/internal-babel-macros/MuiError.macro` instead.
	 * @param {number} code
	 */
	function formatMuiErrorMessage$1(code) {
	  // Apply babel-plugin-transform-template-literals in loose mode
	  // loose mode is safe if we're concatenating primitives
	  // see https://babeljs.io/docs/en/babel-plugin-transform-template-literals#loose
	  /* eslint-disable prefer-template */
	  let url = 'https://mui.com/production-error/?code=' + code;
	  for (let i = 1; i < arguments.length; i += 1) {
	    // rest params over-transpile for this case
	    // eslint-disable-next-line prefer-rest-params
	    url += '&args[]=' + encodeURIComponent(arguments[i]);
	  }
	  return 'Minified MUI error #' + code + '; visit ' + url + ' for the full message.';
	  /* eslint-enable prefer-template */
	}

	var formatMuiErrorMessage = /*#__PURE__*/Object.freeze({
		__proto__: null,
		default: formatMuiErrorMessage$1
	});

	var THEME_ID = '$$material';

	function _extends$1() {
	  return _extends$1 = Object.assign ? Object.assign.bind() : function (n) {
	    for (var e = 1; e < arguments.length; e++) {
	      var t = arguments[e];
	      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
	    }
	    return n;
	  }, _extends$1.apply(null, arguments);
	}

	function _objectWithoutPropertiesLoose(r, e) {
	  if (null == r) return {};
	  var t = {};
	  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
	    if (-1 !== e.indexOf(n)) continue;
	    t[n] = r[n];
	  }
	  return t;
	}

	/*

	Based off glamor's StyleSheet, thanks Sunil ❤️

	high performance StyleSheet for css-in-js systems

	- uses multiple style tags behind the scenes for millions of rules
	- uses `insertRule` for appending in production for *much* faster performance

	// usage

	import { StyleSheet } from '@emotion/sheet'

	let styleSheet = new StyleSheet({ key: '', container: document.head })

	styleSheet.insert('#box { border: 1px solid red; }')
	- appends a css rule into the stylesheet

	styleSheet.flush()
	- empties the stylesheet of all its contents

	*/

	function sheetForTag(tag) {
	  if (tag.sheet) {
	    return tag.sheet;
	  } // this weirdness brought to you by firefox

	  /* istanbul ignore next */

	  for (var i = 0; i < document.styleSheets.length; i++) {
	    if (document.styleSheets[i].ownerNode === tag) {
	      return document.styleSheets[i];
	    }
	  } // this function should always return with a value
	  // TS can't understand it though so we make it stop complaining here

	  return undefined;
	}
	function createStyleElement(options) {
	  var tag = document.createElement('style');
	  tag.setAttribute('data-emotion', options.key);
	  if (options.nonce !== undefined) {
	    tag.setAttribute('nonce', options.nonce);
	  }
	  tag.appendChild(document.createTextNode(''));
	  tag.setAttribute('data-s', '');
	  return tag;
	}
	var StyleSheet = /*#__PURE__*/function () {
	  // Using Node instead of HTMLElement since container may be a ShadowRoot
	  function StyleSheet(options) {
	    var _this = this;
	    this._insertTag = function (tag) {
	      var before;
	      if (_this.tags.length === 0) {
	        if (_this.insertionPoint) {
	          before = _this.insertionPoint.nextSibling;
	        } else if (_this.prepend) {
	          before = _this.container.firstChild;
	        } else {
	          before = _this.before;
	        }
	      } else {
	        before = _this.tags[_this.tags.length - 1].nextSibling;
	      }
	      _this.container.insertBefore(tag, before);
	      _this.tags.push(tag);
	    };
	    this.isSpeedy = options.speedy === undefined ? true : options.speedy;
	    this.tags = [];
	    this.ctr = 0;
	    this.nonce = options.nonce; // key is the value of the data-emotion attribute, it's used to identify different sheets

	    this.key = options.key;
	    this.container = options.container;
	    this.prepend = options.prepend;
	    this.insertionPoint = options.insertionPoint;
	    this.before = null;
	  }
	  var _proto = StyleSheet.prototype;
	  _proto.hydrate = function hydrate(nodes) {
	    nodes.forEach(this._insertTag);
	  };
	  _proto.insert = function insert(rule) {
	    // the max length is how many rules we have per style tag, it's 65000 in speedy mode
	    // it's 1 in dev because we insert source maps that map a single rule to a location
	    // and you can only have one source map per style tag
	    if (this.ctr % (this.isSpeedy ? 65000 : 1) === 0) {
	      this._insertTag(createStyleElement(this));
	    }
	    var tag = this.tags[this.tags.length - 1];
	    if (this.isSpeedy) {
	      var sheet = sheetForTag(tag);
	      try {
	        // this is the ultrafast version, works across browsers
	        // the big drawback is that the css won't be editable in devtools
	        sheet.insertRule(rule, sheet.cssRules.length);
	      } catch (e) {}
	    } else {
	      tag.appendChild(document.createTextNode(rule));
	    }
	    this.ctr++;
	  };
	  _proto.flush = function flush() {
	    this.tags.forEach(function (tag) {
	      var _tag$parentNode;
	      return (_tag$parentNode = tag.parentNode) == null ? void 0 : _tag$parentNode.removeChild(tag);
	    });
	    this.tags = [];
	    this.ctr = 0;
	  };
	  return StyleSheet;
	}();

	var MS = '-ms-';
	var MOZ = '-moz-';
	var WEBKIT = '-webkit-';
	var COMMENT = 'comm';
	var RULESET = 'rule';
	var DECLARATION = 'decl';
	var IMPORT = '@import';
	var KEYFRAMES = '@keyframes';
	var LAYER = '@layer';

	/**
	 * @param {number}
	 * @return {number}
	 */
	var abs = Math.abs;

	/**
	 * @param {number}
	 * @return {string}
	 */
	var from = String.fromCharCode;

	/**
	 * @param {object}
	 * @return {object}
	 */
	var assign = Object.assign;

	/**
	 * @param {string} value
	 * @param {number} length
	 * @return {number}
	 */
	function hash(value, length) {
	  return charat(value, 0) ^ 45 ? (((length << 2 ^ charat(value, 0)) << 2 ^ charat(value, 1)) << 2 ^ charat(value, 2)) << 2 ^ charat(value, 3) : 0;
	}

	/**
	 * @param {string} value
	 * @return {string}
	 */
	function trim(value) {
	  return value.trim();
	}

	/**
	 * @param {string} value
	 * @param {RegExp} pattern
	 * @return {string?}
	 */
	function match(value, pattern) {
	  return (value = pattern.exec(value)) ? value[0] : value;
	}

	/**
	 * @param {string} value
	 * @param {(string|RegExp)} pattern
	 * @param {string} replacement
	 * @return {string}
	 */
	function replace(value, pattern, replacement) {
	  return value.replace(pattern, replacement);
	}

	/**
	 * @param {string} value
	 * @param {string} search
	 * @return {number}
	 */
	function indexof(value, search) {
	  return value.indexOf(search);
	}

	/**
	 * @param {string} value
	 * @param {number} index
	 * @return {number}
	 */
	function charat(value, index) {
	  return value.charCodeAt(index) | 0;
	}

	/**
	 * @param {string} value
	 * @param {number} begin
	 * @param {number} end
	 * @return {string}
	 */
	function substr(value, begin, end) {
	  return value.slice(begin, end);
	}

	/**
	 * @param {string} value
	 * @return {number}
	 */
	function strlen(value) {
	  return value.length;
	}

	/**
	 * @param {any[]} value
	 * @return {number}
	 */
	function sizeof(value) {
	  return value.length;
	}

	/**
	 * @param {any} value
	 * @param {any[]} array
	 * @return {any}
	 */
	function append(value, array) {
	  return array.push(value), value;
	}

	/**
	 * @param {string[]} array
	 * @param {function} callback
	 * @return {string}
	 */
	function combine(array, callback) {
	  return array.map(callback).join('');
	}

	var line = 1;
	var column = 1;
	var length = 0;
	var position = 0;
	var character = 0;
	var characters = '';

	/**
	 * @param {string} value
	 * @param {object | null} root
	 * @param {object | null} parent
	 * @param {string} type
	 * @param {string[] | string} props
	 * @param {object[] | string} children
	 * @param {number} length
	 */
	function node(value, root, parent, type, props, children, length) {
	  return {
	    value: value,
	    root: root,
	    parent: parent,
	    type: type,
	    props: props,
	    children: children,
	    line: line,
	    column: column,
	    length: length,
	    return: ''
	  };
	}

	/**
	 * @param {object} root
	 * @param {object} props
	 * @return {object}
	 */
	function copy(root, props) {
	  return assign(node('', null, null, '', null, null, 0), root, {
	    length: -root.length
	  }, props);
	}

	/**
	 * @return {number}
	 */
	function char() {
	  return character;
	}

	/**
	 * @return {number}
	 */
	function prev() {
	  character = position > 0 ? charat(characters, --position) : 0;
	  if (column--, character === 10) column = 1, line--;
	  return character;
	}

	/**
	 * @return {number}
	 */
	function next() {
	  character = position < length ? charat(characters, position++) : 0;
	  if (column++, character === 10) column = 1, line++;
	  return character;
	}

	/**
	 * @return {number}
	 */
	function peek() {
	  return charat(characters, position);
	}

	/**
	 * @return {number}
	 */
	function caret() {
	  return position;
	}

	/**
	 * @param {number} begin
	 * @param {number} end
	 * @return {string}
	 */
	function slice(begin, end) {
	  return substr(characters, begin, end);
	}

	/**
	 * @param {number} type
	 * @return {number}
	 */
	function token(type) {
	  switch (type) {
	    // \0 \t \n \r \s whitespace token
	    case 0:
	    case 9:
	    case 10:
	    case 13:
	    case 32:
	      return 5;
	    // ! + , / > @ ~ isolate token
	    case 33:
	    case 43:
	    case 44:
	    case 47:
	    case 62:
	    case 64:
	    case 126:
	    // ; { } breakpoint token
	    case 59:
	    case 123:
	    case 125:
	      return 4;
	    // : accompanied token
	    case 58:
	      return 3;
	    // " ' ( [ opening delimit token
	    case 34:
	    case 39:
	    case 40:
	    case 91:
	      return 2;
	    // ) ] closing delimit token
	    case 41:
	    case 93:
	      return 1;
	  }
	  return 0;
	}

	/**
	 * @param {string} value
	 * @return {any[]}
	 */
	function alloc(value) {
	  return line = column = 1, length = strlen(characters = value), position = 0, [];
	}

	/**
	 * @param {any} value
	 * @return {any}
	 */
	function dealloc(value) {
	  return characters = '', value;
	}

	/**
	 * @param {number} type
	 * @return {string}
	 */
	function delimit(type) {
	  return trim(slice(position - 1, delimiter(type === 91 ? type + 2 : type === 40 ? type + 1 : type)));
	}

	/**
	 * @param {number} type
	 * @return {string}
	 */
	function whitespace(type) {
	  while (character = peek()) if (character < 33) next();else break;
	  return token(type) > 2 || token(character) > 3 ? '' : ' ';
	}

	/**
	 * @param {number} index
	 * @param {number} count
	 * @return {string}
	 */
	function escaping(index, count) {
	  while (--count && next())
	  // not 0-9 A-F a-f
	  if (character < 48 || character > 102 || character > 57 && character < 65 || character > 70 && character < 97) break;
	  return slice(index, caret() + (count < 6 && peek() == 32 && next() == 32));
	}

	/**
	 * @param {number} type
	 * @return {number}
	 */
	function delimiter(type) {
	  while (next()) switch (character) {
	    // ] ) " '
	    case type:
	      return position;
	    // " '
	    case 34:
	    case 39:
	      if (type !== 34 && type !== 39) delimiter(character);
	      break;
	    // (
	    case 40:
	      if (type === 41) delimiter(type);
	      break;
	    // \
	    case 92:
	      next();
	      break;
	  }
	  return position;
	}

	/**
	 * @param {number} type
	 * @param {number} index
	 * @return {number}
	 */
	function commenter(type, index) {
	  while (next())
	  // //
	  if (type + character === 47 + 10) break;
	  // /*
	  else if (type + character === 42 + 42 && peek() === 47) break;
	  return '/*' + slice(index, position - 1) + '*' + from(type === 47 ? type : next());
	}

	/**
	 * @param {number} index
	 * @return {string}
	 */
	function identifier(index) {
	  while (!token(peek())) next();
	  return slice(index, position);
	}

	/**
	 * @param {string} value
	 * @return {object[]}
	 */
	function compile(value) {
	  return dealloc(parse('', null, null, null, [''], value = alloc(value), 0, [0], value));
	}

	/**
	 * @param {string} value
	 * @param {object} root
	 * @param {object?} parent
	 * @param {string[]} rule
	 * @param {string[]} rules
	 * @param {string[]} rulesets
	 * @param {number[]} pseudo
	 * @param {number[]} points
	 * @param {string[]} declarations
	 * @return {object}
	 */
	function parse(value, root, parent, rule, rules, rulesets, pseudo, points, declarations) {
	  var index = 0;
	  var offset = 0;
	  var length = pseudo;
	  var atrule = 0;
	  var property = 0;
	  var previous = 0;
	  var variable = 1;
	  var scanning = 1;
	  var ampersand = 1;
	  var character = 0;
	  var type = '';
	  var props = rules;
	  var children = rulesets;
	  var reference = rule;
	  var characters = type;
	  while (scanning) switch (previous = character, character = next()) {
	    // (
	    case 40:
	      if (previous != 108 && charat(characters, length - 1) == 58) {
	        if (indexof(characters += replace(delimit(character), '&', '&\f'), '&\f') != -1) ampersand = -1;
	        break;
	      }
	    // " ' [
	    case 34:
	    case 39:
	    case 91:
	      characters += delimit(character);
	      break;
	    // \t \n \r \s
	    case 9:
	    case 10:
	    case 13:
	    case 32:
	      characters += whitespace(previous);
	      break;
	    // \
	    case 92:
	      characters += escaping(caret() - 1, 7);
	      continue;
	    // /
	    case 47:
	      switch (peek()) {
	        case 42:
	        case 47:
	          append(comment(commenter(next(), caret()), root, parent), declarations);
	          break;
	        default:
	          characters += '/';
	      }
	      break;
	    // {
	    case 123 * variable:
	      points[index++] = strlen(characters) * ampersand;
	    // } ; \0
	    case 125 * variable:
	    case 59:
	    case 0:
	      switch (character) {
	        // \0 }
	        case 0:
	        case 125:
	          scanning = 0;
	        // ;
	        case 59 + offset:
	          if (ampersand == -1) characters = replace(characters, /\f/g, '');
	          if (property > 0 && strlen(characters) - length) append(property > 32 ? declaration(characters + ';', rule, parent, length - 1) : declaration(replace(characters, ' ', '') + ';', rule, parent, length - 2), declarations);
	          break;
	        // @ ;
	        case 59:
	          characters += ';';
	        // { rule/at-rule
	        default:
	          append(reference = ruleset(characters, root, parent, index, offset, rules, points, type, props = [], children = [], length), rulesets);
	          if (character === 123) if (offset === 0) parse(characters, root, reference, reference, props, rulesets, length, points, children);else switch (atrule === 99 && charat(characters, 3) === 110 ? 100 : atrule) {
	            // d l m s
	            case 100:
	            case 108:
	            case 109:
	            case 115:
	              parse(value, reference, reference, rule && append(ruleset(value, reference, reference, 0, 0, rules, points, type, rules, props = [], length), children), rules, children, length, points, rule ? props : children);
	              break;
	            default:
	              parse(characters, reference, reference, reference, [''], children, 0, points, children);
	          }
	      }
	      index = offset = property = 0, variable = ampersand = 1, type = characters = '', length = pseudo;
	      break;
	    // :
	    case 58:
	      length = 1 + strlen(characters), property = previous;
	    default:
	      if (variable < 1) if (character == 123) --variable;else if (character == 125 && variable++ == 0 && prev() == 125) continue;
	      switch (characters += from(character), character * variable) {
	        // &
	        case 38:
	          ampersand = offset > 0 ? 1 : (characters += '\f', -1);
	          break;
	        // ,
	        case 44:
	          points[index++] = (strlen(characters) - 1) * ampersand, ampersand = 1;
	          break;
	        // @
	        case 64:
	          // -
	          if (peek() === 45) characters += delimit(next());
	          atrule = peek(), offset = length = strlen(type = characters += identifier(caret())), character++;
	          break;
	        // -
	        case 45:
	          if (previous === 45 && strlen(characters) == 2) variable = 0;
	      }
	  }
	  return rulesets;
	}

	/**
	 * @param {string} value
	 * @param {object} root
	 * @param {object?} parent
	 * @param {number} index
	 * @param {number} offset
	 * @param {string[]} rules
	 * @param {number[]} points
	 * @param {string} type
	 * @param {string[]} props
	 * @param {string[]} children
	 * @param {number} length
	 * @return {object}
	 */
	function ruleset(value, root, parent, index, offset, rules, points, type, props, children, length) {
	  var post = offset - 1;
	  var rule = offset === 0 ? rules : [''];
	  var size = sizeof(rule);
	  for (var i = 0, j = 0, k = 0; i < index; ++i) for (var x = 0, y = substr(value, post + 1, post = abs(j = points[i])), z = value; x < size; ++x) if (z = trim(j > 0 ? rule[x] + ' ' + y : replace(y, /&\f/g, rule[x]))) props[k++] = z;
	  return node(value, root, parent, offset === 0 ? RULESET : type, props, children, length);
	}

	/**
	 * @param {number} value
	 * @param {object} root
	 * @param {object?} parent
	 * @return {object}
	 */
	function comment(value, root, parent) {
	  return node(value, root, parent, COMMENT, from(char()), substr(value, 2, -2), 0);
	}

	/**
	 * @param {string} value
	 * @param {object} root
	 * @param {object?} parent
	 * @param {number} length
	 * @return {object}
	 */
	function declaration(value, root, parent, length) {
	  return node(value, root, parent, DECLARATION, substr(value, 0, length), substr(value, length + 1, -1), length);
	}

	/**
	 * @param {object[]} children
	 * @param {function} callback
	 * @return {string}
	 */
	function serialize(children, callback) {
	  var output = '';
	  var length = sizeof(children);
	  for (var i = 0; i < length; i++) output += callback(children[i], i, children, callback) || '';
	  return output;
	}

	/**
	 * @param {object} element
	 * @param {number} index
	 * @param {object[]} children
	 * @param {function} callback
	 * @return {string}
	 */
	function stringify(element, index, children, callback) {
	  switch (element.type) {
	    case LAYER:
	      if (element.children.length) break;
	    case IMPORT:
	    case DECLARATION:
	      return element.return = element.return || element.value;
	    case COMMENT:
	      return '';
	    case KEYFRAMES:
	      return element.return = element.value + '{' + serialize(element.children, callback) + '}';
	    case RULESET:
	      element.value = element.props.join(',');
	  }
	  return strlen(children = serialize(element.children, callback)) ? element.return = element.value + '{' + children + '}' : '';
	}

	/**
	 * @param {function[]} collection
	 * @return {function}
	 */
	function middleware(collection) {
	  var length = sizeof(collection);
	  return function (element, index, children, callback) {
	    var output = '';
	    for (var i = 0; i < length; i++) output += collection[i](element, index, children, callback) || '';
	    return output;
	  };
	}

	/**
	 * @param {function} callback
	 * @return {function}
	 */
	function rulesheet(callback) {
	  return function (element) {
	    if (!element.root) if (element = element.return) callback(element);
	  };
	}

	var weakMemoize = function weakMemoize(func) {
	  var cache = new WeakMap();
	  return function (arg) {
	    if (cache.has(arg)) {
	      // Use non-null assertion because we just checked that the cache `has` it
	      // This allows us to remove `undefined` from the return value
	      return cache.get(arg);
	    }
	    var ret = func(arg);
	    cache.set(arg, ret);
	    return ret;
	  };
	};

	function memoize$1(fn) {
	  var cache = Object.create(null);
	  return function (arg) {
	    if (cache[arg] === undefined) cache[arg] = fn(arg);
	    return cache[arg];
	  };
	}

	var isBrowser = typeof document !== 'undefined';
	var identifierWithPointTracking = function identifierWithPointTracking(begin, points, index) {
	  var previous = 0;
	  var character = 0;
	  while (true) {
	    previous = character;
	    character = peek(); // &\f

	    if (previous === 38 && character === 12) {
	      points[index] = 1;
	    }
	    if (token(character)) {
	      break;
	    }
	    next();
	  }
	  return slice(begin, position);
	};
	var toRules = function toRules(parsed, points) {
	  // pretend we've started with a comma
	  var index = -1;
	  var character = 44;
	  do {
	    switch (token(character)) {
	      case 0:
	        // &\f
	        if (character === 38 && peek() === 12) {
	          // this is not 100% correct, we don't account for literal sequences here - like for example quoted strings
	          // stylis inserts \f after & to know when & where it should replace this sequence with the context selector
	          // and when it should just concatenate the outer and inner selectors
	          // it's very unlikely for this sequence to actually appear in a different context, so we just leverage this fact here
	          points[index] = 1;
	        }
	        parsed[index] += identifierWithPointTracking(position - 1, points, index);
	        break;
	      case 2:
	        parsed[index] += delimit(character);
	        break;
	      case 4:
	        // comma
	        if (character === 44) {
	          // colon
	          parsed[++index] = peek() === 58 ? '&\f' : '';
	          points[index] = parsed[index].length;
	          break;
	        }

	      // fallthrough

	      default:
	        parsed[index] += from(character);
	    }
	  } while (character = next());
	  return parsed;
	};
	var getRules = function getRules(value, points) {
	  return dealloc(toRules(alloc(value), points));
	}; // WeakSet would be more appropriate, but only WeakMap is supported in IE11

	var fixedElements = /* #__PURE__ */new WeakMap();
	var compat = function compat(element) {
	  if (element.type !== 'rule' || !element.parent ||
	  // positive .length indicates that this rule contains pseudo
	  // negative .length indicates that this rule has been already prefixed
	  element.length < 1) {
	    return;
	  }
	  var value = element.value;
	  var parent = element.parent;
	  var isImplicitRule = element.column === parent.column && element.line === parent.line;
	  while (parent.type !== 'rule') {
	    parent = parent.parent;
	    if (!parent) return;
	  } // short-circuit for the simplest case

	  if (element.props.length === 1 && value.charCodeAt(0) !== 58
	  /* colon */ && !fixedElements.get(parent)) {
	    return;
	  } // if this is an implicitly inserted rule (the one eagerly inserted at the each new nested level)
	  // then the props has already been manipulated beforehand as they that array is shared between it and its "rule parent"

	  if (isImplicitRule) {
	    return;
	  }
	  fixedElements.set(element, true);
	  var points = [];
	  var rules = getRules(value, points);
	  var parentRules = parent.props;
	  for (var i = 0, k = 0; i < rules.length; i++) {
	    for (var j = 0; j < parentRules.length; j++, k++) {
	      element.props[k] = points[i] ? rules[i].replace(/&\f/g, parentRules[j]) : parentRules[j] + " " + rules[i];
	    }
	  }
	};
	var removeLabel = function removeLabel(element) {
	  if (element.type === 'decl') {
	    var value = element.value;
	    if (
	    // charcode for l
	    value.charCodeAt(0) === 108 &&
	    // charcode for b
	    value.charCodeAt(2) === 98) {
	      // this ignores label
	      element["return"] = '';
	      element.value = '';
	    }
	  }
	};

	/* eslint-disable no-fallthrough */

	function prefix(value, length) {
	  switch (hash(value, length)) {
	    // color-adjust
	    case 5103:
	      return WEBKIT + 'print-' + value + value;
	    // animation, animation-(delay|direction|duration|fill-mode|iteration-count|name|play-state|timing-function)

	    case 5737:
	    case 4201:
	    case 3177:
	    case 3433:
	    case 1641:
	    case 4457:
	    case 2921: // text-decoration, filter, clip-path, backface-visibility, column, box-decoration-break

	    case 5572:
	    case 6356:
	    case 5844:
	    case 3191:
	    case 6645:
	    case 3005: // mask, mask-image, mask-(mode|clip|size), mask-(repeat|origin), mask-position, mask-composite,

	    case 6391:
	    case 5879:
	    case 5623:
	    case 6135:
	    case 4599:
	    case 4855: // background-clip, columns, column-(count|fill|gap|rule|rule-color|rule-style|rule-width|span|width)

	    case 4215:
	    case 6389:
	    case 5109:
	    case 5365:
	    case 5621:
	    case 3829:
	      return WEBKIT + value + value;
	    // appearance, user-select, transform, hyphens, text-size-adjust

	    case 5349:
	    case 4246:
	    case 4810:
	    case 6968:
	    case 2756:
	      return WEBKIT + value + MOZ + value + MS + value + value;
	    // flex, flex-direction

	    case 6828:
	    case 4268:
	      return WEBKIT + value + MS + value + value;
	    // order

	    case 6165:
	      return WEBKIT + value + MS + 'flex-' + value + value;
	    // align-items

	    case 5187:
	      return WEBKIT + value + replace(value, /(\w+).+(:[^]+)/, WEBKIT + 'box-$1$2' + MS + 'flex-$1$2') + value;
	    // align-self

	    case 5443:
	      return WEBKIT + value + MS + 'flex-item-' + replace(value, /flex-|-self/, '') + value;
	    // align-content

	    case 4675:
	      return WEBKIT + value + MS + 'flex-line-pack' + replace(value, /align-content|flex-|-self/, '') + value;
	    // flex-shrink

	    case 5548:
	      return WEBKIT + value + MS + replace(value, 'shrink', 'negative') + value;
	    // flex-basis

	    case 5292:
	      return WEBKIT + value + MS + replace(value, 'basis', 'preferred-size') + value;
	    // flex-grow

	    case 6060:
	      return WEBKIT + 'box-' + replace(value, '-grow', '') + WEBKIT + value + MS + replace(value, 'grow', 'positive') + value;
	    // transition

	    case 4554:
	      return WEBKIT + replace(value, /([^-])(transform)/g, '$1' + WEBKIT + '$2') + value;
	    // cursor

	    case 6187:
	      return replace(replace(replace(value, /(zoom-|grab)/, WEBKIT + '$1'), /(image-set)/, WEBKIT + '$1'), value, '') + value;
	    // background, background-image

	    case 5495:
	    case 3959:
	      return replace(value, /(image-set\([^]*)/, WEBKIT + '$1' + '$`$1');
	    // justify-content

	    case 4968:
	      return replace(replace(value, /(.+:)(flex-)?(.*)/, WEBKIT + 'box-pack:$3' + MS + 'flex-pack:$3'), /s.+-b[^;]+/, 'justify') + WEBKIT + value + value;
	    // (margin|padding)-inline-(start|end)

	    case 4095:
	    case 3583:
	    case 4068:
	    case 2532:
	      return replace(value, /(.+)-inline(.+)/, WEBKIT + '$1$2') + value;
	    // (min|max)?(width|height|inline-size|block-size)

	    case 8116:
	    case 7059:
	    case 5753:
	    case 5535:
	    case 5445:
	    case 5701:
	    case 4933:
	    case 4677:
	    case 5533:
	    case 5789:
	    case 5021:
	    case 4765:
	      // stretch, max-content, min-content, fill-available
	      if (strlen(value) - 1 - length > 6) switch (charat(value, length + 1)) {
	        // (m)ax-content, (m)in-content
	        case 109:
	          // -
	          if (charat(value, length + 4) !== 45) break;
	        // (f)ill-available, (f)it-content

	        case 102:
	          return replace(value, /(.+:)(.+)-([^]+)/, '$1' + WEBKIT + '$2-$3' + '$1' + MOZ + (charat(value, length + 3) == 108 ? '$3' : '$2-$3')) + value;
	        // (s)tretch

	        case 115:
	          return ~indexof(value, 'stretch') ? prefix(replace(value, 'stretch', 'fill-available'), length) + value : value;
	      }
	      break;
	    // position: sticky

	    case 4949:
	      // (s)ticky?
	      if (charat(value, length + 1) !== 115) break;
	    // display: (flex|inline-flex)

	    case 6444:
	      switch (charat(value, strlen(value) - 3 - (~indexof(value, '!important') && 10))) {
	        // stic(k)y
	        case 107:
	          return replace(value, ':', ':' + WEBKIT) + value;
	        // (inline-)?fl(e)x

	        case 101:
	          return replace(value, /(.+:)([^;!]+)(;|!.+)?/, '$1' + WEBKIT + (charat(value, 14) === 45 ? 'inline-' : '') + 'box$3' + '$1' + WEBKIT + '$2$3' + '$1' + MS + '$2box$3') + value;
	      }
	      break;
	    // writing-mode

	    case 5936:
	      switch (charat(value, length + 11)) {
	        // vertical-l(r)
	        case 114:
	          return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, 'tb') + value;
	        // vertical-r(l)

	        case 108:
	          return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, 'tb-rl') + value;
	        // horizontal(-)tb

	        case 45:
	          return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, 'lr') + value;
	      }
	      return WEBKIT + value + MS + value + value;
	  }
	  return value;
	}
	var prefixer = function prefixer(element, index, children, callback) {
	  if (element.length > -1) if (!element["return"]) switch (element.type) {
	    case DECLARATION:
	      element["return"] = prefix(element.value, element.length);
	      break;
	    case KEYFRAMES:
	      return serialize([copy(element, {
	        value: replace(element.value, '@', '@' + WEBKIT)
	      })], callback);
	    case RULESET:
	      if (element.length) return combine(element.props, function (value) {
	        switch (match(value, /(::plac\w+|:read-\w+)/)) {
	          // :read-(only|write)
	          case ':read-only':
	          case ':read-write':
	            return serialize([copy(element, {
	              props: [replace(value, /:(read-\w+)/, ':' + MOZ + '$1')]
	            })], callback);
	          // :placeholder

	          case '::placeholder':
	            return serialize([copy(element, {
	              props: [replace(value, /:(plac\w+)/, ':' + WEBKIT + 'input-$1')]
	            }), copy(element, {
	              props: [replace(value, /:(plac\w+)/, ':' + MOZ + '$1')]
	            }), copy(element, {
	              props: [replace(value, /:(plac\w+)/, MS + 'input-$1')]
	            })], callback);
	        }
	        return '';
	      });
	  }
	};
	var getServerStylisCache = isBrowser ? undefined : weakMemoize(function () {
	  return memoize$1(function () {
	    return {};
	  });
	});
	var defaultStylisPlugins = [prefixer];
	var createCache = function createCache(options) {
	  var key = options.key;
	  if (isBrowser && key === 'css') {
	    var ssrStyles = document.querySelectorAll("style[data-emotion]:not([data-s])"); // get SSRed styles out of the way of React's hydration
	    // document.head is a safe place to move them to(though note document.head is not necessarily the last place they will be)
	    // note this very very intentionally targets all style elements regardless of the key to ensure
	    // that creating a cache works inside of render of a React component

	    Array.prototype.forEach.call(ssrStyles, function (node) {
	      // we want to only move elements which have a space in the data-emotion attribute value
	      // because that indicates that it is an Emotion 11 server-side rendered style elements
	      // while we will already ignore Emotion 11 client-side inserted styles because of the :not([data-s]) part in the selector
	      // Emotion 10 client-side inserted styles did not have data-s (but importantly did not have a space in their data-emotion attributes)
	      // so checking for the space ensures that loading Emotion 11 after Emotion 10 has inserted some styles
	      // will not result in the Emotion 10 styles being destroyed
	      var dataEmotionAttribute = node.getAttribute('data-emotion');
	      if (dataEmotionAttribute.indexOf(' ') === -1) {
	        return;
	      }
	      document.head.appendChild(node);
	      node.setAttribute('data-s', '');
	    });
	  }
	  var stylisPlugins = options.stylisPlugins || defaultStylisPlugins;
	  var inserted = {};
	  var container;
	  var nodesToHydrate = [];
	  if (isBrowser) {
	    container = options.container || document.head;
	    Array.prototype.forEach.call(
	    // this means we will ignore elements which don't have a space in them which
	    // means that the style elements we're looking at are only Emotion 11 server-rendered style elements
	    document.querySelectorAll("style[data-emotion^=\"" + key + " \"]"), function (node) {
	      var attrib = node.getAttribute("data-emotion").split(' ');
	      for (var i = 1; i < attrib.length; i++) {
	        inserted[attrib[i]] = true;
	      }
	      nodesToHydrate.push(node);
	    });
	  }
	  var _insert;
	  var omnipresentPlugins = [compat, removeLabel];
	  if (!getServerStylisCache) {
	    var currentSheet;
	    var finalizingPlugins = [stringify, rulesheet(function (rule) {
	      currentSheet.insert(rule);
	    })];
	    var serializer = middleware(omnipresentPlugins.concat(stylisPlugins, finalizingPlugins));
	    var stylis = function stylis(styles) {
	      return serialize(compile(styles), serializer);
	    };
	    _insert = function insert(selector, serialized, sheet, shouldCache) {
	      currentSheet = sheet;
	      stylis(selector ? selector + "{" + serialized.styles + "}" : serialized.styles);
	      if (shouldCache) {
	        cache.inserted[serialized.name] = true;
	      }
	    };
	  } else {
	    var _finalizingPlugins = [stringify];
	    var _serializer = middleware(omnipresentPlugins.concat(stylisPlugins, _finalizingPlugins));
	    var _stylis = function _stylis(styles) {
	      return serialize(compile(styles), _serializer);
	    };
	    var serverStylisCache = getServerStylisCache(stylisPlugins)(key);
	    var getRules = function getRules(selector, serialized) {
	      var name = serialized.name;
	      if (serverStylisCache[name] === undefined) {
	        serverStylisCache[name] = _stylis(selector ? selector + "{" + serialized.styles + "}" : serialized.styles);
	      }
	      return serverStylisCache[name];
	    };
	    _insert = function _insert(selector, serialized, sheet, shouldCache) {
	      var name = serialized.name;
	      var rules = getRules(selector, serialized);
	      if (cache.compat === undefined) {
	        // in regular mode, we don't set the styles on the inserted cache
	        // since we don't need to and that would be wasting memory
	        // we return them so that they are rendered in a style tag
	        if (shouldCache) {
	          cache.inserted[name] = true;
	        }
	        return rules;
	      } else {
	        // in compat mode, we put the styles on the inserted cache so
	        // that emotion-server can pull out the styles
	        // except when we don't want to cache it which was in Global but now
	        // is nowhere but we don't want to do a major right now
	        // and just in case we're going to leave the case here
	        // it's also not affecting client side bundle size
	        // so it's really not a big deal
	        if (shouldCache) {
	          cache.inserted[name] = rules;
	        } else {
	          return rules;
	        }
	      }
	    };
	  }
	  var cache = {
	    key: key,
	    sheet: new StyleSheet({
	      key: key,
	      container: container,
	      nonce: options.nonce,
	      speedy: options.speedy,
	      prepend: options.prepend,
	      insertionPoint: options.insertionPoint
	    }),
	    nonce: options.nonce,
	    inserted: inserted,
	    registered: {},
	    insert: _insert
	  };
	  cache.sheet.hydrate(nodesToHydrate);
	  return cache;
	};

	var jsxRuntime = {exports: {}};

	var reactJsxRuntime_production_min = {};

	/**
	 * @license React
	 * react-jsx-runtime.production.min.js
	 *
	 * Copyright (c) Facebook, Inc. and its affiliates.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	var hasRequiredReactJsxRuntime_production_min;

	function requireReactJsxRuntime_production_min () {
		if (hasRequiredReactJsxRuntime_production_min) return reactJsxRuntime_production_min;
		hasRequiredReactJsxRuntime_production_min = 1;

		var f = React$1,
		  k = Symbol.for("react.element"),
		  l = Symbol.for("react.fragment"),
		  m = Object.prototype.hasOwnProperty,
		  n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
		  p = {
		    key: true,
		    ref: true,
		    __self: true,
		    __source: true
		  };
		function q(c, a, g) {
		  var b,
		    d = {},
		    e = null,
		    h = null;
		  void 0 !== g && (e = "" + g);
		  void 0 !== a.key && (e = "" + a.key);
		  void 0 !== a.ref && (h = a.ref);
		  for (b in a) m.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
		  if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
		  return {
		    $$typeof: k,
		    type: c,
		    key: e,
		    ref: h,
		    props: d,
		    _owner: n.current
		  };
		}
		reactJsxRuntime_production_min.Fragment = l;
		reactJsxRuntime_production_min.jsx = q;
		reactJsxRuntime_production_min.jsxs = q;
		return reactJsxRuntime_production_min;
	}

	{
	  jsxRuntime.exports = requireReactJsxRuntime_production_min();
	}

	var jsxRuntimeExports = jsxRuntime.exports;

	let cache;
	if (typeof document === 'object') {
	  cache = createCache({
	    key: 'css',
	    prepend: true
	  });
	}
	function StyledEngineProvider(props) {
	  const {
	    injectFirst,
	    children
	  } = props;
	  return injectFirst && cache ? /*#__PURE__*/jsxRuntimeExports.jsx(react.CacheProvider, {
	    value: cache,
	    children: children
	  }) : children;
	}

	function isEmpty$1(obj) {
	  return obj === undefined || obj === null || Object.keys(obj).length === 0;
	}
	function GlobalStyles$2(props) {
	  const {
	    styles,
	    defaultTheme = {}
	  } = props;
	  const globalStyles = typeof styles === 'function' ? themeInput => styles(isEmpty$1(themeInput) ? defaultTheme : themeInput) : styles;
	  return /*#__PURE__*/jsxRuntimeExports.jsx(react.Global, {
	    styles: globalStyles
	  });
	}

	/**
	 * @mui/styled-engine v5.16.14
	 *
	 * @license MIT
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	function styled$1(tag, options) {
	  const stylesFactory = emStyled(tag, options);
	  return stylesFactory;
	}

	// eslint-disable-next-line @typescript-eslint/naming-convention
	const internal_processStyles = (tag, processor) => {
	  // Emotion attaches all the styles as `__emotion_styles`.
	  // Ref: https://github.com/emotion-js/emotion/blob/16d971d0da229596d6bcc39d282ba9753c9ee7cf/packages/styled/src/base.js#L186
	  if (Array.isArray(tag.__emotion_styles)) {
	    tag.__emotion_styles = processor(tag.__emotion_styles);
	  }
	};

	var styledEngine = /*#__PURE__*/Object.freeze({
		__proto__: null,
		GlobalStyles: GlobalStyles$2,
		StyledEngineProvider: StyledEngineProvider,
		ThemeContext: react.ThemeContext,
		css: react.css,
		default: styled$1,
		internal_processStyles: internal_processStyles,
		keyframes: react.keyframes
	});

	// https://github.com/sindresorhus/is-plain-obj/blob/main/index.js
	function isPlainObject(item) {
	  if (typeof item !== 'object' || item === null) {
	    return false;
	  }
	  const prototype = Object.getPrototypeOf(item);
	  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in item) && !(Symbol.iterator in item);
	}
	function deepClone(source) {
	  if (/*#__PURE__*/ /*#__PURE__*/React__namespace.isValidElement(source) || !isPlainObject(source)) {
	    return source;
	  }
	  const output = {};
	  Object.keys(source).forEach(key => {
	    output[key] = deepClone(source[key]);
	  });
	  return output;
	}
	function deepmerge$1(target, source, options = {
	  clone: true
	}) {
	  const output = options.clone ? _extends$1({}, target) : target;
	  if (isPlainObject(target) && isPlainObject(source)) {
	    Object.keys(source).forEach(key => {
	      if (/*#__PURE__*/React__namespace.isValidElement(source[key])) {
	        output[key] = source[key];
	      } else if (isPlainObject(source[key]) &&
	      // Avoid prototype pollution
	      Object.prototype.hasOwnProperty.call(target, key) && isPlainObject(target[key])) {
	        // Since `output` is a clone of `target` and we have narrowed `target` in this block we can cast to the same type.
	        output[key] = deepmerge$1(target[key], source[key], options);
	      } else if (options.clone) {
	        output[key] = isPlainObject(source[key]) ? deepClone(source[key]) : source[key];
	      } else {
	        output[key] = source[key];
	      }
	    });
	  }
	  return output;
	}

	var deepmerge = /*#__PURE__*/Object.freeze({
		__proto__: null,
		default: deepmerge$1,
		isPlainObject: isPlainObject
	});

	const _excluded$a = ["values", "unit", "step"];
	const sortBreakpointsValues = values => {
	  const breakpointsAsArray = Object.keys(values).map(key => ({
	    key,
	    val: values[key]
	  })) || [];
	  // Sort in ascending order
	  breakpointsAsArray.sort((breakpoint1, breakpoint2) => breakpoint1.val - breakpoint2.val);
	  return breakpointsAsArray.reduce((acc, obj) => {
	    return _extends$1({}, acc, {
	      [obj.key]: obj.val
	    });
	  }, {});
	};

	// Keep in mind that @media is inclusive by the CSS specification.
	function createBreakpoints(breakpoints) {
	  const {
	      // The breakpoint **start** at this value.
	      // For instance with the first breakpoint xs: [xs, sm).
	      values = {
	        xs: 0,
	        // phone
	        sm: 600,
	        // tablet
	        md: 900,
	        // small laptop
	        lg: 1200,
	        // desktop
	        xl: 1536 // large screen
	      },
	      unit = 'px',
	      step = 5
	    } = breakpoints,
	    other = _objectWithoutPropertiesLoose(breakpoints, _excluded$a);
	  const sortedValues = sortBreakpointsValues(values);
	  const keys = Object.keys(sortedValues);
	  function up(key) {
	    const value = typeof values[key] === 'number' ? values[key] : key;
	    return `@media (min-width:${value}${unit})`;
	  }
	  function down(key) {
	    const value = typeof values[key] === 'number' ? values[key] : key;
	    return `@media (max-width:${value - step / 100}${unit})`;
	  }
	  function between(start, end) {
	    const endIndex = keys.indexOf(end);
	    return `@media (min-width:${typeof values[start] === 'number' ? values[start] : start}${unit}) and ` + `(max-width:${(endIndex !== -1 && typeof values[keys[endIndex]] === 'number' ? values[keys[endIndex]] : end) - step / 100}${unit})`;
	  }
	  function only(key) {
	    if (keys.indexOf(key) + 1 < keys.length) {
	      return between(key, keys[keys.indexOf(key) + 1]);
	    }
	    return up(key);
	  }
	  function not(key) {
	    // handle first and last key separately, for better readability
	    const keyIndex = keys.indexOf(key);
	    if (keyIndex === 0) {
	      return up(keys[1]);
	    }
	    if (keyIndex === keys.length - 1) {
	      return down(keys[keyIndex]);
	    }
	    return between(key, keys[keys.indexOf(key) + 1]).replace('@media', '@media not all and');
	  }
	  return _extends$1({
	    keys,
	    values: sortedValues,
	    up,
	    down,
	    between,
	    only,
	    not,
	    unit
	  }, other);
	}

	const shape = {
	  borderRadius: 4
	};

	function merge(acc, item) {
	  if (!item) {
	    return acc;
	  }
	  return deepmerge$1(acc, item, {
	    clone: false // No need to clone deep, it's way faster.
	  });
	}

	// The breakpoint **start** at this value.
	// For instance with the first breakpoint xs: [xs, sm[.
	const values = {
	  xs: 0,
	  // phone
	  sm: 600,
	  // tablet
	  md: 900,
	  // small laptop
	  lg: 1200,
	  // desktop
	  xl: 1536 // large screen
	};
	const defaultBreakpoints = {
	  // Sorted ASC by size. That's important.
	  // It can't be configured as it's used statically for propTypes.
	  keys: ['xs', 'sm', 'md', 'lg', 'xl'],
	  up: key => `@media (min-width:${values[key]}px)`
	};
	function handleBreakpoints(props, propValue, styleFromPropValue) {
	  const theme = props.theme || {};
	  if (Array.isArray(propValue)) {
	    const themeBreakpoints = theme.breakpoints || defaultBreakpoints;
	    return propValue.reduce((acc, item, index) => {
	      acc[themeBreakpoints.up(themeBreakpoints.keys[index])] = styleFromPropValue(propValue[index]);
	      return acc;
	    }, {});
	  }
	  if (typeof propValue === 'object') {
	    const themeBreakpoints = theme.breakpoints || defaultBreakpoints;
	    return Object.keys(propValue).reduce((acc, breakpoint) => {
	      // key is breakpoint
	      if (Object.keys(themeBreakpoints.values || values).indexOf(breakpoint) !== -1) {
	        const mediaKey = themeBreakpoints.up(breakpoint);
	        acc[mediaKey] = styleFromPropValue(propValue[breakpoint], breakpoint);
	      } else {
	        const cssKey = breakpoint;
	        acc[cssKey] = propValue[cssKey];
	      }
	      return acc;
	    }, {});
	  }
	  const output = styleFromPropValue(propValue);
	  return output;
	}
	function createEmptyBreakpointObject(breakpointsInput = {}) {
	  var _breakpointsInput$key;
	  const breakpointsInOrder = (_breakpointsInput$key = breakpointsInput.keys) == null ? void 0 : _breakpointsInput$key.reduce((acc, key) => {
	    const breakpointStyleKey = breakpointsInput.up(key);
	    acc[breakpointStyleKey] = {};
	    return acc;
	  }, {});
	  return breakpointsInOrder || {};
	}
	function removeUnusedBreakpoints(breakpointKeys, style) {
	  return breakpointKeys.reduce((acc, key) => {
	    const breakpointOutput = acc[key];
	    const isBreakpointUnused = !breakpointOutput || Object.keys(breakpointOutput).length === 0;
	    if (isBreakpointUnused) {
	      delete acc[key];
	    }
	    return acc;
	  }, style);
	}

	// It should to be noted that this function isn't equivalent to `text-transform: capitalize`.
	//
	// A strict capitalization should uppercase the first letter of each word in the sentence.
	// We only handle the first word.
	function capitalize$1(string) {
	  if (typeof string !== 'string') {
	    throw new Error(formatMuiErrorMessage$1(7));
	  }
	  return string.charAt(0).toUpperCase() + string.slice(1);
	}

	var capitalize = /*#__PURE__*/Object.freeze({
		__proto__: null,
		default: capitalize$1
	});

	function getPath(obj, path, checkVars = true) {
	  if (!path || typeof path !== 'string') {
	    return null;
	  }

	  // Check if CSS variables are used
	  if (obj && obj.vars && checkVars) {
	    const val = `vars.${path}`.split('.').reduce((acc, item) => acc && acc[item] ? acc[item] : null, obj);
	    if (val != null) {
	      return val;
	    }
	  }
	  return path.split('.').reduce((acc, item) => {
	    if (acc && acc[item] != null) {
	      return acc[item];
	    }
	    return null;
	  }, obj);
	}
	function getStyleValue(themeMapping, transform, propValueFinal, userValue = propValueFinal) {
	  let value;
	  if (typeof themeMapping === 'function') {
	    value = themeMapping(propValueFinal);
	  } else if (Array.isArray(themeMapping)) {
	    value = themeMapping[propValueFinal] || userValue;
	  } else {
	    value = getPath(themeMapping, propValueFinal) || userValue;
	  }
	  if (transform) {
	    value = transform(value, userValue, themeMapping);
	  }
	  return value;
	}
	function style$1(options) {
	  const {
	    prop,
	    cssProperty = options.prop,
	    themeKey,
	    transform
	  } = options;

	  // false positive
	  // eslint-disable-next-line react/function-component-definition
	  const fn = props => {
	    if (props[prop] == null) {
	      return null;
	    }
	    const propValue = props[prop];
	    const theme = props.theme;
	    const themeMapping = getPath(theme, themeKey) || {};
	    const styleFromPropValue = propValueFinal => {
	      let value = getStyleValue(themeMapping, transform, propValueFinal);
	      if (propValueFinal === value && typeof propValueFinal === 'string') {
	        // Haven't found value
	        value = getStyleValue(themeMapping, transform, `${prop}${propValueFinal === 'default' ? '' : capitalize$1(propValueFinal)}`, propValueFinal);
	      }
	      if (cssProperty === false) {
	        return value;
	      }
	      return {
	        [cssProperty]: value
	      };
	    };
	    return handleBreakpoints(props, propValue, styleFromPropValue);
	  };
	  fn.propTypes = {};
	  fn.filterProps = [prop];
	  return fn;
	}

	function memoize(fn) {
	  const cache = {};
	  return arg => {
	    if (cache[arg] === undefined) {
	      cache[arg] = fn(arg);
	    }
	    return cache[arg];
	  };
	}

	const properties = {
	  m: 'margin',
	  p: 'padding'
	};
	const directions = {
	  t: 'Top',
	  r: 'Right',
	  b: 'Bottom',
	  l: 'Left',
	  x: ['Left', 'Right'],
	  y: ['Top', 'Bottom']
	};
	const aliases = {
	  marginX: 'mx',
	  marginY: 'my',
	  paddingX: 'px',
	  paddingY: 'py'
	};

	// memoize() impact:
	// From 300,000 ops/sec
	// To 350,000 ops/sec
	const getCssProperties = memoize(prop => {
	  // It's not a shorthand notation.
	  if (prop.length > 2) {
	    if (aliases[prop]) {
	      prop = aliases[prop];
	    } else {
	      return [prop];
	    }
	  }
	  const [a, b] = prop.split('');
	  const property = properties[a];
	  const direction = directions[b] || '';
	  return Array.isArray(direction) ? direction.map(dir => property + dir) : [property + direction];
	});
	const marginKeys = ['m', 'mt', 'mr', 'mb', 'ml', 'mx', 'my', 'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'marginX', 'marginY', 'marginInline', 'marginInlineStart', 'marginInlineEnd', 'marginBlock', 'marginBlockStart', 'marginBlockEnd'];
	const paddingKeys = ['p', 'pt', 'pr', 'pb', 'pl', 'px', 'py', 'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'paddingX', 'paddingY', 'paddingInline', 'paddingInlineStart', 'paddingInlineEnd', 'paddingBlock', 'paddingBlockStart', 'paddingBlockEnd'];
	[...marginKeys, ...paddingKeys];
	function createUnaryUnit(theme, themeKey, defaultValue, propName) {
	  var _getPath;
	  const themeSpacing = (_getPath = getPath(theme, themeKey, false)) != null ? _getPath : defaultValue;
	  if (typeof themeSpacing === 'number') {
	    return abs => {
	      if (typeof abs === 'string') {
	        return abs;
	      }
	      return themeSpacing * abs;
	    };
	  }
	  if (Array.isArray(themeSpacing)) {
	    return abs => {
	      if (typeof abs === 'string') {
	        return abs;
	      }
	      return themeSpacing[abs];
	    };
	  }
	  if (typeof themeSpacing === 'function') {
	    return themeSpacing;
	  }
	  return () => undefined;
	}
	function createUnarySpacing(theme) {
	  return createUnaryUnit(theme, 'spacing', 8);
	}
	function getValue(transformer, propValue) {
	  if (typeof propValue === 'string' || propValue == null) {
	    return propValue;
	  }
	  const abs = Math.abs(propValue);
	  const transformed = transformer(abs);
	  if (propValue >= 0) {
	    return transformed;
	  }
	  if (typeof transformed === 'number') {
	    return -transformed;
	  }
	  return `-${transformed}`;
	}
	function getStyleFromPropValue(cssProperties, transformer) {
	  return propValue => cssProperties.reduce((acc, cssProperty) => {
	    acc[cssProperty] = getValue(transformer, propValue);
	    return acc;
	  }, {});
	}
	function resolveCssProperty(props, keys, prop, transformer) {
	  // Using a hash computation over an array iteration could be faster, but with only 28 items,
	  // it's doesn't worth the bundle size.
	  if (keys.indexOf(prop) === -1) {
	    return null;
	  }
	  const cssProperties = getCssProperties(prop);
	  const styleFromPropValue = getStyleFromPropValue(cssProperties, transformer);
	  const propValue = props[prop];
	  return handleBreakpoints(props, propValue, styleFromPropValue);
	}
	function style(props, keys) {
	  const transformer = createUnarySpacing(props.theme);
	  return Object.keys(props).map(prop => resolveCssProperty(props, keys, prop, transformer)).reduce(merge, {});
	}
	function margin(props) {
	  return style(props, marginKeys);
	}
	margin.propTypes = {};
	margin.filterProps = marginKeys;
	function padding(props) {
	  return style(props, paddingKeys);
	}
	padding.propTypes = {};
	padding.filterProps = paddingKeys;

	// The different signatures imply different meaning for their arguments that can't be expressed structurally.
	// We express the difference with variable names.

	function createSpacing(spacingInput = 8) {
	  // Already transformed.
	  if (spacingInput.mui) {
	    return spacingInput;
	  }

	  // Material Design layouts are visually balanced. Most measurements align to an 8dp grid, which aligns both spacing and the overall layout.
	  // Smaller components, such as icons, can align to a 4dp grid.
	  // https://m2.material.io/design/layout/understanding-layout.html
	  const transform = createUnarySpacing({
	    spacing: spacingInput
	  });
	  const spacing = (...argsInput) => {
	    const args = argsInput.length === 0 ? [1] : argsInput;
	    return args.map(argument => {
	      const output = transform(argument);
	      return typeof output === 'number' ? `${output}px` : output;
	    }).join(' ');
	  };
	  spacing.mui = true;
	  return spacing;
	}

	function compose(...styles) {
	  const handlers = styles.reduce((acc, style) => {
	    style.filterProps.forEach(prop => {
	      acc[prop] = style;
	    });
	    return acc;
	  }, {});

	  // false positive
	  // eslint-disable-next-line react/function-component-definition
	  const fn = props => {
	    return Object.keys(props).reduce((acc, prop) => {
	      if (handlers[prop]) {
	        return merge(acc, handlers[prop](props));
	      }
	      return acc;
	    }, {});
	  };
	  fn.propTypes = {};
	  fn.filterProps = styles.reduce((acc, style) => acc.concat(style.filterProps), []);
	  return fn;
	}

	function borderTransform(value) {
	  if (typeof value !== 'number') {
	    return value;
	  }
	  return `${value}px solid`;
	}
	function createBorderStyle(prop, transform) {
	  return style$1({
	    prop,
	    themeKey: 'borders',
	    transform
	  });
	}
	const border = createBorderStyle('border', borderTransform);
	const borderTop = createBorderStyle('borderTop', borderTransform);
	const borderRight = createBorderStyle('borderRight', borderTransform);
	const borderBottom = createBorderStyle('borderBottom', borderTransform);
	const borderLeft = createBorderStyle('borderLeft', borderTransform);
	const borderColor = createBorderStyle('borderColor');
	const borderTopColor = createBorderStyle('borderTopColor');
	const borderRightColor = createBorderStyle('borderRightColor');
	const borderBottomColor = createBorderStyle('borderBottomColor');
	const borderLeftColor = createBorderStyle('borderLeftColor');
	const outline = createBorderStyle('outline', borderTransform);
	const outlineColor = createBorderStyle('outlineColor');

	// false positive
	// eslint-disable-next-line react/function-component-definition
	const borderRadius = props => {
	  if (props.borderRadius !== undefined && props.borderRadius !== null) {
	    const transformer = createUnaryUnit(props.theme, 'shape.borderRadius', 4);
	    const styleFromPropValue = propValue => ({
	      borderRadius: getValue(transformer, propValue)
	    });
	    return handleBreakpoints(props, props.borderRadius, styleFromPropValue);
	  }
	  return null;
	};
	borderRadius.propTypes = {};
	borderRadius.filterProps = ['borderRadius'];
	compose(border, borderTop, borderRight, borderBottom, borderLeft, borderColor, borderTopColor, borderRightColor, borderBottomColor, borderLeftColor, borderRadius, outline, outlineColor);

	// false positive
	// eslint-disable-next-line react/function-component-definition
	const gap = props => {
	  if (props.gap !== undefined && props.gap !== null) {
	    const transformer = createUnaryUnit(props.theme, 'spacing', 8);
	    const styleFromPropValue = propValue => ({
	      gap: getValue(transformer, propValue)
	    });
	    return handleBreakpoints(props, props.gap, styleFromPropValue);
	  }
	  return null;
	};
	gap.propTypes = {};
	gap.filterProps = ['gap'];

	// false positive
	// eslint-disable-next-line react/function-component-definition
	const columnGap = props => {
	  if (props.columnGap !== undefined && props.columnGap !== null) {
	    const transformer = createUnaryUnit(props.theme, 'spacing', 8);
	    const styleFromPropValue = propValue => ({
	      columnGap: getValue(transformer, propValue)
	    });
	    return handleBreakpoints(props, props.columnGap, styleFromPropValue);
	  }
	  return null;
	};
	columnGap.propTypes = {};
	columnGap.filterProps = ['columnGap'];

	// false positive
	// eslint-disable-next-line react/function-component-definition
	const rowGap = props => {
	  if (props.rowGap !== undefined && props.rowGap !== null) {
	    const transformer = createUnaryUnit(props.theme, 'spacing', 8);
	    const styleFromPropValue = propValue => ({
	      rowGap: getValue(transformer, propValue)
	    });
	    return handleBreakpoints(props, props.rowGap, styleFromPropValue);
	  }
	  return null;
	};
	rowGap.propTypes = {};
	rowGap.filterProps = ['rowGap'];
	const gridColumn = style$1({
	  prop: 'gridColumn'
	});
	const gridRow = style$1({
	  prop: 'gridRow'
	});
	const gridAutoFlow = style$1({
	  prop: 'gridAutoFlow'
	});
	const gridAutoColumns = style$1({
	  prop: 'gridAutoColumns'
	});
	const gridAutoRows = style$1({
	  prop: 'gridAutoRows'
	});
	const gridTemplateColumns = style$1({
	  prop: 'gridTemplateColumns'
	});
	const gridTemplateRows = style$1({
	  prop: 'gridTemplateRows'
	});
	const gridTemplateAreas = style$1({
	  prop: 'gridTemplateAreas'
	});
	const gridArea = style$1({
	  prop: 'gridArea'
	});
	compose(gap, columnGap, rowGap, gridColumn, gridRow, gridAutoFlow, gridAutoColumns, gridAutoRows, gridTemplateColumns, gridTemplateRows, gridTemplateAreas, gridArea);

	function paletteTransform(value, userValue) {
	  if (userValue === 'grey') {
	    return userValue;
	  }
	  return value;
	}
	const color = style$1({
	  prop: 'color',
	  themeKey: 'palette',
	  transform: paletteTransform
	});
	const bgcolor = style$1({
	  prop: 'bgcolor',
	  cssProperty: 'backgroundColor',
	  themeKey: 'palette',
	  transform: paletteTransform
	});
	const backgroundColor = style$1({
	  prop: 'backgroundColor',
	  themeKey: 'palette',
	  transform: paletteTransform
	});
	compose(color, bgcolor, backgroundColor);

	function sizingTransform(value) {
	  return value <= 1 && value !== 0 ? `${value * 100}%` : value;
	}
	const width = style$1({
	  prop: 'width',
	  transform: sizingTransform
	});
	const maxWidth = props => {
	  if (props.maxWidth !== undefined && props.maxWidth !== null) {
	    const styleFromPropValue = propValue => {
	      var _props$theme, _props$theme2;
	      const breakpoint = ((_props$theme = props.theme) == null || (_props$theme = _props$theme.breakpoints) == null || (_props$theme = _props$theme.values) == null ? void 0 : _props$theme[propValue]) || values[propValue];
	      if (!breakpoint) {
	        return {
	          maxWidth: sizingTransform(propValue)
	        };
	      }
	      if (((_props$theme2 = props.theme) == null || (_props$theme2 = _props$theme2.breakpoints) == null ? void 0 : _props$theme2.unit) !== 'px') {
	        return {
	          maxWidth: `${breakpoint}${props.theme.breakpoints.unit}`
	        };
	      }
	      return {
	        maxWidth: breakpoint
	      };
	    };
	    return handleBreakpoints(props, props.maxWidth, styleFromPropValue);
	  }
	  return null;
	};
	maxWidth.filterProps = ['maxWidth'];
	const minWidth = style$1({
	  prop: 'minWidth',
	  transform: sizingTransform
	});
	const height = style$1({
	  prop: 'height',
	  transform: sizingTransform
	});
	const maxHeight = style$1({
	  prop: 'maxHeight',
	  transform: sizingTransform
	});
	const minHeight = style$1({
	  prop: 'minHeight',
	  transform: sizingTransform
	});
	style$1({
	  prop: 'size',
	  cssProperty: 'width',
	  transform: sizingTransform
	});
	style$1({
	  prop: 'size',
	  cssProperty: 'height',
	  transform: sizingTransform
	});
	const boxSizing = style$1({
	  prop: 'boxSizing'
	});
	compose(width, maxWidth, minWidth, height, maxHeight, minHeight, boxSizing);

	const defaultSxConfig = {
	  // borders
	  border: {
	    themeKey: 'borders',
	    transform: borderTransform
	  },
	  borderTop: {
	    themeKey: 'borders',
	    transform: borderTransform
	  },
	  borderRight: {
	    themeKey: 'borders',
	    transform: borderTransform
	  },
	  borderBottom: {
	    themeKey: 'borders',
	    transform: borderTransform
	  },
	  borderLeft: {
	    themeKey: 'borders',
	    transform: borderTransform
	  },
	  borderColor: {
	    themeKey: 'palette'
	  },
	  borderTopColor: {
	    themeKey: 'palette'
	  },
	  borderRightColor: {
	    themeKey: 'palette'
	  },
	  borderBottomColor: {
	    themeKey: 'palette'
	  },
	  borderLeftColor: {
	    themeKey: 'palette'
	  },
	  outline: {
	    themeKey: 'borders',
	    transform: borderTransform
	  },
	  outlineColor: {
	    themeKey: 'palette'
	  },
	  borderRadius: {
	    themeKey: 'shape.borderRadius',
	    style: borderRadius
	  },
	  // palette
	  color: {
	    themeKey: 'palette',
	    transform: paletteTransform
	  },
	  bgcolor: {
	    themeKey: 'palette',
	    cssProperty: 'backgroundColor',
	    transform: paletteTransform
	  },
	  backgroundColor: {
	    themeKey: 'palette',
	    transform: paletteTransform
	  },
	  // spacing
	  p: {
	    style: padding
	  },
	  pt: {
	    style: padding
	  },
	  pr: {
	    style: padding
	  },
	  pb: {
	    style: padding
	  },
	  pl: {
	    style: padding
	  },
	  px: {
	    style: padding
	  },
	  py: {
	    style: padding
	  },
	  padding: {
	    style: padding
	  },
	  paddingTop: {
	    style: padding
	  },
	  paddingRight: {
	    style: padding
	  },
	  paddingBottom: {
	    style: padding
	  },
	  paddingLeft: {
	    style: padding
	  },
	  paddingX: {
	    style: padding
	  },
	  paddingY: {
	    style: padding
	  },
	  paddingInline: {
	    style: padding
	  },
	  paddingInlineStart: {
	    style: padding
	  },
	  paddingInlineEnd: {
	    style: padding
	  },
	  paddingBlock: {
	    style: padding
	  },
	  paddingBlockStart: {
	    style: padding
	  },
	  paddingBlockEnd: {
	    style: padding
	  },
	  m: {
	    style: margin
	  },
	  mt: {
	    style: margin
	  },
	  mr: {
	    style: margin
	  },
	  mb: {
	    style: margin
	  },
	  ml: {
	    style: margin
	  },
	  mx: {
	    style: margin
	  },
	  my: {
	    style: margin
	  },
	  margin: {
	    style: margin
	  },
	  marginTop: {
	    style: margin
	  },
	  marginRight: {
	    style: margin
	  },
	  marginBottom: {
	    style: margin
	  },
	  marginLeft: {
	    style: margin
	  },
	  marginX: {
	    style: margin
	  },
	  marginY: {
	    style: margin
	  },
	  marginInline: {
	    style: margin
	  },
	  marginInlineStart: {
	    style: margin
	  },
	  marginInlineEnd: {
	    style: margin
	  },
	  marginBlock: {
	    style: margin
	  },
	  marginBlockStart: {
	    style: margin
	  },
	  marginBlockEnd: {
	    style: margin
	  },
	  // display
	  displayPrint: {
	    cssProperty: false,
	    transform: value => ({
	      '@media print': {
	        display: value
	      }
	    })
	  },
	  display: {},
	  overflow: {},
	  textOverflow: {},
	  visibility: {},
	  whiteSpace: {},
	  // flexbox
	  flexBasis: {},
	  flexDirection: {},
	  flexWrap: {},
	  justifyContent: {},
	  alignItems: {},
	  alignContent: {},
	  order: {},
	  flex: {},
	  flexGrow: {},
	  flexShrink: {},
	  alignSelf: {},
	  justifyItems: {},
	  justifySelf: {},
	  // grid
	  gap: {
	    style: gap
	  },
	  rowGap: {
	    style: rowGap
	  },
	  columnGap: {
	    style: columnGap
	  },
	  gridColumn: {},
	  gridRow: {},
	  gridAutoFlow: {},
	  gridAutoColumns: {},
	  gridAutoRows: {},
	  gridTemplateColumns: {},
	  gridTemplateRows: {},
	  gridTemplateAreas: {},
	  gridArea: {},
	  // positions
	  position: {},
	  zIndex: {
	    themeKey: 'zIndex'
	  },
	  top: {},
	  right: {},
	  bottom: {},
	  left: {},
	  // shadows
	  boxShadow: {
	    themeKey: 'shadows'
	  },
	  // sizing
	  width: {
	    transform: sizingTransform
	  },
	  maxWidth: {
	    style: maxWidth
	  },
	  minWidth: {
	    transform: sizingTransform
	  },
	  height: {
	    transform: sizingTransform
	  },
	  maxHeight: {
	    transform: sizingTransform
	  },
	  minHeight: {
	    transform: sizingTransform
	  },
	  boxSizing: {},
	  // typography
	  fontFamily: {
	    themeKey: 'typography'
	  },
	  fontSize: {
	    themeKey: 'typography'
	  },
	  fontStyle: {
	    themeKey: 'typography'
	  },
	  fontWeight: {
	    themeKey: 'typography'
	  },
	  letterSpacing: {},
	  textTransform: {},
	  lineHeight: {},
	  textAlign: {},
	  typography: {
	    cssProperty: false,
	    themeKey: 'typography'
	  }
	};

	function objectsHaveSameKeys(...objects) {
	  const allKeys = objects.reduce((keys, object) => keys.concat(Object.keys(object)), []);
	  const union = new Set(allKeys);
	  return objects.every(object => union.size === Object.keys(object).length);
	}
	function callIfFn(maybeFn, arg) {
	  return typeof maybeFn === 'function' ? maybeFn(arg) : maybeFn;
	}

	// eslint-disable-next-line @typescript-eslint/naming-convention
	function unstable_createStyleFunctionSx() {
	  function getThemeValue(prop, val, theme, config) {
	    const props = {
	      [prop]: val,
	      theme
	    };
	    const options = config[prop];
	    if (!options) {
	      return {
	        [prop]: val
	      };
	    }
	    const {
	      cssProperty = prop,
	      themeKey,
	      transform,
	      style
	    } = options;
	    if (val == null) {
	      return null;
	    }

	    // TODO v6: remove, see https://github.com/mui/material-ui/pull/38123
	    if (themeKey === 'typography' && val === 'inherit') {
	      return {
	        [prop]: val
	      };
	    }
	    const themeMapping = getPath(theme, themeKey) || {};
	    if (style) {
	      return style(props);
	    }
	    const styleFromPropValue = propValueFinal => {
	      let value = getStyleValue(themeMapping, transform, propValueFinal);
	      if (propValueFinal === value && typeof propValueFinal === 'string') {
	        // Haven't found value
	        value = getStyleValue(themeMapping, transform, `${prop}${propValueFinal === 'default' ? '' : capitalize$1(propValueFinal)}`, propValueFinal);
	      }
	      if (cssProperty === false) {
	        return value;
	      }
	      return {
	        [cssProperty]: value
	      };
	    };
	    return handleBreakpoints(props, val, styleFromPropValue);
	  }
	  function styleFunctionSx(props) {
	    var _theme$unstable_sxCon;
	    const {
	      sx,
	      theme = {}
	    } = props || {};
	    if (!sx) {
	      return null; // Emotion & styled-components will neglect null
	    }
	    const config = (_theme$unstable_sxCon = theme.unstable_sxConfig) != null ? _theme$unstable_sxCon : defaultSxConfig;

	    /*
	     * Receive `sxInput` as object or callback
	     * and then recursively check keys & values to create media query object styles.
	     * (the result will be used in `styled`)
	     */
	    function traverse(sxInput) {
	      let sxObject = sxInput;
	      if (typeof sxInput === 'function') {
	        sxObject = sxInput(theme);
	      } else if (typeof sxInput !== 'object') {
	        // value
	        return sxInput;
	      }
	      if (!sxObject) {
	        return null;
	      }
	      const emptyBreakpoints = createEmptyBreakpointObject(theme.breakpoints);
	      const breakpointsKeys = Object.keys(emptyBreakpoints);
	      let css = emptyBreakpoints;
	      Object.keys(sxObject).forEach(styleKey => {
	        const value = callIfFn(sxObject[styleKey], theme);
	        if (value !== null && value !== undefined) {
	          if (typeof value === 'object') {
	            if (config[styleKey]) {
	              css = merge(css, getThemeValue(styleKey, value, theme, config));
	            } else {
	              const breakpointsValues = handleBreakpoints({
	                theme
	              }, value, x => ({
	                [styleKey]: x
	              }));
	              if (objectsHaveSameKeys(breakpointsValues, value)) {
	                css[styleKey] = styleFunctionSx({
	                  sx: value,
	                  theme
	                });
	              } else {
	                css = merge(css, breakpointsValues);
	              }
	            }
	          } else {
	            css = merge(css, getThemeValue(styleKey, value, theme, config));
	          }
	        }
	      });
	      return removeUnusedBreakpoints(breakpointsKeys, css);
	    }
	    return Array.isArray(sx) ? sx.map(traverse) : traverse(sx);
	  }
	  return styleFunctionSx;
	}
	const styleFunctionSx$1 = unstable_createStyleFunctionSx();
	styleFunctionSx$1.filterProps = ['sx'];

	/**
	 * A universal utility to style components with multiple color modes. Always use it from the theme object.
	 * It works with:
	 *  - [Basic theme](https://mui.com/material-ui/customization/dark-mode/)
	 *  - [CSS theme variables](https://mui.com/material-ui/experimental-api/css-theme-variables/overview/)
	 *  - Zero-runtime engine
	 *
	 * Tips: Use an array over object spread and place `theme.applyStyles()` last.
	 *
	 * ✅ [{ background: '#e5e5e5' }, theme.applyStyles('dark', { background: '#1c1c1c' })]
	 *
	 * 🚫 { background: '#e5e5e5', ...theme.applyStyles('dark', { background: '#1c1c1c' })}
	 *
	 * @example
	 * 1. using with `styled`:
	 * ```jsx
	 *   const Component = styled('div')(({ theme }) => [
	 *     { background: '#e5e5e5' },
	 *     theme.applyStyles('dark', {
	 *       background: '#1c1c1c',
	 *       color: '#fff',
	 *     }),
	 *   ]);
	 * ```
	 *
	 * @example
	 * 2. using with `sx` prop:
	 * ```jsx
	 *   <Box sx={theme => [
	 *     { background: '#e5e5e5' },
	 *     theme.applyStyles('dark', {
	 *        background: '#1c1c1c',
	 *        color: '#fff',
	 *      }),
	 *     ]}
	 *   />
	 * ```
	 *
	 * @example
	 * 3. theming a component:
	 * ```jsx
	 *   extendTheme({
	 *     components: {
	 *       MuiButton: {
	 *         styleOverrides: {
	 *           root: ({ theme }) => [
	 *             { background: '#e5e5e5' },
	 *             theme.applyStyles('dark', {
	 *               background: '#1c1c1c',
	 *               color: '#fff',
	 *             }),
	 *           ],
	 *         },
	 *       }
	 *     }
	 *   })
	 *```
	 */
	function applyStyles(key, styles) {
	  // @ts-expect-error this is 'any' type
	  const theme = this;
	  if (theme.vars && typeof theme.getColorSchemeSelector === 'function') {
	    // If CssVarsProvider is used as a provider,
	    // returns '* :where([data-mui-color-scheme="light|dark"]) &'
	    const selector = theme.getColorSchemeSelector(key).replace(/(\[[^\]]+\])/, '*:where($1)');
	    return {
	      [selector]: styles
	    };
	  }
	  if (theme.palette.mode === key) {
	    return styles;
	  }
	  return {};
	}

	const _excluded$9 = ["breakpoints", "palette", "spacing", "shape"];
	function createTheme$2(options = {}, ...args) {
	  const {
	      breakpoints: breakpointsInput = {},
	      palette: paletteInput = {},
	      spacing: spacingInput,
	      shape: shapeInput = {}
	    } = options,
	    other = _objectWithoutPropertiesLoose(options, _excluded$9);
	  const breakpoints = createBreakpoints(breakpointsInput);
	  const spacing = createSpacing(spacingInput);
	  let muiTheme = deepmerge$1({
	    breakpoints,
	    direction: 'ltr',
	    components: {},
	    // Inject component definitions.
	    palette: _extends$1({
	      mode: 'light'
	    }, paletteInput),
	    spacing,
	    shape: _extends$1({}, shape, shapeInput)
	  }, other);
	  muiTheme.applyStyles = applyStyles;
	  muiTheme = args.reduce((acc, argument) => deepmerge$1(acc, argument), muiTheme);
	  muiTheme.unstable_sxConfig = _extends$1({}, defaultSxConfig, other == null ? void 0 : other.unstable_sxConfig);
	  muiTheme.unstable_sx = function sx(props) {
	    return styleFunctionSx$1({
	      sx: props,
	      theme: this
	    });
	  };
	  return muiTheme;
	}

	var createTheme$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		default: createTheme$2,
		private_createBreakpoints: createBreakpoints,
		unstable_applyStyles: applyStyles
	});

	function isObjectEmpty(obj) {
	  return Object.keys(obj).length === 0;
	}
	function useTheme$2(defaultTheme = null) {
	  const contextTheme = React__namespace.useContext(react.ThemeContext);
	  return !contextTheme || isObjectEmpty(contextTheme) ? defaultTheme : contextTheme;
	}

	const systemDefaultTheme$1 = createTheme$2();
	function useTheme$1(defaultTheme = systemDefaultTheme$1) {
	  return useTheme$2(defaultTheme);
	}

	function GlobalStyles$1({
	  styles,
	  themeId,
	  defaultTheme = {}
	}) {
	  const upperTheme = useTheme$1(defaultTheme);
	  const globalStyles = typeof styles === 'function' ? styles(themeId ? upperTheme[themeId] || upperTheme : upperTheme) : styles;
	  return /*#__PURE__*/jsxRuntimeExports.jsx(GlobalStyles$2, {
	    styles: globalStyles
	  });
	}

	const _excluded$8 = ["sx"];
	const splitProps = props => {
	  var _props$theme$unstable, _props$theme;
	  const result = {
	    systemProps: {},
	    otherProps: {}
	  };
	  const config = (_props$theme$unstable = props == null || (_props$theme = props.theme) == null ? void 0 : _props$theme.unstable_sxConfig) != null ? _props$theme$unstable : defaultSxConfig;
	  Object.keys(props).forEach(prop => {
	    if (config[prop]) {
	      result.systemProps[prop] = props[prop];
	    } else {
	      result.otherProps[prop] = props[prop];
	    }
	  });
	  return result;
	};
	function extendSxProp(props) {
	  const {
	      sx: inSx
	    } = props,
	    other = _objectWithoutPropertiesLoose(props, _excluded$8);
	  const {
	    systemProps,
	    otherProps
	  } = splitProps(other);
	  let finalSx;
	  if (Array.isArray(inSx)) {
	    finalSx = [systemProps, ...inSx];
	  } else if (typeof inSx === 'function') {
	    finalSx = (...args) => {
	      const result = inSx(...args);
	      if (!isPlainObject(result)) {
	        return systemProps;
	      }
	      return _extends$1({}, systemProps, result);
	    };
	  } else {
	    finalSx = _extends$1({}, systemProps, inSx);
	  }
	  return _extends$1({}, otherProps, {
	    sx: finalSx
	  });
	}

	var styleFunctionSx = /*#__PURE__*/Object.freeze({
		__proto__: null,
		default: styleFunctionSx$1,
		extendSxProp: extendSxProp,
		unstable_createStyleFunctionSx: unstable_createStyleFunctionSx,
		unstable_defaultSxConfig: defaultSxConfig
	});

	const defaultGenerator = componentName => componentName;
	const createClassNameGenerator = () => {
	  let generate = defaultGenerator;
	  return {
	    configure(generator) {
	      generate = generator;
	    },
	    generate(componentName) {
	      return generate(componentName);
	    },
	    reset() {
	      generate = defaultGenerator;
	    }
	  };
	};
	const ClassNameGenerator = createClassNameGenerator();

	function r(e){var t,f,n="";if("string"==typeof e||"number"==typeof e)n+=e;else if("object"==typeof e)if(Array.isArray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(f=r(e[t]))&&(n&&(n+=" "),n+=f);}else for(f in e)e[f]&&(n&&(n+=" "),n+=f);return n}function clsx(){for(var e,t,f=0,n="",o=arguments.length;f<o;f++)(e=arguments[f])&&(t=r(e))&&(n&&(n+=" "),n+=t);return n}

	const globalStateClasses = {
	  active: 'active',
	  checked: 'checked',
	  completed: 'completed',
	  disabled: 'disabled',
	  error: 'error',
	  expanded: 'expanded',
	  focused: 'focused',
	  focusVisible: 'focusVisible',
	  open: 'open',
	  readOnly: 'readOnly',
	  required: 'required',
	  selected: 'selected'
	};
	function generateUtilityClass(componentName, slot, globalStatePrefix = 'Mui') {
	  const globalStateClass = globalStateClasses[slot];
	  return globalStateClass ? `${globalStatePrefix}-${globalStateClass}` : `${ClassNameGenerator.generate(componentName)}-${slot}`;
	}

	function generateUtilityClasses(componentName, slots, globalStatePrefix = 'Mui') {
	  const result = {};
	  slots.forEach(slot => {
	    result[slot] = generateUtilityClass(componentName, slot, globalStatePrefix);
	  });
	  return result;
	}

	var reactIs = {exports: {}};

	var reactIs_production = {};

	/**
	 * @license React
	 * react-is.production.js
	 *
	 * Copyright (c) Meta Platforms, Inc. and affiliates.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	var hasRequiredReactIs_production;

	function requireReactIs_production () {
		if (hasRequiredReactIs_production) return reactIs_production;
		hasRequiredReactIs_production = 1;

		var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"),
		  REACT_PORTAL_TYPE = Symbol.for("react.portal"),
		  REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"),
		  REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"),
		  REACT_PROFILER_TYPE = Symbol.for("react.profiler");
		var REACT_CONSUMER_TYPE = Symbol.for("react.consumer"),
		  REACT_CONTEXT_TYPE = Symbol.for("react.context"),
		  REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"),
		  REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"),
		  REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"),
		  REACT_MEMO_TYPE = Symbol.for("react.memo"),
		  REACT_LAZY_TYPE = Symbol.for("react.lazy"),
		  REACT_OFFSCREEN_TYPE = Symbol.for("react.offscreen"),
		  REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference");
		function typeOf(object) {
		  if ("object" === typeof object && null !== object) {
		    var $$typeof = object.$$typeof;
		    switch ($$typeof) {
		      case REACT_ELEMENT_TYPE:
		        switch (object = object.type, object) {
		          case REACT_FRAGMENT_TYPE:
		          case REACT_PROFILER_TYPE:
		          case REACT_STRICT_MODE_TYPE:
		          case REACT_SUSPENSE_TYPE:
		          case REACT_SUSPENSE_LIST_TYPE:
		            return object;
		          default:
		            switch (object = object && object.$$typeof, object) {
		              case REACT_CONTEXT_TYPE:
		              case REACT_FORWARD_REF_TYPE:
		              case REACT_LAZY_TYPE:
		              case REACT_MEMO_TYPE:
		                return object;
		              case REACT_CONSUMER_TYPE:
		                return object;
		              default:
		                return $$typeof;
		            }
		        }
		      case REACT_PORTAL_TYPE:
		        return $$typeof;
		    }
		  }
		}
		reactIs_production.ContextConsumer = REACT_CONSUMER_TYPE;
		reactIs_production.ContextProvider = REACT_CONTEXT_TYPE;
		reactIs_production.Element = REACT_ELEMENT_TYPE;
		reactIs_production.ForwardRef = REACT_FORWARD_REF_TYPE;
		reactIs_production.Fragment = REACT_FRAGMENT_TYPE;
		reactIs_production.Lazy = REACT_LAZY_TYPE;
		reactIs_production.Memo = REACT_MEMO_TYPE;
		reactIs_production.Portal = REACT_PORTAL_TYPE;
		reactIs_production.Profiler = REACT_PROFILER_TYPE;
		reactIs_production.StrictMode = REACT_STRICT_MODE_TYPE;
		reactIs_production.Suspense = REACT_SUSPENSE_TYPE;
		reactIs_production.SuspenseList = REACT_SUSPENSE_LIST_TYPE;
		reactIs_production.isContextConsumer = function (object) {
		  return typeOf(object) === REACT_CONSUMER_TYPE;
		};
		reactIs_production.isContextProvider = function (object) {
		  return typeOf(object) === REACT_CONTEXT_TYPE;
		};
		reactIs_production.isElement = function (object) {
		  return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
		};
		reactIs_production.isForwardRef = function (object) {
		  return typeOf(object) === REACT_FORWARD_REF_TYPE;
		};
		reactIs_production.isFragment = function (object) {
		  return typeOf(object) === REACT_FRAGMENT_TYPE;
		};
		reactIs_production.isLazy = function (object) {
		  return typeOf(object) === REACT_LAZY_TYPE;
		};
		reactIs_production.isMemo = function (object) {
		  return typeOf(object) === REACT_MEMO_TYPE;
		};
		reactIs_production.isPortal = function (object) {
		  return typeOf(object) === REACT_PORTAL_TYPE;
		};
		reactIs_production.isProfiler = function (object) {
		  return typeOf(object) === REACT_PROFILER_TYPE;
		};
		reactIs_production.isStrictMode = function (object) {
		  return typeOf(object) === REACT_STRICT_MODE_TYPE;
		};
		reactIs_production.isSuspense = function (object) {
		  return typeOf(object) === REACT_SUSPENSE_TYPE;
		};
		reactIs_production.isSuspenseList = function (object) {
		  return typeOf(object) === REACT_SUSPENSE_LIST_TYPE;
		};
		reactIs_production.isValidElementType = function (type) {
		  return "string" === typeof type || "function" === typeof type || type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || type === REACT_OFFSCREEN_TYPE || "object" === typeof type && null !== type && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_CONSUMER_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_CLIENT_REFERENCE || void 0 !== type.getModuleId) ? true : false;
		};
		reactIs_production.typeOf = typeOf;
		return reactIs_production;
	}

	{
	  reactIs.exports = requireReactIs_production();
	}

	var reactIsExports = reactIs.exports;

	// Simplified polyfill for IE11 support
	// https://github.com/JamesMGreene/Function.name/blob/58b314d4a983110c3682f1228f845d39ccca1817/Function.name.js#L3
	const fnNameMatchRegex = /^\s*function(?:\s|\s*\/\*.*\*\/\s*)+([^(\s/]*)\s*/;
	function getFunctionName(fn) {
	  const match = `${fn}`.match(fnNameMatchRegex);
	  const name = match && match[1];
	  return name || '';
	}
	function getFunctionComponentName(Component, fallback = '') {
	  return Component.displayName || Component.name || getFunctionName(Component) || fallback;
	}
	function getWrappedName(outerType, innerType, wrapperName) {
	  const functionName = getFunctionComponentName(innerType);
	  return outerType.displayName || (functionName !== '' ? `${wrapperName}(${functionName})` : wrapperName);
	}

	/**
	 * cherry-pick from
	 * https://github.com/facebook/react/blob/769b1f270e1251d9dbdce0fcbd9e92e502d059b8/packages/shared/getComponentName.js
	 * originally forked from recompose/getDisplayName with added IE11 support
	 */
	function getDisplayName$1(Component) {
	  if (Component == null) {
	    return undefined;
	  }
	  if (typeof Component === 'string') {
	    return Component;
	  }
	  if (typeof Component === 'function') {
	    return getFunctionComponentName(Component, 'Component');
	  }

	  // TypeScript can't have components as objects but they exist in the form of `memo` or `Suspense`
	  if (typeof Component === 'object') {
	    switch (Component.$$typeof) {
	      case reactIsExports.ForwardRef:
	        return getWrappedName(Component, Component.render, 'ForwardRef');
	      case reactIsExports.Memo:
	        return getWrappedName(Component, Component.type, 'memo');
	      default:
	        return undefined;
	    }
	  }
	  return undefined;
	}

	var getDisplayName = /*#__PURE__*/Object.freeze({
		__proto__: null,
		default: getDisplayName$1,
		getFunctionName: getFunctionName
	});

	/**
	 * Add keys, values of `defaultProps` that does not exist in `props`
	 * @param {object} defaultProps
	 * @param {object} props
	 * @returns {object} resolved props
	 */
	function resolveProps(defaultProps, props) {
	  const output = _extends$1({}, props);
	  Object.keys(defaultProps).forEach(propName => {
	    if (propName.toString().match(/^(components|slots)$/)) {
	      output[propName] = _extends$1({}, defaultProps[propName], output[propName]);
	    } else if (propName.toString().match(/^(componentsProps|slotProps)$/)) {
	      const defaultSlotProps = defaultProps[propName] || {};
	      const slotProps = props[propName];
	      output[propName] = {};
	      if (!slotProps || !Object.keys(slotProps)) {
	        // Reduce the iteration if the slot props is empty
	        output[propName] = defaultSlotProps;
	      } else if (!defaultSlotProps || !Object.keys(defaultSlotProps)) {
	        // Reduce the iteration if the default slot props is empty
	        output[propName] = slotProps;
	      } else {
	        output[propName] = _extends$1({}, slotProps);
	        Object.keys(defaultSlotProps).forEach(slotPropName => {
	          output[propName][slotPropName] = resolveProps(defaultSlotProps[slotPropName], slotProps[slotPropName]);
	        });
	      }
	    } else if (output[propName] === undefined) {
	      output[propName] = defaultProps[propName];
	    }
	  });
	  return output;
	}

	/**
	 * A version of `React.useLayoutEffect` that does not show a warning when server-side rendering.
	 * This is useful for effects that are only needed for client-side rendering but not for SSR.
	 *
	 * Before you use this hook, make sure to read https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85
	 * and confirm it doesn't apply to your use-case.
	 */
	const useEnhancedEffect = typeof window !== 'undefined' ? React__namespace.useLayoutEffect : React__namespace.useEffect;

	function clamp$1(val, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
	  return Math.max(min, Math.min(val, max));
	}

	var clamp = /*#__PURE__*/Object.freeze({
		__proto__: null,
		default: clamp$1
	});

	/**
	 * Safe chained function.
	 *
	 * Will only create a new function if needed,
	 * otherwise will pass back existing functions or null.
	 */
	function createChainedFunction(...funcs) {
	  return funcs.reduce((acc, func) => {
	    if (func == null) {
	      return acc;
	    }
	    return function chainedFunction(...args) {
	      acc.apply(this, args);
	      func.apply(this, args);
	    };
	  }, () => {});
	}

	// Corresponds to 10 frames at 60 Hz.
	// A few bytes payload overhead when lodash/debounce is ~3 kB and debounce ~300 B.
	function debounce(func, wait = 166) {
	  let timeout;
	  function debounced(...args) {
	    const later = () => {
	      // @ts-ignore
	      func.apply(this, args);
	    };
	    clearTimeout(timeout);
	    timeout = setTimeout(later, wait);
	  }
	  debounced.clear = () => {
	    clearTimeout(timeout);
	  };
	  return debounced;
	}

	function deprecatedPropType(validator, reason) {
	  {
	    return () => null;
	  }
	}

	function isMuiElement(element, muiNames) {
	  var _muiName, _element$type;
	  return /*#__PURE__*/ /*#__PURE__*/React__namespace.isValidElement(element) && muiNames.indexOf(
	  // For server components `muiName` is avaialble in element.type._payload.value.muiName
	  // relevant info - https://github.com/facebook/react/blob/2807d781a08db8e9873687fccc25c0f12b4fb3d4/packages/react/src/ReactLazy.js#L45
	  // eslint-disable-next-line no-underscore-dangle
	  (_muiName = element.type.muiName) != null ? _muiName : (_element$type = element.type) == null || (_element$type = _element$type._payload) == null || (_element$type = _element$type.value) == null ? void 0 : _element$type.muiName) !== -1;
	}

	function ownerDocument(node) {
	  return node && node.ownerDocument || document;
	}

	function ownerWindow(node) {
	  const doc = ownerDocument(node);
	  return doc.defaultView || window;
	}

	function requirePropFactory(componentNameInError, Component) {
	  {
	    return () => null;
	  }
	}

	/**
	 * TODO v5: consider making it private
	 *
	 * passes {value} to {ref}
	 *
	 * WARNING: Be sure to only call this inside a callback that is passed as a ref.
	 * Otherwise, make sure to cleanup the previous {ref} if it changes. See
	 * https://github.com/mui/material-ui/issues/13539
	 *
	 * Useful if you want to expose the ref of an inner component to the public API
	 * while still using it inside the component.
	 * @param ref A ref callback or ref object. If anything falsy, this is a no-op.
	 */
	function setRef(ref, value) {
	  if (typeof ref === 'function') {
	    ref(value);
	  } else if (ref) {
	    ref.current = value;
	  }
	}

	let globalId = 0;
	function useGlobalId(idOverride) {
	  const [defaultId, setDefaultId] = React__namespace.useState(idOverride);
	  const id = idOverride || defaultId;
	  React__namespace.useEffect(() => {
	    if (defaultId == null) {
	      // Fallback to this default id when possible.
	      // Use the incrementing value for client-side rendering only.
	      // We can't use it server-side.
	      // If you want to use random values please consider the Birthday Problem: https://en.wikipedia.org/wiki/Birthday_problem
	      globalId += 1;
	      setDefaultId(`mui-${globalId}`);
	    }
	  }, [defaultId]);
	  return id;
	}

	// downstream bundlers may remove unnecessary concatenation, but won't remove toString call -- Workaround for https://github.com/webpack/webpack/issues/14814
	const maybeReactUseId = React__namespace['useId'.toString()];
	/**
	 *
	 * @example <div id={useId()} />
	 * @param idOverride
	 * @returns {string}
	 */
	function useId(idOverride) {
	  if (maybeReactUseId !== undefined) {
	    const reactId = maybeReactUseId();
	    return idOverride != null ? idOverride : reactId;
	  }
	  // eslint-disable-next-line react-hooks/rules-of-hooks -- `React.useId` is invariant at runtime.
	  return useGlobalId(idOverride);
	}

	function unsupportedProp(props, propName, componentName, location, propFullName) {
	  {
	    return null;
	  }
	}

	function useControlled({
	  controlled,
	  default: defaultProp,
	  name,
	  state = 'value'
	}) {
	  // isControlled is ignored in the hook dependency lists as it should never change.
	  const {
	    current: isControlled
	  } = React__namespace.useRef(controlled !== undefined);
	  const [valueState, setValue] = React__namespace.useState(defaultProp);
	  const value = isControlled ? controlled : valueState;
	  const setValueIfUncontrolled = React__namespace.useCallback(newValue => {
	    if (!isControlled) {
	      setValue(newValue);
	    }
	  }, []);
	  return [value, setValueIfUncontrolled];
	}

	/**
	 * Inspired by https://github.com/facebook/react/issues/14099#issuecomment-440013892
	 * See RFC in https://github.com/reactjs/rfcs/pull/220
	 */

	function useEventCallback(fn) {
	  const ref = React__namespace.useRef(fn);
	  useEnhancedEffect(() => {
	    ref.current = fn;
	  });
	  return React__namespace.useRef((...args) =>
	  // @ts-expect-error hide `this`
	  (0, ref.current)(...args)).current;
	}

	function useForkRef(...refs) {
	  /**
	   * This will create a new function if the refs passed to this hook change and are all defined.
	   * This means react will call the old forkRef with `null` and the new forkRef
	   * with the ref. Cleanup naturally emerges from this behavior.
	   */
	  return React__namespace.useMemo(() => {
	    if (refs.every(ref => ref == null)) {
	      return null;
	    }
	    return instance => {
	      refs.forEach(ref => {
	        setRef(ref, instance);
	      });
	    };
	    // eslint-disable-next-line react-hooks/exhaustive-deps
	  }, refs);
	}

	class Timeout {
	  constructor() {
	    this.currentId = null;
	    this.clear = () => {
	      if (this.currentId !== null) {
	        clearTimeout(this.currentId);
	        this.currentId = null;
	      }
	    };
	    this.disposeEffect = () => {
	      return this.clear;
	    };
	  }
	  static create() {
	    return new Timeout();
	  }
	  /**
	   * Executes `fn` after `delay`, clearing any previously scheduled call.
	   */
	  start(delay, fn) {
	    this.clear();
	    this.currentId = setTimeout(() => {
	      this.currentId = null;
	      fn();
	    }, delay);
	  }
	}

	let hadKeyboardEvent = true;
	let hadFocusVisibleRecently = false;
	const hadFocusVisibleRecentlyTimeout = new Timeout();
	const inputTypesWhitelist = {
	  text: true,
	  search: true,
	  url: true,
	  tel: true,
	  email: true,
	  password: true,
	  number: true,
	  date: true,
	  month: true,
	  week: true,
	  time: true,
	  datetime: true,
	  'datetime-local': true
	};

	/**
	 * Computes whether the given element should automatically trigger the
	 * `focus-visible` class being added, i.e. whether it should always match
	 * `:focus-visible` when focused.
	 * @param {Element} node
	 * @returns {boolean}
	 */
	function focusTriggersKeyboardModality(node) {
	  const {
	    type,
	    tagName
	  } = node;
	  if (tagName === 'INPUT' && inputTypesWhitelist[type] && !node.readOnly) {
	    return true;
	  }
	  if (tagName === 'TEXTAREA' && !node.readOnly) {
	    return true;
	  }
	  if (node.isContentEditable) {
	    return true;
	  }
	  return false;
	}

	/**
	 * Keep track of our keyboard modality state with `hadKeyboardEvent`.
	 * If the most recent user interaction was via the keyboard;
	 * and the key press did not include a meta, alt/option, or control key;
	 * then the modality is keyboard. Otherwise, the modality is not keyboard.
	 * @param {KeyboardEvent} event
	 */
	function handleKeyDown(event) {
	  if (event.metaKey || event.altKey || event.ctrlKey) {
	    return;
	  }
	  hadKeyboardEvent = true;
	}

	/**
	 * If at any point a user clicks with a pointing device, ensure that we change
	 * the modality away from keyboard.
	 * This avoids the situation where a user presses a key on an already focused
	 * element, and then clicks on a different element, focusing it with a
	 * pointing device, while we still think we're in keyboard modality.
	 */
	function handlePointerDown() {
	  hadKeyboardEvent = false;
	}
	function handleVisibilityChange() {
	  if (this.visibilityState === 'hidden') {
	    // If the tab becomes active again, the browser will handle calling focus
	    // on the element (Safari actually calls it twice).
	    // If this tab change caused a blur on an element with focus-visible,
	    // re-apply the class when the user switches back to the tab.
	    if (hadFocusVisibleRecently) {
	      hadKeyboardEvent = true;
	    }
	  }
	}
	function prepare(doc) {
	  doc.addEventListener('keydown', handleKeyDown, true);
	  doc.addEventListener('mousedown', handlePointerDown, true);
	  doc.addEventListener('pointerdown', handlePointerDown, true);
	  doc.addEventListener('touchstart', handlePointerDown, true);
	  doc.addEventListener('visibilitychange', handleVisibilityChange, true);
	}
	function isFocusVisible(event) {
	  const {
	    target
	  } = event;
	  try {
	    return target.matches(':focus-visible');
	  } catch (error) {
	    // Browsers not implementing :focus-visible will throw a SyntaxError.
	    // We use our own heuristic for those browsers.
	    // Rethrow might be better if it's not the expected error but do we really
	    // want to crash if focus-visible malfunctioned?
	  }

	  // No need for validFocusTarget check. The user does that by attaching it to
	  // focusable events only.
	  return hadKeyboardEvent || focusTriggersKeyboardModality(target);
	}
	function useIsFocusVisible() {
	  const ref = React__namespace.useCallback(node => {
	    if (node != null) {
	      prepare(node.ownerDocument);
	    }
	  }, []);
	  const isFocusVisibleRef = React__namespace.useRef(false);

	  /**
	   * Should be called if a blur event is fired
	   */
	  function handleBlurVisible() {
	    // checking against potential state variable does not suffice if we focus and blur synchronously.
	    // React wouldn't have time to trigger a re-render so `focusVisible` would be stale.
	    // Ideally we would adjust `isFocusVisible(event)` to look at `relatedTarget` for blur events.
	    // This doesn't work in IE11 due to https://github.com/facebook/react/issues/3751
	    // TODO: check again if React releases their internal changes to focus event handling (https://github.com/facebook/react/pull/19186).
	    if (isFocusVisibleRef.current) {
	      // To detect a tab/window switch, we look for a blur event followed
	      // rapidly by a visibility change.
	      // If we don't see a visibility change within 100ms, it's probably a
	      // regular focus change.
	      hadFocusVisibleRecently = true;
	      hadFocusVisibleRecentlyTimeout.start(100, () => {
	        hadFocusVisibleRecently = false;
	      });
	      isFocusVisibleRef.current = false;
	      return true;
	    }
	    return false;
	  }

	  /**
	   * Should be called if a blur event is fired
	   */
	  function handleFocusVisible(event) {
	    if (isFocusVisible(event)) {
	      isFocusVisibleRef.current = true;
	      return true;
	    }
	    return false;
	  }
	  return {
	    isFocusVisibleRef,
	    onFocus: handleFocusVisible,
	    onBlur: handleBlurVisible,
	    ref
	  };
	}

	function composeClasses(slots, getUtilityClass, classes = undefined) {
	  const output = {};
	  Object.keys(slots).forEach(
	  // `Object.keys(slots)` can't be wider than `T` because we infer `T` from `slots`.
	  // @ts-expect-error https://github.com/microsoft/TypeScript/pull/12253#issuecomment-263132208
	  slot => {
	    output[slot] = slots[slot].reduce((acc, key) => {
	      if (key) {
	        const utilityClass = getUtilityClass(key);
	        if (utilityClass !== '') {
	          acc.push(utilityClass);
	        }
	        if (classes && classes[key]) {
	          acc.push(classes[key]);
	        }
	      }
	      return acc;
	    }, []).join(' ');
	  });
	  return output;
	}

	const ThemeContext = /*#__PURE__*/React__namespace.createContext(null);

	function useTheme() {
	  const theme = React__namespace.useContext(ThemeContext);
	  return theme;
	}

	const hasSymbol = typeof Symbol === 'function' && Symbol.for;
	var nested = hasSymbol ? Symbol.for('mui.nested') : '__THEME_NESTED__';

	function mergeOuterLocalTheme(outerTheme, localTheme) {
	  if (typeof localTheme === 'function') {
	    const mergedTheme = localTheme(outerTheme);
	    return mergedTheme;
	  }
	  return _extends$1({}, outerTheme, localTheme);
	}

	/**
	 * This component takes a `theme` prop.
	 * It makes the `theme` available down the React tree thanks to React context.
	 * This component should preferably be used at **the root of your component tree**.
	 */
	function ThemeProvider$2(props) {
	  const {
	    children,
	    theme: localTheme
	  } = props;
	  const outerTheme = useTheme();
	  const theme = React__namespace.useMemo(() => {
	    const output = outerTheme === null ? localTheme : mergeOuterLocalTheme(outerTheme, localTheme);
	    if (output != null) {
	      output[nested] = outerTheme !== null;
	    }
	    return output;
	  }, [localTheme, outerTheme]);
	  return /*#__PURE__*/jsxRuntimeExports.jsx(ThemeContext.Provider, {
	    value: theme,
	    children: children
	  });
	}

	const _excluded$7 = ["value"];
	const RtlContext = /*#__PURE__*/React__namespace.createContext();
	function RtlProvider(_ref) {
	  let {
	      value
	    } = _ref,
	    props = _objectWithoutPropertiesLoose(_ref, _excluded$7);
	  return /*#__PURE__*/jsxRuntimeExports.jsx(RtlContext.Provider, _extends$1({
	    value: value != null ? value : true
	  }, props));
	}

	const PropsContext = /*#__PURE__*/React__namespace.createContext(undefined);
	function DefaultPropsProvider({
	  value,
	  children
	}) {
	  return /*#__PURE__*/jsxRuntimeExports.jsx(PropsContext.Provider, {
	    value: value,
	    children: children
	  });
	}
	function getThemeProps(params) {
	  const {
	    theme,
	    name,
	    props
	  } = params;
	  if (!theme || !theme.components || !theme.components[name]) {
	    return props;
	  }
	  const config = theme.components[name];
	  if (config.defaultProps) {
	    // compatible with v5 signature
	    return resolveProps(config.defaultProps, props);
	  }
	  if (!config.styleOverrides && !config.variants) {
	    // v6 signature, no property 'defaultProps'
	    return resolveProps(config, props);
	  }
	  return props;
	}
	function useDefaultProps$1({
	  props,
	  name
	}) {
	  const ctx = React__namespace.useContext(PropsContext);
	  return getThemeProps({
	    props,
	    name,
	    theme: {
	      components: ctx
	    }
	  });
	}

	const EMPTY_THEME = {};
	function useThemeScoping(themeId, upperTheme, localTheme, isPrivate = false) {
	  return React__namespace.useMemo(() => {
	    const resolvedTheme = themeId ? upperTheme[themeId] || upperTheme : upperTheme;
	    if (typeof localTheme === 'function') {
	      const mergedTheme = localTheme(resolvedTheme);
	      const result = themeId ? _extends$1({}, upperTheme, {
	        [themeId]: mergedTheme
	      }) : mergedTheme;
	      // must return a function for the private theme to NOT merge with the upper theme.
	      // see the test case "use provided theme from a callback" in ThemeProvider.test.js
	      if (isPrivate) {
	        return () => result;
	      }
	      return result;
	    }
	    return themeId ? _extends$1({}, upperTheme, {
	      [themeId]: localTheme
	    }) : _extends$1({}, upperTheme, localTheme);
	  }, [themeId, upperTheme, localTheme, isPrivate]);
	}

	/**
	 * This component makes the `theme` available down the React tree.
	 * It should preferably be used at **the root of your component tree**.
	 *
	 * <ThemeProvider theme={theme}> // existing use case
	 * <ThemeProvider theme={{ id: theme }}> // theme scoping
	 */
	function ThemeProvider$1(props) {
	  const {
	    children,
	    theme: localTheme,
	    themeId
	  } = props;
	  const upperTheme = useTheme$2(EMPTY_THEME);
	  const upperPrivateTheme = useTheme() || EMPTY_THEME;
	  const engineTheme = useThemeScoping(themeId, upperTheme, localTheme);
	  const privateTheme = useThemeScoping(themeId, upperPrivateTheme, localTheme, true);
	  const rtlValue = engineTheme.direction === 'rtl';
	  return /*#__PURE__*/jsxRuntimeExports.jsx(ThemeProvider$2, {
	    theme: privateTheme,
	    children: /*#__PURE__*/jsxRuntimeExports.jsx(react.ThemeContext.Provider, {
	      value: engineTheme,
	      children: /*#__PURE__*/jsxRuntimeExports.jsx(RtlProvider, {
	        value: rtlValue,
	        children: /*#__PURE__*/jsxRuntimeExports.jsx(DefaultPropsProvider, {
	          value: engineTheme == null ? void 0 : engineTheme.components,
	          children: children
	        })
	      })
	    })
	  });
	}

	function createMixins(breakpoints, mixins) {
	  return _extends$1({
	    toolbar: {
	      minHeight: 56,
	      [breakpoints.up('xs')]: {
	        '@media (orientation: landscape)': {
	          minHeight: 48
	        }
	      },
	      [breakpoints.up('sm')]: {
	        minHeight: 64
	      }
	    }
	  }, mixins);
	}

	var colorManipulator = {};

	var interopRequireDefault = {exports: {}};

	(function (module) {
		function _interopRequireDefault(e) {
		  return e && e.__esModule ? e : {
		    "default": e
		  };
		}
		module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports; 
	} (interopRequireDefault));

	var interopRequireDefaultExports = interopRequireDefault.exports;

	var require$$1 = /*@__PURE__*/getAugmentedNamespace(formatMuiErrorMessage);

	var require$$2 = /*@__PURE__*/getAugmentedNamespace(clamp);

	var _interopRequireDefault$3 = interopRequireDefaultExports;
	Object.defineProperty(colorManipulator, "__esModule", {
	  value: true
	});
	colorManipulator.alpha = alpha;
	colorManipulator.blend = blend;
	colorManipulator.colorChannel = void 0;
	var darken_1 = colorManipulator.darken = darken;
	colorManipulator.decomposeColor = decomposeColor;
	colorManipulator.emphasize = emphasize;
	var getContrastRatio_1 = colorManipulator.getContrastRatio = getContrastRatio;
	colorManipulator.getLuminance = getLuminance;
	colorManipulator.hexToRgb = hexToRgb;
	colorManipulator.hslToRgb = hslToRgb;
	var lighten_1 = colorManipulator.lighten = lighten;
	colorManipulator.private_safeAlpha = private_safeAlpha;
	colorManipulator.private_safeColorChannel = void 0;
	colorManipulator.private_safeDarken = private_safeDarken;
	colorManipulator.private_safeEmphasize = private_safeEmphasize;
	colorManipulator.private_safeLighten = private_safeLighten;
	colorManipulator.recomposeColor = recomposeColor;
	colorManipulator.rgbToHex = rgbToHex;
	var _formatMuiErrorMessage2 = _interopRequireDefault$3(require$$1);
	var _clamp = _interopRequireDefault$3(require$$2);
	/* eslint-disable @typescript-eslint/naming-convention */

	/**
	 * Returns a number whose value is limited to the given range.
	 * @param {number} value The value to be clamped
	 * @param {number} min The lower boundary of the output range
	 * @param {number} max The upper boundary of the output range
	 * @returns {number} A number in the range [min, max]
	 */
	function clampWrapper(value, min = 0, max = 1) {
	  return (0, _clamp.default)(value, min, max);
	}

	/**
	 * Converts a color from CSS hex format to CSS rgb format.
	 * @param {string} color - Hex color, i.e. #nnn or #nnnnnn
	 * @returns {string} A CSS rgb color string
	 */
	function hexToRgb(color) {
	  color = color.slice(1);
	  const re = new RegExp(`.{1,${color.length >= 6 ? 2 : 1}}`, 'g');
	  let colors = color.match(re);
	  if (colors && colors[0].length === 1) {
	    colors = colors.map(n => n + n);
	  }
	  return colors ? `rgb${colors.length === 4 ? 'a' : ''}(${colors.map((n, index) => {
    return index < 3 ? parseInt(n, 16) : Math.round(parseInt(n, 16) / 255 * 1000) / 1000;
  }).join(', ')})` : '';
	}
	function intToHex(int) {
	  const hex = int.toString(16);
	  return hex.length === 1 ? `0${hex}` : hex;
	}

	/**
	 * Returns an object with the type and values of a color.
	 *
	 * Note: Does not support rgb % values.
	 * @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color()
	 * @returns {object} - A MUI color object: {type: string, values: number[]}
	 */
	function decomposeColor(color) {
	  // Idempotent
	  if (color.type) {
	    return color;
	  }
	  if (color.charAt(0) === '#') {
	    return decomposeColor(hexToRgb(color));
	  }
	  const marker = color.indexOf('(');
	  const type = color.substring(0, marker);
	  if (['rgb', 'rgba', 'hsl', 'hsla', 'color'].indexOf(type) === -1) {
	    throw new Error((0, _formatMuiErrorMessage2.default)(9, color));
	  }
	  let values = color.substring(marker + 1, color.length - 1);
	  let colorSpace;
	  if (type === 'color') {
	    values = values.split(' ');
	    colorSpace = values.shift();
	    if (values.length === 4 && values[3].charAt(0) === '/') {
	      values[3] = values[3].slice(1);
	    }
	    if (['srgb', 'display-p3', 'a98-rgb', 'prophoto-rgb', 'rec-2020'].indexOf(colorSpace) === -1) {
	      throw new Error((0, _formatMuiErrorMessage2.default)(10, colorSpace));
	    }
	  } else {
	    values = values.split(',');
	  }
	  values = values.map(value => parseFloat(value));
	  return {
	    type,
	    values,
	    colorSpace
	  };
	}

	/**
	 * Returns a channel created from the input color.
	 *
	 * @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color()
	 * @returns {string} - The channel for the color, that can be used in rgba or hsla colors
	 */
	const colorChannel = color => {
	  const decomposedColor = decomposeColor(color);
	  return decomposedColor.values.slice(0, 3).map((val, idx) => decomposedColor.type.indexOf('hsl') !== -1 && idx !== 0 ? `${val}%` : val).join(' ');
	};
	colorManipulator.colorChannel = colorChannel;
	const private_safeColorChannel = (color, warning) => {
	  try {
	    return colorChannel(color);
	  } catch (error) {
	    return color;
	  }
	};

	/**
	 * Converts a color object with type and values to a string.
	 * @param {object} color - Decomposed color
	 * @param {string} color.type - One of: 'rgb', 'rgba', 'hsl', 'hsla', 'color'
	 * @param {array} color.values - [n,n,n] or [n,n,n,n]
	 * @returns {string} A CSS color string
	 */
	colorManipulator.private_safeColorChannel = private_safeColorChannel;
	function recomposeColor(color) {
	  const {
	    type,
	    colorSpace
	  } = color;
	  let {
	    values
	  } = color;
	  if (type.indexOf('rgb') !== -1) {
	    // Only convert the first 3 values to int (i.e. not alpha)
	    values = values.map((n, i) => i < 3 ? parseInt(n, 10) : n);
	  } else if (type.indexOf('hsl') !== -1) {
	    values[1] = `${values[1]}%`;
	    values[2] = `${values[2]}%`;
	  }
	  if (type.indexOf('color') !== -1) {
	    values = `${colorSpace} ${values.join(' ')}`;
	  } else {
	    values = `${values.join(', ')}`;
	  }
	  return `${type}(${values})`;
	}

	/**
	 * Converts a color from CSS rgb format to CSS hex format.
	 * @param {string} color - RGB color, i.e. rgb(n, n, n)
	 * @returns {string} A CSS rgb color string, i.e. #nnnnnn
	 */
	function rgbToHex(color) {
	  // Idempotent
	  if (color.indexOf('#') === 0) {
	    return color;
	  }
	  const {
	    values
	  } = decomposeColor(color);
	  return `#${values.map((n, i) => intToHex(i === 3 ? Math.round(255 * n) : n)).join('')}`;
	}

	/**
	 * Converts a color from hsl format to rgb format.
	 * @param {string} color - HSL color values
	 * @returns {string} rgb color values
	 */
	function hslToRgb(color) {
	  color = decomposeColor(color);
	  const {
	    values
	  } = color;
	  const h = values[0];
	  const s = values[1] / 100;
	  const l = values[2] / 100;
	  const a = s * Math.min(l, 1 - l);
	  const f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
	  let type = 'rgb';
	  const rgb = [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
	  if (color.type === 'hsla') {
	    type += 'a';
	    rgb.push(values[3]);
	  }
	  return recomposeColor({
	    type,
	    values: rgb
	  });
	}
	/**
	 * The relative brightness of any point in a color space,
	 * normalized to 0 for darkest black and 1 for lightest white.
	 *
	 * Formula: https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
	 * @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color()
	 * @returns {number} The relative brightness of the color in the range 0 - 1
	 */
	function getLuminance(color) {
	  color = decomposeColor(color);
	  let rgb = color.type === 'hsl' || color.type === 'hsla' ? decomposeColor(hslToRgb(color)).values : color.values;
	  rgb = rgb.map(val => {
	    if (color.type !== 'color') {
	      val /= 255; // normalized
	    }
	    return val <= 0.03928 ? val / 12.92 : ((val + 0.055) / 1.055) ** 2.4;
	  });

	  // Truncate at 3 digits
	  return Number((0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]).toFixed(3));
	}

	/**
	 * Calculates the contrast ratio between two colors.
	 *
	 * Formula: https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
	 * @param {string} foreground - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla()
	 * @param {string} background - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla()
	 * @returns {number} A contrast ratio value in the range 0 - 21.
	 */
	function getContrastRatio(foreground, background) {
	  const lumA = getLuminance(foreground);
	  const lumB = getLuminance(background);
	  return (Math.max(lumA, lumB) + 0.05) / (Math.min(lumA, lumB) + 0.05);
	}

	/**
	 * Sets the absolute transparency of a color.
	 * Any existing alpha values are overwritten.
	 * @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color()
	 * @param {number} value - value to set the alpha channel to in the range 0 - 1
	 * @returns {string} A CSS color string. Hex input values are returned as rgb
	 */
	function alpha(color, value) {
	  color = decomposeColor(color);
	  value = clampWrapper(value);
	  if (color.type === 'rgb' || color.type === 'hsl') {
	    color.type += 'a';
	  }
	  if (color.type === 'color') {
	    color.values[3] = `/${value}`;
	  } else {
	    color.values[3] = value;
	  }
	  return recomposeColor(color);
	}
	function private_safeAlpha(color, value, warning) {
	  try {
	    return alpha(color, value);
	  } catch (error) {
	    return color;
	  }
	}

	/**
	 * Darkens a color.
	 * @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color()
	 * @param {number} coefficient - multiplier in the range 0 - 1
	 * @returns {string} A CSS color string. Hex input values are returned as rgb
	 */
	function darken(color, coefficient) {
	  color = decomposeColor(color);
	  coefficient = clampWrapper(coefficient);
	  if (color.type.indexOf('hsl') !== -1) {
	    color.values[2] *= 1 - coefficient;
	  } else if (color.type.indexOf('rgb') !== -1 || color.type.indexOf('color') !== -1) {
	    for (let i = 0; i < 3; i += 1) {
	      color.values[i] *= 1 - coefficient;
	    }
	  }
	  return recomposeColor(color);
	}
	function private_safeDarken(color, coefficient, warning) {
	  try {
	    return darken(color, coefficient);
	  } catch (error) {
	    return color;
	  }
	}

	/**
	 * Lightens a color.
	 * @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color()
	 * @param {number} coefficient - multiplier in the range 0 - 1
	 * @returns {string} A CSS color string. Hex input values are returned as rgb
	 */
	function lighten(color, coefficient) {
	  color = decomposeColor(color);
	  coefficient = clampWrapper(coefficient);
	  if (color.type.indexOf('hsl') !== -1) {
	    color.values[2] += (100 - color.values[2]) * coefficient;
	  } else if (color.type.indexOf('rgb') !== -1) {
	    for (let i = 0; i < 3; i += 1) {
	      color.values[i] += (255 - color.values[i]) * coefficient;
	    }
	  } else if (color.type.indexOf('color') !== -1) {
	    for (let i = 0; i < 3; i += 1) {
	      color.values[i] += (1 - color.values[i]) * coefficient;
	    }
	  }
	  return recomposeColor(color);
	}
	function private_safeLighten(color, coefficient, warning) {
	  try {
	    return lighten(color, coefficient);
	  } catch (error) {
	    return color;
	  }
	}

	/**
	 * Darken or lighten a color, depending on its luminance.
	 * Light colors are darkened, dark colors are lightened.
	 * @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color()
	 * @param {number} coefficient=0.15 - multiplier in the range 0 - 1
	 * @returns {string} A CSS color string. Hex input values are returned as rgb
	 */
	function emphasize(color, coefficient = 0.15) {
	  return getLuminance(color) > 0.5 ? darken(color, coefficient) : lighten(color, coefficient);
	}
	function private_safeEmphasize(color, coefficient, warning) {
	  try {
	    return emphasize(color, coefficient);
	  } catch (error) {
	    return color;
	  }
	}

	/**
	 * Blend a transparent overlay color with a background color, resulting in a single
	 * RGB color.
	 * @param {string} background - CSS color
	 * @param {string} overlay - CSS color
	 * @param {number} opacity - Opacity multiplier in the range 0 - 1
	 * @param {number} [gamma=1.0] - Gamma correction factor. For gamma-correct blending, 2.2 is usual.
	 */
	function blend(background, overlay, opacity, gamma = 1.0) {
	  const blendChannel = (b, o) => Math.round((b ** (1 / gamma) * (1 - opacity) + o ** (1 / gamma) * opacity) ** gamma);
	  const backgroundColor = decomposeColor(background);
	  const overlayColor = decomposeColor(overlay);
	  const rgb = [blendChannel(backgroundColor.values[0], overlayColor.values[0]), blendChannel(backgroundColor.values[1], overlayColor.values[1]), blendChannel(backgroundColor.values[2], overlayColor.values[2])];
	  return recomposeColor({
	    type: 'rgb',
	    values: rgb
	  });
	}

	const common = {
	  black: '#000',
	  white: '#fff'
	};

	const grey = {
	  50: '#fafafa',
	  100: '#f5f5f5',
	  200: '#eeeeee',
	  300: '#e0e0e0',
	  400: '#bdbdbd',
	  500: '#9e9e9e',
	  600: '#757575',
	  700: '#616161',
	  800: '#424242',
	  900: '#212121',
	  A100: '#f5f5f5',
	  A200: '#eeeeee',
	  A400: '#bdbdbd',
	  A700: '#616161'
	};

	const purple = {
	  50: '#f3e5f5',
	  200: '#ce93d8',
	  300: '#ba68c8',
	  400: '#ab47bc',
	  500: '#9c27b0',
	  700: '#7b1fa2'};

	const red = {
	  300: '#e57373',
	  400: '#ef5350',
	  500: '#f44336',
	  700: '#d32f2f',
	  800: '#c62828'};

	const orange = {
	  300: '#ffb74d',
	  400: '#ffa726',
	  500: '#ff9800',
	  700: '#f57c00',
	  900: '#e65100'};

	const blue = {
	  50: '#e3f2fd',
	  200: '#90caf9',
	  400: '#42a5f5',
	  700: '#1976d2',
	  800: '#1565c0'};

	const lightBlue = {
	  300: '#4fc3f7',
	  400: '#29b6f6',
	  500: '#03a9f4',
	  700: '#0288d1',
	  900: '#01579b'};

	const green = {
	  300: '#81c784',
	  400: '#66bb6a',
	  500: '#4caf50',
	  700: '#388e3c',
	  800: '#2e7d32',
	  900: '#1b5e20'};

	const _excluded$6 = ["mode", "contrastThreshold", "tonalOffset"];
	const light = {
	  // The colors used to style the text.
	  text: {
	    // The most important text.
	    primary: 'rgba(0, 0, 0, 0.87)',
	    // Secondary text.
	    secondary: 'rgba(0, 0, 0, 0.6)',
	    // Disabled text have even lower visual prominence.
	    disabled: 'rgba(0, 0, 0, 0.38)'
	  },
	  // The color used to divide different elements.
	  divider: 'rgba(0, 0, 0, 0.12)',
	  // The background colors used to style the surfaces.
	  // Consistency between these values is important.
	  background: {
	    paper: common.white,
	    default: common.white
	  },
	  // The colors used to style the action elements.
	  action: {
	    // The color of an active action like an icon button.
	    active: 'rgba(0, 0, 0, 0.54)',
	    // The color of an hovered action.
	    hover: 'rgba(0, 0, 0, 0.04)',
	    hoverOpacity: 0.04,
	    // The color of a selected action.
	    selected: 'rgba(0, 0, 0, 0.08)',
	    selectedOpacity: 0.08,
	    // The color of a disabled action.
	    disabled: 'rgba(0, 0, 0, 0.26)',
	    // The background color of a disabled action.
	    disabledBackground: 'rgba(0, 0, 0, 0.12)',
	    disabledOpacity: 0.38,
	    focus: 'rgba(0, 0, 0, 0.12)',
	    focusOpacity: 0.12,
	    activatedOpacity: 0.12
	  }
	};
	const dark = {
	  text: {
	    primary: common.white,
	    secondary: 'rgba(255, 255, 255, 0.7)',
	    disabled: 'rgba(255, 255, 255, 0.5)',
	    icon: 'rgba(255, 255, 255, 0.5)'
	  },
	  divider: 'rgba(255, 255, 255, 0.12)',
	  background: {
	    paper: '#121212',
	    default: '#121212'
	  },
	  action: {
	    active: common.white,
	    hover: 'rgba(255, 255, 255, 0.08)',
	    hoverOpacity: 0.08,
	    selected: 'rgba(255, 255, 255, 0.16)',
	    selectedOpacity: 0.16,
	    disabled: 'rgba(255, 255, 255, 0.3)',
	    disabledBackground: 'rgba(255, 255, 255, 0.12)',
	    disabledOpacity: 0.38,
	    focus: 'rgba(255, 255, 255, 0.12)',
	    focusOpacity: 0.12,
	    activatedOpacity: 0.24
	  }
	};
	function addLightOrDark(intent, direction, shade, tonalOffset) {
	  const tonalOffsetLight = tonalOffset.light || tonalOffset;
	  const tonalOffsetDark = tonalOffset.dark || tonalOffset * 1.5;
	  if (!intent[direction]) {
	    if (intent.hasOwnProperty(shade)) {
	      intent[direction] = intent[shade];
	    } else if (direction === 'light') {
	      intent.light = lighten_1(intent.main, tonalOffsetLight);
	    } else if (direction === 'dark') {
	      intent.dark = darken_1(intent.main, tonalOffsetDark);
	    }
	  }
	}
	function getDefaultPrimary(mode = 'light') {
	  if (mode === 'dark') {
	    return {
	      main: blue[200],
	      light: blue[50],
	      dark: blue[400]
	    };
	  }
	  return {
	    main: blue[700],
	    light: blue[400],
	    dark: blue[800]
	  };
	}
	function getDefaultSecondary(mode = 'light') {
	  if (mode === 'dark') {
	    return {
	      main: purple[200],
	      light: purple[50],
	      dark: purple[400]
	    };
	  }
	  return {
	    main: purple[500],
	    light: purple[300],
	    dark: purple[700]
	  };
	}
	function getDefaultError(mode = 'light') {
	  if (mode === 'dark') {
	    return {
	      main: red[500],
	      light: red[300],
	      dark: red[700]
	    };
	  }
	  return {
	    main: red[700],
	    light: red[400],
	    dark: red[800]
	  };
	}
	function getDefaultInfo(mode = 'light') {
	  if (mode === 'dark') {
	    return {
	      main: lightBlue[400],
	      light: lightBlue[300],
	      dark: lightBlue[700]
	    };
	  }
	  return {
	    main: lightBlue[700],
	    light: lightBlue[500],
	    dark: lightBlue[900]
	  };
	}
	function getDefaultSuccess(mode = 'light') {
	  if (mode === 'dark') {
	    return {
	      main: green[400],
	      light: green[300],
	      dark: green[700]
	    };
	  }
	  return {
	    main: green[800],
	    light: green[500],
	    dark: green[900]
	  };
	}
	function getDefaultWarning(mode = 'light') {
	  if (mode === 'dark') {
	    return {
	      main: orange[400],
	      light: orange[300],
	      dark: orange[700]
	    };
	  }
	  return {
	    main: '#ed6c02',
	    // closest to orange[800] that pass 3:1.
	    light: orange[500],
	    dark: orange[900]
	  };
	}
	function createPalette(palette) {
	  const {
	      mode = 'light',
	      contrastThreshold = 3,
	      tonalOffset = 0.2
	    } = palette,
	    other = _objectWithoutPropertiesLoose(palette, _excluded$6);
	  const primary = palette.primary || getDefaultPrimary(mode);
	  const secondary = palette.secondary || getDefaultSecondary(mode);
	  const error = palette.error || getDefaultError(mode);
	  const info = palette.info || getDefaultInfo(mode);
	  const success = palette.success || getDefaultSuccess(mode);
	  const warning = palette.warning || getDefaultWarning(mode);

	  // Use the same logic as
	  // Bootstrap: https://github.com/twbs/bootstrap/blob/1d6e3710dd447de1a200f29e8fa521f8a0908f70/scss/_functions.scss#L59
	  // and material-components-web https://github.com/material-components/material-components-web/blob/ac46b8863c4dab9fc22c4c662dc6bd1b65dd652f/packages/mdc-theme/_functions.scss#L54
	  function getContrastText(background) {
	    const contrastText = getContrastRatio_1(background, dark.text.primary) >= contrastThreshold ? dark.text.primary : light.text.primary;
	    return contrastText;
	  }
	  const augmentColor = ({
	    color,
	    name,
	    mainShade = 500,
	    lightShade = 300,
	    darkShade = 700
	  }) => {
	    color = _extends$1({}, color);
	    if (!color.main && color[mainShade]) {
	      color.main = color[mainShade];
	    }
	    if (!color.hasOwnProperty('main')) {
	      throw new Error(formatMuiErrorMessage$1(11, name ? ` (${name})` : '', mainShade));
	    }
	    if (typeof color.main !== 'string') {
	      throw new Error(formatMuiErrorMessage$1(12, name ? ` (${name})` : '', JSON.stringify(color.main)));
	    }
	    addLightOrDark(color, 'light', lightShade, tonalOffset);
	    addLightOrDark(color, 'dark', darkShade, tonalOffset);
	    if (!color.contrastText) {
	      color.contrastText = getContrastText(color.main);
	    }
	    return color;
	  };
	  const modes = {
	    dark,
	    light
	  };
	  const paletteOutput = deepmerge$1(_extends$1({
	    // A collection of common colors.
	    common: _extends$1({}, common),
	    // prevent mutable object.
	    // The palette mode, can be light or dark.
	    mode,
	    // The colors used to represent primary interface elements for a user.
	    primary: augmentColor({
	      color: primary,
	      name: 'primary'
	    }),
	    // The colors used to represent secondary interface elements for a user.
	    secondary: augmentColor({
	      color: secondary,
	      name: 'secondary',
	      mainShade: 'A400',
	      lightShade: 'A200',
	      darkShade: 'A700'
	    }),
	    // The colors used to represent interface elements that the user should be made aware of.
	    error: augmentColor({
	      color: error,
	      name: 'error'
	    }),
	    // The colors used to represent potentially dangerous actions or important messages.
	    warning: augmentColor({
	      color: warning,
	      name: 'warning'
	    }),
	    // The colors used to present information to the user that is neutral and not necessarily important.
	    info: augmentColor({
	      color: info,
	      name: 'info'
	    }),
	    // The colors used to indicate the successful completion of an action that user triggered.
	    success: augmentColor({
	      color: success,
	      name: 'success'
	    }),
	    // The grey colors.
	    grey,
	    // Used by `getContrastText()` to maximize the contrast between
	    // the background and the text.
	    contrastThreshold,
	    // Takes a background color and returns the text color that maximizes the contrast.
	    getContrastText,
	    // Generate a rich color object.
	    augmentColor,
	    // Used by the functions below to shift a color's luminance by approximately
	    // two indexes within its tonal palette.
	    // E.g., shift from Red 500 to Red 300 or Red 700.
	    tonalOffset
	  }, modes[mode]), other);
	  return paletteOutput;
	}

	const _excluded$5 = ["fontFamily", "fontSize", "fontWeightLight", "fontWeightRegular", "fontWeightMedium", "fontWeightBold", "htmlFontSize", "allVariants", "pxToRem"];
	function round(value) {
	  return Math.round(value * 1e5) / 1e5;
	}
	const caseAllCaps = {
	  textTransform: 'uppercase'
	};
	const defaultFontFamily = '"Roboto", "Helvetica", "Arial", sans-serif';

	/**
	 * @see @link{https://m2.material.io/design/typography/the-type-system.html}
	 * @see @link{https://m2.material.io/design/typography/understanding-typography.html}
	 */
	function createTypography(palette, typography) {
	  const _ref = typeof typography === 'function' ? typography(palette) : typography,
	    {
	      fontFamily = defaultFontFamily,
	      // The default font size of the Material Specification.
	      fontSize = 14,
	      // px
	      fontWeightLight = 300,
	      fontWeightRegular = 400,
	      fontWeightMedium = 500,
	      fontWeightBold = 700,
	      // Tell MUI what's the font-size on the html element.
	      // 16px is the default font-size used by browsers.
	      htmlFontSize = 16,
	      // Apply the CSS properties to all the variants.
	      allVariants,
	      pxToRem: pxToRem2
	    } = _ref,
	    other = _objectWithoutPropertiesLoose(_ref, _excluded$5);
	  const coef = fontSize / 14;
	  const pxToRem = pxToRem2 || (size => `${size / htmlFontSize * coef}rem`);
	  const buildVariant = (fontWeight, size, lineHeight, letterSpacing, casing) => _extends$1({
	    fontFamily,
	    fontWeight,
	    fontSize: pxToRem(size),
	    // Unitless following https://meyerweb.com/eric/thoughts/2006/02/08/unitless-line-heights/
	    lineHeight
	  }, fontFamily === defaultFontFamily ? {
	    letterSpacing: `${round(letterSpacing / size)}em`
	  } : {}, casing, allVariants);
	  const variants = {
	    h1: buildVariant(fontWeightLight, 96, 1.167, -1.5),
	    h2: buildVariant(fontWeightLight, 60, 1.2, -0.5),
	    h3: buildVariant(fontWeightRegular, 48, 1.167, 0),
	    h4: buildVariant(fontWeightRegular, 34, 1.235, 0.25),
	    h5: buildVariant(fontWeightRegular, 24, 1.334, 0),
	    h6: buildVariant(fontWeightMedium, 20, 1.6, 0.15),
	    subtitle1: buildVariant(fontWeightRegular, 16, 1.75, 0.15),
	    subtitle2: buildVariant(fontWeightMedium, 14, 1.57, 0.1),
	    body1: buildVariant(fontWeightRegular, 16, 1.5, 0.15),
	    body2: buildVariant(fontWeightRegular, 14, 1.43, 0.15),
	    button: buildVariant(fontWeightMedium, 14, 1.75, 0.4, caseAllCaps),
	    caption: buildVariant(fontWeightRegular, 12, 1.66, 0.4),
	    overline: buildVariant(fontWeightRegular, 12, 2.66, 1, caseAllCaps),
	    // TODO v6: Remove handling of 'inherit' variant from the theme as it is already handled in Material UI's Typography component. Also, remember to remove the associated types.
	    inherit: {
	      fontFamily: 'inherit',
	      fontWeight: 'inherit',
	      fontSize: 'inherit',
	      lineHeight: 'inherit',
	      letterSpacing: 'inherit'
	    }
	  };
	  return deepmerge$1(_extends$1({
	    htmlFontSize,
	    pxToRem,
	    fontFamily,
	    fontSize,
	    fontWeightLight,
	    fontWeightRegular,
	    fontWeightMedium,
	    fontWeightBold
	  }, variants), other, {
	    clone: false // No need to clone deep
	  });
	}

	const shadowKeyUmbraOpacity = 0.2;
	const shadowKeyPenumbraOpacity = 0.14;
	const shadowAmbientShadowOpacity = 0.12;
	function createShadow(...px) {
	  return [`${px[0]}px ${px[1]}px ${px[2]}px ${px[3]}px rgba(0,0,0,${shadowKeyUmbraOpacity})`, `${px[4]}px ${px[5]}px ${px[6]}px ${px[7]}px rgba(0,0,0,${shadowKeyPenumbraOpacity})`, `${px[8]}px ${px[9]}px ${px[10]}px ${px[11]}px rgba(0,0,0,${shadowAmbientShadowOpacity})`].join(',');
	}

	// Values from https://github.com/material-components/material-components-web/blob/be8747f94574669cb5e7add1a7c54fa41a89cec7/packages/mdc-elevation/_variables.scss
	const shadows = ['none', createShadow(0, 2, 1, -1, 0, 1, 1, 0, 0, 1, 3, 0), createShadow(0, 3, 1, -2, 0, 2, 2, 0, 0, 1, 5, 0), createShadow(0, 3, 3, -2, 0, 3, 4, 0, 0, 1, 8, 0), createShadow(0, 2, 4, -1, 0, 4, 5, 0, 0, 1, 10, 0), createShadow(0, 3, 5, -1, 0, 5, 8, 0, 0, 1, 14, 0), createShadow(0, 3, 5, -1, 0, 6, 10, 0, 0, 1, 18, 0), createShadow(0, 4, 5, -2, 0, 7, 10, 1, 0, 2, 16, 1), createShadow(0, 5, 5, -3, 0, 8, 10, 1, 0, 3, 14, 2), createShadow(0, 5, 6, -3, 0, 9, 12, 1, 0, 3, 16, 2), createShadow(0, 6, 6, -3, 0, 10, 14, 1, 0, 4, 18, 3), createShadow(0, 6, 7, -4, 0, 11, 15, 1, 0, 4, 20, 3), createShadow(0, 7, 8, -4, 0, 12, 17, 2, 0, 5, 22, 4), createShadow(0, 7, 8, -4, 0, 13, 19, 2, 0, 5, 24, 4), createShadow(0, 7, 9, -4, 0, 14, 21, 2, 0, 5, 26, 4), createShadow(0, 8, 9, -5, 0, 15, 22, 2, 0, 6, 28, 5), createShadow(0, 8, 10, -5, 0, 16, 24, 2, 0, 6, 30, 5), createShadow(0, 8, 11, -5, 0, 17, 26, 2, 0, 6, 32, 5), createShadow(0, 9, 11, -5, 0, 18, 28, 2, 0, 7, 34, 6), createShadow(0, 9, 12, -6, 0, 19, 29, 2, 0, 7, 36, 6), createShadow(0, 10, 13, -6, 0, 20, 31, 3, 0, 8, 38, 7), createShadow(0, 10, 13, -6, 0, 21, 33, 3, 0, 8, 40, 7), createShadow(0, 10, 14, -6, 0, 22, 35, 3, 0, 8, 42, 7), createShadow(0, 11, 14, -7, 0, 23, 36, 3, 0, 9, 44, 8), createShadow(0, 11, 15, -7, 0, 24, 38, 3, 0, 9, 46, 8)];

	const _excluded$4 = ["duration", "easing", "delay"];
	// Follow https://material.google.com/motion/duration-easing.html#duration-easing-natural-easing-curves
	// to learn the context in which each easing should be used.
	const easing = {
	  // This is the most common easing curve.
	  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
	  // Objects enter the screen at full velocity from off-screen and
	  // slowly decelerate to a resting point.
	  easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
	  // Objects leave the screen at full velocity. They do not decelerate when off-screen.
	  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
	  // The sharp curve is used by objects that may return to the screen at any time.
	  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
	};

	// Follow https://m2.material.io/guidelines/motion/duration-easing.html#duration-easing-common-durations
	// to learn when use what timing
	const duration = {
	  shortest: 150,
	  shorter: 200,
	  short: 250,
	  // most basic recommended timing
	  standard: 300,
	  // this is to be used in complex animations
	  complex: 375,
	  // recommended when something is entering screen
	  enteringScreen: 225,
	  // recommended when something is leaving screen
	  leavingScreen: 195
	};
	function formatMs(milliseconds) {
	  return `${Math.round(milliseconds)}ms`;
	}
	function getAutoHeightDuration(height) {
	  if (!height) {
	    return 0;
	  }
	  const constant = height / 36;

	  // https://www.wolframalpha.com/input/?i=(4+%2B+15+*+(x+%2F+36+)+**+0.25+%2B+(x+%2F+36)+%2F+5)+*+10
	  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
	}
	function createTransitions(inputTransitions) {
	  const mergedEasing = _extends$1({}, easing, inputTransitions.easing);
	  const mergedDuration = _extends$1({}, duration, inputTransitions.duration);
	  const create = (props = ['all'], options = {}) => {
	    const {
	        duration: durationOption = mergedDuration.standard,
	        easing: easingOption = mergedEasing.easeInOut,
	        delay = 0
	      } = options;
	      _objectWithoutPropertiesLoose(options, _excluded$4);
	    return (Array.isArray(props) ? props : [props]).map(animatedProp => `${animatedProp} ${typeof durationOption === 'string' ? durationOption : formatMs(durationOption)} ${easingOption} ${typeof delay === 'string' ? delay : formatMs(delay)}`).join(',');
	  };
	  return _extends$1({
	    getAutoHeightDuration,
	    create
	  }, inputTransitions, {
	    easing: mergedEasing,
	    duration: mergedDuration
	  });
	}

	// We need to centralize the zIndex definitions as they work
	// like global values in the browser.
	const zIndex = {
	  mobileStepper: 1000,
	  fab: 1050,
	  speedDial: 1050,
	  appBar: 1100,
	  drawer: 1200,
	  modal: 1300,
	  snackbar: 1400,
	  tooltip: 1500
	};

	const _excluded$3 = ["breakpoints", "mixins", "spacing", "palette", "transitions", "typography", "shape"];
	function createTheme(options = {}, ...args) {
	  const {
	      mixins: mixinsInput = {},
	      palette: paletteInput = {},
	      transitions: transitionsInput = {},
	      typography: typographyInput = {}
	    } = options,
	    other = _objectWithoutPropertiesLoose(options, _excluded$3);
	  if (options.vars) {
	    throw new Error(formatMuiErrorMessage$1(18));
	  }
	  const palette = createPalette(paletteInput);
	  const systemTheme = createTheme$2(options);
	  let muiTheme = deepmerge$1(systemTheme, {
	    mixins: createMixins(systemTheme.breakpoints, mixinsInput),
	    palette,
	    // Don't use [...shadows] until you've verified its transpiled code is not invoking the iterator protocol.
	    shadows: shadows.slice(),
	    typography: createTypography(palette, typographyInput),
	    transitions: createTransitions(transitionsInput),
	    zIndex: _extends$1({}, zIndex)
	  });
	  muiTheme = deepmerge$1(muiTheme, other);
	  muiTheme = args.reduce((acc, argument) => deepmerge$1(acc, argument), muiTheme);
	  muiTheme.unstable_sxConfig = _extends$1({}, defaultSxConfig, other == null ? void 0 : other.unstable_sxConfig);
	  muiTheme.unstable_sx = function sx(props) {
	    return styleFunctionSx$1({
	      sx: props,
	      theme: this
	    });
	  };
	  return muiTheme;
	}

	const defaultTheme = createTheme();

	var createStyled$1 = {};

	var _extends = {exports: {}};

	var hasRequired_extends;

	function require_extends () {
		if (hasRequired_extends) return _extends.exports;
		hasRequired_extends = 1;
		(function (module) {
			function _extends() {
			  return module.exports = _extends = Object.assign ? Object.assign.bind() : function (n) {
			    for (var e = 1; e < arguments.length; e++) {
			      var t = arguments[e];
			      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
			    }
			    return n;
			  }, module.exports.__esModule = true, module.exports["default"] = module.exports, _extends.apply(null, arguments);
			}
			module.exports = _extends, module.exports.__esModule = true, module.exports["default"] = module.exports; 
		} (_extends));
		return _extends.exports;
	}

	var objectWithoutPropertiesLoose = {exports: {}};

	var hasRequiredObjectWithoutPropertiesLoose;

	function requireObjectWithoutPropertiesLoose () {
		if (hasRequiredObjectWithoutPropertiesLoose) return objectWithoutPropertiesLoose.exports;
		hasRequiredObjectWithoutPropertiesLoose = 1;
		(function (module) {
			function _objectWithoutPropertiesLoose(r, e) {
			  if (null == r) return {};
			  var t = {};
			  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
			    if (-1 !== e.indexOf(n)) continue;
			    t[n] = r[n];
			  }
			  return t;
			}
			module.exports = _objectWithoutPropertiesLoose, module.exports.__esModule = true, module.exports["default"] = module.exports; 
		} (objectWithoutPropertiesLoose));
		return objectWithoutPropertiesLoose.exports;
	}

	var require$$3 = /*@__PURE__*/getAugmentedNamespace(styledEngine);

	var require$$4 = /*@__PURE__*/getAugmentedNamespace(deepmerge);

	var require$$5 = /*@__PURE__*/getAugmentedNamespace(capitalize);

	var require$$6 = /*@__PURE__*/getAugmentedNamespace(getDisplayName);

	var require$$7 = /*@__PURE__*/getAugmentedNamespace(createTheme$1);

	var require$$8 = /*@__PURE__*/getAugmentedNamespace(styleFunctionSx);

	var _interopRequireDefault$2 = interopRequireDefaultExports;
	Object.defineProperty(createStyled$1, "__esModule", {
	  value: true
	});
	var _default = createStyled$1.default = createStyled;
	createStyled$1.shouldForwardProp = shouldForwardProp;
	createStyled$1.systemDefaultTheme = void 0;
	var _extends2 = _interopRequireDefault$2(require_extends());
	var _objectWithoutPropertiesLoose2 = _interopRequireDefault$2(requireObjectWithoutPropertiesLoose());
	var _styledEngine = _interopRequireWildcard(require$$3);
	var _deepmerge = require$$4;
	_interopRequireDefault$2(require$$5);
	_interopRequireDefault$2(require$$6);
	var _createTheme = _interopRequireDefault$2(require$$7);
	var _styleFunctionSx = _interopRequireDefault$2(require$$8);
	const _excluded$2 = ["ownerState"],
	  _excluded2 = ["variants"],
	  _excluded3 = ["name", "slot", "skipVariantsResolver", "skipSx", "overridesResolver"];
	/* eslint-disable no-underscore-dangle */
	function _getRequireWildcardCache(e) {
	  if ("function" != typeof WeakMap) return null;
	  var r = new WeakMap(),
	    t = new WeakMap();
	  return (_getRequireWildcardCache = function (e) {
	    return e ? t : r;
	  })(e);
	}
	function _interopRequireWildcard(e, r) {
	  if (e && e.__esModule) return e;
	  if (null === e || "object" != typeof e && "function" != typeof e) return {
	    default: e
	  };
	  var t = _getRequireWildcardCache(r);
	  if (t && t.has(e)) return t.get(e);
	  var n = {
	      __proto__: null
	    },
	    a = Object.defineProperty && Object.getOwnPropertyDescriptor;
	  for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) {
	    var i = a ? Object.getOwnPropertyDescriptor(e, u) : null;
	    i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u];
	  }
	  return n.default = e, t && t.set(e, n), n;
	}
	function isEmpty(obj) {
	  return Object.keys(obj).length === 0;
	}

	// https://github.com/emotion-js/emotion/blob/26ded6109fcd8ca9875cc2ce4564fee678a3f3c5/packages/styled/src/utils.js#L40
	function isStringTag(tag) {
	  return typeof tag === 'string' &&
	  // 96 is one less than the char code
	  // for "a" so this is checking that
	  // it's a lowercase character
	  tag.charCodeAt(0) > 96;
	}

	// Update /system/styled/#api in case if this changes
	function shouldForwardProp(prop) {
	  return prop !== 'ownerState' && prop !== 'theme' && prop !== 'sx' && prop !== 'as';
	}
	const systemDefaultTheme = createStyled$1.systemDefaultTheme = (0, _createTheme.default)();
	const lowercaseFirstLetter = string => {
	  if (!string) {
	    return string;
	  }
	  return string.charAt(0).toLowerCase() + string.slice(1);
	};
	function resolveTheme({
	  defaultTheme,
	  theme,
	  themeId
	}) {
	  return isEmpty(theme) ? defaultTheme : theme[themeId] || theme;
	}
	function defaultOverridesResolver(slot) {
	  if (!slot) {
	    return null;
	  }
	  return (props, styles) => styles[slot];
	}
	function processStyleArg(callableStyle, _ref) {
	  let {
	      ownerState
	    } = _ref,
	    props = (0, _objectWithoutPropertiesLoose2.default)(_ref, _excluded$2);
	  const resolvedStylesArg = typeof callableStyle === 'function' ? callableStyle((0, _extends2.default)({
	    ownerState
	  }, props)) : callableStyle;
	  if (Array.isArray(resolvedStylesArg)) {
	    return resolvedStylesArg.flatMap(resolvedStyle => processStyleArg(resolvedStyle, (0, _extends2.default)({
	      ownerState
	    }, props)));
	  }
	  if (!!resolvedStylesArg && typeof resolvedStylesArg === 'object' && Array.isArray(resolvedStylesArg.variants)) {
	    const {
	        variants = []
	      } = resolvedStylesArg,
	      otherStyles = (0, _objectWithoutPropertiesLoose2.default)(resolvedStylesArg, _excluded2);
	    let result = otherStyles;
	    variants.forEach(variant => {
	      let isMatch = true;
	      if (typeof variant.props === 'function') {
	        isMatch = variant.props((0, _extends2.default)({
	          ownerState
	        }, props, ownerState));
	      } else {
	        Object.keys(variant.props).forEach(key => {
	          if ((ownerState == null ? void 0 : ownerState[key]) !== variant.props[key] && props[key] !== variant.props[key]) {
	            isMatch = false;
	          }
	        });
	      }
	      if (isMatch) {
	        if (!Array.isArray(result)) {
	          result = [result];
	        }
	        result.push(typeof variant.style === 'function' ? variant.style((0, _extends2.default)({
	          ownerState
	        }, props, ownerState)) : variant.style);
	      }
	    });
	    return result;
	  }
	  return resolvedStylesArg;
	}
	function createStyled(input = {}) {
	  const {
	    themeId,
	    defaultTheme = systemDefaultTheme,
	    rootShouldForwardProp = shouldForwardProp,
	    slotShouldForwardProp = shouldForwardProp
	  } = input;
	  const systemSx = props => {
	    return (0, _styleFunctionSx.default)((0, _extends2.default)({}, props, {
	      theme: resolveTheme((0, _extends2.default)({}, props, {
	        defaultTheme,
	        themeId
	      }))
	    }));
	  };
	  systemSx.__mui_systemSx = true;
	  return (tag, inputOptions = {}) => {
	    // Filter out the `sx` style function from the previous styled component to prevent unnecessary styles generated by the composite components.
	    (0, _styledEngine.internal_processStyles)(tag, styles => styles.filter(style => !(style != null && style.__mui_systemSx)));
	    const {
	        name: componentName,
	        slot: componentSlot,
	        skipVariantsResolver: inputSkipVariantsResolver,
	        skipSx: inputSkipSx,
	        // TODO v6: remove `lowercaseFirstLetter()` in the next major release
	        // For more details: https://github.com/mui/material-ui/pull/37908
	        overridesResolver = defaultOverridesResolver(lowercaseFirstLetter(componentSlot))
	      } = inputOptions,
	      options = (0, _objectWithoutPropertiesLoose2.default)(inputOptions, _excluded3);

	    // if skipVariantsResolver option is defined, take the value, otherwise, true for root and false for other slots.
	    const skipVariantsResolver = inputSkipVariantsResolver !== undefined ? inputSkipVariantsResolver :
	    // TODO v6: remove `Root` in the next major release
	    // For more details: https://github.com/mui/material-ui/pull/37908
	    componentSlot && componentSlot !== 'Root' && componentSlot !== 'root' || false;
	    const skipSx = inputSkipSx || false;
	    let label;
	    let shouldForwardPropOption = shouldForwardProp;

	    // TODO v6: remove `Root` in the next major release
	    // For more details: https://github.com/mui/material-ui/pull/37908
	    if (componentSlot === 'Root' || componentSlot === 'root') {
	      shouldForwardPropOption = rootShouldForwardProp;
	    } else if (componentSlot) {
	      // any other slot specified
	      shouldForwardPropOption = slotShouldForwardProp;
	    } else if (isStringTag(tag)) {
	      // for string (html) tag, preserve the behavior in emotion & styled-components.
	      shouldForwardPropOption = undefined;
	    }
	    const defaultStyledResolver = (0, _styledEngine.default)(tag, (0, _extends2.default)({
	      shouldForwardProp: shouldForwardPropOption,
	      label
	    }, options));
	    const transformStyleArg = stylesArg => {
	      // On the server Emotion doesn't use React.forwardRef for creating components, so the created
	      // component stays as a function. This condition makes sure that we do not interpolate functions
	      // which are basically components used as a selectors.
	      if (typeof stylesArg === 'function' && stylesArg.__emotion_real !== stylesArg || (0, _deepmerge.isPlainObject)(stylesArg)) {
	        return props => processStyleArg(stylesArg, (0, _extends2.default)({}, props, {
	          theme: resolveTheme({
	            theme: props.theme,
	            defaultTheme,
	            themeId
	          })
	        }));
	      }
	      return stylesArg;
	    };
	    const muiStyledResolver = (styleArg, ...expressions) => {
	      let transformedStyleArg = transformStyleArg(styleArg);
	      const expressionsWithDefaultTheme = expressions ? expressions.map(transformStyleArg) : [];
	      if (componentName && overridesResolver) {
	        expressionsWithDefaultTheme.push(props => {
	          const theme = resolveTheme((0, _extends2.default)({}, props, {
	            defaultTheme,
	            themeId
	          }));
	          if (!theme.components || !theme.components[componentName] || !theme.components[componentName].styleOverrides) {
	            return null;
	          }
	          const styleOverrides = theme.components[componentName].styleOverrides;
	          const resolvedStyleOverrides = {};
	          // TODO: v7 remove iteration and use `resolveStyleArg(styleOverrides[slot])` directly
	          Object.entries(styleOverrides).forEach(([slotKey, slotStyle]) => {
	            resolvedStyleOverrides[slotKey] = processStyleArg(slotStyle, (0, _extends2.default)({}, props, {
	              theme
	            }));
	          });
	          return overridesResolver(props, resolvedStyleOverrides);
	        });
	      }
	      if (componentName && !skipVariantsResolver) {
	        expressionsWithDefaultTheme.push(props => {
	          var _theme$components;
	          const theme = resolveTheme((0, _extends2.default)({}, props, {
	            defaultTheme,
	            themeId
	          }));
	          const themeVariants = theme == null || (_theme$components = theme.components) == null || (_theme$components = _theme$components[componentName]) == null ? void 0 : _theme$components.variants;
	          return processStyleArg({
	            variants: themeVariants
	          }, (0, _extends2.default)({}, props, {
	            theme
	          }));
	        });
	      }
	      if (!skipSx) {
	        expressionsWithDefaultTheme.push(systemSx);
	      }
	      const numOfCustomFnsApplied = expressionsWithDefaultTheme.length - expressions.length;
	      if (Array.isArray(styleArg) && numOfCustomFnsApplied > 0) {
	        const placeholders = new Array(numOfCustomFnsApplied).fill('');
	        // If the type is array, than we need to add placeholders in the template for the overrides, variants and the sx styles.
	        transformedStyleArg = [...styleArg, ...placeholders];
	        transformedStyleArg.raw = [...styleArg.raw, ...placeholders];
	      }
	      const Component = defaultStyledResolver(transformedStyleArg, ...expressionsWithDefaultTheme);
	      if (tag.muiName) {
	        Component.muiName = tag.muiName;
	      }
	      return Component;
	    };
	    if (defaultStyledResolver.withConfig) {
	      muiStyledResolver.withConfig = defaultStyledResolver.withConfig;
	    }
	    return muiStyledResolver;
	  };
	}

	// copied from @mui/system/createStyled
	function slotShouldForwardProp(prop) {
	  return prop !== 'ownerState' && prop !== 'theme' && prop !== 'sx' && prop !== 'as';
	}

	const rootShouldForwardProp = prop => slotShouldForwardProp(prop) && prop !== 'classes';

	const styled = _default({
	  themeId: THEME_ID,
	  defaultTheme,
	  rootShouldForwardProp
	});

	const _excluded$1 = ["theme"];
	function ThemeProvider(_ref) {
	  let {
	      theme: themeInput
	    } = _ref,
	    props = _objectWithoutPropertiesLoose(_ref, _excluded$1);
	  const scopedTheme = themeInput[THEME_ID];
	  return /*#__PURE__*/jsxRuntimeExports.jsx(ThemeProvider$1, _extends$1({}, props, {
	    themeId: scopedTheme ? THEME_ID : undefined,
	    theme: scopedTheme || themeInput
	  }));
	}

	function useDefaultProps(params) {
	  return useDefaultProps$1(params);
	}

	function GlobalStyles(props) {
	  return /*#__PURE__*/jsxRuntimeExports.jsx(GlobalStyles$1, _extends$1({}, props, {
	    defaultTheme: defaultTheme,
	    themeId: THEME_ID
	  }));
	}

	const html = (theme, enableColorScheme) => _extends$1({
	  WebkitFontSmoothing: 'antialiased',
	  // Antialiasing.
	  MozOsxFontSmoothing: 'grayscale',
	  // Antialiasing.
	  // Change from `box-sizing: content-box` so that `width`
	  // is not affected by `padding` or `border`.
	  boxSizing: 'border-box',
	  // Fix font resize problem in iOS
	  WebkitTextSizeAdjust: '100%'
	}, enableColorScheme && !theme.vars && {
	  colorScheme: theme.palette.mode
	});
	const body = theme => _extends$1({
	  color: (theme.vars || theme).palette.text.primary
	}, theme.typography.body1, {
	  backgroundColor: (theme.vars || theme).palette.background.default,
	  '@media print': {
	    // Save printer ink.
	    backgroundColor: (theme.vars || theme).palette.common.white
	  }
	});
	const styles = (theme, enableColorScheme = false) => {
	  var _theme$components;
	  const colorSchemeStyles = {};
	  if (enableColorScheme && theme.colorSchemes) {
	    Object.entries(theme.colorSchemes).forEach(([key, scheme]) => {
	      var _scheme$palette;
	      colorSchemeStyles[theme.getColorSchemeSelector(key).replace(/\s*&/, '')] = {
	        colorScheme: (_scheme$palette = scheme.palette) == null ? void 0 : _scheme$palette.mode
	      };
	    });
	  }
	  let defaultStyles = _extends$1({
	    html: html(theme, enableColorScheme),
	    '*, *::before, *::after': {
	      boxSizing: 'inherit'
	    },
	    'strong, b': {
	      fontWeight: theme.typography.fontWeightBold
	    },
	    body: _extends$1({
	      margin: 0
	    }, body(theme), {
	      // Add support for document.body.requestFullScreen().
	      // Other elements, if background transparent, are not supported.
	      '&::backdrop': {
	        backgroundColor: (theme.vars || theme).palette.background.default
	      }
	    })
	  }, colorSchemeStyles);
	  const themeOverrides = (_theme$components = theme.components) == null || (_theme$components = _theme$components.MuiCssBaseline) == null ? void 0 : _theme$components.styleOverrides;
	  if (themeOverrides) {
	    defaultStyles = [defaultStyles, themeOverrides];
	  }
	  return defaultStyles;
	};

	/**
	 * Kickstart an elegant, consistent, and simple baseline to build upon.
	 */
	function CssBaseline(inProps) {
	  const props = useDefaultProps({
	    props: inProps,
	    name: 'MuiCssBaseline'
	  });
	  const {
	    children,
	    enableColorScheme = false
	  } = props;
	  return /*#__PURE__*/jsxRuntimeExports.jsxs(React__namespace.Fragment, {
	    children: [/*#__PURE__*/jsxRuntimeExports.jsx(GlobalStyles, {
	      styles: theme => styles(theme, enableColorScheme)
	    }), children]
	  });
	}

	var Close = {};

	var createSvgIcon$1 = {};

	function getSvgIconUtilityClass(slot) {
	  return generateUtilityClass('MuiSvgIcon', slot);
	}
	generateUtilityClasses('MuiSvgIcon', ['root', 'colorPrimary', 'colorSecondary', 'colorAction', 'colorError', 'colorDisabled', 'fontSizeInherit', 'fontSizeSmall', 'fontSizeMedium', 'fontSizeLarge']);

	const _excluded = ["children", "className", "color", "component", "fontSize", "htmlColor", "inheritViewBox", "titleAccess", "viewBox"];
	const useUtilityClasses = ownerState => {
	  const {
	    color,
	    fontSize,
	    classes
	  } = ownerState;
	  const slots = {
	    root: ['root', color !== 'inherit' && `color${capitalize$1(color)}`, `fontSize${capitalize$1(fontSize)}`]
	  };
	  return composeClasses(slots, getSvgIconUtilityClass, classes);
	};
	const SvgIconRoot = styled('svg', {
	  name: 'MuiSvgIcon',
	  slot: 'Root',
	  overridesResolver: (props, styles) => {
	    const {
	      ownerState
	    } = props;
	    return [styles.root, ownerState.color !== 'inherit' && styles[`color${capitalize$1(ownerState.color)}`], styles[`fontSize${capitalize$1(ownerState.fontSize)}`]];
	  }
	})(({
	  theme,
	  ownerState
	}) => {
	  var _theme$transitions, _theme$transitions$cr, _theme$transitions2, _theme$typography, _theme$typography$pxT, _theme$typography2, _theme$typography2$px, _theme$typography3, _theme$typography3$px, _palette$ownerState$c, _palette, _palette2, _palette3;
	  return {
	    userSelect: 'none',
	    width: '1em',
	    height: '1em',
	    display: 'inline-block',
	    // the <svg> will define the property that has `currentColor`
	    // for example heroicons uses fill="none" and stroke="currentColor"
	    fill: ownerState.hasSvgAsChild ? undefined : 'currentColor',
	    flexShrink: 0,
	    transition: (_theme$transitions = theme.transitions) == null || (_theme$transitions$cr = _theme$transitions.create) == null ? void 0 : _theme$transitions$cr.call(_theme$transitions, 'fill', {
	      duration: (_theme$transitions2 = theme.transitions) == null || (_theme$transitions2 = _theme$transitions2.duration) == null ? void 0 : _theme$transitions2.shorter
	    }),
	    fontSize: {
	      inherit: 'inherit',
	      small: ((_theme$typography = theme.typography) == null || (_theme$typography$pxT = _theme$typography.pxToRem) == null ? void 0 : _theme$typography$pxT.call(_theme$typography, 20)) || '1.25rem',
	      medium: ((_theme$typography2 = theme.typography) == null || (_theme$typography2$px = _theme$typography2.pxToRem) == null ? void 0 : _theme$typography2$px.call(_theme$typography2, 24)) || '1.5rem',
	      large: ((_theme$typography3 = theme.typography) == null || (_theme$typography3$px = _theme$typography3.pxToRem) == null ? void 0 : _theme$typography3$px.call(_theme$typography3, 35)) || '2.1875rem'
	    }[ownerState.fontSize],
	    // TODO v5 deprecate, v6 remove for sx
	    color: (_palette$ownerState$c = (_palette = (theme.vars || theme).palette) == null || (_palette = _palette[ownerState.color]) == null ? void 0 : _palette.main) != null ? _palette$ownerState$c : {
	      action: (_palette2 = (theme.vars || theme).palette) == null || (_palette2 = _palette2.action) == null ? void 0 : _palette2.active,
	      disabled: (_palette3 = (theme.vars || theme).palette) == null || (_palette3 = _palette3.action) == null ? void 0 : _palette3.disabled,
	      inherit: undefined
	    }[ownerState.color]
	  };
	});
	const SvgIcon = /*#__PURE__*/React__namespace.forwardRef(function SvgIcon(inProps, ref) {
	  const props = useDefaultProps({
	    props: inProps,
	    name: 'MuiSvgIcon'
	  });
	  const {
	      children,
	      className,
	      color = 'inherit',
	      component = 'svg',
	      fontSize = 'medium',
	      htmlColor,
	      inheritViewBox = false,
	      titleAccess,
	      viewBox = '0 0 24 24'
	    } = props,
	    other = _objectWithoutPropertiesLoose(props, _excluded);
	  const hasSvgAsChild = /*#__PURE__*/ /*#__PURE__*/React__namespace.isValidElement(children) && children.type === 'svg';
	  const ownerState = _extends$1({}, props, {
	    color,
	    component,
	    fontSize,
	    instanceFontSize: inProps.fontSize,
	    inheritViewBox,
	    viewBox,
	    hasSvgAsChild
	  });
	  const more = {};
	  if (!inheritViewBox) {
	    more.viewBox = viewBox;
	  }
	  const classes = useUtilityClasses(ownerState);
	  return /*#__PURE__*/jsxRuntimeExports.jsxs(SvgIconRoot, _extends$1({
	    as: component,
	    className: clsx(classes.root, className),
	    focusable: "false",
	    color: htmlColor,
	    "aria-hidden": titleAccess ? undefined : true,
	    role: titleAccess ? 'img' : undefined,
	    ref: ref
	  }, more, other, hasSvgAsChild && children.props, {
	    ownerState: ownerState,
	    children: [hasSvgAsChild ? children.props.children : children, titleAccess ? /*#__PURE__*/jsxRuntimeExports.jsx("title", {
	      children: titleAccess
	    }) : null]
	  }));
	});
	SvgIcon.muiName = 'SvgIcon';

	function createSvgIcon(path, displayName) {
	  function Component(props, ref) {
	    return /*#__PURE__*/jsxRuntimeExports.jsx(SvgIcon, _extends$1({
	      "data-testid": `${displayName}Icon`,
	      ref: ref
	    }, props, {
	      children: path
	    }));
	  }
	  Component.muiName = SvgIcon.muiName;
	  return /*#__PURE__*/React__namespace.memo(/*#__PURE__*/React__namespace.forwardRef(Component));
	}

	// TODO: remove this export once ClassNameGenerator is stable
	// eslint-disable-next-line @typescript-eslint/naming-convention
	const unstable_ClassNameGenerator = {
	  configure: generator => {
	    ClassNameGenerator.configure(generator);
	  }
	};

	var utils = /*#__PURE__*/Object.freeze({
		__proto__: null,
		capitalize: capitalize$1,
		createChainedFunction: createChainedFunction,
		createSvgIcon: createSvgIcon,
		debounce: debounce,
		deprecatedPropType: deprecatedPropType,
		isMuiElement: isMuiElement,
		ownerDocument: ownerDocument,
		ownerWindow: ownerWindow,
		requirePropFactory: requirePropFactory,
		setRef: setRef,
		unstable_ClassNameGenerator: unstable_ClassNameGenerator,
		unstable_useEnhancedEffect: useEnhancedEffect,
		unstable_useId: useId,
		unsupportedProp: unsupportedProp,
		useControlled: useControlled,
		useEventCallback: useEventCallback,
		useForkRef: useForkRef,
		useIsFocusVisible: useIsFocusVisible
	});

	var require$$0 = /*@__PURE__*/getAugmentedNamespace(utils);

	var hasRequiredCreateSvgIcon;

	function requireCreateSvgIcon () {
		if (hasRequiredCreateSvgIcon) return createSvgIcon$1;
		hasRequiredCreateSvgIcon = 1;
		(function (exports) {
			'use client';

			Object.defineProperty(exports, "__esModule", {
			  value: true
			});
			Object.defineProperty(exports, "default", {
			  enumerable: true,
			  get: function () {
			    return _utils.createSvgIcon;
			  }
			});
			var _utils = require$$0; 
		} (createSvgIcon$1));
		return createSvgIcon$1;
	}

	var _interopRequireDefault$1 = interopRequireDefaultExports;
	Object.defineProperty(Close, "__esModule", {
	  value: true
	});
	var default_1$1 = Close.default = void 0;
	var _createSvgIcon$1 = _interopRequireDefault$1(requireCreateSvgIcon());
	var _jsxRuntime$1 = jsxRuntimeExports;
	default_1$1 = Close.default = (0, _createSvgIcon$1.default)(/*#__PURE__*/(0, _jsxRuntime$1.jsx)("path", {
	  d: "M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
	}), 'Close');

	function ChatHeader() {
	  return /*#__PURE__*/React.createElement(material.Box, {
	    sx: {
	      bgcolor: 'primary.main',
	      color: 'white',
	      px: 2,
	      py: 1.5,
	      display: 'flex',
	      justifyContent: 'space-between',
	      alignItems: 'center'
	    }
	  }, /*#__PURE__*/React.createElement(material.Typography, {
	    variant: "h6",
	    component: "div"
	  }, "AI\u30A2\u30B7\u30B9\u30BF\u30F3\u30C8"), /*#__PURE__*/React.createElement(material.IconButton, {
	    size: "small",
	    sx: {
	      color: 'white'
	    },
	    onClick: () => console.log('Close chat')
	  }, /*#__PURE__*/React.createElement(default_1$1, null)));
	}

	function MessageBubble({
	  type,
	  content
	}) {
	  const isBot = type === 'bot';
	  return /*#__PURE__*/React.createElement(material.Box, {
	    sx: {
	      display: 'flex',
	      justifyContent: isBot ? 'flex-start' : 'flex-end',
	      mb: 2,
	      maxWidth: '100%'
	    }
	  }, /*#__PURE__*/React.createElement(material.Paper, {
	    elevation: 1,
	    sx: {
	      p: 2,
	      maxWidth: '80%',
	      bgcolor: isBot ? 'grey.100' : 'primary.main',
	      color: isBot ? 'text.primary' : 'white',
	      borderRadius: 2,
	      borderTopLeftRadius: isBot ? 0 : 2,
	      borderTopRightRadius: isBot ? 2 : 0,
	      wordBreak: 'break-word'
	    }
	  }, /*#__PURE__*/React.createElement(material.Typography, {
	    variant: "body1",
	    sx: {
	      whiteSpace: 'pre-wrap',
	      lineHeight: 1.5
	    }
	  }, content)));
	}

	function ChatMessages({
	  messages
	}) {
	  return /*#__PURE__*/React.createElement(material.Box, {
	    sx: {
	      flex: 1,
	      overflow: 'auto',
	      p: 2,
	      display: 'flex',
	      flexDirection: 'column',
	      gap: 1,
	      '&::-webkit-scrollbar': {
	        width: '8px'
	      },
	      '&::-webkit-scrollbar-track': {
	        background: '#f1f1f1'
	      },
	      '&::-webkit-scrollbar-thumb': {
	        background: '#888',
	        borderRadius: '4px'
	      },
	      '&::-webkit-scrollbar-thumb:hover': {
	        background: '#555'
	      }
	    }
	  }, messages.map(message => /*#__PURE__*/React.createElement(MessageBubble, {
	    key: message.id,
	    type: message.type,
	    content: message.content
	  })));
	}

	var Send = {};

	var _interopRequireDefault = interopRequireDefaultExports;
	Object.defineProperty(Send, "__esModule", {
	  value: true
	});
	var default_1 = Send.default = void 0;
	var _createSvgIcon = _interopRequireDefault(requireCreateSvgIcon());
	var _jsxRuntime = jsxRuntimeExports;
	default_1 = Send.default = (0, _createSvgIcon.default)(/*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
	  d: "M2.01 21 23 12 2.01 3 2 10l15 2-15 2z"
	}), 'Send');

	function ChatInput({
	  onSendMessage
	}) {
	  const [message, setMessage] = React$1.useState('');
	  const handleSubmit = e => {
	    e.preventDefault();
	    if (message.trim()) {
	      onSendMessage(message);
	      setMessage('');
	    }
	  };
	  return /*#__PURE__*/React.createElement(material.Box, {
	    component: "form",
	    onSubmit: handleSubmit,
	    sx: {
	      p: 2,
	      borderTop: 1,
	      borderColor: 'divider',
	      display: 'flex',
	      gap: 1
	    }
	  }, /*#__PURE__*/React.createElement(material.TextField, {
	    fullWidth: true,
	    size: "small",
	    placeholder: "\u30E1\u30C3\u30BB\u30FC\u30B8\u3092\u5165\u529B...",
	    value: message,
	    onChange: e => setMessage(e.target.value),
	    sx: {
	      '& .MuiOutlinedInput-root': {
	        borderRadius: 2
	      }
	    }
	  }), /*#__PURE__*/React.createElement(material.IconButton, {
	    color: "primary",
	    type: "submit",
	    disabled: !message.trim()
	  }, /*#__PURE__*/React.createElement(default_1, null)));
	}

	// frontend/api.js

	const API_BASE_URL = 'https://aibookingbot-backend-235426778039.asia-northeast1.run.app';

	// APIリクエストの共通処理
	const fetchAPI = async (endpoint, options = {}) => {
	  try {
	    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
	      ...options,
	      headers: {
	        'Content-Type': 'application/json',
	        ...options.headers
	      }
	    });
	    if (!response.ok) {
	      const errorData = await response.json().catch(() => ({}));
	      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
	    }
	    const data = await response.json();
	    return data;
	  } catch (error) {
	    console.error('API Error:', error);
	    throw error;
	  }
	};

	// チャット関連のAPI

	const chatAPI = {
	  streamMessage: async (message, history = [], onChunk) => {
	    const response = await fetch(`${API_BASE_URL}/api/claude/message`, {
	      method: 'POST',
	      headers: {
	        'Content-Type': 'application/json'
	      },
	      body: JSON.stringify({
	        message,
	        history
	      })
	    });
	    const reader = response.body.getReader();
	    const decoder = new TextDecoder();
	    while (true) {
	      const {
	        value,
	        done
	      } = await reader.read();
	      if (done) break;
	      const chunk = decoder.decode(value);
	      const lines = chunk.split('\n');
	      for (const line of lines) {
	        if (line.startsWith('data: ')) {
	          const data = JSON.parse(line.slice(6));
	          onChunk(data);
	        }
	      }
	    }
	  }
	};

	// カレンダー関連のAPI
	const calendarAPI = {
	  // 利用可能な日時を取得
	  getAvailableSlots: (startDate, endDate) => fetchAPI('/api/calendar/slots', {
	    method: 'GET',
	    params: {
	      startDate,
	      endDate
	    }
	  }),
	  createReservation: reservationData => fetchAPI('/api/calendar/reservations', {
	    method: 'POST',
	    body: JSON.stringify(reservationData)
	  }),
	  // 新しく追加するメソッド
	  getReservations: (params = '') => fetchAPI(`/api/calendar/reservations${params ? `?${params}` : ''}`),
	  getReservationById: id => fetchAPI(`/api/calendar/reservations/${id}`),
	  // 予約ステータスの更新
	  updateReservationStatus: (id, status) => fetchAPI(`/api/calendar/reservations/${id}/status`, {
	    method: 'PUT',
	    body: JSON.stringify({
	      status
	    })
	  }),
	  // 予約情報の更新
	  updateReservation: (id, data) => fetchAPI(`/api/calendar/reservations/${id}`, {
	    method: 'PUT',
	    body: JSON.stringify(data)
	  })
	};

	// useAI.js// useAI.js
	function useAI() {
	  const [isProcessing, setIsProcessing] = React$1.useState(false);
	  const [showCalendar, setShowCalendar] = React$1.useState(false);
	  const [confirmationMode, setConfirmationMode] = React$1.useState(false);
	  const processMessage = async (message, history = [], onChunk) => {
	    setIsProcessing(true);
	    let completeResponse = '';
	    try {
	      await chatAPI.streamMessage(message, history, data => {
	        if (data.content) {
	          completeResponse += data.content;

	          // マーカーを除去して表示用テキストを生成
	          const displayContent = data.content.replace(/[$&]/g, '').trim();
	          if (displayContent) {
	            onChunk({
	              content: displayContent
	            });
	          }

	          // $ マーカーの検出（予約確認モード）
	          if (data.content.includes('$')) {
	            setConfirmationMode(true);
	          }

	          // & マーカーの検出（カレンダー表示）
	          if (data.content.includes('&') && confirmationMode) {
	            setShowCalendar(true);
	            setConfirmationMode(false);
	          }
	        }
	      });
	    } catch (error) {
	      console.error('Error:', error);
	    } finally {
	      setIsProcessing(false);
	    }
	  };
	  return {
	    processMessage,
	    isProcessing,
	    showCalendar,
	    setShowCalendar
	  };
	}

	const TIME_SLOTS = ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
	function CalendarView({
	  onClose,
	  onSelectDateTime
	}) {
	  const [selectedDate, setSelectedDate] = React$1.useState(null);
	  const [selectedTime, setSelectedTime] = React$1.useState(null);
	  const handleTimeSelect = time => {
	    setSelectedTime(time);
	  };
	  const handleConfirm = () => {
	    if (selectedDate && selectedTime) {
	      const dateStr = dateFns.format(selectedDate, 'yyyy年MM月dd日');
	      onSelectDateTime?.(`${dateStr} ${selectedTime}`);
	    }
	  };
	  return /*#__PURE__*/React.createElement(material.Box, {
	    sx: {
	      height: '100%',
	      display: 'flex',
	      flexDirection: 'column',
	      bgcolor: 'background.paper',
	      overflow: 'auto'
	    }
	  }, /*#__PURE__*/React.createElement(material.Box, {
	    sx: {
	      p: 2,
	      borderBottom: 1,
	      borderColor: 'divider'
	    }
	  }, /*#__PURE__*/React.createElement(material.Typography, {
	    variant: "h6"
	  }, "\u3054\u5E0C\u671B\u306E\u65E5\u6642\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044")), /*#__PURE__*/React.createElement(material.Box, {
	    sx: {
	      p: 2,
	      overflow: 'auto'
	    }
	  }, /*#__PURE__*/React.createElement(LocalizationProvider.LocalizationProvider, {
	    dateAdapter: AdapterDateFns.AdapterDateFns,
	    adapterLocale: locale.ja
	  }, /*#__PURE__*/React.createElement(material.Box, {
	    sx: {
	      display: 'flex',
	      justifyContent: 'center',
	      mb: 2
	    }
	  }, /*#__PURE__*/React.createElement(DateCalendar.DateCalendar, {
	    value: selectedDate,
	    onChange: newDate => setSelectedDate(newDate),
	    minDate: new Date(),
	    maxDate: dateFns.addDays(new Date(), 30),
	    disableHighlightToday: false,
	    sx: {
	      '& .MuiPickersCalendarHeader-root': {
	        mr: 0
	      },
	      '& .MuiDayCalendar-weekDayLabel': {
	        width: 32,
	        height: 32
	      },
	      '& .MuiPickersDay-root': {
	        width: 32,
	        height: 32
	      }
	    }
	  }))), selectedDate && /*#__PURE__*/React.createElement(material.Box, {
	    sx: {
	      mt: 2
	    }
	  }, /*#__PURE__*/React.createElement(material.Typography, {
	    variant: "subtitle1",
	    sx: {
	      mb: 2
	    }
	  }, dateFns.format(selectedDate, 'yyyy年MM月dd日'), "\u306E\u4E88\u7D04\u53EF\u80FD\u306A\u6642\u9593"), /*#__PURE__*/React.createElement(material.Stack, {
	    direction: "row",
	    spacing: 1,
	    flexWrap: "wrap",
	    sx: {
	      gap: 1
	    }
	  }, TIME_SLOTS.map(time => /*#__PURE__*/React.createElement(material.Button, {
	    key: time,
	    variant: selectedTime === time ? 'contained' : 'outlined',
	    onClick: () => handleTimeSelect(time),
	    size: "small",
	    sx: {
	      minWidth: '80px'
	    }
	  }, time))))), /*#__PURE__*/React.createElement(material.Box, {
	    sx: {
	      p: 2,
	      mt: 'auto',
	      borderTop: 1,
	      borderColor: 'divider',
	      bgcolor: 'background.paper'
	    }
	  }, /*#__PURE__*/React.createElement(material.Stack, {
	    direction: "row",
	    spacing: 2,
	    justifyContent: "flex-end"
	  }, /*#__PURE__*/React.createElement(material.Button, {
	    variant: "outlined",
	    onClick: onClose
	  }, "\u30AD\u30E3\u30F3\u30BB\u30EB"), /*#__PURE__*/React.createElement(material.Button, {
	    variant: "contained",
	    disabled: !selectedDate || !selectedTime,
	    onClick: handleConfirm
	  }, "\u4E88\u7D04\u3059\u308B"))));
	}

	function ReservationForm({
	  onSubmit,
	  onCancel
	}) {
	  const [formData, setFormData] = React$1.useState({
	    name: '',
	    email: '',
	    phone: '',
	    company: '',
	    message: ''
	  });
	  const [errors, setErrors] = React$1.useState({});
	  const handleChange = e => {
	    const {
	      name,
	      value
	    } = e.target;
	    setFormData(prev => ({
	      ...prev,
	      [name]: value
	    }));
	    // エラーをクリア
	    if (errors[name]) {
	      setErrors(prev => ({
	        ...prev,
	        [name]: ''
	      }));
	    }
	  };
	  const validateForm = () => {
	    const newErrors = {};
	    if (!formData.name.trim()) {
	      newErrors.name = 'お名前を入力してください';
	    }
	    if (!formData.email.trim()) {
	      newErrors.email = 'メールアドレスを入力してください';
	    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
	      newErrors.email = '有効なメールアドレスを入力してください';
	    }
	    if (!formData.phone.trim()) {
	      newErrors.phone = '電話番号を入力してください';
	    }
	    return newErrors;
	  };
	  const handleSubmit = e => {
	    e.preventDefault();
	    const newErrors = validateForm();
	    if (Object.keys(newErrors).length === 0) {
	      onSubmit(formData);
	    } else {
	      setErrors(newErrors);
	    }
	  };
	  return /*#__PURE__*/React.createElement(material.Box, {
	    component: "form",
	    onSubmit: handleSubmit,
	    sx: {
	      height: '100%',
	      display: 'flex',
	      flexDirection: 'column',
	      bgcolor: 'background.paper',
	      p: 2
	    }
	  }, /*#__PURE__*/React.createElement(material.Typography, {
	    variant: "h6",
	    sx: {
	      mb: 2
	    }
	  }, "\u4E88\u7D04\u60C5\u5831\u306E\u5165\u529B"), /*#__PURE__*/React.createElement(material.Stack, {
	    spacing: 2,
	    sx: {
	      flex: 1
	    }
	  }, /*#__PURE__*/React.createElement(material.TextField, {
	    label: "\u304A\u540D\u524D",
	    name: "name",
	    value: formData.name,
	    onChange: handleChange,
	    error: !!errors.name,
	    helperText: errors.name,
	    required: true
	  }), /*#__PURE__*/React.createElement(material.TextField, {
	    label: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9",
	    name: "email",
	    type: "email",
	    value: formData.email,
	    onChange: handleChange,
	    error: !!errors.email,
	    helperText: errors.email,
	    required: true
	  }), /*#__PURE__*/React.createElement(material.TextField, {
	    label: "\u96FB\u8A71\u756A\u53F7",
	    name: "phone",
	    value: formData.phone,
	    onChange: handleChange,
	    error: !!errors.phone,
	    helperText: errors.phone,
	    required: true
	  }), /*#__PURE__*/React.createElement(material.TextField, {
	    label: "\u4F1A\u793E\u540D",
	    name: "company",
	    value: formData.company,
	    onChange: handleChange
	  }), /*#__PURE__*/React.createElement(material.TextField, {
	    label: "\u3054\u8981\u671B\u30FB\u3054\u8CEA\u554F\u306A\u3069",
	    name: "message",
	    value: formData.message,
	    onChange: handleChange,
	    multiline: true,
	    rows: 4
	  })), /*#__PURE__*/React.createElement(material.Box, {
	    sx: {
	      mt: 3,
	      display: 'flex',
	      gap: 2,
	      justifyContent: 'flex-end'
	    }
	  }, /*#__PURE__*/React.createElement(material.Button, {
	    variant: "outlined",
	    onClick: onCancel
	  }, "\u30AD\u30E3\u30F3\u30BB\u30EB"), /*#__PURE__*/React.createElement(material.Button, {
	    type: "submit",
	    variant: "contained"
	  }, "\u4E88\u7D04\u3092\u78BA\u5B9A\u3059\u308B")));
	}

	function ChatWidget() {
	  const [messages, setMessages] = React$1.useState([{
	    id: 1,
	    type: 'bot',
	    content: '個別相談にご関心をお寄せいただきありがとうございます。\n具体的にどんなAIツールを作りたいと思われているか一言でお伝えください。'
	  }]);
	  const [showForm, setShowForm] = React$1.useState(false);
	  const [selectedDateTime, setSelectedDateTime] = React$1.useState(null);
	  const {
	    processMessage,
	    isProcessing,
	    showCalendar,
	    setShowCalendar,
	    error
	  } = useAI();
	  const handleSendMessage = async message => {
	    if (!message.trim()) return;

	    // ユーザーメッセージを追加
	    setMessages(prev => [...prev, {
	      id: prev.length + 1,
	      type: 'user',
	      content: message
	    }]);

	    // ボットの応答メッセージを追加（空の状態から開始）
	    setMessages(prev => [...prev, {
	      id: prev.length + 1,
	      type: 'bot',
	      content: ''
	    }]);

	    // 会話履歴の変換（初期メッセージも含める）
	    const history = messages.map(msg => ({
	      type: msg.type,
	      content: msg.content
	    }));

	    // ストリーミングレスポンスの処理
	    await processMessage(message, history, chunk => {
	      setMessages(prev => prev.map((msg, index) => {
	        // 最後のメッセージ（ボットの応答）を更新
	        if (index === prev.length - 1) {
	          return {
	            ...msg,
	            content: msg.content + chunk.content
	          };
	        }
	        return msg;
	      }));
	    });
	  };
	  const handleSelectDateTime = async dateTimeStr => {
	    try {
	      setSelectedDateTime(dateTimeStr);
	      setShowCalendar(false);
	      setShowForm(true);
	    } catch (error) {
	      console.error('Calendar selection error:', error);
	      setMessages(prev => [...prev, {
	        id: prev.length + 1,
	        type: 'bot',
	        content: '申し訳ありません。日時の選択中にエラーが発生しました。'
	      }]);
	    }
	  };
	  const handleFormSubmit = async formData => {
	    try {
	      // 日時文字列をDateオブジェクトに変換
	      const [datePart, timePart] = selectedDateTime.split(' ');
	      const [year, month, day] = datePart.replace('年', '-').replace('月', '-').replace('日', '').split('-');
	      const [hours, minutes] = timePart.split(':');
	      const dateObject = new Date(parseInt(year), parseInt(month) - 1,
	      // 月は0-based
	      parseInt(day), parseInt(hours), parseInt(minutes));

	      // 予約データの送信
	      const reservationData = {
	        clientId: undefined.VITE_DEFAULT_CLIENT_ID || 'default',
	        datetime: dateObject.toISOString(),
	        customerInfo: {
	          name: formData.name,
	          email: formData.email,
	          phone: formData.phone,
	          company: formData.company,
	          message: formData.message
	        }
	      };
	      console.log('Sending reservation data:', reservationData); // デバッグログ
	      await calendarAPI.createReservation(reservationData);
	      const confirmationMessage = `
  予約を承りました。
  
  日時：${selectedDateTime}
  お名前：${formData.name}
  メールアドレス：${formData.email}
  電話番号：${formData.phone}
  ${formData.company ? `会社名：${formData.company}\n` : ''}
  ${formData.message ? `ご要望：${formData.message}` : ''}
  
  ご予約の確認メールをお送りいたしましたので、ご確認ください。
  当日は担当者より改めてご連絡させていただきます。
  `;
	      setShowForm(false);
	      setMessages(prev => [...prev, {
	        id: prev.length + 1,
	        type: 'bot',
	        content: confirmationMessage
	      }]);
	    } catch (error) {
	      console.error('Reservation submission error:', error);
	      console.error('Error details:', error);
	      setMessages(prev => [...prev, {
	        id: prev.length + 1,
	        type: 'bot',
	        content: '申し訳ありません。予約の送信中にエラーが発生しました。'
	      }]);
	    }
	  };
	  return /*#__PURE__*/React.createElement(material.Paper, {
	    elevation: 3,
	    sx: {
	      position: 'fixed',
	      bottom: 20,
	      right: 20,
	      width: {
	        xs: 'calc(100% - 40px)',
	        sm: 400
	      },
	      height: {
	        xs: 'calc(100% - 40px)',
	        sm: 600
	      },
	      maxHeight: 'calc(100vh - 40px)',
	      display: 'flex',
	      flexDirection: 'column',
	      overflow: 'hidden',
	      borderRadius: 2
	    }
	  }, /*#__PURE__*/React.createElement(ChatHeader, null), /*#__PURE__*/React.createElement(material.Box, {
	    sx: {
	      position: 'relative',
	      flex: 1,
	      display: 'flex',
	      flexDirection: 'column',
	      minHeight: 0
	    }
	  }, /*#__PURE__*/React.createElement(material.Collapse, {
	    in: !!error
	  }, /*#__PURE__*/React.createElement(material.Alert, {
	    severity: "error",
	    sx: {
	      m: 1
	    }
	  }, error)), /*#__PURE__*/React.createElement(ChatMessages, {
	    messages: messages
	  }), isProcessing && /*#__PURE__*/React.createElement(material.Box, {
	    sx: {
	      position: 'absolute',
	      bottom: 0,
	      left: 0,
	      right: 0,
	      p: 2,
	      display: 'flex',
	      justifyContent: 'center',
	      background: 'rgba(255, 255, 255, 0.8)',
	      zIndex: 1
	    }
	  }, /*#__PURE__*/React.createElement(material.CircularProgress, {
	    size: 20
	  })), showCalendar && /*#__PURE__*/React.createElement(material.Box, {
	    sx: {
	      position: 'absolute',
	      top: 0,
	      left: 0,
	      right: 0,
	      bottom: 0,
	      bgcolor: 'background.paper',
	      zIndex: 2
	    }
	  }, /*#__PURE__*/React.createElement(CalendarView, {
	    onClose: () => setShowCalendar(false),
	    onSelectDateTime: handleSelectDateTime
	  })), showForm && /*#__PURE__*/React.createElement(material.Box, {
	    sx: {
	      position: 'absolute',
	      top: 0,
	      left: 0,
	      right: 0,
	      bottom: 0,
	      bgcolor: 'background.paper',
	      zIndex: 2
	    }
	  }, /*#__PURE__*/React.createElement(ReservationForm, {
	    onSubmit: handleFormSubmit,
	    onCancel: () => setShowForm(false)
	  }))), /*#__PURE__*/React.createElement(ChatInput, {
	    onSendMessage: handleSendMessage,
	    disabled: isProcessing || showCalendar || showForm
	  }));
	}

	const theme = createTheme({
	  typography: {
	    fontFamily: ['Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"',
	    // 日本語フォントを追加
	    '"Hiragino Kaku Gothic ProN"', '"Hiragino Sans"', 'Meiryo'].join(',')
	  },
	  palette: {
	    mode: 'light',
	    primary: {
	      main: '#FF6B2B'
	    }
	  }
	});
	function App({
	  clientId
	}) {
	  return /*#__PURE__*/React.createElement(ThemeProvider, {
	    theme: theme
	  }, /*#__PURE__*/React.createElement(CssBaseline, null), /*#__PURE__*/React.createElement(ChatWidget, {
	    clientId: clientId
	  }));
	}

	// widget/src/main.jsx
	const createWidget = () => {
	  if (typeof window === 'undefined') {
	    console.error('Window object not found');
	    return null;
	  }
	  const AIChatWidget = {
	    _initialized: false,
	    _version: '1.0.0',
	    _root: null,
	    init: async function (config = {}) {
	      console.log('Initialization started...', {
	        config
	      });
	      try {
	        // 既存のインスタンスのクリーンアップ
	        if (this._initialized) {
	          await this.destroy();
	        }
	        if (!window.React || !window.ReactDOM) {
	          throw new Error('Required dependencies not loaded');
	        }
	        if (!config.clientId) {
	          throw new Error('ClientId is required');
	        }
	        const container = this._prepareContainer();
	        this._root = window.ReactDOM.createRoot(container);
	        this._root.render(window.React.createElement(window.React.StrictMode, null, window.React.createElement(App, {
	          ...config
	        })));
	        this._initialized = true;
	        console.log('Widget initialized successfully');
	        return true;
	      } catch (error) {
	        console.error('Widget initialization failed:', error);
	        this._cleanup();
	        throw error;
	      }
	    },
	    _prepareContainer() {
	      const existingWidget = document.getElementById('ai-chat-widget');
	      if (existingWidget) {
	        existingWidget.remove();
	      }
	      const container = document.createElement('div');
	      container.id = 'ai-chat-widget';
	      document.body.appendChild(container);
	      return container;
	    },
	    _cleanup() {
	      if (this._root) {
	        try {
	          this._root.unmount();
	        } catch (e) {
	          console.error('Unmount failed:', e);
	        }
	        this._root = null;
	      }
	      const widget = document.getElementById('ai-chat-widget');
	      if (widget) {
	        widget.remove();
	      }
	      this._initialized = false;
	    },
	    destroy: function () {
	      console.log('Destroying widget...');
	      this._cleanup();
	      return true;
	    }
	  };

	  // グローバルオブジェクトへの割り当て
	  Object.defineProperty(window, 'AIChatWidget', {
	    value: AIChatWidget,
	    writable: false,
	    configurable: false
	  });
	  return AIChatWidget;
	};

	// 即時実行してウィジェットを作成
	const widget = createWidget();
	console.log('Widget created:', widget);

	return widget;

}));
