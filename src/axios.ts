import axios from "axios";
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import { UAParser } from "ua-parser-js";

export const baseUrl: string = "https://currency-converter-backend-two.vercel.app";


const generateDeviceId = (rawId: string): string => {
  return CryptoJS.MD5(rawId).toString();
};

const getDeviceName = (): string => {
  const parser = new UAParser();
  const result = parser.getResult();
  return result.device.model || "Unknown";
};

const getDeviceId = (): string => {
  const parser = new UAParser();
  const result = parser.getResult();

  const deviceName: string = `${result.device.model ?? ""}${result.browser.name ?? ""}`;
  const deviceID: string = result.ua ?? "Unknown";
  const preId: string = deviceName + deviceID;

  return generateDeviceId(preId);
};

const instance: AxiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    devicemodel: getDeviceName(),
    deviceuniqueid: getDeviceId(),
    "ngrok-skip-browser-warning": "69420",
  },
});

instance.interceptors.request.use(
  (request: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = Cookies.get("token");

    if (request.headers?.set) {
      request.headers.set("Accept", "application/json, text/plain, */*");

      if (token) {
        request.headers.set("Authorization", `Bearer ${token}`);
      }
    }

    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.clear();
      Cookies.remove("token");
    }

    return Promise.reject(error);
  }
);

export default instance;
