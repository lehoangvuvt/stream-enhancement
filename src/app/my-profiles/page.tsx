"use client";

import HeaderPanelLayout from "@/components/layouts/headerPanelLayout";
import { useRouter } from "next/navigation";

const MyProfiles = () => {
  const router = useRouter();

  const handleConnectRepo = async () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID ?? "";
    const redirectURL = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URL + "/repo";
    const gitHubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectURL}&scope=repo`;
    router.push(gitHubUrl);
  };

  return (
    <HeaderPanelLayout>
      <button onClick={handleConnectRepo}>Connect repo</button>
    </HeaderPanelLayout>
  );
};

export default MyProfiles;
