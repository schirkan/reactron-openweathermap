import moment from 'moment';
import numeral from 'numeral';
import * as React from 'react';
import { IWeatherCondition } from 'src/common/interfaces/IWeatherCondition';

import './WeatherConditionsPerDay.scss';
import { WeatherIcon } from './WeatherIcon';

interface IWeatherConditionsPerDayProps {
  localDateString: string;
  conditions: IWeatherCondition[];
  showDateHeader: boolean;
  timeFormat: string;
  timezone: string;
}

export class WeatherConditionsPerDay extends React.Component<IWeatherConditionsPerDayProps> {
  public render() {
    const timeFormat = this.props.timeFormat || 'LT';

    return (
      <section className="WeatherConditionsPerDay" >
        <span className="date-header" hidden={!this.props.showDateHeader}>{this.props.localDateString}</span>
        <div className="condition-list">
          {this.props.conditions.map(c => {
            const time = moment.utc(c.dt_txt).tz(this.props.timezone);
            const night = c.weather_icon.endsWith('n');
            // const rain = Math.round(c.rain * 100) / 100;
            // const snow = Math.round(c.snow * 100) / 100;

            return (
              <React.Fragment key={c.dt}>
                <span className="time">{time.format(timeFormat)}</span>
                <span className="icon"><WeatherIcon weatherId={c.weather_id} night={night} /></span>
                <span className="temp">{numeral(c.temp).format('0.0')}</span>
                <span>{c.weather_description}</span>
                {/* <span>
                {rain ? (<React.Fragment>Rain: {rain.toFixed(2)} mm</React.Fragment>) : null}
                {snow ? (<React.Fragment> - Snow: {snow.toFixed(2)} mm</React.Fragment>) : null}
              </span> */}
              </React.Fragment>
            );
          })}
        </div>
      </section>
    );
  }
}
