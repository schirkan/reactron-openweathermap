import { IReactronServiceContext } from '@schirkan/reactron-interfaces';
import * as request from 'request-promise-native';
import { IWeatherService } from "../../common/interfaces/IWeatherService";
import { IWeatherServiceOptions } from '../../common/interfaces/IWeatherServiceOptions';

const baseUrl = "http://api.openweathermap.org/data/2.5/";

// Service to access the WUnderground API
export class WeatherService implements IWeatherService {
    private options: IWeatherServiceOptions;

    public async start(context: IReactronServiceContext): Promise<void> {
        console.log('WeatherService.start()');
    }

    public async stop(): Promise<void> {
        console.log('WeatherService.stop()');
    }

    public async setOptions(options: IWeatherServiceOptions): Promise<void> {
        console.log('WeatherService.setOptions()');
        this.options = options;
    }

    public async getCurrentConditions(location: WeatherModels.ILocationRequest): Promise<any> {
        const url = this.getApiUrl('weather', location);
        return this.getResponse(url);
    }

    public async getFiveDaysForecast(location: WeatherModels.ILocationRequest): Promise<WeatherModels.IWeatherResponse> {
        const url = this.getApiUrl('forecast', location);
        return this.getResponse(url);
    }

    private getApiUrl(endpoint: string, location: WeatherModels.ILocationRequest): string {
        let url = baseUrl + endpoint
            + '?APPID=' + this.options.apiKey
            + '&units=' + this.options.units
            + '&lang=' + this.options.lang;

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

    private async getResponse(url: string): Promise<WeatherModels.IWeatherResponse> {
        console.log('WeatherService.get(' + url + ')');

        // TODO: cache

        const response = await request.get(url, { json: true, resolveWithFullResponse: true }) as request.FullResponse;

        if (response.statusCode !== 200) {
            throw new Error(response.statusMessage);
        }

        return response.body;
    }
}