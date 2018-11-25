import moment from 'moment';
import * as React from 'react';

import './WeatherForecast.scss';

interface IWeatherForecastProps {
  localDateString: string;
  conditions: WeatherModels.IWeatherResponseCondition[];
}

export class WeatherForecast extends React.Component<IWeatherForecastProps> {

  private renderConditions() {
    return (
      <div className="condition-list">
        {this.props.conditions.map(c => {
          let rain = c.rain && c.rain['3h'] || 0;
          let snow = c.snow && c.snow['3h'] || 0;
          const dayOrNight = c.weather[0].icon.endsWith('n') ? 'night' : 'day';
          const iconClassName = 'wi wi-owm-' + dayOrNight + '-' + c.weather[0].id;

          rain = Math.round(rain * 100) / 100;
          snow = Math.round(snow * 100) / 100;

          return (
            <React.Fragment key={c.dt}>
              <span>{moment.utc(c.dt_txt).local().format('HH:mm')}</span>
              <span><i className={iconClassName} /></span>
              <span>{c.weather[0].description}</span>
              <span>{c.main.temp_min} / {c.main.temp_max}</span>
              <span>
                {rain ? (<React.Fragment>Rain: {rain.toFixed(2)} mm</React.Fragment>) : null}
                {snow ? (<React.Fragment> - Snow: {snow.toFixed(2)} mm</React.Fragment>) : null}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    );
    // const iconClassName = 'wi wi-' + this.props.icon + ' wi-wu-' + this.props.icon;
    {/* <span>{this.props.date}</span>
        <i className={iconClassName} />
        <span>{this.props.conditions}</span>
        <span>{this.props.low} °C</span> / <span>{this.props.high} °C</span> */}
  }

  public render() {
    return (
      <section className="WeatherForecast" >
        <span className="date-header">{this.props.localDateString}</span>
        {this.renderConditions()}
      </section>
    );
  }
}
