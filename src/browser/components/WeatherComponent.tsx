import * as SvgIcons from '@fortawesome/free-solid-svg-icons';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import { IReactronComponentContext } from '@schirkan/reactron-interfaces';
import * as React from 'react';
import { IWeatherService } from 'src/common/interfaces/IWeatherService';
import { WeatherForecast } from './WeatherForecast';

import './WeatherComponent.scss';

// tslint:disable-next-line:no-var-requires
const moment = require('moment');

interface IWeatherComponentState {
  weatherForecast?: WeatherModels.IWeatherResponse;
  error?: any;
}

export class WeatherComponent extends React.Component<WeatherModels.ILocationRequest, IWeatherComponentState> {
  public context: IReactronComponentContext;

  constructor(props: WeatherModels.ILocationRequest) {
    super(props);
    this.state = {};
  }

  public componentDidMount() {
    this.loadWeatherData();
  }

  public componentDidUpdate() {
    this.loadWeatherData();
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

    const days: { [date: string]: WeatherModels.IWeatherResponseCondition[] } = {};

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
          <WeatherForecast key={dateString} localDateString={dateString} conditions={days[dateString]} />
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
        <div>
          <FontAwesome.FontAwesomeIcon icon={SvgIcons.faCloudSun} />
          Weather for {this.state.weatherForecast.city.name}, {this.state.weatherForecast.city.country}
        </div>
        {this.renderForecast()}
      </section>
    );
  }
}
