import { ILocationResponse } from "./ILocationResponse";
import { IWeatherCondition } from "./IWeatherCondition";

export interface IWeatherForecast {
    location: ILocationResponse;
    conditions: IWeatherCondition[];
}