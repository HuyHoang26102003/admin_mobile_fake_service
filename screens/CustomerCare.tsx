import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import FFScreenTopSection from "@/src/components/FFScreenTopSection";
import { useNavigation } from "@react-navigation/native";
import { MainStackParamList } from "@/src/navigation/AppNavigator";
import { StackNavigationProp } from "@react-navigation/stack";
import FFButton from "@/src/components/FFButton";
import { CustomerCareService } from "@/src/services/CustomerCareService";
import FFModal from "@/src/components/FFModal";
import FFSlider from "@/src/components/FFSlider";
import FFBottomTrackingSheet from "@/src/components/FFBottomTrackingSheet";

export type CustomerCareScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  "CustomerCare"
>;

const CustomerCare = () => {
  const navigation = useNavigation<CustomerCareScreenNavigationProp>();
  const [loopNumber, setLoopNumber] = useState(1);
  const [isShowModal, setIsShowModal] = useState(false);
  const [loopedCount, setLoopedCount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showTrackingSheet, setShowTrackingSheet] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start countdown timer for next generation
  const startCountdown = () => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Set initial time (60 seconds)
    setTimeRemaining(60);

    // Start interval
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Clear interval when reaching 0
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleGenerateSeeding = async () => {
    try {
      const res = await CustomerCareService.generateSeeding();
      const { EC } = res;
      if (EC === 0) {
        setLoopedCount((prev) => {
          const newCount = prev + 1;

          if (newCount >= loopNumber) {
            setIsGenerating(false);
            setShowSuccess(true);
            // Keep the sheet open to show completion
            setTimeout(() => {
              setShowSuccess(false);
              return 0; // Reset counter
            }, 3000);
            return newCount;
          } else {
            // Schedule next generation after delay
            setTimeout(() => {
              handleGenerateSeeding();
            }, 60000);

            // Start countdown timer
            startCountdown();
            return newCount;
          }
        });
      } else {
        // If there's an error code
        setIsGenerating(false);
        setLoopedCount(0);
      }
    } catch (error) {
      console.error("Error generating seeding:", error);
      setIsGenerating(false);
      setLoopedCount(0);
    }
  };

  useEffect(() => {
    const generateRecords = async () => {
      if (!isGenerating || loopedCount >= loopNumber) return;
      await handleGenerateSeeding();
    };

    if (isGenerating && loopedCount === 0) {
      generateRecords();
    }
  }, [loopedCount, isGenerating, loopNumber]);

  const handleStartGeneration = () => {
    setLoopedCount(0);
    setShowSuccess(false);
    setIsGenerating(true);
    setIsShowModal(false);
    setShowTrackingSheet(true);
    startCountdown(); // Start the countdown immediately
  };

  const handleOpenModal = () => {
    setIsGenerating(false);
    setLoopedCount(0);
    setShowSuccess(false);
    setIsShowModal(true);
  };

  const handleCloseModal = () => {
    setIsGenerating(false);
    setIsShowModal(false);
  };

  const handleCancelGeneration = () => {
    setIsGenerating(false);
    setLoopedCount(0);
    setShowTrackingSheet(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleSliderChange = (value: number) => {
    // Ensure value is always an integer between 1-5
    const newValue = Math.max(1, Math.min(5, Math.round(value)));
    setLoopNumber(newValue);
  };

  return (
    <View style={styles.container}>
      <FFScreenTopSection title="Customer Care" navigation={navigation} />

      {/* Generate Button */}
      <View style={styles.buttonContainer}>
        <FFButton onPress={handleOpenModal}>Generate Seeding</FFButton>
      </View>

      {/* Selection Modal */}
      <FFModal onClose={handleCloseModal} visible={isShowModal}>
        <View style={styles.modalContent}>
          <Text style={styles.label}>Number of records to generate</Text>
          <Text style={styles.value}>{loopNumber}</Text>
          <FFSlider
            value={loopNumber}
            onValueChange={handleSliderChange}
            minimumValue={1}
            maximumValue={5}
            step={1}
          />
          <FFButton onPress={handleStartGeneration}>Generate</FFButton>
        </View>
      </FFModal>

      {/* Tracking Bottom Sheet */}
      <FFBottomTrackingSheet
        visible={showTrackingSheet}
        current={showSuccess ? loopNumber : loopedCount}
        total={loopNumber}
        isActive={isGenerating}
        entityType="customer care ticket"
        onCancel={handleCancelGeneration}
        timeRemaining={timeRemaining}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  buttonContainer: {
    marginTop: 16,
  },
  modalContent: {
    padding: 16,
    gap: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CustomerCare;
