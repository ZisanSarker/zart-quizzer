import api from "./api";

export const deleteAccount = async (): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(
    "/settings/deleteAccount"
  );
  return response.data;
};
