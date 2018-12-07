export interface ILocationResponse {
    id: number;
    name: string;
    country: string;
    coords: {
        lat: number;
        lon: number;
    };
}