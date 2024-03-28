"use client";

import GithubService from "@/services/github.service";
import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";

type Props = {
  commit: (repo: any) => void;
};

const Container = styled.div`
  display: flex;
  flex-flow: column wrap;
`;

const ReposModal: React.FC<Props> = ({ commit }) => {
  const [repos, setRepos] = useState<any[]>([]);

  useEffect(() => {
    const getRepos = async () => {
      const response = await GithubService.getUserRepos();
      if (response) {
        setRepos(response);
      }
    };
    getRepos();
  }, []);

  const handleCommit = async (repo: any) => {
    commit(repo);
  };

  return (
    <Container>
      {repos?.length > 0 &&
        repos.map((repo) => (
          <div
            style={{
              width: "100%",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            key={repo.id}
          >
            {repo.name}

            <button onClick={() => handleCommit(repo)}>Commit</button>
          </div>
        ))}
    </Container>
  );
};

export default ReposModal;
