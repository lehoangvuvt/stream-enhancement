"use client";

import { useEffect, useState } from "react";

const Page = () => {
  const [isReceived, setReceived] = useState(false);

  useEffect(() => {
    setTimeout(() => setReceived(true), 5000);
  }, []);

  useEffect(() => {
    if (isReceived) {
      setTimeout(() => setReceived(false), 10000);
    } else{
      setTimeout(() => setReceived(true), 5000);
    }
  }, [isReceived]);

  return isReceived ? (
    <div
      style={{
        width: "100%",
        background: "rgba(0,0,0,0)",
        fontSize: "54px",
        display: "flex",
        justifyContent: "center",
        color: "white",
        alignItems: "center",
        fontWeight: "500",
      }}
    >
      <img
        alt="donation-gif"
        style={{
          width: "400px",
        }}
        src="/gif/pikachu.gif"
      />
      User 1 donate for you 500.000 VNĐ
    </div>
  ) : null;
};

export default Page;
