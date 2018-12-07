export interface ILocationRequest {
    cityName?: string;
    zip?: string;
    coords?: {
        lon: number;
        lat: number;
    };
    cityId?: number;
}