import axios from "axios";

const API = "https://sakshi-mobile-wala.onrender.com/api/devices";

export const getDevices = async () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const res = await axios.get(API,  {headers: {Authorization: `Bearer ${user.token}`, },});
  // return res.data.data; // ✅ important
  console.log("TOKEN:", user?.token);
  return res.data;
};

export const getDeviceById = async (id) => {
  const res = await axios.get(`${API}/${id}`);
  return res.data.data; // ✅ important
};

export const updateDevice = async (id, data, token) => {
  return await axios.put(`${API}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteDevice = async (id, token) => {
  return await axios.delete(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ✅ DELETE FIELD (NEW)
export const deleteField = async (id, key, token) => {
  const res = await axios.delete(`${API}/delete-field/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { key },
  });
  return res.data;
};