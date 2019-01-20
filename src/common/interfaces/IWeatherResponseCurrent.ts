export interface IWeatherResponseCurrent {
    dt: number; // Time of data forecasted, unix, UTC
    main: {
        temp: number; // Temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
        temp_min: number; // Minimum temperature at the moment of calculation. This is deviation from 'temp' that is possible for large cities and megalopolises geographically expanded (use these parameter optionally). Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
        temp_max: number; // Maximum temperature at the moment of calculation. This is deviation from 'temp' that is possible for large cities and megalopolises geographically expanded (use these parameter optionally). Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
        pressure: number; // Atmospheric pressure on the sea level by default, hPa
        humidity: number; // Humidity, %
    };
    weather: [{
        id: number; // Weather condition id
        main: string; // Group of weather parameters (Rain, Snow, Extreme etc.)
        description: string; // Weather condition within the group
        icon: string; // Weather icon id
    }];
    clouds: {
        all: number; // Cloudiness, %
    };
    wind: {
        speed: number; // Wind speed. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour.
        deg: number; // Wind direction, degrees (meteorological)
    };
    rain: {
        '3h': number; // Rain volume for last 3 hours, mm
    };
    snow: {
        '3h': number; // Snow volume for last 3 hours
    };
    sys:{
        country: string;
        sunrise: number;
        sunset: number;
    };
    id: number;
    name: string; // city
    coords: {
        lat: number;
        lon: number;
    };
}