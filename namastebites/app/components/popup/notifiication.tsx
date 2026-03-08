"use client";
import useMessage from "@/app/store/useMessage";
import React, { useEffect } from "react";

const Notification = () => {
  const { message, setMessage, type, setType } = useMessage();
  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  }, [message, setMessage]);
  let backgroundColor = "green";
  switch (type) {
    case "error":
      backgroundColor = "red";
      break;
    case "success":
      backgroundColor = "green";
      break;
    case "info":
      backgroundColor = "blue";
      break;
    case "warning":
      backgroundColor = "yellow";
      break;
    default:
      backgroundColor = "blue";
      break;
  }
  //   if (message.length > 0)
  return (
    <div
      style={{
        zIndex: 101,
        borderRadius: "14px",
        padding: "1rem",
        opacity: message.length ? "100%" : "0%",
        transition: "opacity 250ms ease-in-out",
        backgroundColor,
        color: "white",
      }}
      className="fixed top-10 right-10"
    >
      <span className="text-white p-2">{message}</span>
    </div>
  );
};

export default Notification;
