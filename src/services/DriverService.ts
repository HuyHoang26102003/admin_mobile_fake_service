import axiosInstance from "../utils/axiosConfig";

export const DriverService = {
  generateSeeding: async () => {
    try {
      const response = await axiosInstance.post("/companion-admin/drivers");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
