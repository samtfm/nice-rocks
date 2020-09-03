import * as React from 'react';
import { NavigationContainerRef } from '@react-navigation/native';

export const navigationRef = React.createRef<NavigationContainerRef>();

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function navigate(name: string, params: any): void {
  navigationRef?.current?.navigate(name, params);
}
