import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Call this once in App.jsx
export const initToast = () => {
  toast.configure();
};

export const notifySuccess = (message) => {
  toast.success(message, {
    position: toast.TOP_RIGHT,
    autoClose: 3000,
  });
};

export const notifyError = (message) => {
  toast.error(message, {
    position: toast.TOP_RIGHT,
    autoClose: 3000,
  });
};
