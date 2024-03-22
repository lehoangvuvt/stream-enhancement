"use client";

import styled from "styled-components";
import { useRouter } from "next/navigation";
import "./home.css";
import bgGif from "/public/gif/bg.gif";
import GradientBGColor from "@/components/gradient-bg-button";
import Image from "next/image";
import { useState } from "react";

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
            position: "fixed",
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
                ? "rotate(-15deg) scale(1.2)"
                : hoverMode === "create"
                ? "rotate(15deg) scale(1.2)"
                : "rotate(0deg) scale(1)",
            filter:
              hoverMode === "explore"
                ? " hue-rotate(100deg)"
                : hoverMode === "create"
                ? " hue-rotate(200deg)"
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
            <div className="ellipses-home-container">
              <div className="greeting">Layout Genius</div>
              <div className="ellipses ellipses__outer--thin">
                <div className="ellipses ellipses__orbit"></div>
              </div>
              <div className="ellipses ellipses__outer--thick"></div>
            </div>
            <div
              style={{
                background: "transparent",
                color: "white",
                zIndex: 100,
                position: "absolute",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                top: "34%",
                fontSize: "16px",
                letterSpacing: "0.5px",
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
                top: "42%",
                position: "absolute",
              }}
            >
              <GradientBGColor
                onHover={() => setHoverMode("explore")}
                onLeave={() => setHoverMode(null)}
                style={{ width: "150px" }}
                onClick={() => router.push("/search")}
              >
                Explore
              </GradientBGColor>
              <GradientBGColor
                onHover={() => setHoverMode("create")}
                onLeave={() => setHoverMode(null)}
                style={{ width: "150px" }}
                onClick={() => router.push("/overlay-builder/setup")}
              >
                Create
              </GradientBGColor>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
