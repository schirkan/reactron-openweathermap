import * as React from 'react';

let styleSheetInjected = false;
const injectStyleSheet = () => {
  if (styleSheetInjected) {
    return;
  }
  styleSheetInjected = true;
  const head = document.head || document.getElementsByTagName('head')[0];
  if (head) {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = '/modules/reactron-openweathermap/public/css/weather-icons.min.css';
    head.appendChild(style);
  }
};

interface IWeatherIconProps {
  weatherId: string | number;
  night?: boolean;
}

export class WeatherIcon extends React.Component<IWeatherIconProps> {
  public componentDidMount() {
    injectStyleSheet();
  }

  public render() {
    const dayOrNight = this.props.night ? 'night' : 'day';
    const iconClassName = 'wi wi-owm-' + dayOrNight + '-' + this.props.weatherId;

    return <i className={iconClassName} />;
  }
}
