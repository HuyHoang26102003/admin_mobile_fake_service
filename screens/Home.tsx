import { View, Text } from "react-native";
import React from "react";
import FFView from "@/src/components/FFView";
import { colors, spacing } from "@/src/theme";
import FFText from "@/src/components/FFText";
import { useNavigation } from "@react-navigation/native";
import {
  StackNavigationProp,
  StackNavigatorProps,
} from "@react-navigation/stack";
import { MainStackParamList } from "../src/navigation/AppNavigator";
import FFScreenTopSection from "@/src/components/FFScreenTopSection";

const AD_Home_Cards: {
  id: number;
  title: string;
  navigateTo: keyof MainStackParamList;
}[] = [
  {
    id: 1,
    title: "Customer",
    navigateTo: "Customer",
  },
  {
    id: 2,
    title: "Driver",
    navigateTo: "Driver",
  },
  {
    id: 3,
    title: "Restaurant",
    navigateTo: "Restaurant",
  },
  {
    id: 4,
    title: "Customer Care",
    navigateTo: "CustomerCare",
  },
  {
    id: 5,
    title: "Customer Care Inquiry",
    navigateTo: "CustomerCareInquiry",
  },
  {
    id: 6,
    title: "Order",
    navigateTo: "Order",
  },
];

export type HomeSreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  "Home"
>;

const Home = () => {
  const navigation = useNavigation<HomeSreenNavigationProp>();
  return (
    <>
      <FFScreenTopSection
        title="The Sim"
        showBackButton={false}
        navigation={navigation}
      />
      <View
        style={{
          flex: 1,
          padding: spacing.md,
          flexDirection: "row",
          gap: spacing.sm,
          width: "100%",
          flexWrap: "wrap",
        }}
      >
        {AD_Home_Cards.map((item) => (
          <FFView
            onPress={() => navigation.navigate(item.navigateTo)}
            key={item.id}
            style={{
              padding: spacing.md,
              borderRadius: spacing.sm,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.white,
              elevation: spacing.sm,
              height: spacing.xxxxl,
              width: "48%",
            }}
          >
            <FFText style={{ margin: "auto" }}>{item.title}</FFText>
          </FFView>
        ))}
      </View>
    </>
  );
};

export default Home;
