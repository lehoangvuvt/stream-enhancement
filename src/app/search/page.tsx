"use client";

import { useEffect, useState } from "react";
import { ELEMENT_TYPES, Layout } from "../types/element.types";
import SearchView from "./view";
import Loading from "@/components/loading";

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

const SearchPage = ({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) => {
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [searchedLayouts, setSearchedLayouts] = useState<Layout[]>([]);
  const [isLoading, setLoading] = useState(true);

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

  useEffect(() => {
    if (!layouts || layouts.length === 0) return;
    if (searchParams.q) {
      const q = searchParams.q;
      const result = layouts.filter(
        (layout) =>
          layout.authorName.toUpperCase().includes(q.toUpperCase()) ||
          layout.title.toUpperCase().includes(q.toUpperCase()) ||
          layout.tags.includes(q)
      );
      setSearchedLayouts(result);
    } else {
      setSearchedLayouts([...layouts]);
    }
  }, [searchParams, layouts]);

  if (isLoading) return <Loading />;
  return <SearchView layouts={searchedLayouts} />;
};

export default SearchPage;
