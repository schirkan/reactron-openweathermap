import { IReactronService } from "@schirkan/reactron-interfaces";
import { ILocationRequest } from "./ILocationRequest";
import { IWeatherForecast } from "./IWeatherForecast";
import { IWeatherServiceOptions } from "./IWeatherServiceOptions";

export interface IWeatherService extends IReactronService<IWeatherServiceOptions> {    
    getCurrentConditions(location: ILocationRequest): Promise<any>;
    getFiveDaysForecast(location: ILocationRequest): Promise<IWeatherForecast>;
}