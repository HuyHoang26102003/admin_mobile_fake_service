import axiosInstance from "../utils/axiosConfig";

export const CustomerCareInquiryService = {
  generateSeeding: async () => {
    try {
      const response = await axiosInstance.post(
        "/companion-admin/customer-care-inquiries"
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
