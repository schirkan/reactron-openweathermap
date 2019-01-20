import { ILocationResponse } from "./ILocationResponse";
import { IWeatherResponseCondition } from "./IWeatherResponseCondition";

export interface IWeatherResponseForecast {
    city: ILocationResponse;
    list: IWeatherResponseCondition[];
}