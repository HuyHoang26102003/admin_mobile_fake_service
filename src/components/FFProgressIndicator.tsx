import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import FFText from "./FFText";

interface FFProgressIndicatorProps {
  current: number;
  total: number;
  isActive: boolean;
  entityType: string;
}

const FFProgressIndicator: React.FC<FFProgressIndicatorProps> = ({
  current,
  total,
  isActive,
  entityType,
}) => {
  // Calculate progress percentage
  const progress = (current / total) * 100;

  // Format the waiting message
  const getWaitingMessage = () => {
    if (current === 0) return "";
    const remaining = total - current;
    return `Waiting for next ${entityType} (${remaining} remaining)...`;
  };

  // Show status message based on progress
  const getStatusMessage = () => {
    if (current === 0 && !isActive) return "";
    if (current === 0 && isActive)
      return `Starting ${entityType} generation...`;
    if (current === total)
      return `All ${total} ${entityType}s generated successfully!`;
    return `Generated ${current} of ${total} ${entityType}s`;
  };

  if (!isActive && current === 0) return null;

  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>

      {/* Status text */}
      <FFText fontSize="md" fontWeight="600" style={styles.statusText}>
        {getStatusMessage()}
      </FFText>

      {/* Waiting indicator */}
      {isActive && current < total && (
        <View style={styles.waitingContainer}>
          <ActivityIndicator size="small" color="#4F46E5" />
          <FFText fontSize="sm" fontWeight="500" style={styles.waitingText}>
            {getWaitingMessage()}
          </FFText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    elevation: 1,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4F46E5",
    borderRadius: 4,
  },
  statusText: {
    textAlign: "center",
    marginVertical: 4,
  },
  waitingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  waitingText: {
    marginLeft: 8,
    color: "#6B7280",
  },
});

export default FFProgressIndicator;
