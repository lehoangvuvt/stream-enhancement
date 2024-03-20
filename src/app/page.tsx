"use client";

import SearchBar from "@/components/search-bar";
import TemplateItem from "@/components/template-item";
import { FormEvent, useEffect, useState } from "react";
import styled from "styled-components";
import { OverlayMetadata } from "./overlay-builder/setup/page";
import { useRouter } from "next/navigation";

const Container = styled.div`
  background-color: #131417;
  width: 100%;
  min-height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  padding: 0px 15px;
  box-sizing: border-box;
`;

const Header = styled.div`
  width: 100%;
  padding: 10px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TemplatesList = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  gap: 10px;
  margin-top: 10px;
`;

const Left = styled.div`
  width: 15%;
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column wrap;
`;

export default function Home() {
  const [searchTxt, setSearchTxt] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [layouts, setLayouts] = useState<OverlayMetadata[]>([]);
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (localStorage.getItem("layouts")) {
      const a = localStorage.getItem("layouts");
      if (a !== null) {
        const b = JSON.parse(a) as OverlayMetadata[];
        setLayouts(b);
      }
    }
    setLoading(false);
  }, []);

  const handleOnSelectLayout = (index: number) => {
    router.push(`/overlay-builder/setup?id=${index}`);
  };

  return (
    <Container>
      <Left></Left>
      <Right>
        <Header>
          <form style={{ width: "100%" }} onSubmit={handleSubmit}>
            <SearchBar
              placeholder="Search layouts..."
              value={searchTxt}
              onChange={setSearchTxt}
            />
          </form>
        </Header>
        <TemplatesList>
          {!isLoading ? (
            layouts?.length > 0 ? (
              layouts.map((layout, i) => (
                <TemplateItem
                  onClick={() => handleOnSelectLayout(i)}
                  overlayMetadata={layout}
                  width="calc(100% / 4 - 4px)"
                  key={i}
                />
              ))
            ) : (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-start",
                  color: "rgba(255,255,255,.6)",
                  fontWeight: 600,
                  fontSize: "17px",
                }}
              >
                {`You haven't created any layouts yet. Click`}&nbsp;
                <span
                  onClick={() => router.push("/overlay-builder/setup")}
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                >
                  here
                </span>
                &nbsp;to create one
              </div>
            )
          ) : (
            <p style={{ color: "#ffffff" }}>Loading...</p>
          )}
        </TemplatesList>
      </Right>
    </Container>
  );
}
