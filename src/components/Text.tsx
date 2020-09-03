import React, { ReactElement } from "react";
import { Text as ReactNativeText } from "react-native";
import colors from 'styles/colors';

export const textStyles = {
  fontFamily: "Bitter-Regular",
  color: colors.gray20,
};

export interface Text {
  style?: any;
  [x:string]: any;
}

const Text = ({style, ...props}: Text): ReactElement => (
  <ReactNativeText {...props} style={[textStyles, style]} />
);

export default Text;
