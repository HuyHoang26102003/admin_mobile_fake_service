import React from "react";
import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import FFText from "./FFText";
import FFProgressIndicator from "./FFProgressIndicator";

interface FFTrackingModalProps {
  visible: boolean;
  current: number;
  total: number;
  isActive: boolean;
  entityType: string;
  onCancel: () => void;
  timeRemaining?: number;
}

const FFTrackingModal: React.FC<FFTrackingModalProps> = ({
  visible,
  current,
  total,
  isActive,
  entityType,
  onCancel,
  timeRemaining,
}) => {
  // Calculate next generation time in seconds
  const formatTimeRemaining = () => {
    if (!timeRemaining || timeRemaining <= 0) return null;
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const getStatusTitle = () => {
    if (current === total) return "Generation Complete";
    return `Generating ${entityType}s`;
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Title */}
          <FFText fontSize="lg" fontWeight="700" style={styles.title}>
            {getStatusTitle()}
          </FFText>

          {/* Progress info */}
          <View style={styles.progressContainer}>
            <FFProgressIndicator
              current={current}
              total={total}
              isActive={isActive}
              entityType={entityType}
            />
          </View>

          {/* Time remaining */}
          {isActive && current < total && timeRemaining && (
            <View style={styles.timeContainer}>
              <FFText fontSize="md" fontWeight="600" style={styles.timeLabel}>
                Next generation in:
              </FFText>
              <FFText fontSize="xl" fontWeight="700" style={styles.timeValue}>
                {formatTimeRemaining()}
              </FFText>
            </View>
          )}

          {/* Cancel button */}
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <FFText
              fontSize="md"
              fontWeight="600"
              style={styles.cancelButtonText}
            >
              {current === total ? "Close" : "Cancel"}
            </FFText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    marginBottom: 15,
    textAlign: "center",
  },
  progressContainer: {
    width: "100%",
    marginVertical: 10,
  },
  timeContainer: {
    alignItems: "center",
    marginVertical: 15,
    padding: 10,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    width: "100%",
  },
  timeLabel: {
    color: "#4B5563",
    marginBottom: 5,
  },
  timeValue: {
    color: "#4F46E5",
  },
  cancelButton: {
    marginTop: 15,
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "white",
  },
});

export default FFTrackingModal;
