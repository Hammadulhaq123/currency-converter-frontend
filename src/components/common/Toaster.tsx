import { toast, Toaster } from "react-hot-toast";
import React from "react";

// React component for the Toaster UI container
export const ToasterContainer: React.FC = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        style: {
          background: "#333",
          color: "#fff",
        },
      }}
    />
  );
};

// Success Toast
export const SuccessToast = (message: string): void => {
  console.log(message);
  toast.success(message, {
    duration: 3000,
    style: {
      background: "green",
      color: "#fff",
    },
    iconTheme: {
      primary: "white",
      secondary: "green",
    },
  });
};



// Error Toast
export const ErrorToast = (message: string): void => {
  toast.error(message, {
    duration: 3000,
    style: {
      background: "#ff4d4d",
      color: "#fff",
    },
    iconTheme: {
      primary: "white",
      secondary: "#ff4d4d",
    },
  });
};

// Warning Toast
export const WarningToast = (message: string): void => {
  toast(message, {
    icon: "⚠️",
    duration: 3000,
    style: {
      background: "#fff",
      color: "#1c1c1c",
    },
    iconTheme: {
      primary: "white",
      secondary: "#fff",
    },
  });
};
