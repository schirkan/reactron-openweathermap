import { IReactronServiceDefinition } from '@schirkan/reactron-interfaces';
import { WeatherService } from './services/WeatherService';

export const services: IReactronServiceDefinition[] = [{
    description: 'Service for OpenWeatherMap',
    displayName: 'Weather Service',
    fields: [{
        displayName: 'ApiKey for OpenWeatherMap',
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
    }],
    name: 'WeatherService',
    service: WeatherService
}];