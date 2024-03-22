"use client";

import styled from "styled-components";
import { useRouter } from "next/navigation";
import HeaderPanelLayout from "@/components/layouts/headerPanelLayout";
import "./home.css";
import GradientBGColor from "@/components/gradient-bg-button";

const Container = styled.div`
  background-color: #131417;
  top: 0;
  left: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;
export default function Home() {
  const router = useRouter();
  return (
    <Container>
      <div className="container">
        <div className="container__item landing-page-container">
          <div className="content__wrapper">
            <div className="ellipses-container">
              <h2 className="greeting">Layout Genius</h2>
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
                top: "35%",
              }}
            >
              Create your layout and generate ReactJS Code
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                top: "44%",
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
                Start Create
              </GradientBGColor>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
