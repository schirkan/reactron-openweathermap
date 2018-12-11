import { IReactronComponentDefinition } from '@schirkan/reactron-interfaces';
import { WeatherComponent } from './components/WeatherComponent';
import { WeatherIcon } from './components/WeatherIcon';

export * from './components/WeatherComponent';

export const components: IReactronComponentDefinition[] = [{
    component: WeatherComponent,
    description: 'Weather Forecast by OpenWeatherMap',
    displayName: 'Weather Forecast',
    fields: [{
        description: 'City Name',
        displayName: 'City Name',
        name: 'cityName',
        valueType: 'string'
    }, {
        description: 'Zip, Country Code',
        displayName: 'Zip, Country Code',
        name: 'zip',
        valueType: 'string'
    }, {
        description: 'Coordinates',
        displayName: 'Coordinates',
        name: 'coords',
        valueType: 'object',
        fields: [{
            description: 'lat',
            displayName: 'lat',
            name: 'lat',
            valueType: 'number'
        }, {
            description: 'lon',
            displayName: 'lon',
            name: 'lon',
            valueType: 'number'
        }]
    }, {
        description: 'City Id',
        displayName: 'City Id',
        name: 'cityId',
        valueType: 'number'
    }],
    name: 'WeatherComponent'
}, {
    component: WeatherIcon,
    type: 'internal',
    name: 'WeatherIcon',
    displayName: 'WeatherIcon'
}];