import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // 🔁 change if needed
});

// // attach token automatically
// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }
//   return req;
// });
// ✅ AUTO ATTACH TOKEN


API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }

  return req;
});

// IMPORT EXCEL
export const importExcel = (formData) =>
  API.post("/devices/import", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// EXPORT EXCEL
export const exportExcel = () =>
  API.get("/devices/export", {
    responseType: "blob", // VERY IMPORTANT
  });

  
export const getUsers = () => API.get("/users");
export const updateRole = (id, role) =>
  API.put(`/users/${id}`, { role });

export const getUploadedFiles = () =>
  API.get("/devices/files");

export const downloadFile = (filename) =>
  API.get(`/devices/files/${filename}`, {
    responseType: "blob", // 🔥 important
  });
  
export const deleteFile = (filename) =>
  API.delete(`/devices/files/${filename}`);  


export default API;