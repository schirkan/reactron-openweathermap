import * as SvgIcons from '@fortawesome/free-solid-svg-icons';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import { IReactronComponentContext } from '@schirkan/reactron-interfaces';
import moment from 'moment';
import * as React from 'react';
import { IWeatherService } from 'src/common/interfaces/IWeatherService';
import { WeatherForecast } from './WeatherForecast';

import './WeatherComponent.scss';

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
    injectStyleSheet();
    this.loadWeatherData();
  }

  public componentDidUpdate(prevProps: WeatherModels.ILocationRequest) {
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
        <h2>
          Weather for {this.state.weatherForecast.city.name}, {this.state.weatherForecast.city.country}
        </h2>
        {this.renderForecast()}
      </section>
    );
  }
}
