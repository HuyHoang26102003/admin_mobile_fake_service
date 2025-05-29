import axiosInstance from "../utils/axiosConfig";

export const RestaurantService = {
  generateSeeding: async () => {
    try {
      const response = await axiosInstance.post("/companion-admin/restaurants");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
