import axios from "axios";
import { cookies } from "../cookies";

export const api = axios.create({
  baseURL: process.env.REACT_APP_API,
  headers: {
    Authorization: `Bearer ${cookies.get("token") ? cookies.get("token") : ""}`,
  },
});
