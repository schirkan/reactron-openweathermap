import { ILocationResponse } from "./ILocationResponse";
import { IWeatherCondition } from "./IWeatherCondition";

export interface IWeatherCurrent {
    location: ILocationResponse;
    condition: IWeatherCondition;
}