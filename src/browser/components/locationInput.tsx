import { IInputComponentProps } from '@schirkan/reactron-interfaces';
import * as React from 'react';

export const locationInput = (props: IInputComponentProps) => {
  return props && props.value && (props.value.cityName || props.value.zip) ||
    (<span style={{ color: 'red' }}>missing</span>);
};