'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var request = require('request-promise-native');

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

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
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
}

var baseUrl = "http://api.openweathermap.org/data/2.5/";
// Service to access the WUnderground API
var WeatherService = /** @class */ (function () {
    function WeatherService() {
        this.cache = {};
    }
    WeatherService.prototype.start = function (context) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                console.log('WeatherService.start()');
                return [2 /*return*/];
            });
        });
    };
    WeatherService.prototype.stop = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                console.log('WeatherService.stop()');
                return [2 /*return*/];
            });
        });
    };
    WeatherService.prototype.setOptions = function (options) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                console.log('WeatherService.setOptions()');
                this.options = options;
                return [2 /*return*/];
            });
        });
    };
    WeatherService.prototype.getCurrentConditions = function (location) {
        return __awaiter(this, void 0, Promise, function () {
            var url;
            return __generator(this, function (_a) {
                url = this.getApiUrl('weather', location);
                return [2 /*return*/, this.getResponse(url)];
            });
        });
    };
    WeatherService.prototype.getFiveDaysForecast = function (location) {
        return __awaiter(this, void 0, Promise, function () {
            var url;
            return __generator(this, function (_a) {
                url = this.getApiUrl('forecast', location);
                return [2 /*return*/, this.getResponse(url)];
            });
        });
    };
    WeatherService.prototype.getApiUrl = function (endpoint, location) {
        var url = baseUrl + endpoint
            + '?APPID=' + this.options.apiKey
            + '&units=' + this.options.units
            + '&lang=' + this.options.lang;
        if (location) {
            if (location.cityName) {
                url += '&q=' + location.cityName;
            }
            if (location.zip) {
                url += '&zip=' + location.zip;
            }
            if (location.coords) {
                url += '&lon=' + location.coords.lon + '&lat=' + location.coords.lat;
            }
            if (location.cityId) {
                url += '&id=' + location.cityId;
            }
        }
        return url;
    };
    WeatherService.prototype.getResponse = function (url) {
        return __awaiter(this, void 0, Promise, function () {
            var now, validCacheTime, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('WeatherService.get(' + url + ')');
                        now = Date.now();
                        validCacheTime = now - (this.options.cacheDuration * 60 * 1000);
                        // check timestamp
                        if (this.cache[url] && this.cache[url].timestamp < validCacheTime) {
                            delete (this.cache[url]);
                        }
                        if (!!this.cache[url]) return [3 /*break*/, 2];
                        return [4 /*yield*/, request.get(url, { json: true, resolveWithFullResponse: true })];
                    case 1:
                        response = _a.sent();
                        if (response.statusCode !== 200) {
                            throw new Error(response.statusMessage);
                        }
                        this.cache[url] = {
                            timestamp: now,
                            result: response.body,
                            url: url
                        };
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.cache[url].result];
                }
            });
        });
    };
    return WeatherService;
}());

var services = [{
        description: 'Service for OpenWeatherMap',
        displayName: 'Weather Service',
        fields: [{
                displayName: 'API Key',
                description: 'API Key for OpenWeatherMap. Get yours at https://openweathermap.org/api',
                name: 'apiKey',
                valueType: 'string',
            }, {
                defaultValue: 'de',
                description: 'Language',
                displayName: 'Language',
                name: 'lang',
                valueType: 'string',
                values: [
                    { text: 'German', value: 'de' },
                    { text: 'English', value: 'en' },
                ]
            }, {
                defaultValue: 'metric',
                description: 'Units',
                displayName: 'Units',
                name: 'units',
                valueType: 'string',
                values: [
                    { text: 'Metric (Celsius)', value: 'metric' },
                    { text: 'Imperial (Fahrenheit)', value: 'imperial' },
                    { text: 'Kelvin', value: '' },
                ]
            }, {
                defaultValue: 15,
                description: 'Cache duration in minutes',
                displayName: 'Cache duration (min)',
                name: 'cacheDuration',
                valueType: 'number',
                minValue: 0,
                maxValue: 120,
                stepSize: 5
            }],
        name: 'WeatherService',
        service: WeatherService
    }];

exports.services = services;
//# sourceMappingURL=bundle.server.js.map
