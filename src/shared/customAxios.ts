import axios from "axios";
import config from "./config";

export default axios.create({
    baseURL: config.API_URL,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0, private",
    },
    timeout: 300000,
  });
  