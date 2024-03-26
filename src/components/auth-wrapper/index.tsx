"use client";

import { UserInfo, useAppStore } from "@/zustand/store";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "../loading";

type Props = {
  children: React.ReactNode;
};

const AuthWrapper: React.FC<Props> = ({ children }) => {
  const [isLoading, setLoading] = useState(true);
  const { setUserInfo } = useAppStore();

  useEffect(() => {
    const authenticate = async () => {
      try {
        const response = await axios({
          url: `${process.env.NEXT_PUBLIC_API_BASE_ROUTE}/auth/authenticate`,
          withCredentials: true,
          method: "GET",
        });
        const data = response.data as UserInfo;
        setUserInfo(data);
      } catch (error) {
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
