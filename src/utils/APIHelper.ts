import axiosInstance from "./axiosInstance";

export const fetcher = async <T>(url: string): Promise<T> => {
  try {
    const response = await axiosInstance.get<T>(url);
    return response.data;
  } catch (error) {
    console.error(`GET request to ${url} failed `, error);
    throw error;
  }
};

export const postRequest = async <T, U>(
  url: string,
  data: T,
  isMultipart = false
): Promise<U> => {
  try {
    const headers = isMultipart
      ? { "Content-Type": "multipart/form-data" }
      : { "Content-Type": "application/json" };
    const response = await axiosInstance.post<U>(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error(`Post request to ${url} failed `, error);
    throw error;
  }
};

export const putRequest = async <T, U>(
  url: string,
  data: T,
  isMultipart = false
): Promise<U> => {
  try {
    const headers = isMultipart
      ? { "Content-Type": "multipart/form-data" }
      : { "Content-Type": "application/json" };
    const response = await axiosInstance.put<U>(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error(`Post request to ${url} failed `, error);
    throw error;
  }
};

export const deleteRequest = async <T, U>(url: string, data: T): Promise<U> => {
  try {
    const response = await axiosInstance.delete<U>(url, { data });
    return response.data;
  } catch (error) {
    console.error(`Post request to ${url} failed `, error);
    throw error;
  }
};
