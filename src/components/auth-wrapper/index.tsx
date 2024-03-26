"use client";

import { UserInfo, useAppStore } from "@/zustand/store";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "../loading";
import UserService from "@/services/user.service";

type Props = {
  children: React.ReactNode;
};

const AuthWrapper: React.FC<Props> = ({ children }) => {
  const [isLoading, setLoading] = useState(true);
  const { setUserInfo } = useAppStore();

  useEffect(() => {
    const authenticate = async () => {
      const data = await UserService.authenticate();
      if (data) {
        setUserInfo(data);
      } else {
        setUserInfo(null);
      }
      setLoading(false);
    };
    authenticate();
  }, [setUserInfo]);
  if (isLoading) return <Loading />;
  return children;
};

export default AuthWrapper;
