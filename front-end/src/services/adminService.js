import api from "./api";

export const loginAdmin = async (email, password) => {
  const res = await api.post("/admin/login", { email, password });
  return res.data;
};

export const getUsers = async () => {
  const res = await api.get("/admin/users");
  return res.data;
};

export const getTransactions = async () => {
  const res = await api.get("/admin/transactions");
  return res.data;
};

export const verifyUser = async (data) => {
  const res = await api.post("/admin/users/verify", data);
  return res.data;
};
