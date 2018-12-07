import { IReactronServiceDefinition } from '@schirkan/reactron-interfaces';
import { WeatherService } from './services/WeatherService';

// export interfaces
export * from '../common/interfaces/ILocationResponse';
export * from '../common/interfaces/ILocationRequest';
export * from '../common/interfaces/IWeatherCondition';
export * from '../common/interfaces/IWeatherForecast';
export * from '../common/interfaces/IWeatherResponse';
export * from '../common/interfaces/IWeatherResponseCondition';
export * from '../common/interfaces/IWeatherService';
export * from '../common/interfaces/IWeatherServiceOptions';

// export reactron service definition
export const services: IReactronServiceDefinition[] = [{
    description: 'Service for OpenWeatherMap',
    displayName: 'Weather Service',
    fields: [{
        displayName: 'API Key',
        description: 'API Key for OpenWeatherMap. Get yours at https://openweathermap.org/api',
        name: 'apiKey',
        valueType: 'string',
    }, {
        defaultValue: 'de',
        description: 'Language',
        displayName: 'Language',
        name: 'lang',
        valueType: 'string',
        values: [
            { text: 'German', value: 'de' },
            { text: 'English', value: 'en' },
        ]
    }, {
        defaultValue: 'metric',
        description: 'Units',
        displayName: 'Units',
        name: 'units',
        valueType: 'string',
        values: [
            { text: 'Metric (Celsius)', value: 'metric' },
            { text: 'Imperial (Fahrenheit)', value: 'imperial' },
            { text: 'Kelvin', value: '' },
        ]
    }, {
        defaultValue: 15,
        description: 'Cache duration in minutes',
        displayName: 'Cache duration (min)',
        name: 'cacheDuration',
        valueType: 'number',
        minValue: 0,
        maxValue: 120,
        stepSize: 5
    }],
    name: 'WeatherService',
    service: WeatherService
}];