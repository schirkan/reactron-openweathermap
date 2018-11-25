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
      <div>
        {this.props.conditions.map(c => (
          <div key={c.dt}>
            {moment.utc(c.dt_txt).local().format('YYYY-MM-DD HH:mm:ss')}<br />
            {c.dt_txt}: {c.weather[0].main} ({c.weather[0].icon}) - {c.weather[0].description}<br />
            Temp: {c.main.temp_min} / {c.main.temp_max}<br />
            {c.rain && (<React.Fragment>Rain: {c.rain['3h']} mm<br /></React.Fragment>)}
            {c.snow && (<React.Fragment>Snow: {c.snow['3h']} mm<br /></React.Fragment>)}
            <hr />
          </div>
        ))}
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
      <section className="WeatherForecast">
        <span>{this.props.localDateString}</span>
        {this.renderConditions()}
      </section>
    );
  }
}
