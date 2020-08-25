import React from "react";
import { Text } from "react-native";

export const textStyles = {
  fontFamily: "Bitter-Regular",
};

const MyText = ({style, ...props}) => (
  <Text {...props} style={[textStyles, style]} />
);

export default MyText;
