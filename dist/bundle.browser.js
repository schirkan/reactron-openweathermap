System.register(['moment', 'react'], function (exports, module) {
    'use strict';
    var moment, createElement, Component, Fragment;
    return {
        setters: [function (module) {
            moment = module.default;
        }, function (module) {
            createElement = module.createElement;
            Component = module.Component;
            Fragment = module.Fragment;
        }],
        execute: function () {

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

            var css = ".WeatherConditionsPerDay .date-header {\n  font-weight: bold;\n  font-size: 120%; }\n\n.WeatherConditionsPerDay .condition-list {\n  display: grid;\n  grid-template-columns: -webkit-max-content -webkit-max-content 11em -webkit-max-content auto;\n  grid-template-columns: max-content max-content 11em max-content auto; }\n  .WeatherConditionsPerDay .condition-list span {\n    margin-right: 6px; }\n";
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
                WeatherConditionsPerDay.prototype.renderConditions = function () {
                    return (createElement("div", { className: "condition-list" }, this.props.conditions.map(function (c) {
                        var night = c.weather_icon.endsWith('n');
                        var rain = Math.round(c.rain * 100) / 100;
                        var snow = Math.round(c.snow * 100) / 100;
                        return (createElement(Fragment, { key: c.dt },
                            createElement("span", null, moment.utc(c.dt_txt).local().format('HH:mm')),
                            createElement("span", null,
                                createElement(WeatherIcon, { weatherId: c.weather_id, night: night })),
                            createElement("span", null, c.weather_description),
                            createElement("span", null, c.temp),
                            createElement("span", null,
                                rain ? (createElement(Fragment, null,
                                    "Rain: ",
                                    rain.toFixed(2),
                                    " mm")) : null,
                                snow ? (createElement(Fragment, null,
                                    " - Snow: ",
                                    snow.toFixed(2),
                                    " mm")) : null)));
                    })));
                };
                WeatherConditionsPerDay.prototype.render = function () {
                    return (createElement("section", { className: "WeatherConditionsPerDay" },
                        createElement("span", { className: "date-header" }, this.props.localDateString),
                        this.renderConditions()));
                };
                return WeatherConditionsPerDay;
            }(Component));

            var css$1 = "";
            styleInject(css$1);

            var WeatherComponent = exports('WeatherComponent', /** @class */ (function (_super) {
                __extends(WeatherComponent, _super);
                function WeatherComponent(props) {
                    var _this = _super.call(this, props) || this;
                    _this.state = {};
                    return _this;
                }
                WeatherComponent.prototype.componentDidMount = function () {
                    this.loadWeatherData();
                };
                WeatherComponent.prototype.componentDidUpdate = function (prevProps) {
                    if (JSON.stringify(this.props) !== JSON.stringify(prevProps)) {
                        this.loadWeatherData();
                    }
                };
                WeatherComponent.prototype.loadWeatherData = function () {
                    var _this = this;
                    var weatherService = this.context.getService('WeatherService');
                    if (weatherService) {
                        weatherService.getFiveDaysForecast(this.props)
                            .then(function (response) { return _this.setState({ weatherForecast: response }); })
                            .catch(function (error) { return _this.setState({ error: error }); });
                    }
                };
                WeatherComponent.prototype.renderForecast = function () {
                    if (!this.state.weatherForecast) {
                        return;
                    }
                    var days = {};
                    // group by date
                    this.state.weatherForecast.list.forEach(function (item) {
                        var localDate = moment.utc(item.dt_txt).local();
                        var localDateString = localDate.format('YYYY-MM-DD');
                        if (!days[localDateString]) {
                            days[localDateString] = [];
                        }
                        days[localDateString].push(item);
                    });
                    return (createElement("div", null, Object.keys(days).map(function (dateString) {
                        return createElement(WeatherConditionsPerDay, { key: dateString, localDateString: dateString, conditions: days[dateString] });
                    })));
                };
                WeatherComponent.prototype.render = function () {
                    if (this.state.error) {
                        return 'Error: ' + this.state.error;
                    }
                    if (!this.state.weatherForecast) {
                        return this.context.renderLoading('Loading weather...');
                    }
                    return (createElement("section", { className: "WeatherComponent" },
                        createElement("h2", null,
                            "Weather for ",
                            this.state.weatherForecast.city.name,
                            ", ",
                            this.state.weatherForecast.city.country),
                        this.renderForecast()));
                };
                return WeatherComponent;
            }(Component)));

            var components = exports('components', [{
                    component: WeatherComponent,
                    description: 'Weather Forecast by OpenWeatherMap',
                    displayName: 'Weather Forecast',
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
                        }, {
                            description: 'Coordinates',
                            displayName: 'Coordinates',
                            name: 'coords',
                            valueType: 'object',
                            fields: [{
                                    description: 'lat',
                                    displayName: 'lat',
                                    name: 'lat',
                                    valueType: 'number'
                                }, {
                                    description: 'lon',
                                    displayName: 'lon',
                                    name: 'lon',
                                    valueType: 'number'
                                }]
                        }, {
                            description: 'City Id',
                            displayName: 'City Id',
                            name: 'cityId',
                            valueType: 'number'
                        }],
                    name: 'WeatherComponent'
                }]);

        }
    };
});
//# sourceMappingURL=bundle.browser.js.map
