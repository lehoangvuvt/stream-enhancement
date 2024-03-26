"use client";

import GradientBGColor from "@/components/gradient-bg-button";
import HeaderPanelLayout from "@/components/layouts/headerPanelLayout";
import {
  ArrowRightOutlined,
  FacebookFilled,
  GithubFilled,
  GoogleOutlined,
} from "@ant-design/icons";
import { FormEvent, FormEventHandler, useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { UserInfo, useAppStore } from "@/zustand/store";
import { useRouter } from "next/navigation";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column wrap;
  align-items: center;
`;

const Title = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  color: white;
  font-weight: 600;
  padding: 40px 0px;
  font-size: 26px;
  margin-top: 30px;
  margin-bottom: 40px;
`;

const Body = styled.div`
  width: 85%;
  display: flex;
  justify-content: center;
  gap: 50px;
`;

const NormalLoginContainer = styled.form`
  width: calc(50% - 50px);
  display: flex;
  flex-flow: column wrap;
  gap: 15px;
`;

const Input = styled.input`
  width: 100%;
  background-color: #222222;
  border: none;
  outline: none;
  box-sizing: border-box;
  padding: 18px 20px;
  font-size: 16px;
  border-radius: 4px;
  letter-spacing: 0.25px;
  color: white;
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const SocialLoginContainer = styled.div`
  width: calc(50% - 50px);
  display: flex;
  flex-flow: column wrap;
  gap: 15px;
  button {
    width: 100%;
    flex: 1;
    div {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 10px;
      box-sizing: border-box;
      padding-left: 20px;
    }
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 20px 30px;
  background-image: linear-gradient(
    to right,
    #00c299,
    #d5cc73,
    #00c299,
    #d5cc73
  );
  background-size: 300% 300%;
  background-position: 0% 100%;
  font-size: 16px;
  font-weight: 600;
  border: none;
  outline: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  filter: brightness(100%);
  transition: padding 0.25s ease;
  &:disabled {
    filter: brightness(50%);
    cursor: not-allowed;
    &:hover {
      animation: none;
      padding: 20px 30px;
    }
  }
  &:hover {
    animation: LoginButtonHover 1s ease 0s;
    padding: 20px 20px;
    @keyframes LoginButtonHover {
      from {
        background-position: 0% 100%;
      }
      to {
        background-position: 100% 100%;
      }
    }
  }
`;

const Footer = styled.div`
  margin-top: 80px;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  &:hover {
    color: white;
    text-decoration: underline;
  }
`;

const ErrorMsg = styled.div`
  width: 100%;
  font-size: 16px;
  color: #ef5350;
  font-weight: 600;
  margin-top: 10px;
`;

const Login = () => {
  const router = useRouter();
  const { userInfo, setUserInfo } = useAppStore();
  const [username, setUsername] = useState("vu2");
  const [password, setPassword] = useState("12345");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (userInfo) router.push("/search");
  }, [userInfo]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!username || !password) return;
    setLoading(true);
    try {
      const response = await axios({
        url: `${process.env.NEXT_PUBLIC_API_BASE_ROUTE}/auth/login`,
        method: "POST",
        data: {
          username,
          password,
        },
        withCredentials: true,
      });
      await authenticate();
    } catch (err) {
      setError("Invalid username or password");
      setLoading(false);
    }
  };

  const authenticate = async () => {
    const auth = await axios({
      url: `${process.env.NEXT_PUBLIC_API_BASE_ROUTE}/auth/authenticate`,
      method: "GET",
      withCredentials: true,
    });
    const data = auth.data as UserInfo;
    setUserInfo(data);
    setLoading(false);
    router.push("/search");
  };

  return (
    <HeaderPanelLayout showHeader={false}>
      <Container>
        <Title>Login to Your Account</Title>
        <Body>
          <NormalLoginContainer onSubmit={handleSubmit}>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <LoginButton disabled={!username || !password || isLoading}>
              Login to Your Account <ArrowRightOutlined />
            </LoginButton>
            {error && <ErrorMsg>{error}</ErrorMsg>}
          </NormalLoginContainer>
          <div
            style={{
              width: "50px",
              height: "100%",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 400,
              fontSize: "25px",
            }}
          >
            /
          </div>
          <SocialLoginContainer>
            <GradientBGColor onClick={() => {}}>
              <GoogleOutlined />
              Sign in with Google
            </GradientBGColor>
            <GradientBGColor onClick={() => {}}>
              <FacebookFilled />
              Sign in with Facebook
            </GradientBGColor>
            <GradientBGColor onClick={() => {}}>
              <GithubFilled />
              Sign in with Github
            </GradientBGColor>
          </SocialLoginContainer>
        </Body>
        <Footer
          onClick={() => router.push("/register")}
        >{`Don't have account? Sign up here`}</Footer>
      </Container>
    </HeaderPanelLayout>
  );
};

export default Login;
