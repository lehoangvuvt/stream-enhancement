"use client";

import SearchBar from "@/components/search-bar";
import { FormEvent, useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter, useSearchParams } from "next/navigation";
import GradientBGColor from "@/components/gradient-bg-button";
import Logo from "@/components/logo";
import { useAppStore } from "@/zustand/store";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";

type Props = {
  showHeader?: boolean;
  showPanel?: boolean;
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
  animation: layoutAppear 0.2s ease;
  @keyframes layoutAppear {
    from {
      filter: brightness(0%);
    }
    to {
      filter: brightness(100%);
    }
  }
`;

const Header = styled.div`
  width: 100%;
  padding: 15px 30px 15px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0px;
  box-sizing: border-box;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  button {
    width: 100px;
    height: 40px;
    cursor: pointer;
    border: none;
    outline: none;
    border-radius: 4px;
    font-weight: 600;
    font-size: 13px;
    &.sign-up-btn {
      background-color: #388e3c;
      color: white;
    }
    &.login-btn {
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
    }
    &.user-btn {
      background-color: transparent;
      color: white;
      font-size: 18px;
      width: 35px;
      height: 35px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.4);
    }
    &.sign-out-btn {
      background-color: transparent;
      color: white;
      width: 70px;
      transition: letter-spacing 0.1s ease;
      &:hover {
        text-decoration: underline;
        letter-spacing: 0.5px;
      }
    }
  }
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

const MenuItem = styled.div`
  width: 100%;
  color: white;
  padding: 0px 22px;
  height: 45px;
  display: flex;
  align-items: center;
  font-size: 15px;
  cursor: pointer;
  font-weight: 400;
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

const Right = styled.div`
  margin-left: 210px;
  width: calc(100% - 210px);
  display: flex;
  flex-flow: column wrap;
`;

const HeaderPanelLayout: React.FC<Props> = ({
  children,
  showHeader = true,
  showPanel = true,
}) => {
  const { userInfo } = useAppStore();
  const params = useSearchParams();
  const [searchTxt, setSearchTxt] = useState("");
  const router = useRouter();

  const signOut = async () => {
    try {
      await axios({
        url: `${process.env.NEXT_PUBLIC_API_BASE_ROUTE}/auth/sign-out`,
        withCredentials: true,
        method: "GET",
      });
    } catch (err) {}
    window.location.reload();
  };

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
      {showPanel && (
        <Left>
          <Logo />
          <GradientBGColor
            style={{ width: "80%", height: "48px", marginBottom: "15px" }}
            onClick={() => router.push("/overlay-builder/setup")}
          >
            Create Layout
          </GradientBGColor>

          <div
            style={{
              width: "100%",
              display: "flex",
              flexFlow: "column wrap",
            }}
          >
            {userInfo && (
              <MenuItem onClick={() => router.push("/my-layouts")}>
                My Layouts
              </MenuItem>
            )}
            <MenuItem onClick={() => router.push("/search?sortBy=pop")}>
              Explore
            </MenuItem>
          </div>
        </Left>
      )}
      <Right>
        {showHeader && (
          <Header>
            <form style={{ flex: 1 }} onSubmit={handleSubmit}>
              <SearchBar
                onClear={() => {
                  setSearchTxt("");
                }}
                placeholder="Search layouts..."
                value={searchTxt}
                onChange={setSearchTxt}
              />
            </form>
            <HeaderRight>
              {!userInfo ? (
                <>
                  <button
                    className="sign-up-btn"
                    onClick={() => router.push("/register")}
                  >
                    Sign Up
                  </button>
                  <button
                    className="login-btn"
                    onClick={() => router.push("/login")}
                  >
                    Login
                  </button>
                </>
              ) : (
                <>
                  <button className="user-btn">
                    <UserOutlined />
                  </button>
                  <button onClick={signOut} className="sign-out-btn">
                    Sign out
                  </button>
                </>
              )}
            </HeaderRight>
          </Header>
        )}
        {children}
      </Right>
    </Container>
  );
};

export default HeaderPanelLayout;
