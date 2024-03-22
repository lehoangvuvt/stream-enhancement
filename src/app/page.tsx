"use client";

import styled from "styled-components";
import { useRouter } from "next/navigation";
import "./home.css";
import bgGif from "/public/gif/bg.gif";
import GradientBGColor from "@/components/gradient-bg-button";
import Image from "next/image";

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
  return (
    <Container>
      <div className="container">
        <div
          style={{
            position: "fixed",
            left: '10%',
            top: '7%',
            width: "80%",
            height: "80%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.7,
          }}
        >
          <Image
            src={bgGif.src}
            alt="bg"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
        <div className="container__item landing-page-container">
          <div className="content__wrapper">
            <div className="ellipses-container">
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
                top: "36%",
                fontSize: "15px",
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
                gap: "20px",
                top: "45%",
                position: "absolute",
              }}
            >
              <GradientBGColor
                style={{ width: "150px" }}
                onClick={() => router.push("/search")}
              >
                Explore
              </GradientBGColor>
              <GradientBGColor
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
