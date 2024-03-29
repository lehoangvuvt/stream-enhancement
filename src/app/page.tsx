"use client";

import styled from "styled-components";
import { useRouter } from "next/navigation";
import "./home.css";
import bgGif from "/public/gif/bg.gif";
import Image from "next/image";
import { useState } from "react";
import GradientBorderButton from "@/components/gradient-border-button";

const Container = styled.div`
  background-color: black;
  top: 0;
  left: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  animation: homeAppear 1s ease;
  @keyframes homeAppear {
    from {
      filter: brightness(0%);
    }
    to {
      filter: brightness(100%);
    }
  }
`;
export default function Home() {
  const router = useRouter();
  const [hoverMode, setHoverMode] = useState<string | null>(null);

  return (
    <Container>
      <div className="home-container">
        <div
          style={{
            position: "absolute",
            left: "10%",
            top: "7%",
            width: "80%",
            height: "80%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.25s ease",
            opacity: hoverMode ? 1 : 0.4,
            transform:
              hoverMode === "explore"
                ? `rotate(${Math.floor(Math.random() * 91)}deg) scale(1.2)`
                : hoverMode === "create"
                ? `rotate(${Math.floor(Math.random() * 91)}deg) scale(1.2)`
                : `rotate(0deg) scale(1)`,
            filter:
              hoverMode === "explore"
                ? `hue-rotate(${Math.floor(
                    Math.random() * (500 - 100 + 1) + 100
                  )}deg)`
                : hoverMode === "create"
                ? `hue-rotate(${Math.floor(
                    Math.random() * (500 - 100 + 1) + 100
                  )}deg)`
                : "none",
          }}
        >
          <Image
            src={bgGif.src}
            alt="bg"
            fill
            style={{ objectFit: "contain", display: "block" }}
          />
        </div>
        <div className="home-container__item landing-page-home-container">
          <div className="content__wrapper">
            <div className="greeting">
              Layout
              <br />
              Genius
            </div>
            <div
              style={{
                background: "transparent",
                color: "rgba(255,255,255,0.85)",
                zIndex: 100,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                fontSize: "18px",
                letterSpacing: "1px",
                fontWeight: 500,
              }}
            >
              Create your layout and generate ReactJS Code
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "25px",
                marginTop: "30px",
              }}
            >
              <GradientBorderButton
                onHover={() => {
                  setHoverMode("explore");
                }}
                onLeave={() => setHoverMode(null)}
                style={{ width: "200px" }}
                onClick={() => router.push("/explore")}
              >
                Explore
              </GradientBorderButton>
              <GradientBorderButton
                onHover={() => {
                  setHoverMode("create");
                }}
                onLeave={() => setHoverMode(null)}
                style={{ width: "200px" }}
                onClick={() => router.push("/overlay-builder/setup")}
              >
                Create
              </GradientBorderButton>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
