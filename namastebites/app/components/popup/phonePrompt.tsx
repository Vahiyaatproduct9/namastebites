"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import useProfile from "@/app/store/useProfile";
import { useRouter } from "next/navigation";

const PhonePrompt = () => {
  const { isSignedIn, isLoaded } = useUser();
  const { phone } = useProfile();
  const [show, setShow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      if (!phone || phone.length < 10 || phone.length > 11) {
        setShow(true);
      } else {
        setShow(false);
      }
    }
  }, [isLoaded, isSignedIn, phone]);

  if (!show) return null;

  return (
    <>
      <style>
        {`
          @keyframes slideUp {
            from {
              transform: translate(-50%, 100%);
              opacity: 0;
            }
            to {
              transform: translate(-50%, 0);
              opacity: 1;
            }
          }
        `}
      </style>
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "var(--color-dark)",
          padding: "1.5rem",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
          border: "1px solid var(--color-primary)",
          zIndex: 1000,
          width: "90%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          animation: "slideUp 0.3s ease-out",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span className="material-symbols-outlined" style={{ color: "var(--color-primary)" }}>
            phone_iphone
          </span>
          <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--color-light)" }}>
            Phone Number Required
          </h3>
        </div>
        <p style={{ margin: 0, fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.8)", lineHeight: "1.4" }}>
          Please add your phone number to enable food ordering and delivery updates.
        </p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setShow(false)}
            style={{
              flex: 1,
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              background: "transparent",
              color: "var(--color-light)",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Later
          </button>
          <button
            onClick={() => {
              setShow(false);
              router.push("/settings");
            }}
            style={{
              flex: 2,
              padding: "0.75rem",
              borderRadius: "8px",
              border: "none",
              background: "var(--color-primary)",
              color: "var(--color-white)",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >
            Go to Settings
          </button>
        </div>
      </div>
    </>
  );
};

export default PhonePrompt;
