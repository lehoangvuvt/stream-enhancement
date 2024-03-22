"use client";

import SearchBar from "@/components/search-bar";
import { FormEvent, useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter, useSearchParams } from "next/navigation";
import GradientBGColor from "@/components/gradient-bg-button";
import Logo from "@/components/logo";

type Props = {
  children: React.ReactNode;
};

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

const Left = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 180px;
  height: 100%;
  background-color: #1e1f26;
  box-sizing: border-box;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  padding-top: 0px;
  box-sizing: border-box;
  z-index: 100;
  overflow-x: hidden;
`;

const Right = styled.div`
  margin-left: 210px;
  width: calc(100% - 210px);
  display: flex;
  flex-flow: column wrap;
`;

const HeaderPanelLayout: React.FC<Props> = ({ children }) => {
  const params = useSearchParams();
  const [searchTxt, setSearchTxt] = useState("");
  const router = useRouter();

  useEffect(() => {
    const q = params.get("q");
    if (typeof q === "string") {
      setSearchTxt(q);
    } else {
      setSearchTxt("test");
    }
  }, [params]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTxt.trim().length > 0) {
      router.push("/search?q=" + searchTxt);
    } else {
      router.push("/search");
    }
  };

  return (
    <Container>
      <Left>
        <Logo />
        <GradientBGColor
          style={{ width: "80%" }}
          onClick={() => router.push("/overlay-builder/setup")}
        >
          Create Layout
        </GradientBGColor>
      </Left>
      <Right>
        <Header>
          <form style={{ width: "100%" }} onSubmit={handleSubmit}>
            <SearchBar
              onClear={() => {
                setSearchTxt("");
              }}
              placeholder="Search layouts..."
              value={searchTxt}
              onChange={setSearchTxt}
            />
          </form>
        </Header>
        {children}
      </Right>
    </Container>
  );
};

export default HeaderPanelLayout;
