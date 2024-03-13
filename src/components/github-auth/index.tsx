import React, { useEffect } from "react";

const GITHUB_CLIENT_ID = "4ba5703caa4238e81ff5";
const GITHUB_CLIENT_SECRET = "0d1bc4aad0937d98cf5b2e4296ca0e8e7024fb43";
const GITHUB_CALLBACK_URL = "http://localhost:3000/auth/github/redirect";
const githubOAuthURL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=repo`;

const GitHubOAuth = () => {
  const handleLogin = async (code: string) => {
    try {
        alert(true)
      // Exchange the code for an access token
      const body = {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      };
      const data = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => response.json());

      const accessToken = data.access_token;
      alert(accessToken)
      const userProfile: any = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": "figma-for-dev",
        },
      });

      // Handle the user profile data (e.g., store it in your database and log the user in)\
      alert(true)
      console.log({ userProfile });
      console.log(`Welcome, ${userProfile.data.name}!`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGitHubCallback = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get("code");

    if (code) {
      handleLogin(code);
    }
  };

  useEffect(() => {
    handleGitHubCallback();
  }, []);

  return (
    <div>
      <a href={githubOAuthURL}>Sign in with GitHub</a>
    </div>
  );
};

export default GitHubOAuth;
