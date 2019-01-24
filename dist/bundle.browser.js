System.register(['react', '@schirkan/reactron-interfaces', 'moment', 'numeral'], function (exports, module) {
  'use strict';
  var createElement, Component, Fragment, topicNames, moment, numeral;
  return {
    setters: [function (module) {
      createElement = module.createElement;
      Component = module.Component;
      Fragment = module.Fragment;
    }, function (module) {
      topicNames = module.topicNames;
    }, function (module) {
      moment = module.default;
    }, function (module) {
      numeral = module.default;
    }],
    execute: function () {

      const locationInput = (props) => {
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

      function __awaiter(thisArg, _arguments, P, generator) {
          return new (P || (P = Promise))(function (resolve, reject) {
              function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
              function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
              function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
              step((generator = generator.apply(thisArg, _arguments || [])).next());
          });
      }

      let styleSheetInjected = false;
      const injectStyleSheet = () => {
          if (styleSheetInjected) {
              return;
          }
          styleSheetInjected = true;
          const head = document.head || document.getElementsByTagName('head')[0];
          if (head) {
              const style = document.createElement('link');
              style.rel = 'stylesheet';
              style.href = '/modules/reactron-openweathermap/public/css/weather-icons.min.css';
              head.appendChild(style);
          }
      };
      class WeatherIcon extends Component {
          componentDidMount() {
              injectStyleSheet();
          }
          render() {
              const dayOrNight = this.props.night ? 'night' : 'day';
              const iconClassName = 'wi wi-owm-' + dayOrNight + '-' + this.props.weatherId;
              return createElement("i", { className: iconClassName });
          }
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

      var css = ".WeatherConditionsPerDay .date-header {\n  font-weight: bold;\n  font-size: 120%; }\n\n.WeatherConditionsPerDay .condition-list {\n  display: grid;\n  grid-template-columns: -webkit-max-content 2.5em 2.7em 11em;\n  grid-template-columns: max-content 2.5em 2.7em 11em;\n  margin-left: 12px; }\n  .WeatherConditionsPerDay .condition-list .time {\n    text-align: right; }\n  .WeatherConditionsPerDay .condition-list .icon {\n    text-align: center;\n    margin-left: 10px; }\n  .WeatherConditionsPerDay .condition-list .temp {\n    text-align: right;\n    margin-right: 10px; }\n";
      styleInject(css);

      class WeatherConditionsPerDay extends Component {
          render() {
              const timeFormat = this.props.timeFormat || 'LT';
              return (createElement("section", { className: "WeatherConditionsPerDay" },
                  createElement("span", { className: "date-header", hidden: !this.props.showDateHeader }, this.props.localDateString),
                  createElement("div", { className: "condition-list" }, this.props.conditions.map(c => {
                      const time = moment.utc(c.timestampText).tz(this.props.timezone);
                      // const rain = Math.round(c.rain * 100) / 100;
                      // const snow = Math.round(c.snow * 100) / 100;
                      return (createElement(Fragment, { key: c.timestamp },
                          createElement("span", { className: "time" }, time.format(timeFormat)),
                          createElement("span", { className: "icon" },
                              createElement(WeatherIcon, { weatherId: c.weatherId, night: c.night })),
                          createElement("span", { className: "temp" }, numeral(c.temp).format('0.0')),
                          createElement("span", null, c.weatherDescription)));
                  }))));
          }
      }

      var css$1 = ".WeatherForecast .header {\n  border-bottom: 1px solid;\n  margin-bottom: 10px; }\n\n.WeatherForecast .shadow {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  box-shadow: inset 0px -150px 150px -100px #000; }\n";
      styleInject(css$1);

      class WeatherForecast extends Component {
          constructor(props) {
              super(props);
              this.state = {};
              this.loadData = this.loadData.bind(this);
          }
          componentDidMount() {
              this.context.topics.subscribe(topicNames.refresh, this.loadData);
              this.loadData();
          }
          componentWillUnmount() {
              this.context.topics.unsubscribe(topicNames.refresh, this.loadData);
          }
          componentDidUpdate(prevProps) {
              if (JSON.stringify(this.props) !== JSON.stringify(prevProps)) {
                  this.loadData();
              }
          }
          loadData() {
              return __awaiter(this, void 0, void 0, function* () {
                  const weatherService = yield this.context.getService('WeatherService');
                  if (weatherService) {
                      try {
                          const weatherForecast = yield weatherService.getFiveDaysForecast(this.props.location);
                          this.setState({ weatherForecast });
                      }
                      catch (error) {
                          this.setState({ error });
                      }
                  }
              });
          }
          renderForecast() {
              if (!this.state.weatherForecast) {
                  return;
              }
              const timezone = this.context.settings.timezone;
              const today = moment().tz(timezone);
              const forecastDays = Math.max(this.props.forecastDays, 1);
              const days = {};
              // group by date
              this.state.weatherForecast.conditions.forEach(item => {
                  const localDate = moment.utc(item.timestampText).tz(timezone);
                  if (localDate.diff(today, 'days', true) > forecastDays) {
                      return;
                  }
                  const localDateString = localDate.format('L');
                  if (!days[localDateString]) {
                      days[localDateString] = [];
                  }
                  days[localDateString].push(item);
              });
              return (createElement(Fragment, null, Object.keys(days).map(dateString => createElement(WeatherConditionsPerDay, { key: dateString, localDateString: dateString, conditions: days[dateString], timezone: timezone, showDateHeader: this.props.showDateHeader, timeFormat: this.props.timeFormat }))));
          }
          render() {
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
                      this.state.weatherForecast.location.name,
                      ", ",
                      this.state.weatherForecast.location.country),
                  this.renderForecast()));
          }
      } exports('WeatherForecast', WeatherForecast);

      const components = exports('components', [{
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
