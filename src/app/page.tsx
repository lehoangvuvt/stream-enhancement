"use client";

import SearchBar from "@/components/search-bar";
import TemplateItem from "@/components/template-item";
import { FormEvent, useEffect, useState } from "react";
import styled from "styled-components";
import { OverlayMetadata } from "./overlay-builder/setup/page";
import { useRouter } from "next/navigation";
import { Layout } from "./types/element.types";

const Container = styled.div`
  background-color: #131417;
  width: 100%;
  min-height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  box-sizing: border-box;
  gap: 20px;
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
  background-color: #1e1f26;
  box-sizing: border-box;
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column wrap;
`;

export default function Home() {
  const [searchTxt, setSearchTxt] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [searchedLayouts, setSearchedLayouts] = useState<Layout[]>([]);
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTxt.trim().length > 0) {
      const result = layouts.filter(
        (layout) =>
          layout.authorName.toUpperCase().includes(searchTxt.toUpperCase()) ||
          layout.title.toUpperCase().includes(searchTxt.toUpperCase()) ||
          layout.tags.includes(searchTxt)
      );
      setSearchedLayouts(result);
    } else {
      setSearchedLayouts([...layouts]);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("layouts")) {
      const a = localStorage.getItem("layouts");
      if (a !== null) {
        const b = JSON.parse(a) as Layout[];
        setLayouts(b);
        setSearchedLayouts(b);
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
            searchedLayouts?.length > 0 ? (
              searchedLayouts.map((layout, i) => (
                <TemplateItem
                  onClick={() => handleOnSelectLayout(i)}
                  layout={layout}
                  width="calc(100% / 4 - 15px)"
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
                {layouts?.length === 0 ? (
                  <>
                    {`You haven't created any layouts yet. Click`}&nbsp;
                    <span
                      onClick={() => router.push("/overlay-builder/setup")}
                      style={{ cursor: "pointer", textDecoration: "underline" }}
                    >
                      here
                    </span>
                    &nbsp;to create one
                  </>
                ) : (
                  <>Not find any layouts</>
                )}
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
