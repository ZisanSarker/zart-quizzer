import api from "./api";
import { ChangePasswordData } from "@/types/user";

export const deleteAccount = async (): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(
    "/settings/deleteAccount"
  );
  return response.data;
};

export const changePassword = async (
  data: ChangePasswordData
): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>(
    "/settings/change-password",
    data
  );
  return response.data;
};
