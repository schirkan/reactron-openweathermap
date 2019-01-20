export interface IWeatherCondition {
    timestamp: number; // Time of data forecasted, unix, UTC
    timestampText?: string; // Data/time of calculation, UTC
    temp: number; // Temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
    pressure: number; // Atmospheric pressure on the sea level by default, hPa
    pressureSeaLevel?: number; // Atmospheric pressure on the sea level, hPa
    pressureGroundLevel?: number; // Atmospheric pressure on the ground level, hPa
    humidity: number; // Humidity, %
    night: boolean;
    weatherId: number; // Weather condition id
    weatherText: string; // Group of weather parameters (Rain, Snow, Extreme etc.)
    weatherDescription: string; // Weather condition within the group
    weatherIcon: string; // Weather icon id
    clouds: number; // Cloudiness, %
    windSpeed: number; // Wind speed. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour.
    windDegree: number; // Wind direction, degrees (meteorological)
    rain: number; // Rain volume for last 3 hours, mm
    snow: number; // Snow volume for last 3 hours
    sunrise?: number;
    sunset?: number;
}