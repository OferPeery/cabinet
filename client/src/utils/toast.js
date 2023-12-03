import { toast } from "react-toastify";

export const showHttpErrorToast = (
  error,
  fallbackMessage = "Something went wrong"
) => {
  console.log("An error has occured:", error);

  if (error?.response?.status === 500) {
    return toast.error(fallbackMessage);
  }

  return toast.error(error?.response?.data ?? fallbackMessage);
};
