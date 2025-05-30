import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  PanResponder,
} from "react-native";
import FFText from "./FFText";
import { LinearGradient } from "expo-linear-gradient";

interface FFBottomTrackingSheetProps {
  visible: boolean;
  current: number;
  total: number;
  isActive: boolean;
  entityType: string;
  onCancel: () => void;
  timeRemaining?: number;
}

const { height } = Dimensions.get("window");
const SHEET_HEIGHT = 220;

const FFBottomTrackingSheet: React.FC<FFBottomTrackingSheetProps> = ({
  visible,
  current,
  total,
  isActive,
  entityType,
  onCancel,
  timeRemaining,
}) => {
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // Set up pan responder for swipe down to dismiss
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > SHEET_HEIGHT / 3) {
          onCancel();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Calculate progress percentage
  const progress = (current / total) * 100;

  // Format time remaining
  const formatTimeRemaining = () => {
    if (!timeRemaining || timeRemaining <= 0) return "Starting...";
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Animate sheet in/out when visibility changes
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SHEET_HEIGHT,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, translateY, opacity]);

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents={visible ? "auto" : "none"}>
      <Animated.View
        style={[styles.backdrop, { opacity }]}
        onTouchEnd={onCancel}
      />

      <Animated.View
        style={[
          styles.sheetContainer,
          {
            transform: [{ translateY }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        {/* Pull indicator */}
        <View style={styles.pullIndicator} />

        {/* Status badge */}
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: isActive
                ? "#4F46E5"
                : current === total
                ? "#10B981"
                : "#EF4444",
            },
          ]}
        >
          <FFText fontSize="sm" fontWeight="600" style={styles.statusText}>
            {isActive
              ? "GENERATING"
              : current === total
              ? "COMPLETED"
              : "CANCELED"}
          </FFText>
        </View>

        {/* Title */}
        <FFText fontSize="lg" fontWeight="700" style={styles.title}>
          {current === total
            ? `Generated ${total} ${entityType}${total > 1 ? "s" : ""}`
            : `Generating ${entityType}s (${current}/${total})`}
        </FFText>

        {/* Progress bar */}
        <View style={styles.progressBarContainer}>
          <LinearGradient
            colors={["#4F46E5", "#7C3AED"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressBar, { width: `${progress}%` }]}
          />
        </View>

        {/* Time info */}
        {isActive && current < total && (
          <View style={styles.timeRow}>
            <View style={styles.timeContainer}>
              <FFText fontSize="sm" fontWeight="500" style={styles.timeLabel}>
                NEXT GENERATION IN
              </FFText>
              <FFText fontSize="xl" fontWeight="700" style={styles.timeValue}>
                {formatTimeRemaining()}
              </FFText>
            </View>

            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <FFText fontSize="sm" fontWeight="600" style={styles.cancelText}>
                CANCEL
              </FFText>
            </TouchableOpacity>
          </View>
        )}

        {/* Done state */}
        {!isActive && (
          <TouchableOpacity style={styles.doneButton} onPress={onCancel}>
            <FFText fontSize="md" fontWeight="600" style={styles.doneText}>
              {current === total ? "DONE" : "CLOSE"}
            </FFText>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  sheetContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    height: SHEET_HEIGHT,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  pullIndicator: {
    width: 40,
    height: 5,
    backgroundColor: "#CBD5E1",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 10,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 12,
  },
  statusText: {
    color: "white",
  },
  title: {
    marginBottom: 16,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 16,
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeContainer: {
    flex: 1,
  },
  timeLabel: {
    color: "#6B7280",
    marginBottom: 4,
  },
  timeValue: {
    color: "#111827",
  },
  cancelButton: {
    backgroundColor: "#FEE2E2",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelText: {
    color: "#EF4444",
  },
  doneButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  doneText: {
    color: "white",
  },
});

export default FFBottomTrackingSheet;
