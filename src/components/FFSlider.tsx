import React from "react";
import { View, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import colors from "../theme/colors";

interface FFSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
}

const FFSlider: React.FC<FFSliderProps> = ({
  value,
  onValueChange,
  minimumValue = 1,
  maximumValue = 5,
  step = 1,
}) => {
  const handleValueChange = (newValue: number) => {
    // Round to nearest step to prevent floating point issues
    const roundedValue = Math.round(newValue);
    if (roundedValue !== value) {
      onValueChange(roundedValue);
    }
  };

  return (
    <View style={styles.container}>
      <Slider
        style={styles.slider}
        value={value}
        onValueChange={handleValueChange}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        minimumTrackTintColor={colors.primary_dark}
        maximumTrackTintColor={colors.black}
        thumbTintColor={colors.primary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
  },
  slider: {
    width: "100%",
    height: 40,
  },
});

export default FFSlider;
