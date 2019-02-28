import { IReactronComponentContext, topicNames } from '@schirkan/reactron-interfaces';
import moment from 'moment';
import * as React from 'react';
import { ILocationRequest } from 'src/common/interfaces/ILocationRequest';
import { IWeatherCondition } from 'src/common/interfaces/IWeatherCondition';
import { IWeatherForecast } from 'src/common/interfaces/IWeatherForecast';
import { IWeatherService } from 'src/common/interfaces/IWeatherService';
import { WeatherConditionsPerDay } from './WeatherConditionsPerDay';

import './WeatherForecast.scss';

interface IWeatherForecastProps {
  location: ILocationRequest;
  showHeader: boolean;
  showDateHeader: boolean;
  showShadow: boolean;
  timeFormat: string;
  forecastDays: number;
}

interface IWeatherForecastState {
  weatherForecast?: IWeatherForecast;
  error?: any;
  loading: boolean;
}

export class WeatherForecast extends React.Component<IWeatherForecastProps, IWeatherForecastState> {
  public context: IReactronComponentContext;

  constructor(props: IWeatherForecastProps) {
    super(props);
    this.state = { loading: false };
    this.loadData = this.loadData.bind(this);
  }

  public componentDidMount() {
    this.context.topics.subscribe(topicNames.refresh, this.loadData);
    this.loadData();
  }

  public componentWillUnmount() {
    this.context.topics.unsubscribe(topicNames.refresh, this.loadData);
  }

  public componentDidUpdate(prevProps: any) {
    if (JSON.stringify(this.props) !== JSON.stringify(prevProps)) {
      this.loadData();
    }
  }

  private async loadData() {
    const weatherService = await this.context.getService<IWeatherService>('WeatherService');
    if (weatherService) {
      this.setState({ loading: true });
      try {
        const weatherForecast = await weatherService.getFiveDaysForecast(this.props.location);
        this.setState({ weatherForecast, loading: false });
      } catch (error) {
        this.setState({ error, loading: false });
      }
    }
  }

  private renderForecast() {
    if (!this.state.weatherForecast) {
      return;
    }

    const timezone = this.context.settings.timezone;
    const today = moment().tz(timezone);
    const forecastDays = Math.max(this.props.forecastDays, 1);
    const days: { [date: string]: IWeatherCondition[] } = {};

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

    return (
      <React.Fragment>
        {Object.keys(days).map(dateString =>
          <WeatherConditionsPerDay key={dateString} localDateString={dateString}
            conditions={days[dateString]} timezone={timezone}
            showDateHeader={this.props.showDateHeader} timeFormat={this.props.timeFormat} />
        )}
      </React.Fragment>
    );
  }

  private renderHeader() {
    if (!this.props.showHeader) {
      return null;
    }
    const location = this.state.weatherForecast ? this.state.weatherForecast.location.name + ', ' + this.state.weatherForecast.location.country : '...';

    return (
      <h2>
        Weather forecast for {location}
        {this.state.loading && this.context.renderLoading(undefined, '1x', { display: 'inline-block', marginLeft: '8px' })}
      </h2>
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
      <section className="WeatherForecast">
        <div className="shadow" hidden={!this.props.showShadow} />
        {this.renderHeader()}
        {this.renderForecast()}
      </section>
    );
  }
}
