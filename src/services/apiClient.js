import axios from "axios";
import apiConfig from "../apiConfig";

const apiClient = axios.create({
  baseURL: apiConfig.baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
