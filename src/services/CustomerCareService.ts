import axiosInstance from "../utils/axiosConfig";

export const CustomerCareService = {
  generateSeeding: async () => {
    try {
      const response = await axiosInstance.post(
        "/companion-admin/customer-care"
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
