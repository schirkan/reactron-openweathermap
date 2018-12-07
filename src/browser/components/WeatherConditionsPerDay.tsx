import moment from 'moment';
import * as React from 'react';
import { IWeatherCondition } from 'src/common/interfaces/IWeatherCondition';

import './WeatherConditionsPerDay.scss';

interface IWeatherConditionsPerDayProps {
  localDateString: string;
  conditions: IWeatherCondition[];
}

export class WeatherConditionsPerDay extends React.Component<IWeatherConditionsPerDayProps> {

  private renderConditions() {
    return (
      <div className="condition-list">
        {this.props.conditions.map(c => {
          const dayOrNight = c.weather_icon.endsWith('n') ? 'night' : 'day';
          const iconClassName = 'wi wi-owm-' + dayOrNight + '-' + c.weather_id;

          const rain = Math.round(c.rain * 100) / 100;
          const snow = Math.round(c.snow * 100) / 100;

          return (
            <React.Fragment key={c.dt}>
              <span>{moment.utc(c.dt_txt).local().format('HH:mm')}</span>
              <span><i className={iconClassName} /></span>
              <span>{c.weather_description}</span>
              <span>{c.temp}</span>
              <span>
                {rain ? (<React.Fragment>Rain: {rain.toFixed(2)} mm</React.Fragment>) : null}
                {snow ? (<React.Fragment> - Snow: {snow.toFixed(2)} mm</React.Fragment>) : null}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  public render() {
    return (
      <section className="WeatherConditionsPerDay" >
        <span className="date-header">{this.props.localDateString}</span>
        {this.renderConditions()}
      </section>
    );
  }
}