export interface IWeatherCondition {
    dt: number; // Time of data forecasted, unix, UTC
    dt_txt: string; // Data/time of calculation, UTC
    temp: number; // Temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
    pressure: number; // Atmospheric pressure on the sea level by default, hPa
    sea_level: number; // Atmospheric pressure on the sea level, hPa
    grnd_level: number; // Atmospheric pressure on the ground level, hPa
    humidit: number; // Humidity, %
    weather_id: number; // Weather condition id
    weather_txt: string; // Group of weather parameters (Rain, Snow, Extreme etc.)
    weather_description: string; // Weather condition within the group
    weather_icon: string; // Weather icon id
    clouds: number; // Cloudiness, %
    wind_speed: number; // Wind speed. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour.
    wind_deg: number; // Wind direction, degrees (meteorological)
    rain: number; // Rain volume for last 3 hours, mm
    snow: number; // Snow volume for last 3 hours
}