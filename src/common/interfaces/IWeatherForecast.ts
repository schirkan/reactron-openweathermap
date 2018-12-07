import { ILocationResponse } from "./ILocationResponse";
import { IWeatherCondition } from "./IWeatherCondition";

export interface IWeatherForecast {
    city: ILocationResponse;
    list: IWeatherCondition[];
}