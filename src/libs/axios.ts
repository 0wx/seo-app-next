import axios from "axios"
export const api = axios.create({
  baseURL: "https://se-api.devhaus.me/v1",
  headers: {
    "Content-Type": "application/json",
  },
})