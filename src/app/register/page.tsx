"use client";

import HeaderPanelLayout from "@/components/layouts/headerPanelLayout";
import { ArrowRightOutlined } from "@ant-design/icons";
import { FormEvent, useEffect, useState } from "react";
import styled from "styled-components";
import { useAppStore } from "@/zustand/store";
import { useRouter } from "next/navigation";
import UserService from "@/services/user.service";
import validator from "validator";

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
  width: calc(60% - 50px);
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
  margin-top: 60px;
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

const Register = () => {
  const router = useRouter();
  const { userInfo, setUserInfo } = useAppStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [responseError, setResponseError] = useState<string | null>(null);
  const [passError, setPassError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (userInfo) router.push("/search");
  }, [userInfo]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResponseError(null);
    setPassError(null);
    setEmailError(null);
    const payload = {
      username,
      password,
      email,
    };
    const response = await UserService.register(payload);
    if (response === "success") {
    } else {
      if (response.includes("username")) {
        setResponseError("Username already existed");
      }
      if (response.includes("email")) {
        setResponseError("Email already existed");
      }
    }
  };

  useEffect(() => {
    if (password !== "" && rePassword !== "") {
      if (password !== rePassword) {
        setPassError("Password does not match");
      } else {
        setPassError(null);
      }
    }
  }, [password, rePassword]);

  useEffect(() => {
    if (email.trim().length > 0 && !validator.isEmail(email)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError(null);
    }
  }, [email]);

  return (
    <HeaderPanelLayout showHeader={false}>
      <Container>
        <Title>Register New Account</Title>
        <Body>
          <NormalLoginContainer onSubmit={handleSubmit}>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="abc@xyz.com"
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <Input
              type="password"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              placeholder="Repeat your password"
            />
            <LoginButton
              disabled={
                emailError ||
                passError ||
                username.trim() === "" ||
                email.trim() === "" ||
                password.trim() === "" ||
                rePassword.trim() === ""
                  ? true
                  : false
              }
            >
              Register
              <ArrowRightOutlined />
            </LoginButton>
            {responseError && <ErrorMsg>{responseError}</ErrorMsg>}
            {passError && <ErrorMsg>{passError}</ErrorMsg>}
            {emailError && <ErrorMsg>{emailError}</ErrorMsg>}
          </NormalLoginContainer>
        </Body>
        <Footer
          onClick={() => router.push("/login")}
        >{`Already register? Login here`}</Footer>
      </Container>
    </HeaderPanelLayout>
  );
};

export default Register;
