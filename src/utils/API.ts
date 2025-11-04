import {
  LoginData,
  LoginResponse,
  SignupData,
  SignupResponse,
  User,
} from "../types/User";
import { IResponse } from "./axiosInstance";
import { fetcher, postRequest } from "./APIHelper";

export const signup = async (data: SignupData) => {
  try {
    const response = await postRequest<SignupData, IResponse<SignupResponse>>(
      `/auth/register`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (data: LoginData) => {
  try {
    const response = await postRequest<LoginData, IResponse<LoginResponse>>(
      `/auth/login`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const validateToken = async () => {
  try {
    const response = await fetcher<IResponse<User>>("/auth/verify");
    return response.data;
  } catch (error) {
    throw error;
  }
};
