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

const baseUrl = "http://api.openweathermap.org/data/2.5/";
// Service to access the openweathermap API
class WeatherService {
    constructor(context) {
        this.context = context;
        this.cache = {};
    }
    setOptions(options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.options = options;
        });
    }
    getOptions() {
        return this.options;
    }
    getCurrentConditions(location) {
        return __awaiter(this, void 0, void 0, function* () {
            this.context.log.debug('getCurrentConditions', location);
            const url = this.getApiUrl('weather', location);
            return this.getResponse(url, WeatherService.mapToCurrentConditions);
        });
    }
    getFiveDaysForecast(location) {
        return __awaiter(this, void 0, void 0, function* () {
            this.context.log.debug('getFiveDaysForecast', location);
            const url = this.getApiUrl('forecast', location);
            return this.getResponse(url, WeatherService.mapToWeatherForecast);
        });
    }
    getApiUrl(endpoint, location) {
        let url = baseUrl + endpoint
            + '?APPID=' + this.options.apiKey
            + '&units=' + this.options.units
            + '&lang=' + this.context.settings.lang;
        if (location) {
            if (location.cityName) {
                url += '&q=' + location.cityName;
            }
            if (location.zip) {
                url += '&zip=' + location.zip;
            }
            if (location.coords && (location.coords.lon !== 0 || location.coords.lat !== 0)) {
                url += '&lon=' + location.coords.lon + '&lat=' + location.coords.lat;
            }
            if (location.cityId) {
                url += '&id=' + location.cityId;
            }
        }
        return url;
    }
    getResponse(url, mapper) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = Date.now();
            const validCacheTime = now - (this.options.cacheDuration * 60 * 1000);
            // check timestamp
            if (this.cache[url] && this.cache[url].timestamp < validCacheTime) {
                delete (this.cache[url]);
            }
            if (!this.cache[url]) {
                this.cache[url] = {
                    timestamp: now,
                    result: this.getResponseInternal(url, mapper)
                };
            }
            else {
                this.context.log.debug('cache hit');
            }
            return this.cache[url].result;
        });
    }
    getResponseInternal(url, mapper) {
        return __awaiter(this, void 0, void 0, function* () {
            this.context.log.debug('fetch', url);
            const response = yield request.get(url, { json: true, resolveWithFullResponse: true });
            if (response.statusCode !== 200) {
                this.context.log.error(response.statusMessage, response.body);
                throw new Error(response.statusMessage);
            }
            return mapper(response.body);
        });
    }
    static mapToCurrentConditions(response) {
        const result = {
            location: {
                coords: response.coords,
                country: response.sys.country,
                name: response.name,
                id: response.id
            },
            condition: {
                clouds: response.clouds.all,
                humidity: response.main.humidity,
                night: response.weather[0].icon.endsWith('n'),
                pressure: response.main.pressure,
                rain: response.rain && response.rain["3h"] || 0,
                snow: response.snow && response.snow["3h"] || 0,
                timestamp: response.dt,
                temp: response.main.temp,
                weatherDescription: response.weather[0].description,
                weatherIcon: response.weather[0].icon,
                weatherId: response.weather[0].id,
                weatherText: response.weather[0].main,
                windDegree: response.wind.deg,
                windSpeed: response.wind.speed,
                sunrise: response.sys.sunrise,
                sunset: response.sys.sunset
            }
        };
        return result;
    }
    static mapToWeatherForecast(response) {
        const result = {
            location: response.city,
            conditions: []
        };
        result.conditions = response.list.map(x => ({
            clouds: x.clouds.all,
            humidity: x.main.humidity,
            night: x.weather[0].icon.endsWith('n'),
            pressure: x.main.pressure,
            pressureGroundLevel: x.main.grnd_level,
            pressureSeaLevel: x.main.sea_level,
            rain: x.rain && x.rain["3h"] || 0,
            snow: x.snow && x.snow["3h"] || 0,
            timestamp: x.dt,
            timestampText: x.dt_txt,
            temp: x.main.temp,
            weatherDescription: x.weather[0].description,
            weatherIcon: x.weather[0].icon,
            weatherId: x.weather[0].id,
            weatherText: x.weather[0].main,
            windDegree: x.wind.deg,
            windSpeed: x.wind.speed
        }));
        return result;
    }
}

// export reactron service definition
const services = [{
        description: 'Service for OpenWeatherMap',
        displayName: 'Weather Service',
        fields: [{
                displayName: 'API Key',
                description: 'API Key for OpenWeatherMap. Get yours at https://openweathermap.org/api',
                name: 'apiKey',
                valueType: 'string',
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
                minValue: 5,
                maxValue: 120,
                stepSize: 5
            }],
        name: 'WeatherService',
        service: WeatherService
    }];

exports.services = services;
//# sourceMappingURL=bundle.server.js.map
