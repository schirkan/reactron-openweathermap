import { IReactronServiceContext } from '@schirkan/reactron-interfaces';
import * as request from 'request-promise-native';
import { ILocationRequest } from 'src/common/interfaces/ILocationRequest';
import { IWeatherCondition } from 'src/common/interfaces/IWeatherCondition';
import { IWeatherForecast } from 'src/common/interfaces/IWeatherForecast';
import { IWeatherResponseForecast } from 'src/common/interfaces/IWeatherResponseForecast';
import { IWeatherService } from "src/common/interfaces/IWeatherService";
import { IWeatherServiceOptions } from 'src/common/interfaces/IWeatherServiceOptions';
import { IWeatherCurrent } from 'src/common/interfaces/IWeatherCurrent';
import { IWeatherResponseCurrent } from 'src/common/interfaces/IWeatherResponseCurrent';

const baseUrl = "http://api.openweathermap.org/data/2.5/";

// https://medium.com/@bluepnume/async-javascript-is-much-more-fun-when-you-spend-less-time-thinking-about-control-flow-8580ce9f73fc
// function memoize(method: any) {
//   let cache = {};  
//   return async function() {
//       let args = JSON.stringify(arguments);
//       cache[args] = cache[args] || method.apply(this, arguments);
//       return cache[args];
//   };
// }

interface IWeatherCacheItem {
  url: string;
  timestamp: number;
  result: any;
}

// Service to access the openweathermap API
export class WeatherService implements IWeatherService {
  private options: IWeatherServiceOptions;
  private cache: { [url: string]: IWeatherCacheItem } = {};

  constructor(private context: IReactronServiceContext) {
    // this.getResponse = memoize(this.getResponse);
   }

  public async setOptions(options: IWeatherServiceOptions): Promise<void> {
    this.options = options;
  }

  public getOptions(): Readonly<IWeatherServiceOptions> {
    return this.options;
  }

  public async getCurrentConditions(location: ILocationRequest): Promise<IWeatherCurrent> {
    const url = this.getApiUrl('weather', location);
    return this.getResponse(url).then(WeatherService.mapToCurrentConditions);
  }

  public async getFiveDaysForecast(location: ILocationRequest): Promise<IWeatherForecast> {
    const url = this.getApiUrl('forecast', location);

    // TEST
    const ttt = await this.getCurrentConditions(location);
    console.log(ttt);
    this.context.log.debug('getCurrentConditions', ttt);

    return this.getResponse(url).then(WeatherService.mapToWeatherForecast);
  }

  private getApiUrl(endpoint: string, location: ILocationRequest): string {
    let url = baseUrl + endpoint
      + '?APPID=' + this.options.apiKey
      + '&units=' + this.options.units
      + '&lang=' + this.context.settings.lang;

    if (location) {
      if (location.cityName) {
        url += '&q=' + location.cityName;
      }
      if (location.zip) {
        url += '&zip=' + location.zip;
      }
      if (location.coords) {
        url += '&lon=' + location.coords.lon + '&lat=' + location.coords.lat;
      }
      if (location.cityId) {
        url += '&id=' + location.cityId;
      }
    }
    return url;
  }

  private async getResponse(url: string): Promise<any> {
    this.context.log.debug('get', url);
    const now = Date.now();
    const validCacheTime = now - (this.options.cacheDuration * 60 * 1000);

    // check timestamp
    if (this.cache[url] && this.cache[url].timestamp < validCacheTime) {
      delete (this.cache[url]);
    }

    if (!this.cache[url]) {
      const response = await request.get(url, { json: true, resolveWithFullResponse: true }) as request.FullResponse;
      if (response.statusCode !== 200) {
        this.context.log.error(response.statusMessage, response.body);
        throw new Error(response.statusMessage);
      }
      this.cache[url] = {
        timestamp: now,
        result: response.body,
        url
      };
    } else {
      this.context.log.debug('cache hit');
    }

    return this.cache[url].result;
  }

  private static mapToCurrentConditions(response: IWeatherResponseCurrent): IWeatherCurrent {
    const result: IWeatherCurrent = {
      location: {
        coords: response.coords,
        country: response.sys.country,
        name: response.name,
        id: response.id
      },
      condition: {
        clouds: response.clouds.all,
        humidity: response.main.humidity,
        night: response.weather[0].icon.endsWith('n'),
        pressure: response.main.pressure,
        rain: response.rain && response.rain["3h"] || 0,
        snow: response.snow && response.snow["3h"] || 0,
        timestamp: response.dt,
        temp: response.main.temp,
        weatherDescription: response.weather[0].description,
        weatherIcon: response.weather[0].icon,
        weatherId: response.weather[0].id,
        weatherText: response.weather[0].main,
        windDegree: response.wind.deg,
        windSpeed: response.wind.speed,
        sunrise: response.sys.sunrise,
        sunset: response.sys.sunset
      }
    };
    return result;
  }

  private static mapToWeatherForecast(response: IWeatherResponseForecast): IWeatherForecast {
    const result: IWeatherForecast = {
      location: response.city,
      conditions: []
    };

    result.conditions = response.list.map(x => ({
      clouds: x.clouds.all,
      humidity: x.main.humidity,
      night: x.weather[0].icon.endsWith('n'),
      pressure: x.main.pressure,
      pressureGroundLevel: x.main.grnd_level,
      pressureSeaLevel: x.main.sea_level,
      rain: x.rain && x.rain["3h"] || 0,
      snow: x.snow && x.snow["3h"] || 0,
      timestamp: x.dt,
      timestampText: x.dt_txt,
      temp: x.main.temp,
      weatherDescription: x.weather[0].description,
      weatherIcon: x.weather[0].icon,
      weatherId: x.weather[0].id,
      weatherText: x.weather[0].main,
      windDegree: x.wind.deg,
      windSpeed: x.wind.speed
    } as IWeatherCondition));

    return result;
  }
}