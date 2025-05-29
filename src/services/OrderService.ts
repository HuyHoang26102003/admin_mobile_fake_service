import axiosInstance from "../utils/axiosConfig";

export const OrderService = {
  generateSeeding: async () => {
    try {
      const response = await axiosInstance.post("/companion-admin/order");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
