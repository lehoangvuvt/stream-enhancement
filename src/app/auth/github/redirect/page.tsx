"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const GITHUB_CLIENT_ID = "4ba5703caa4238e81ff5";
const GITHUB_CLIENT_SECRET = "0d1bc4aad0937d98cf5b2e4296ca0e8e7024fb43";
const GITHUB_CALLBACK_URL = "http://localhost:3000/auth/github/redirect";
const githubOAuthURL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=repo`;

const GithubAuthRedirect = () => {
  const params = useSearchParams();

  useEffect(() => {
    const getAccessToken = async (code: string) => {
      const data = new FormData();
      data.append("client_id", GITHUB_CLIENT_ID);
      data.append("client_secret", GITHUB_CLIENT_SECRET);
      data.append("code", code);
      data.append("redirect_uri", GITHUB_CALLBACK_URL);
      const repsonse = await fetch(
        `https://github.com/login/oauth/access_token`,
        {
          method: "POST",
          body: data,
        }
      );
    };

    if (params.get("code")) {
      const code = params.get("code");
      if (code !== null) {
        getAccessToken(code);
      }
    }
  }, [params]);

  return <h1>Redirect...</h1>;
};

export default GithubAuthRedirect;
