"use client";

import SearchBar from "@/components/search-bar";
import { FormEvent, useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter, useSearchParams } from "next/navigation";
import { Layout } from "./types/element.types";
import GradientBGColor from "@/components/gradient-bg-button";
import Logo from "@/components/logo";
import HeaderPanelLayout from "@/components/layouts/headerPanelLayout";

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

export default function Home() {
  const params = useSearchParams();
  const [searchTxt, setSearchTxt] = useState("");
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const router = useRouter();

  // useEffect(() => {
  //   const q = params.get("q");
  //   if (typeof q === "string") {
  //     setSearchTxt(q);
  //     const result = layouts.filter(
  //       (layout) =>
  //         layout.authorName.toUpperCase().includes(searchTxt.toUpperCase()) ||
  //         layout.title.toUpperCase().includes(searchTxt.toUpperCase()) ||
  //         layout.tags.includes(searchTxt)
  //     );
  //     setSearchedLayouts(result);
  //   } else {
  //     setSearchTxt("");
  //     setSearchedLayouts([...layouts]);
  //   }
  // }, [params]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTxt.trim().length > 0) {
      router.push("/search?q=" + searchTxt);
    } else {
      router.push("/search");
    }
  };

  // useEffect(() => {
  //   if (localStorage.getItem("layouts")) {
  //     const a = localStorage.getItem("layouts");
  //     if (a !== null) {
  //       const b = JSON.parse(a) as Layout[];
  //       setLayouts(b);
  //       setSearchedLayouts(b);
  //     }
  //   } else {
  //     localStorage.setItem("layouts", JSON.stringify(sampleLayouts));
  //     setSearchedLayouts(sampleLayouts);
  //     setLayouts(sampleLayouts);
  //   }
  //   setLoading(false);
  // }, []);

  const handleOnSelectLayout = (index: number) => {
    router.push(`/overlay-builder/setup?id=${index}`);
  };

  return (
    <HeaderPanelLayout>
      <h1>HOme</h1>
    </HeaderPanelLayout>
  );
}
