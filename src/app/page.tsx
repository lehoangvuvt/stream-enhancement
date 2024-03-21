"use client";

import SearchBar from "@/components/search-bar";
import TemplateItem from "@/components/template-item";
import { FormEvent, useEffect, useState } from "react";
import styled from "styled-components";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ELEMENT_TYPES, Layout } from "./types/element.types";
import { off } from "process";

const sampleLayouts: Layout[] = [
  {
    overlayMetadata: {
      background_ratio: [16, 9],
      background_url: "",
      elements: [
        {
          id: "element_1",
          coords: {
            x: 767.6000366210938,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 392.0125427246094,
            y: 198.5,
          },
          order: 1,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#FF0000",
            transform: "rotate(0deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
        {
          id: "element_2",
          coords: {
            x: 767.6000366210938,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 392.0125427246094,
            y: 198.5,
          },
          order: 2,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#FF0000",
            transform: "rotate(45deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
        {
          id: "element_3",
          coords: {
            x: 767.6000366210938,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 392.0125427246094,
            y: 198.5,
          },
          order: 3,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#FF0000",
            transform: "rotate(70deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
        {
          id: "element_4",
          coords: {
            x: 767.6000366210938,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 392.0125427246094,
            y: 198.5,
          },
          order: 4,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#FF0000",
            transform: "rotate(-70deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
      ],
      lastEleNo: 4,
    },
    authorName: "lehoangvu",
    tags: ["reactjs", "styled-components", "star"],
    title: "Test 1",
  },
  {
    overlayMetadata: {
      background_ratio: [16, 9],
      background_url: "",
      elements: [
        {
          id: "element_1",
          coords: {
            x: 767.6000366210938,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 392.0125427246094,
            y: 198.5,
          },
          order: 1,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#f0ea5a",
            transform: "rotate(0deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
        {
          id: "element_2",
          coords: {
            x: 767.6000366210938,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 392.0125427246094,
            y: 198.5,
          },
          order: 2,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#FF0000",
            transform: "rotate(45deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
        {
          id: "element_3",
          coords: {
            x: 767.6000366210938,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 392.0125427246094,
            y: 198.5,
          },
          order: 3,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#00ff53",
            transform: "rotate(70deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
        {
          id: "element_4",
          coords: {
            x: 767.6000366210938,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 392.0125427246094,
            y: 198.5,
          },
          order: 4,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#2d00ff",
            transform: "rotate(-70deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
      ],
      lastEleNo: 4,
    },
    authorName: "lehoangvu2",
    tags: ["nextks", "nextjs", "styled-components", "star"],
    title: "Test 2",
  },
  {
    overlayMetadata: {
      background_ratio: [16, 9],
      background_url: "",
      elements: [
        {
          id: "element_1",
          coords: {
            x: 767.6000366210938,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 392.0125427246094,
            y: 198.5,
          },
          order: 1,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#FF0000",
            transform: "rotate(0deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
        {
          id: "element_2",
          coords: {
            x: 767.6000366210938,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 392.0125427246094,
            y: 198.5,
          },
          order: 2,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#FF0000",
            transform: "rotate(45deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
        {
          id: "element_3",
          coords: {
            x: 767.6000366210938,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 392.0125427246094,
            y: 198.5,
          },
          order: 3,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#FF0000",
            transform: "rotate(70deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
        {
          id: "element_4",
          coords: {
            x: 767.6000366210938,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 392.0125427246094,
            y: 198.5,
          },
          order: 4,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#FF0000",
            transform: "rotate(-70deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
        {
          id: "element_5",
          coords: {
            x: 544,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 168.41250610351562,
            y: 198.5,
          },
          order: 5,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#FF0000",
            transform: "rotate(-70deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
        {
          id: "element_6",
          coords: {
            x: 1020,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 644.4125061035156,
            y: 198.5,
          },
          order: 6,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#FF0000",
            transform: "rotate(-70deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
      ],
      lastEleNo: 6,
    },
    authorName: "lehoangvu3",
    tags: ["reactjs", "css", "star ", "square"],
    title: "test 3",
  },
  {
    overlayMetadata: {
      background_ratio: [16, 9],
      background_url: "",
      elements: [
        {
          id: "element_1",
          coords: {
            x: 767.6000366210938,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 392.0125427246094,
            y: 198.5,
          },
          order: 1,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#FF0000",
            transform: "rotate(0deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
        {
          id: "element_2",
          coords: {
            x: 767.6000366210938,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 392.0125427246094,
            y: 198.5,
          },
          order: 2,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#FF0000",
            transform: "rotate(45deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
        {
          id: "element_3",
          coords: {
            x: 767.6000366210938,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 392.0125427246094,
            y: 198.5,
          },
          order: 3,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#FF0000",
            transform: "rotate(70deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
        {
          id: "element_4",
          coords: {
            x: 767.6000366210938,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 392.0125427246094,
            y: 198.5,
          },
          order: 4,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#FF0000",
            transform: "rotate(-70deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
        {
          id: "element_5",
          coords: {
            x: 544,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 168.41250610351562,
            y: 198.5,
          },
          order: 5,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#FF0000",
            transform: "rotate(-70deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
        {
          id: "element_6",
          coords: {
            x: 1020,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 644.4125061035156,
            y: 198.5,
          },
          order: 6,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#FF0000",
            transform: "rotate(-70deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
      ],
      lastEleNo: 6,
    },
    authorName: "asdsds",
    tags: ["asdad"],
    title: "asdds",
  },
  {
    overlayMetadata: {
      background_ratio: [16, 9],
      background_url: "",
      elements: [
        {
          id: "element_1",
          coords: {
            x: 767.6000366210938,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 392.0125427246094,
            y: 198.5,
          },
          order: 1,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#f0ea5a",
            transform: "rotate(0deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
        {
          id: "element_2",
          coords: {
            x: 767.6000366210938,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 392.0125427246094,
            y: 198.5,
          },
          order: 2,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#FF0000",
            transform: "rotate(45deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
        {
          id: "element_3",
          coords: {
            x: 767.6000366210938,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 392.0125427246094,
            y: 198.5,
          },
          order: 3,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#00ff53",
            transform: "rotate(70deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
        {
          id: "element_4",
          coords: {
            x: 767.6000366210938,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 392.0125427246094,
            y: 198.5,
          },
          order: 4,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#2d00ff",
            transform: "rotate(-70deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
      ],
      lastEleNo: 4,
    },
    authorName: "asd",
    tags: ["123asd", "123", "sadd", "1231az", "zzcz1", "1aacz"],
    title: "asda",
  },
  {
    overlayMetadata: {
      background_ratio: [16, 9],
      background_url: "",
      elements: [
        {
          id: "element_1",
          coords: {
            x: 767.6000366210938,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 392.0125427246094,
            y: 198.5,
          },
          order: 1,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#f0ea5a",
            transform: "rotate(0deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
        {
          id: "element_2",
          coords: {
            x: 767.6000366210938,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 392.0125427246094,
            y: 198.5,
          },
          order: 2,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#FF0000",
            transform: "rotate(45deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
        {
          id: "element_3",
          coords: {
            x: 767.6000366210938,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 392.0125427246094,
            y: 198.5,
          },
          order: 3,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#00ff53",
            transform: "rotate(70deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
        {
          id: "element_4",
          coords: {
            x: 767.6000366210938,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 392.0125427246094,
            y: 198.5,
          },
          order: 4,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#2d00ff",
            transform: "rotate(-70deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
      ],
      lastEleNo: 4,
    },
    authorName: "test 3",
    tags: ["test 3"],
    title: "test 3",
  },
  {
    overlayMetadata: {
      background_ratio: [16, 9],
      background_url: "",
      elements: [
        {
          id: "element_1",
          coords: {
            x: 767.6000366210938,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 392.0125427246094,
            y: 198.5,
          },
          order: 1,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#f0ea5a",
            transform: "rotate(0deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
        {
          id: "element_2",
          coords: {
            x: 767.6000366210938,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 392.0125427246094,
            y: 198.5,
          },
          order: 2,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#FF0000",
            transform: "rotate(45deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
        {
          id: "element_3",
          coords: {
            x: 767.6000366210938,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 392.0125427246094,
            y: 198.5,
          },
          order: 3,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#00ff53",
            transform: "rotate(70deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
        {
          id: "element_4",
          coords: {
            x: 767.6000366210938,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 392.0125427246094,
            y: 198.5,
          },
          order: 4,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#2d00ff",
            transform: "rotate(-70deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
      ],
      lastEleNo: 4,
    },
    authorName: "test 4",
    tags: ["test 4"],
    title: "test 4",
  },
  {
    overlayMetadata: {
      background_ratio: [16, 9],
      background_url: "",
      elements: [
        {
          id: "element_1",
          coords: {
            x: 767.6000366210938,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 392.0125427246094,
            y: 198.5,
          },
          order: 1,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#f0ea5a",
            transform: "rotate(0deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
        {
          id: "element_2",
          coords: {
            x: 767.6000366210938,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 392.0125427246094,
            y: 198.5,
          },
          order: 2,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#FF0000",
            transform: "rotate(45deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
        {
          id: "element_3",
          coords: {
            x: 767.6000366210938,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 392.0125427246094,
            y: 198.5,
          },
          order: 3,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#00ff53",
            transform: "rotate(70deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
        {
          id: "element_4",
          coords: {
            x: 767.6000366210938,
            y: 384.3000030517578,
          },
          isShow: true,
          relativeCoords: {
            x: 392.0125427246094,
            y: 198.5,
          },
          order: 4,
          style: {
            width: "100px",
            height: "100px",
            borderRadius: "0px",
            backgroundColor: "#2d00ff",
            transform: "rotate(-70deg)",
          },
          details: {
            type: ELEMENT_TYPES.SQUARE,
          },
        },
      ],
      lastEleNo: 4,
    },
    authorName: "test 4",
    tags: ["test 4"],
    title: "test 4",
  },
];

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

const TemplatesList = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  gap: 10px;
  margin-top: 10px;
  margin-bottom: 20px;
`;

const Left = styled.div`
  width: 12%;
  background-color: #1e1f26;
  box-sizing: border-box;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column wrap;
`;

export default function Home() {
  const params = useSearchParams();
  const [searchTxt, setSearchTxt] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [searchedLayouts, setSearchedLayouts] = useState<Layout[]>([]);
  const router = useRouter();

  useEffect(() => {
    const q = params.get("q");
    if (typeof q === "string") {
      setSearchTxt(q);
      const result = layouts.filter(
        (layout) =>
          layout.authorName.toUpperCase().includes(searchTxt.toUpperCase()) ||
          layout.title.toUpperCase().includes(searchTxt.toUpperCase()) ||
          layout.tags.includes(searchTxt)
      );
      setSearchedLayouts(result);
    } else {
      setSearchTxt("");
      setSearchedLayouts([...layouts]);
    }
  }, [params]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTxt.trim().length > 0) {
      router.push("?q=" + searchTxt);
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("layouts")) {
      const a = localStorage.getItem("layouts");
      if (a !== null) {
        const b = JSON.parse(a) as Layout[];
        setLayouts(b);
        setSearchedLayouts(b);
      }
    } else {
      localStorage.setItem("layouts", JSON.stringify(sampleLayouts));
      setSearchedLayouts(sampleLayouts);
      setLayouts(sampleLayouts);
    }
    setLoading(false);
  }, []);

  const handleOnSelectLayout = (index: number) => {
    router.push(`/overlay-builder/setup?id=${index}`);
  };

  return (
    <Container>
      <Left></Left>
      <Right>
        <Header>
          <form style={{ width: "100%" }} onSubmit={handleSubmit}>
            <SearchBar
              onClear={() => {
                router.push("/");
              }}
              placeholder="Search layouts..."
              value={searchTxt}
              onChange={setSearchTxt}
            />
          </form>
        </Header>
        <TemplatesList>
          {!isLoading ? (
            searchedLayouts?.length > 0 ? (
              searchedLayouts.map((layout, i) => (
                <TemplateItem
                  onClick={() => handleOnSelectLayout(i)}
                  layout={layout}
                  width="calc(100% / 4 - 15px)"
                  key={i}
                />
              ))
            ) : (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-start",
                  color: "rgba(255,255,255,.6)",
                  fontWeight: 600,
                  fontSize: "17px",
                }}
              >
                {layouts?.length === 0 ? (
                  <>
                    {`You haven't created any layouts yet. Click`}&nbsp;
                    <span
                      onClick={() => router.push("/overlay-builder/setup")}
                      style={{ cursor: "pointer", textDecoration: "underline" }}
                    >
                      here
                    </span>
                    &nbsp;to create one
                  </>
                ) : (
                  <>Not find any layouts</>
                )}
              </div>
            )
          ) : (
            <p style={{ color: "#ffffff" }}>Loading...</p>
          )}
        </TemplatesList>
      </Right>
    </Container>
  );
}
