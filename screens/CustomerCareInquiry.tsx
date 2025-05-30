import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import FFScreenTopSection from "@/src/components/FFScreenTopSection";
import { useNavigation } from "@react-navigation/native";
import { MainStackParamList } from "@/src/navigation/AppNavigator";
import { StackNavigationProp } from "@react-navigation/stack";
import FFButton from "@/src/components/FFButton";
import { CustomerCareInquiryService } from "@/src/services/CustomerCareInquiryService";
import FFModal from "@/src/components/FFModal";
import FFSlider from "@/src/components/FFSlider";

export type CustomerCareInquiryScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  "CustomerCareInquiry"
>;

const CustomerCareInquiry = () => {
  const navigation = useNavigation<CustomerCareInquiryScreenNavigationProp>();
  const [loopNumber, setLoopNumber] = useState(1);
  const [isShowModal, setIsShowModal] = useState(false);
  const [loopedCount, setLoopedCount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateSeeding = async () => {
    if (!isGenerating) return;

    try {
      const res = await CustomerCareInquiryService.generateSeeding();
      const { EC } = res;
      console.log("The following is the inquiry:", res);

      if (EC === 0) {
        setLoopedCount((prev) => {
          const newCount = prev + 1;

          if (newCount >= loopNumber) {
            setIsGenerating(false);
            return 0;
          } else {
            setTimeout(() => {
              handleGenerateSeeding();
            }, 60000);
            return newCount;
          }
        });
      } else {
        setIsGenerating(false);
        setLoopedCount(0);
      }
    } catch (error) {
      console.error("HS: Exception during seeding:", error);
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
      <FFScreenTopSection
        title="Customer Care Inquiry"
        navigation={navigation}
      />
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

export default CustomerCareInquiry;
