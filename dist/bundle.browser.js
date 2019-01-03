System.register(['react', 'moment'], function (exports, module) {
  'use strict';
  var createElement, Component, Fragment, moment;
  return {
    setters: [function (module) {
      createElement = module.createElement;
      Component = module.Component;
      Fragment = module.Fragment;
    }, function (module) {
      moment = module.default;
    }],
    execute: function () {

      var locationInput = function (props) {
          return props && props.value && (props.value.cityName || props.value.zip) ||
              (createElement("span", { style: { color: 'red' } }, "missing"));
      };

      /*! *****************************************************************************
      Copyright (c) Microsoft Corporation. All rights reserved.
      Licensed under the Apache License, Version 2.0 (the "License"); you may not use
      this file except in compliance with the License. You may obtain a copy of the
      License at http://www.apache.org/licenses/LICENSE-2.0

      THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
      KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
      WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
      MERCHANTABLITY OR NON-INFRINGEMENT.

      See the Apache Version 2.0 License for specific language governing permissions
      and limitations under the License.
      ***************************************************************************** */
      /* global Reflect, Promise */

      var extendStatics = function(d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };

      function __extends(d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      }

      var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

      function createCommonjsModule(fn, module) {
      	return module = { exports: {} }, fn(module, module.exports), module.exports;
      }

      var numeral = createCommonjsModule(function (module) {
      /*! @preserve
       * numeral.js
       * version : 2.0.6
       * author : Adam Draper
       * license : MIT
       * http://adamwdraper.github.com/Numeral-js/
       */

      (function (global, factory) {
          if (module.exports) {
              module.exports = factory();
          } else {
              global.numeral = factory();
          }
      }(commonjsGlobal, function () {
          /************************************
              Variables
          ************************************/

          var numeral,
              _,
              VERSION = '2.0.6',
              formats = {},
              locales = {},
              defaults = {
                  currentLocale: 'en',
                  zeroFormat: null,
                  nullFormat: null,
                  defaultFormat: '0,0',
                  scalePercentBy100: true
              },
              options = {
                  currentLocale: defaults.currentLocale,
                  zeroFormat: defaults.zeroFormat,
                  nullFormat: defaults.nullFormat,
                  defaultFormat: defaults.defaultFormat,
                  scalePercentBy100: defaults.scalePercentBy100
              };


          /************************************
              Constructors
          ************************************/

          // Numeral prototype object
          function Numeral(input, number) {
              this._input = input;

              this._value = number;
          }

          numeral = function(input) {
              var value,
                  kind,
                  unformatFunction,
                  regexp;

              if (numeral.isNumeral(input)) {
                  value = input.value();
              } else if (input === 0 || typeof input === 'undefined') {
                  value = 0;
              } else if (input === null || _.isNaN(input)) {
                  value = null;
              } else if (typeof input === 'string') {
                  if (options.zeroFormat && input === options.zeroFormat) {
                      value = 0;
                  } else if (options.nullFormat && input === options.nullFormat || !input.replace(/[^0-9]+/g, '').length) {
                      value = null;
                  } else {
                      for (kind in formats) {
                          regexp = typeof formats[kind].regexps.unformat === 'function' ? formats[kind].regexps.unformat() : formats[kind].regexps.unformat;

                          if (regexp && input.match(regexp)) {
                              unformatFunction = formats[kind].unformat;

                              break;
                          }
                      }

                      unformatFunction = unformatFunction || numeral._.stringToNumber;

                      value = unformatFunction(input);
                  }
              } else {
                  value = Number(input)|| null;
              }

              return new Numeral(input, value);
          };

          // version number
          numeral.version = VERSION;

          // compare numeral object
          numeral.isNumeral = function(obj) {
              return obj instanceof Numeral;
          };

          // helper functions
          numeral._ = _ = {
              // formats numbers separators, decimals places, signs, abbreviations
              numberToFormat: function(value, format, roundingFunction) {
                  var locale = locales[numeral.options.currentLocale],
                      negP = false,
                      optDec = false,
                      leadingCount = 0,
                      abbr = '',
                      trillion = 1000000000000,
                      billion = 1000000000,
                      million = 1000000,
                      thousand = 1000,
                      decimal = '',
                      neg = false,
                      abbrForce, // force abbreviation
                      abs,
                      int,
                      precision,
                      signed,
                      thousands,
                      output;

                  // make sure we never format a null value
                  value = value || 0;

                  abs = Math.abs(value);

                  // see if we should use parentheses for negative number or if we should prefix with a sign
                  // if both are present we default to parentheses
                  if (numeral._.includes(format, '(')) {
                      negP = true;
                      format = format.replace(/[\(|\)]/g, '');
                  } else if (numeral._.includes(format, '+') || numeral._.includes(format, '-')) {
                      signed = numeral._.includes(format, '+') ? format.indexOf('+') : value < 0 ? format.indexOf('-') : -1;
                      format = format.replace(/[\+|\-]/g, '');
                  }

                  // see if abbreviation is wanted
                  if (numeral._.includes(format, 'a')) {
                      abbrForce = format.match(/a(k|m|b|t)?/);

                      abbrForce = abbrForce ? abbrForce[1] : false;

                      // check for space before abbreviation
                      if (numeral._.includes(format, ' a')) {
                          abbr = ' ';
                      }

                      format = format.replace(new RegExp(abbr + 'a[kmbt]?'), '');

                      if (abs >= trillion && !abbrForce || abbrForce === 't') {
                          // trillion
                          abbr += locale.abbreviations.trillion;
                          value = value / trillion;
                      } else if (abs < trillion && abs >= billion && !abbrForce || abbrForce === 'b') {
                          // billion
                          abbr += locale.abbreviations.billion;
                          value = value / billion;
                      } else if (abs < billion && abs >= million && !abbrForce || abbrForce === 'm') {
                          // million
                          abbr += locale.abbreviations.million;
                          value = value / million;
                      } else if (abs < million && abs >= thousand && !abbrForce || abbrForce === 'k') {
                          // thousand
                          abbr += locale.abbreviations.thousand;
                          value = value / thousand;
                      }
                  }

                  // check for optional decimals
                  if (numeral._.includes(format, '[.]')) {
                      optDec = true;
                      format = format.replace('[.]', '.');
                  }

                  // break number and format
                  int = value.toString().split('.')[0];
                  precision = format.split('.')[1];
                  thousands = format.indexOf(',');
                  leadingCount = (format.split('.')[0].split(',')[0].match(/0/g) || []).length;

                  if (precision) {
                      if (numeral._.includes(precision, '[')) {
                          precision = precision.replace(']', '');
                          precision = precision.split('[');
                          decimal = numeral._.toFixed(value, (precision[0].length + precision[1].length), roundingFunction, precision[1].length);
                      } else {
                          decimal = numeral._.toFixed(value, precision.length, roundingFunction);
                      }

                      int = decimal.split('.')[0];

                      if (numeral._.includes(decimal, '.')) {
                          decimal = locale.delimiters.decimal + decimal.split('.')[1];
                      } else {
                          decimal = '';
                      }

                      if (optDec && Number(decimal.slice(1)) === 0) {
                          decimal = '';
                      }
                  } else {
                      int = numeral._.toFixed(value, 0, roundingFunction);
                  }

                  // check abbreviation again after rounding
                  if (abbr && !abbrForce && Number(int) >= 1000 && abbr !== locale.abbreviations.trillion) {
                      int = String(Number(int) / 1000);

                      switch (abbr) {
                          case locale.abbreviations.thousand:
                              abbr = locale.abbreviations.million;
                              break;
                          case locale.abbreviations.million:
                              abbr = locale.abbreviations.billion;
                              break;
                          case locale.abbreviations.billion:
                              abbr = locale.abbreviations.trillion;
                              break;
                      }
                  }


                  // format number
                  if (numeral._.includes(int, '-')) {
                      int = int.slice(1);
                      neg = true;
                  }

                  if (int.length < leadingCount) {
                      for (var i = leadingCount - int.length; i > 0; i--) {
                          int = '0' + int;
                      }
                  }

                  if (thousands > -1) {
                      int = int.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + locale.delimiters.thousands);
                  }

                  if (format.indexOf('.') === 0) {
                      int = '';
                  }

                  output = int + decimal + (abbr ? abbr : '');

                  if (negP) {
                      output = (negP && neg ? '(' : '') + output + (negP && neg ? ')' : '');
                  } else {
                      if (signed >= 0) {
                          output = signed === 0 ? (neg ? '-' : '+') + output : output + (neg ? '-' : '+');
                      } else if (neg) {
                          output = '-' + output;
                      }
                  }

                  return output;
              },
              // unformats numbers separators, decimals places, signs, abbreviations
              stringToNumber: function(string) {
                  var locale = locales[options.currentLocale],
                      stringOriginal = string,
                      abbreviations = {
                          thousand: 3,
                          million: 6,
                          billion: 9,
                          trillion: 12
                      },
                      abbreviation,
                      value,
                      regexp;

                  if (options.zeroFormat && string === options.zeroFormat) {
                      value = 0;
                  } else if (options.nullFormat && string === options.nullFormat || !string.replace(/[^0-9]+/g, '').length) {
                      value = null;
                  } else {
                      value = 1;

                      if (locale.delimiters.decimal !== '.') {
                          string = string.replace(/\./g, '').replace(locale.delimiters.decimal, '.');
                      }

                      for (abbreviation in abbreviations) {
                          regexp = new RegExp('[^a-zA-Z]' + locale.abbreviations[abbreviation] + '(?:\\)|(\\' + locale.currency.symbol + ')?(?:\\))?)?$');

                          if (stringOriginal.match(regexp)) {
                              value *= Math.pow(10, abbreviations[abbreviation]);
                              break;
                          }
                      }

                      // check for negative number
                      value *= (string.split('-').length + Math.min(string.split('(').length - 1, string.split(')').length - 1)) % 2 ? 1 : -1;

                      // remove non numbers
                      string = string.replace(/[^0-9\.]+/g, '');

                      value *= Number(string);
                  }

                  return value;
              },
              isNaN: function(value) {
                  return typeof value === 'number' && isNaN(value);
              },
              includes: function(string, search) {
                  return string.indexOf(search) !== -1;
              },
              insert: function(string, subString, start) {
                  return string.slice(0, start) + subString + string.slice(start);
              },
              reduce: function(array, callback /*, initialValue*/) {
                  if (this === null) {
                      throw new TypeError('Array.prototype.reduce called on null or undefined');
                  }

                  if (typeof callback !== 'function') {
                      throw new TypeError(callback + ' is not a function');
                  }

                  var t = Object(array),
                      len = t.length >>> 0,
                      k = 0,
                      value;

                  if (arguments.length === 3) {
                      value = arguments[2];
                  } else {
                      while (k < len && !(k in t)) {
                          k++;
                      }

                      if (k >= len) {
                          throw new TypeError('Reduce of empty array with no initial value');
                      }

                      value = t[k++];
                  }
                  for (; k < len; k++) {
                      if (k in t) {
                          value = callback(value, t[k], k, t);
                      }
                  }
                  return value;
              },
              /**
               * Computes the multiplier necessary to make x >= 1,
               * effectively eliminating miscalculations caused by
               * finite precision.
               */
              multiplier: function (x) {
                  var parts = x.toString().split('.');

                  return parts.length < 2 ? 1 : Math.pow(10, parts[1].length);
              },
              /**
               * Given a variable number of arguments, returns the maximum
               * multiplier that must be used to normalize an operation involving
               * all of them.
               */
              correctionFactor: function () {
                  var args = Array.prototype.slice.call(arguments);

                  return args.reduce(function(accum, next) {
                      var mn = _.multiplier(next);
                      return accum > mn ? accum : mn;
                  }, 1);
              },
              /**
               * Implementation of toFixed() that treats floats more like decimals
               *
               * Fixes binary rounding issues (eg. (0.615).toFixed(2) === '0.61') that present
               * problems for accounting- and finance-related software.
               */
              toFixed: function(value, maxDecimals, roundingFunction, optionals) {
                  var splitValue = value.toString().split('.'),
                      minDecimals = maxDecimals - (optionals || 0),
                      boundedPrecision,
                      optionalsRegExp,
                      power,
                      output;

                  // Use the smallest precision value possible to avoid errors from floating point representation
                  if (splitValue.length === 2) {
                    boundedPrecision = Math.min(Math.max(splitValue[1].length, minDecimals), maxDecimals);
                  } else {
                    boundedPrecision = minDecimals;
                  }

                  power = Math.pow(10, boundedPrecision);

                  // Multiply up by precision, round accurately, then divide and use native toFixed():
                  output = (roundingFunction(value + 'e+' + boundedPrecision) / power).toFixed(boundedPrecision);

                  if (optionals > maxDecimals - boundedPrecision) {
                      optionalsRegExp = new RegExp('\\.?0{1,' + (optionals - (maxDecimals - boundedPrecision)) + '}$');
                      output = output.replace(optionalsRegExp, '');
                  }

                  return output;
              }
          };

          // avaliable options
          numeral.options = options;

          // avaliable formats
          numeral.formats = formats;

          // avaliable formats
          numeral.locales = locales;

          // This function sets the current locale.  If
          // no arguments are passed in, it will simply return the current global
          // locale key.
          numeral.locale = function(key) {
              if (key) {
                  options.currentLocale = key.toLowerCase();
              }

              return options.currentLocale;
          };

          // This function provides access to the loaded locale data.  If
          // no arguments are passed in, it will simply return the current
          // global locale object.
          numeral.localeData = function(key) {
              if (!key) {
                  return locales[options.currentLocale];
              }

              key = key.toLowerCase();

              if (!locales[key]) {
                  throw new Error('Unknown locale : ' + key);
              }

              return locales[key];
          };

          numeral.reset = function() {
              for (var property in defaults) {
                  options[property] = defaults[property];
              }
          };

          numeral.zeroFormat = function(format) {
              options.zeroFormat = typeof(format) === 'string' ? format : null;
          };

          numeral.nullFormat = function (format) {
              options.nullFormat = typeof(format) === 'string' ? format : null;
          };

          numeral.defaultFormat = function(format) {
              options.defaultFormat = typeof(format) === 'string' ? format : '0.0';
          };

          numeral.register = function(type, name, format) {
              name = name.toLowerCase();

              if (this[type + 's'][name]) {
                  throw new TypeError(name + ' ' + type + ' already registered.');
              }

              this[type + 's'][name] = format;

              return format;
          };


          numeral.validate = function(val, culture) {
              var _decimalSep,
                  _thousandSep,
                  _currSymbol,
                  _valArray,
                  _abbrObj,
                  _thousandRegEx,
                  localeData,
                  temp;

              //coerce val to string
              if (typeof val !== 'string') {
                  val += '';

                  if (console.warn) {
                      console.warn('Numeral.js: Value is not string. It has been co-erced to: ', val);
                  }
              }

              //trim whitespaces from either sides
              val = val.trim();

              //if val is just digits return true
              if (!!val.match(/^\d+$/)) {
                  return true;
              }

              //if val is empty return false
              if (val === '') {
                  return false;
              }

              //get the decimal and thousands separator from numeral.localeData
              try {
                  //check if the culture is understood by numeral. if not, default it to current locale
                  localeData = numeral.localeData(culture);
              } catch (e) {
                  localeData = numeral.localeData(numeral.locale());
              }

              //setup the delimiters and currency symbol based on culture/locale
              _currSymbol = localeData.currency.symbol;
              _abbrObj = localeData.abbreviations;
              _decimalSep = localeData.delimiters.decimal;
              if (localeData.delimiters.thousands === '.') {
                  _thousandSep = '\\.';
              } else {
                  _thousandSep = localeData.delimiters.thousands;
              }

              // validating currency symbol
              temp = val.match(/^[^\d]+/);
              if (temp !== null) {
                  val = val.substr(1);
                  if (temp[0] !== _currSymbol) {
                      return false;
                  }
              }

              //validating abbreviation symbol
              temp = val.match(/[^\d]+$/);
              if (temp !== null) {
                  val = val.slice(0, -1);
                  if (temp[0] !== _abbrObj.thousand && temp[0] !== _abbrObj.million && temp[0] !== _abbrObj.billion && temp[0] !== _abbrObj.trillion) {
                      return false;
                  }
              }

              _thousandRegEx = new RegExp(_thousandSep + '{2}');

              if (!val.match(/[^\d.,]/g)) {
                  _valArray = val.split(_decimalSep);
                  if (_valArray.length > 2) {
                      return false;
                  } else {
                      if (_valArray.length < 2) {
                          return ( !! _valArray[0].match(/^\d+.*\d$/) && !_valArray[0].match(_thousandRegEx));
                      } else {
                          if (_valArray[0].length === 1) {
                              return ( !! _valArray[0].match(/^\d+$/) && !_valArray[0].match(_thousandRegEx) && !! _valArray[1].match(/^\d+$/));
                          } else {
                              return ( !! _valArray[0].match(/^\d+.*\d$/) && !_valArray[0].match(_thousandRegEx) && !! _valArray[1].match(/^\d+$/));
                          }
                      }
                  }
              }

              return false;
          };


          /************************************
              Numeral Prototype
          ************************************/

          numeral.fn = Numeral.prototype = {
              clone: function() {
                  return numeral(this);
              },
              format: function(inputString, roundingFunction) {
                  var value = this._value,
                      format = inputString || options.defaultFormat,
                      kind,
                      output,
                      formatFunction;

                  // make sure we have a roundingFunction
                  roundingFunction = roundingFunction || Math.round;

                  // format based on value
                  if (value === 0 && options.zeroFormat !== null) {
                      output = options.zeroFormat;
                  } else if (value === null && options.nullFormat !== null) {
                      output = options.nullFormat;
                  } else {
                      for (kind in formats) {
                          if (format.match(formats[kind].regexps.format)) {
                              formatFunction = formats[kind].format;

                              break;
                          }
                      }

                      formatFunction = formatFunction || numeral._.numberToFormat;

                      output = formatFunction(value, format, roundingFunction);
                  }

                  return output;
              },
              value: function() {
                  return this._value;
              },
              input: function() {
                  return this._input;
              },
              set: function(value) {
                  this._value = Number(value);

                  return this;
              },
              add: function(value) {
                  var corrFactor = _.correctionFactor.call(null, this._value, value);

                  function cback(accum, curr, currI, O) {
                      return accum + Math.round(corrFactor * curr);
                  }

                  this._value = _.reduce([this._value, value], cback, 0) / corrFactor;

                  return this;
              },
              subtract: function(value) {
                  var corrFactor = _.correctionFactor.call(null, this._value, value);

                  function cback(accum, curr, currI, O) {
                      return accum - Math.round(corrFactor * curr);
                  }

                  this._value = _.reduce([value], cback, Math.round(this._value * corrFactor)) / corrFactor;

                  return this;
              },
              multiply: function(value) {
                  function cback(accum, curr, currI, O) {
                      var corrFactor = _.correctionFactor(accum, curr);
                      return Math.round(accum * corrFactor) * Math.round(curr * corrFactor) / Math.round(corrFactor * corrFactor);
                  }

                  this._value = _.reduce([this._value, value], cback, 1);

                  return this;
              },
              divide: function(value) {
                  function cback(accum, curr, currI, O) {
                      var corrFactor = _.correctionFactor(accum, curr);
                      return Math.round(accum * corrFactor) / Math.round(curr * corrFactor);
                  }

                  this._value = _.reduce([this._value, value], cback);

                  return this;
              },
              difference: function(value) {
                  return Math.abs(numeral(this._value).subtract(value).value());
              }
          };

          /************************************
              Default Locale && Format
          ************************************/

          numeral.register('locale', 'en', {
              delimiters: {
                  thousands: ',',
                  decimal: '.'
              },
              abbreviations: {
                  thousand: 'k',
                  million: 'm',
                  billion: 'b',
                  trillion: 't'
              },
              ordinal: function(number) {
                  var b = number % 10;
                  return (~~(number % 100 / 10) === 1) ? 'th' :
                      (b === 1) ? 'st' :
                      (b === 2) ? 'nd' :
                      (b === 3) ? 'rd' : 'th';
              },
              currency: {
                  symbol: '$'
              }
          });

          

      (function() {
              numeral.register('format', 'bps', {
                  regexps: {
                      format: /(BPS)/,
                      unformat: /(BPS)/
                  },
                  format: function(value, format, roundingFunction) {
                      var space = numeral._.includes(format, ' BPS') ? ' ' : '',
                          output;

                      value = value * 10000;

                      // check for space before BPS
                      format = format.replace(/\s?BPS/, '');

                      output = numeral._.numberToFormat(value, format, roundingFunction);

                      if (numeral._.includes(output, ')')) {
                          output = output.split('');

                          output.splice(-1, 0, space + 'BPS');

                          output = output.join('');
                      } else {
                          output = output + space + 'BPS';
                      }

                      return output;
                  },
                  unformat: function(string) {
                      return +(numeral._.stringToNumber(string) * 0.0001).toFixed(15);
                  }
              });
      })();


      (function() {
              var decimal = {
                  base: 1000,
                  suffixes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
              },
              binary = {
                  base: 1024,
                  suffixes: ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
              };

          var allSuffixes =  decimal.suffixes.concat(binary.suffixes.filter(function (item) {
                  return decimal.suffixes.indexOf(item) < 0;
              }));
              var unformatRegex = allSuffixes.join('|');
              // Allow support for BPS (http://www.investopedia.com/terms/b/basispoint.asp)
              unformatRegex = '(' + unformatRegex.replace('B', 'B(?!PS)') + ')';

          numeral.register('format', 'bytes', {
              regexps: {
                  format: /([0\s]i?b)/,
                  unformat: new RegExp(unformatRegex)
              },
              format: function(value, format, roundingFunction) {
                  var output,
                      bytes = numeral._.includes(format, 'ib') ? binary : decimal,
                      suffix = numeral._.includes(format, ' b') || numeral._.includes(format, ' ib') ? ' ' : '',
                      power,
                      min,
                      max;

                  // check for space before
                  format = format.replace(/\s?i?b/, '');

                  for (power = 0; power <= bytes.suffixes.length; power++) {
                      min = Math.pow(bytes.base, power);
                      max = Math.pow(bytes.base, power + 1);

                      if (value === null || value === 0 || value >= min && value < max) {
                          suffix += bytes.suffixes[power];

                          if (min > 0) {
                              value = value / min;
                          }

                          break;
                      }
                  }

                  output = numeral._.numberToFormat(value, format, roundingFunction);

                  return output + suffix;
              },
              unformat: function(string) {
                  var value = numeral._.stringToNumber(string),
                      power,
                      bytesMultiplier;

                  if (value) {
                      for (power = decimal.suffixes.length - 1; power >= 0; power--) {
                          if (numeral._.includes(string, decimal.suffixes[power])) {
                              bytesMultiplier = Math.pow(decimal.base, power);

                              break;
                          }

                          if (numeral._.includes(string, binary.suffixes[power])) {
                              bytesMultiplier = Math.pow(binary.base, power);

                              break;
                          }
                      }

                      value *= (bytesMultiplier || 1);
                  }

                  return value;
              }
          });
      })();


      (function() {
              numeral.register('format', 'currency', {
              regexps: {
                  format: /(\$)/
              },
              format: function(value, format, roundingFunction) {
                  var locale = numeral.locales[numeral.options.currentLocale],
                      symbols = {
                          before: format.match(/^([\+|\-|\(|\s|\$]*)/)[0],
                          after: format.match(/([\+|\-|\)|\s|\$]*)$/)[0]
                      },
                      output,
                      symbol,
                      i;

                  // strip format of spaces and $
                  format = format.replace(/\s?\$\s?/, '');

                  // format the number
                  output = numeral._.numberToFormat(value, format, roundingFunction);

                  // update the before and after based on value
                  if (value >= 0) {
                      symbols.before = symbols.before.replace(/[\-\(]/, '');
                      symbols.after = symbols.after.replace(/[\-\)]/, '');
                  } else if (value < 0 && (!numeral._.includes(symbols.before, '-') && !numeral._.includes(symbols.before, '('))) {
                      symbols.before = '-' + symbols.before;
                  }

                  // loop through each before symbol
                  for (i = 0; i < symbols.before.length; i++) {
                      symbol = symbols.before[i];

                      switch (symbol) {
                          case '$':
                              output = numeral._.insert(output, locale.currency.symbol, i);
                              break;
                          case ' ':
                              output = numeral._.insert(output, ' ', i + locale.currency.symbol.length - 1);
                              break;
                      }
                  }

                  // loop through each after symbol
                  for (i = symbols.after.length - 1; i >= 0; i--) {
                      symbol = symbols.after[i];

                      switch (symbol) {
                          case '$':
                              output = i === symbols.after.length - 1 ? output + locale.currency.symbol : numeral._.insert(output, locale.currency.symbol, -(symbols.after.length - (1 + i)));
                              break;
                          case ' ':
                              output = i === symbols.after.length - 1 ? output + ' ' : numeral._.insert(output, ' ', -(symbols.after.length - (1 + i) + locale.currency.symbol.length - 1));
                              break;
                      }
                  }


                  return output;
              }
          });
      })();


      (function() {
              numeral.register('format', 'exponential', {
              regexps: {
                  format: /(e\+|e-)/,
                  unformat: /(e\+|e-)/
              },
              format: function(value, format, roundingFunction) {
                  var output,
                      exponential = typeof value === 'number' && !numeral._.isNaN(value) ? value.toExponential() : '0e+0',
                      parts = exponential.split('e');

                  format = format.replace(/e[\+|\-]{1}0/, '');

                  output = numeral._.numberToFormat(Number(parts[0]), format, roundingFunction);

                  return output + 'e' + parts[1];
              },
              unformat: function(string) {
                  var parts = numeral._.includes(string, 'e+') ? string.split('e+') : string.split('e-'),
                      value = Number(parts[0]),
                      power = Number(parts[1]);

                  power = numeral._.includes(string, 'e-') ? power *= -1 : power;

                  function cback(accum, curr, currI, O) {
                      var corrFactor = numeral._.correctionFactor(accum, curr),
                          num = (accum * corrFactor) * (curr * corrFactor) / (corrFactor * corrFactor);
                      return num;
                  }

                  return numeral._.reduce([value, Math.pow(10, power)], cback, 1);
              }
          });
      })();


      (function() {
              numeral.register('format', 'ordinal', {
              regexps: {
                  format: /(o)/
              },
              format: function(value, format, roundingFunction) {
                  var locale = numeral.locales[numeral.options.currentLocale],
                      output,
                      ordinal = numeral._.includes(format, ' o') ? ' ' : '';

                  // check for space before
                  format = format.replace(/\s?o/, '');

                  ordinal += locale.ordinal(value);

                  output = numeral._.numberToFormat(value, format, roundingFunction);

                  return output + ordinal;
              }
          });
      })();


      (function() {
              numeral.register('format', 'percentage', {
              regexps: {
                  format: /(%)/,
                  unformat: /(%)/
              },
              format: function(value, format, roundingFunction) {
                  var space = numeral._.includes(format, ' %') ? ' ' : '',
                      output;

                  if (numeral.options.scalePercentBy100) {
                      value = value * 100;
                  }

                  // check for space before %
                  format = format.replace(/\s?\%/, '');

                  output = numeral._.numberToFormat(value, format, roundingFunction);

                  if (numeral._.includes(output, ')')) {
                      output = output.split('');

                      output.splice(-1, 0, space + '%');

                      output = output.join('');
                  } else {
                      output = output + space + '%';
                  }

                  return output;
              },
              unformat: function(string) {
                  var number = numeral._.stringToNumber(string);
                  if (numeral.options.scalePercentBy100) {
                      return number * 0.01;
                  }
                  return number;
              }
          });
      })();


      (function() {
              numeral.register('format', 'time', {
              regexps: {
                  format: /(:)/,
                  unformat: /(:)/
              },
              format: function(value, format, roundingFunction) {
                  var hours = Math.floor(value / 60 / 60),
                      minutes = Math.floor((value - (hours * 60 * 60)) / 60),
                      seconds = Math.round(value - (hours * 60 * 60) - (minutes * 60));

                  return hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
              },
              unformat: function(string) {
                  var timeArray = string.split(':'),
                      seconds = 0;

                  // turn hours and minutes into seconds and add them all up
                  if (timeArray.length === 3) {
                      // hours
                      seconds = seconds + (Number(timeArray[0]) * 60 * 60);
                      // minutes
                      seconds = seconds + (Number(timeArray[1]) * 60);
                      // seconds
                      seconds = seconds + Number(timeArray[2]);
                  } else if (timeArray.length === 2) {
                      // minutes
                      seconds = seconds + (Number(timeArray[0]) * 60);
                      // seconds
                      seconds = seconds + Number(timeArray[1]);
                  }
                  return Number(seconds);
              }
          });
      })();

      return numeral;
      }));
      });

      function styleInject(css, ref) {
        if ( ref === void 0 ) ref = {};
        var insertAt = ref.insertAt;

        if (!css || typeof document === 'undefined') { return; }

        var head = document.head || document.getElementsByTagName('head')[0];
        var style = document.createElement('style');
        style.type = 'text/css';

        if (insertAt === 'top') {
          if (head.firstChild) {
            head.insertBefore(style, head.firstChild);
          } else {
            head.appendChild(style);
          }
        } else {
          head.appendChild(style);
        }

        if (style.styleSheet) {
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(document.createTextNode(css));
        }
      }

      var css = ".WeatherConditionsPerDay .date-header {\n  font-weight: bold;\n  font-size: 120%; }\n\n.WeatherConditionsPerDay .condition-list {\n  display: grid;\n  grid-template-columns: -webkit-max-content 2.5em 2.7em 11em;\n  grid-template-columns: max-content 2.5em 2.7em 11em;\n  margin-left: 12px; }\n  .WeatherConditionsPerDay .condition-list .time {\n    text-align: right; }\n  .WeatherConditionsPerDay .condition-list .icon {\n    text-align: center;\n    margin-left: 10px; }\n  .WeatherConditionsPerDay .condition-list .temp {\n    text-align: right;\n    margin-right: 10px; }\n";
      styleInject(css);

      var styleSheetInjected = false;
      var injectStyleSheet = function () {
          if (styleSheetInjected) {
              return;
          }
          styleSheetInjected = true;
          var head = document.head || document.getElementsByTagName('head')[0];
          if (head) {
              var style = document.createElement('link');
              style.rel = 'stylesheet';
              style.href = '/modules/reactron-openweathermap/public/css/weather-icons.min.css';
              head.appendChild(style);
          }
      };
      var WeatherIcon = /** @class */ (function (_super) {
          __extends(WeatherIcon, _super);
          function WeatherIcon() {
              return _super !== null && _super.apply(this, arguments) || this;
          }
          WeatherIcon.prototype.componentDidMount = function () {
              injectStyleSheet();
          };
          WeatherIcon.prototype.render = function () {
              var dayOrNight = this.props.night ? 'night' : 'day';
              var iconClassName = 'wi wi-owm-' + dayOrNight + '-' + this.props.weatherId;
              return createElement("i", { className: iconClassName });
          };
          return WeatherIcon;
      }(Component));

      var WeatherConditionsPerDay = /** @class */ (function (_super) {
          __extends(WeatherConditionsPerDay, _super);
          function WeatherConditionsPerDay() {
              return _super !== null && _super.apply(this, arguments) || this;
          }
          WeatherConditionsPerDay.prototype.render = function () {
              var _this = this;
              var timeFormat = this.props.timeFormat || 'LT';
              return (createElement("section", { className: "WeatherConditionsPerDay" },
                  createElement("span", { className: "date-header", hidden: !this.props.showDateHeader }, this.props.localDateString),
                  createElement("div", { className: "condition-list" }, this.props.conditions.map(function (c) {
                      var time = moment.utc(c.dt_txt).tz(_this.props.timezone);
                      var night = c.weather_icon.endsWith('n');
                      // const rain = Math.round(c.rain * 100) / 100;
                      // const snow = Math.round(c.snow * 100) / 100;
                      return (createElement(Fragment, { key: c.dt },
                          createElement("span", { className: "time" }, time.format(timeFormat)),
                          createElement("span", { className: "icon" },
                              createElement(WeatherIcon, { weatherId: c.weather_id, night: night })),
                          createElement("span", { className: "temp" }, numeral(c.temp).format('0.0')),
                          createElement("span", null, c.weather_description)));
                  }))));
          };
          return WeatherConditionsPerDay;
      }(Component));

      var css$1 = ".WeatherForecast .header {\n  border-bottom: 1px solid;\n  margin-bottom: 10px; }\n\n.WeatherForecast .shadow {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  box-shadow: inset 0px -150px 150px -100px #000; }\n";
      styleInject(css$1);

      var WeatherForecast = exports('WeatherForecast', /** @class */ (function (_super) {
          __extends(WeatherForecast, _super);
          function WeatherForecast(props) {
              var _this = _super.call(this, props) || this;
              _this.state = {};
              return _this;
          }
          WeatherForecast.prototype.componentDidMount = function () {
              this.loadWeatherData();
              // TODO: subscribe refresh
          };
          WeatherForecast.prototype.componentDidUpdate = function (prevProps) {
              if (JSON.stringify(this.props) !== JSON.stringify(prevProps)) {
                  this.loadWeatherData();
              }
          };
          WeatherForecast.prototype.componentWillUnmount = function () {
              // TODO: unsubscribe refresh
          };
          WeatherForecast.prototype.loadWeatherData = function () {
              var _this = this;
              var weatherService = this.context.getService('WeatherService');
              if (weatherService) {
                  weatherService.getFiveDaysForecast(this.props.location)
                      .then(function (response) { return _this.setState({ weatherForecast: response }); })
                      .catch(function (error) { return _this.setState({ error: error }); });
              }
          };
          WeatherForecast.prototype.renderForecast = function () {
              var _this = this;
              if (!this.state.weatherForecast) {
                  return;
              }
              var timezone = this.context.settings.timezone;
              var today = moment().tz(timezone);
              var forecastDays = Math.max(this.props.forecastDays, 1);
              var days = {};
              // group by date
              this.state.weatherForecast.list.forEach(function (item) {
                  var localDate = moment.utc(item.dt_txt).tz(timezone);
                  if (localDate.diff(today, 'days', true) > forecastDays) {
                      return;
                  }
                  var localDateString = localDate.format('L');
                  if (!days[localDateString]) {
                      days[localDateString] = [];
                  }
                  days[localDateString].push(item);
              });
              return (createElement(Fragment, null, Object.keys(days).map(function (dateString) {
                  return createElement(WeatherConditionsPerDay, { key: dateString, localDateString: dateString, conditions: days[dateString], timezone: timezone, showDateHeader: _this.props.showDateHeader, timeFormat: _this.props.timeFormat });
              })));
          };
          WeatherForecast.prototype.render = function () {
              if (this.state.error) {
                  return 'Error: ' + this.state.error;
              }
              if (!this.state.weatherForecast) {
                  return this.context.renderLoading('Loading weather...');
              }
              return (createElement("section", { className: "WeatherForecast" },
                  createElement("div", { className: "shadow", hidden: !this.props.showShadow }),
                  createElement("div", { className: "header", hidden: !this.props.showHeader },
                      "Weather forecast for ",
                      this.state.weatherForecast.city.name,
                      ", ",
                      this.state.weatherForecast.city.country),
                  this.renderForecast()));
          };
          return WeatherForecast;
      }(Component)));

      var components = exports('components', [{
              component: WeatherForecast,
              description: 'Weather Forecast by OpenWeatherMap',
              displayName: 'Weather Forecast',
              fields: [{
                      description: 'Location',
                      displayName: 'Location',
                      name: 'location',
                      valueType: 'object',
                      fields: [{
                              description: 'City Name',
                              displayName: 'City Name',
                              name: 'cityName',
                              valueType: 'string'
                          }, {
                              description: 'Zip, Country Code',
                              displayName: 'Zip, Country Code',
                              name: 'zip',
                              valueType: 'string'
                              // }, {
                              //     description: 'Coordinates',
                              //     displayName: 'Coordinates',
                              //     name: 'coords',
                              //     valueType: 'object',
                              //     fields: [{
                              //         description: 'lat',
                              //         displayName: 'lat',
                              //         name: 'lat',
                              //         valueType: 'number'
                              //     }, {
                              //         description: 'lon',
                              //         displayName: 'lon',
                              //         name: 'lon',
                              //         valueType: 'number'
                              //     }]
                              // }, {
                              //     description: 'City Id',
                              //     displayName: 'City Id',
                              //     name: 'cityId',
                              //     valueType: 'number'
                          }],
                      inputControl: locationInput
                  }, {
                      description: 'Show header',
                      displayName: 'Show header',
                      name: 'showHeader',
                      valueType: 'boolean',
                      defaultValue: true
                  }, {
                      description: 'Show date header',
                      displayName: 'Show date header',
                      name: 'showDateHeader',
                      valueType: 'boolean',
                      defaultValue: true
                  }, {
                      description: 'Show shadow',
                      displayName: 'Show shadow',
                      name: 'showShadow',
                      valueType: 'boolean',
                      defaultValue: true
                  }, {
                      description: 'see https://momentjs.com/',
                      displayName: 'Time format',
                      name: 'timeFormat',
                      valueType: 'string',
                      defaultValue: 'LT'
                  }, {
                      description: 'Forecast days',
                      displayName: 'Forecast days',
                      name: 'forecastDays',
                      valueType: 'number',
                      values: [
                          { text: '1', value: 1 },
                          { text: '2', value: 2 },
                          { text: '3', value: 3 },
                          { text: '4', value: 4 },
                          { text: '5', value: 5 }
                      ],
                      defaultValue: 2
                  }],
              name: 'WeatherComponent'
          }, {
              component: WeatherIcon,
              type: 'internal',
              name: 'WeatherIcon',
              displayName: 'WeatherIcon'
          }]);

    }
  };
});
//# sourceMappingURL=bundle.browser.js.map
