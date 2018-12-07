import { ILocationResponse } from "./ILocationResponse";
import { IWeatherResponseCondition } from "./IWeatherResponseCondition";

export interface IWeatherResponse {
    city: ILocationResponse;
    list: IWeatherResponseCondition[];
}