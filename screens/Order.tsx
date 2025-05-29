import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import FFScreenTopSection from "@/src/components/FFScreenTopSection";
import { useNavigation } from "@react-navigation/native";
import { MainStackParamList } from "@/src/navigation/AppNavigator";
import { StackNavigationProp } from "@react-navigation/stack";
import FFButton from "@/src/components/FFButton";
import { OrderService } from "@/src/services/OrderService";
import FFModal from "@/src/components/FFModal";
import FFSlider from "@/src/components/FFSlider";

export type OrderScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  "Order"
>;

const Order = () => {
  const navigation = useNavigation<OrderScreenNavigationProp>();
  const [loopNumber, setLoopNumber] = useState(1);
  const [isShowModal, setIsShowModal] = useState(false);
  const [loopedCount, setLoopedCount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateSeeding = async () => {
    // Guard 1: If generation was stopped externally or by a previous iteration.
    if (!isGenerating) {
      console.log("HS: Aborting, isGenerating is false.");
      return;
    }

    // Guard 2: If we've already reached/passed the target number of loops.
    if (loopedCount >= loopNumber) {
      console.log(
        `HS: Aborting, loopedCount (${loopedCount}) >= loopNumber (${loopNumber}).`
      );
      setIsGenerating(false); // Ensure generation is marked as stopped.
      setLoopedCount(0); // Reset for the next user-initiated generation.
      return;
    }

    try {
      const res = await OrderService.generateSeeding();
      const { EC } = res;
      console.log("check order what heerere", res);
      if (EC === 0) {
        // Successfully generated one item.
        const newLoopedCount = loopedCount + 1;
        setLoopedCount(newLoopedCount);

        // Check if this was the last one needed.
        if (newLoopedCount >= loopNumber) {
          console.log(
            `HS: Target ${loopNumber} reached or exceeded with ${newLoopedCount}. Stopping.`
          );
          setIsGenerating(false);
          setLoopedCount(0); // Reset for next time.
        } else {
          // Not done yet, schedule the next one.
          console.log(
            `HS: Generated ${newLoopedCount}/${loopNumber}. Scheduling next.`
          );
          setTimeout(() => {
            handleGenerateSeeding(); // Recursive call.
          }, 60000); // 60-second delay.
        }
      } else {
        // API call reported an error (EC !== 0).
        console.error(`HS: API error EC: ${EC}. Stopping.`);
        setIsGenerating(false);
        setLoopedCount(0); // Reset.
      }
    } catch (error) {
      // Network or other exception during API call.
      console.error("HS: Exception during seeding:", error);
      setIsGenerating(false);
      setLoopedCount(0); // Reset.
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
    setIsGenerating(true);
    setIsShowModal(false);
  };

  const handleOpenModal = () => {
    setIsGenerating(false);
    setLoopedCount(0);
    setIsShowModal(true);
  };

  const handleCloseModal = () => {
    setIsGenerating(false);
    setIsShowModal(false);
  };

  return (
    <View>
      <FFScreenTopSection title="Order" navigation={navigation} />
      <FFButton onPress={handleOpenModal}>Generate Seeding</FFButton>
      <FFModal onClose={handleCloseModal} visible={isShowModal}>
        <View style={styles.modalContent}>
          <Text style={styles.label}>Number of records to generate</Text>
          <Text style={styles.value}>{loopNumber}</Text>
          <FFSlider
            value={loopNumber}
            onValueChange={setLoopNumber}
            minimumValue={1}
            maximumValue={5}
            step={1}
          />
          <FFButton onPress={handleStartGeneration}>Generate</FFButton>
        </View>
      </FFModal>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default Order;
