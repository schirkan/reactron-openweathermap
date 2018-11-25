System.register(['@fortawesome/free-solid-svg-icons', '@fortawesome/react-fontawesome', 'moment', 'react'], function (exports, module) {
    'use strict';
    var faCloudSun, FontAwesomeIcon, moment, createElement, Component, Fragment;
    return {
        setters: [function (module) {
            faCloudSun = module.faCloudSun;
        }, function (module) {
            FontAwesomeIcon = module.FontAwesomeIcon;
        }, function (module) {
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

            var css = "";
            styleInject(css);

            var WeatherForecast = /** @class */ (function (_super) {
                __extends(WeatherForecast, _super);
                function WeatherForecast() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                WeatherForecast.prototype.renderConditions = function () {
                    return (createElement("div", null, this.props.conditions.map(function (c) { return (createElement("div", { key: c.dt },
                        moment.utc(c.dt_txt).local().format('YYYY-MM-DD HH:mm:ss'),
                        createElement("br", null),
                        c.dt_txt,
                        ": ",
                        c.weather[0].main,
                        " (",
                        c.weather[0].icon,
                        ") - ",
                        c.weather[0].description,
                        createElement("br", null),
                        "Temp: ",
                        c.main.temp_min,
                        " / ",
                        c.main.temp_max,
                        createElement("br", null),
                        c.rain && (createElement(Fragment, null,
                            "Rain: ",
                            c.rain['3h'],
                            " mm",
                            createElement("br", null))),
                        c.snow && (createElement(Fragment, null,
                            "Snow: ",
                            c.snow['3h'],
                            " mm",
                            createElement("br", null))),
                        createElement("hr", null))); })));
                };
                WeatherForecast.prototype.render = function () {
                    return (createElement("section", { className: "WeatherForecast" },
                        createElement("span", null, this.props.localDateString),
                        this.renderConditions()));
                };
                return WeatherForecast;
            }(Component));

            var css$1 = "";
            styleInject(css$1);

            // tslint:disable-next-line:no-var-requires
            var moment$1 = require('moment');
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
                WeatherComponent.prototype.componentDidUpdate = function () {
                    this.loadWeatherData();
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
                        var localDate = moment$1.utc(item.dt_txt).local();
                        var localDateString = localDate.format('YYYY-MM-DD');
                        if (!days[localDateString]) {
                            days[localDateString] = [];
                        }
                        days[localDateString].push(item);
                    });
                    return (createElement("div", null, Object.keys(days).map(function (dateString) {
                        return createElement(WeatherForecast, { key: dateString, localDateString: dateString, conditions: days[dateString] });
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
                        createElement("div", null,
                            createElement(FontAwesomeIcon, { icon: faCloudSun }),
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
