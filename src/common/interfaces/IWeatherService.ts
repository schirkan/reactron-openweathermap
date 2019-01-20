import { IReactronService } from "@schirkan/reactron-interfaces";
import { ILocationRequest } from "./ILocationRequest";
import { IWeatherForecast } from "./IWeatherForecast";
import { IWeatherServiceOptions } from "./IWeatherServiceOptions";
import { IWeatherCurrent } from "./IWeatherCurrent";

export interface IWeatherService extends IReactronService<IWeatherServiceOptions> {    
    getCurrentConditions(location: ILocationRequest): Promise<IWeatherCurrent>;
    getFiveDaysForecast(location: ILocationRequest): Promise<IWeatherForecast>;
}