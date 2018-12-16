import { IInputComponentProps, IReactronComponentDefinition } from '@schirkan/reactron-interfaces';
import { WeatherForecast } from './components/WeatherForecast';
import { WeatherIcon } from './components/WeatherIcon';

export * from './components/WeatherForecast';

export const components: IReactronComponentDefinition[] = [{
    component: WeatherForecast,
    description: 'Weather Forecast by OpenWeatherMap',
    displayName: 'Weather Forecast',
    fields: [{
        description: 'Location',
        displayName: 'Location',
        name: 'location',
        valueType: 'object',
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
        // }, {
        //     description: 'Coordinates',
        //     displayName: 'Coordinates',
        //     name: 'coords',
        //     valueType: 'object',
        //     fields: [{
        //         description: 'lat',
        //         displayName: 'lat',
        //         name: 'lat',
        //         valueType: 'number'
        //     }, {
        //         description: 'lon',
        //         displayName: 'lon',
        //         name: 'lon',
        //         valueType: 'number'
        //     }]
        // }, {
        //     description: 'City Id',
        //     displayName: 'City Id',
        //     name: 'cityId',
        //     valueType: 'number'
        }],
        inputControl: (props: IInputComponentProps) => {
          return props && props.value && (props.value.cityName || props.value.zip) || '';
        }
    }, {
        description: 'Show header',
        displayName: 'Show header',
        name: 'showHeader',
        valueType: 'boolean',
        defaultValue: true
    }, {
        description: 'Show date header',
        displayName: 'Show date header',
        name: 'showDateHeader',
        valueType: 'boolean',
        defaultValue: true
    }, {
        description: 'Show shadow',
        displayName: 'Show shadow',
        name: 'showShadow',
        valueType: 'boolean',
        defaultValue: true
    }, {
        description: 'see https://momentjs.com/',
        displayName: 'Time format',
        name: 'timeFormat',
        valueType: 'string',
        defaultValue: 'LT'
    }, {
        description: 'Forecast days',
        displayName: 'Forecast days',
        name: 'forecastDays',
        valueType: 'number',
        values: [
            { text: '1', value: 1 },
            { text: '2', value: 2 },
            { text: '3', value: 3 },
            { text: '4', value: 4 },
            { text: '5', value: 5 }
        ],
        defaultValue: 2
    }],
    name: 'WeatherComponent'
}, {
    component: WeatherIcon,
    type: 'internal',
    name: 'WeatherIcon',
    displayName: 'WeatherIcon'
}];