import React from "react";
import { Text } from "react-native";
import colors from 'styles/colors';

export const textStyles = {
  fontFamily: "Bitter-Regular",
  color: colors.gray20,
};

const MyText = ({style, ...props}) => (
  <Text {...props} style={[textStyles, style]} />
);

export default MyText;
