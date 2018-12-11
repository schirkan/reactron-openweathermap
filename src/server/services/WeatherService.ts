import { IReactronServiceContext } from '@schirkan/reactron-interfaces';
import * as request from 'request-promise-native';
import { ILocationRequest } from 'src/common/interfaces/ILocationRequest';
import { IWeatherCondition } from 'src/common/interfaces/IWeatherCondition';
import { IWeatherForecast } from 'src/common/interfaces/IWeatherForecast';
import { IWeatherResponse } from 'src/common/interfaces/IWeatherResponse';
import { IWeatherService } from "../../common/interfaces/IWeatherService";
import { IWeatherServiceOptions } from '../../common/interfaces/IWeatherServiceOptions';

const baseUrl = "http://api.openweathermap.org/data/2.5/";

interface IWeatherCacheItem {
    url: string;
    timestamp: number;
    result: any;
}

// Service to access the WUnderground API
export class WeatherService implements IWeatherService {
    private options: IWeatherServiceOptions;
    private context: IReactronServiceContext
    private cache: { [url: string]: IWeatherCacheItem } = {};

    public async start(context: IReactronServiceContext): Promise<void> {
        this.context = context;
        console.log('WeatherService.start()');
    }

    public async stop(): Promise<void> {
        console.log('WeatherService.stop()');
    }

    public async setOptions(options: IWeatherServiceOptions): Promise<void> {
        console.log('WeatherService.setOptions()');
        this.options = options;
    }

    public getOptions(): Readonly<IWeatherServiceOptions> {
        return this.options;
    }

    public async getCurrentConditions(location: ILocationRequest): Promise<any> {
        const url = this.getApiUrl('weather', location);
        return this.getResponse(url);
    }

    public async getFiveDaysForecast(location: ILocationRequest): Promise<IWeatherForecast> {
        const url = this.getApiUrl('forecast', location);
        return this.getResponse(url).then(WeatherService.ToWeatherForecast);
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
        console.log('WeatherService.get(' + url + ')');
        const now = Date.now();
        const validCacheTime = now - (this.options.cacheDuration * 60 * 1000);

        // check timestamp
        if (this.cache[url] && this.cache[url].timestamp < validCacheTime) {
            delete (this.cache[url]);
        }

        if (!this.cache[url]) {
            const response = await request.get(url, { json: true, resolveWithFullResponse: true }) as request.FullResponse;
            if (response.statusCode !== 200) {
                throw new Error(response.statusMessage);
            }
            this.cache[url] = {
                timestamp: now,
                result: response.body,
                url
            };
        }

        return this.cache[url].result;
    }

    private static ToWeatherForecast(response: IWeatherResponse): IWeatherForecast {
        const result: IWeatherForecast = {
            city: response.city,
            list: []
        };

        result.list = response.list.map(x => ({
            clouds: x.clouds.all,
            dt: x.dt,
            dt_txt: x.dt_txt,
            grnd_level: x.main.grnd_level,
            humidity: x.main.humidity,
            pressure: x.main.pressure,
            sea_level: x.main.sea_level,
            temp: x.main.temp,
            rain: x.rain && x.rain["3h"] || 0,
            snow: x.snow && x.snow["3h"] || 0,
            weather_description: x.weather[0].description,
            weather_icon: x.weather[0].icon,
            weather_id: x.weather[0].id,
            weather_txt: x.weather[0].main,
            wind_deg: x.wind.deg,
            wind_speed: x.wind.speed
        } as IWeatherCondition));

        return result;
    }
}