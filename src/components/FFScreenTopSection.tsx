import { View, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import IconIonicons from "react-native-vector-icons/Ionicons";
import FFText from "./FFText";
import { useTheme } from "@/src/hooks/useTheme";
import { spacing } from "../theme";

type FFScreenTopSectionProps = {
  navigation: any;
  title: string;
  titlePosition?: "center" | "left";
  colorDark?: string;
  colorLight?: string;
  showBackButton?: boolean;
};

const FFScreenTopSection: React.FC<FFScreenTopSectionProps> = ({
  navigation,
  title,
  titlePosition = "center",
  colorDark = "#333",
  colorLight = "#fff",
  showBackButton = true,
}) => {
  const { theme } = useTheme();
  const backgroundColor = "transparent";

  return (
    <View
      style={[
        styles.container,
        titlePosition === "left" && styles.containerLeft,
        { backgroundColor },
      ]}
    >
      {showBackButton && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <IconIonicons
            name="chevron-back"
            size={24}
            color={theme === "light" ? "#000" : "#fff"}
          />
        </TouchableOpacity>
      )}
      <FFText
        fontSize="lg"
        colorDark="#fff"
        colorLight="#000"
        style={{
          ...(titlePosition === "center"
            ? styles.centerTitle
            : styles.leftTitle),
        }}
      >
        {title}
      </FFText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 16,
    alignItems: "center",
    position: "relative",
  },
  containerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    left: 16,
    top: 16,
    marginRight: spacing.md,
  },
  centerTitle: {
    textAlign: "center",
  },
  leftTitle: {
    marginLeft: 40,
  },
});

export default FFScreenTopSection;
