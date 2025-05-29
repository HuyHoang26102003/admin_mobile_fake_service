import axiosInstance from "../utils/axiosConfig";

export const CustomerService = {
  generateSeeding: async () => {
    try {
      const response = await axiosInstance.post("/companion-admin/customers");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
