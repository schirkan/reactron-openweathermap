import { IReactronComponentContext } from '@schirkan/reactron-interfaces';
import moment from 'moment';
import * as React from 'react';
import { ILocationRequest } from 'src/common/interfaces/ILocationRequest';
import { IWeatherCondition } from 'src/common/interfaces/IWeatherCondition';
import { IWeatherForecast } from 'src/common/interfaces/IWeatherForecast';
import { IWeatherService } from 'src/common/interfaces/IWeatherService';
import { WeatherConditionsPerDay } from './WeatherConditionsPerDay';

import './WeatherComponent.scss';

interface IWeatherComponentState {
  weatherForecast?: IWeatherForecast;
  error?: any;
}

export class WeatherComponent extends React.Component<ILocationRequest, IWeatherComponentState> {
  public context: IReactronComponentContext;

  constructor(props: ILocationRequest) {
    super(props);
    this.state = {};
  }

  public componentDidMount() {
    this.loadWeatherData();
  }

  public componentDidUpdate(prevProps: ILocationRequest) {
    if (JSON.stringify(this.props) !== JSON.stringify(prevProps)) {
      this.loadWeatherData();
    }
  }

  private loadWeatherData() {
    const weatherService = this.context.getService<IWeatherService>('WeatherService');
    if (weatherService) {
      weatherService.getFiveDaysForecast(this.props)
        .then(response => this.setState({ weatherForecast: response }))
        .catch(error => this.setState({ error }));
    }
  }

  private renderForecast() {
    if (!this.state.weatherForecast) {
      return;
    }

    const days: { [date: string]: IWeatherCondition[] } = {};

    // group by date
    this.state.weatherForecast.list.forEach(item => {
      const localDate = moment.utc(item.dt_txt).local();
      const localDateString = localDate.format('YYYY-MM-DD');
      if (!days[localDateString]) {
        days[localDateString] = [];
      }
      days[localDateString].push(item);
    });

    return (
      <div>
        {Object.keys(days).map(dateString =>
          <WeatherConditionsPerDay key={dateString} localDateString={dateString} conditions={days[dateString]} />
        )}
      </div>
    );
  }

  public render() {
    if (this.state.error) {
      return 'Error: ' + this.state.error;
    }

    if (!this.state.weatherForecast) {
      return this.context.renderLoading('Loading weather...');
    }

    return (
      <section className="WeatherComponent">
        <h2>
          Weather for {this.state.weatherForecast.city.name}, {this.state.weatherForecast.city.country}
        </h2>
        {this.renderForecast()}
      </section>
    );
  }
}
