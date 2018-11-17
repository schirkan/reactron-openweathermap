import { IReactronService } from "@schirkan/reactron-interfaces";
import { IWeatherServiceOptions } from "./IWeatherServiceOptions";

export interface IWeatherService extends IReactronService<IWeatherServiceOptions> {    
    getCurrentConditions(location: WeatherModels.ILocationRequest): Promise<any>;
    getFiveDaysForecast(location: WeatherModels.ILocationRequest): Promise<WeatherModels.IWeatherResponse>;
}