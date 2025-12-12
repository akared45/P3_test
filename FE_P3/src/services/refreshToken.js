import axios from "axios";
import { setAccessToken, clearAccessToken } from "../utils/authMemory";

const refreshClient = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const refreshTokenRequest = async () => {
  try {
    const res = await refreshClient.post("/auth/refresh");
    const accessToken = res.data.accessToken || res.data.auth?.accessToken;

    if (!accessToken) {
      throw new Error("Khong nhan duoc access token moi");
    }
    setAccessToken(accessToken);

    return { accessToken };
  } catch (error) {
    console.error("Loi :", error);
    clearAccessToken();
    throw error;
  }
};