"use client";

import styled from "styled-components";
import BackgroundItem, { TBackgroundItem } from "./components/background-item";
import OverlayView from "./components/overlay-view";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import TextItem from "./components/elements/text-item";
import { XYCoord } from "react-dnd";
import HighlightAltIcon from "@mui/icons-material/HighlightAlt";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { Modal, notification } from "antd";
import {
  CURSOR_TOOL_OPTIONS,
  ELEMENT_TYPES,
  Element,
  Layout,
  Layout_API,
} from "@/types/element.types";
import ElementPropertiesPanel from "./components/overlay-view/components/element-properties-panel";
// import { exportComponentAsJPEG } from "react-component-export-image";
import ImageItem from "./components/elements/image-item";
import useKeyboard from "@/hooks/useKeyboard";
import useClipboard from "@/hooks/useClipboard";
import SquareItem from "./components/elements/square-item";
import Layers from "./components/overlay-view/components/layers";
import { useRouter, useSearchParams } from "next/navigation";
import SaveLayoutModal from "./components/save-layout-modal";
import Loading from "@/components/loading";
import { ArrowLeftOutlined, HomeOutlined } from "@ant-design/icons";
import { useAppStore } from "@/zustand/store";
import axios from "axios";

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: column;
`;

const Header = styled.div`
  width: 100%;
  height: 45px;
  background-color: #2c2c2c;
  z-index: 1;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 0px 25px 0px 15px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
  gap: 10px;
  button {
    font-size: 12px;
    padding: 8px 10px;
    border-radius: 2px;
    cursor: pointer;
    color: white;
    border: none;
    outline: none;
    font-weight: 600;
    &:nth-child(1) {
      color: white;
      background: #0099ff;
    }
    &:nth-child(2) {
      color: white;
      background: #0099ff;
    }
  }
`;

const HeaderLeft = styled.div`
  width: 18%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  box-sizing: border-box;
  padding-right: 20px;
  button {
    &:nth-child(1) {
      background-color: transparent;
      font-size: 18px;
      color: white;
      border: none;
      outline: none;
      text-align: left;
    }
    &:nth-child(2),
    &:nth-child(3) {
      background: #0099ff;
      width: 38% !important;
      &.disabled {
        filter: brightness(50%);
        cursor: not-allowed;
      }
    }
  }
`;

const HeaderCenter = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  div {
    height: 100%;
    aspect-ratio: 1.15;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    cursor: default;
    transition: all 0.1s ease;
    color: white;
    &.selected {
      background-color: #0099ff;
      color: white;
      &:hover {
        background-color: #0099ff;
      }
    }
    &:hover {
      background-color: black;
    }
  }
`;

const HeaderRight = styled.div`
  width: 18%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
`;

const Body = styled.div`
  flex: 1;
  width: 100%;
  background-color: white;
  display: flex;
`;

const LeftPanel = styled.div`
  width: 18%;
  height: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;
  box-sizing: border-box;
  gap: 20px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.02);
  border-right: 1px solid rgba(0, 0, 0, 0.05);
`;

const Right = styled.div`
  width: 18%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.03);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.02);
  border-left: 1px solid rgba(0, 0, 0, 0.05);
`;

const Tabs = styled.div`
  display: flex;
  height: 50px;
  width: 100%;
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
`;

const Tab = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid rgba(0, 0, 0, 0);
  cursor: pointer;
  &.selected {
    color: rgba(0, 0, 0, 1);
    border-bottom: 1px solid rgba(0, 0, 0, 1);
  }
`;

const Center = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  justify-content: flex-start;
  background-color: rgba(0, 0, 0, 0.1);
  gap: 40px;
`;

const CenterTabs = styled.div`
  width: 100%;
  height: 50px;
  background-color: white;
  display: flex;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

const CenterTab = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  background-color: rgba(0, 0, 0, 0.1);
  &.selected {
    background-color: white;
    color: black;
  }
`;

const bgItems: TBackgroundItem[] = [
  {
    id: "bg-0",
    name: "Background 1",
    url: "https://marketplace.canva.com/EAE-DjUuNCg/1/0/1600w/canva-black-and-turquoise-futuristic-twitch-webcam-overlay-template-9JzFgOqnVtw.jpg",
  },
  {
    id: "bg-1",
    name: "Background 2",
    url: "https://static.vecteezy.com/system/resources/previews/006/555/783/non_2x/modern-screen-panel-overlay-frame-set-design-template-for-games-streaming-free-vector.jpg",
  },
];

const sampleFontItems = [{ id: "font_0" }, { id: "font_1" }];

export type OverlayMetadata = {
  background_url: string;
  background_ratio: [number, number];
  elements: Element[];
  lastEleNo: number | null;
};

const SetupPage = () => {
  const { userInfo } = useAppStore();
  const router = useRouter();
  const [isLoading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const [currentMode, setCurrentMode] = useState<"canvas" | "code">("canvas");
  const [isOpenCodeGenModal, setOpenCodeGenModal] = useState(false);
  const [isOpenSaveModal, setOpenSaveModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>("");
  const { get: getCB, write: writeCB } = useClipboard();
  const { pressedKies, setPressedKies } = useKeyboard();
  const [copyType, setCopyType] = useState<"copy" | "cut">("copy");
  const exportContainerRef = useRef<any>(null);
  const [currentCursorToolOption, setCurrentCursorToolOpt] =
    useState<CURSOR_TOOL_OPTIONS>(CURSOR_TOOL_OPTIONS.DEFAULT);
  const [isConnected, setConnected] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [copiedElement, setCopiedElement] = useState<Element | null>(null);
  const [copiedElements, setCopiedElements] = useState<Element[]>([]);
  const [overlayMetaHistories, setOverlayMetaHistories] = useState<
    OverlayMetadata[]
  >([
    {
      background_ratio: [16, 9],
      background_url: "",
      elements: [],
      lastEleNo: null,
    },
  ]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );
  const [inSelectZoneIds, setInSelectZoneIds] = useState<string[]>([]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    const getLayoutDetails = async (id: string) => {
      try {
        const response = await axios({
          url: `${process.env.NEXT_PUBLIC_API_BASE_ROUTE}/layout/${id}`,
          method: "GET",
        });
        const data = response.data;
        const layoutApiDetails = data.data as Layout_API;
        const overlayMetadata = JSON.parse(layoutApiDetails.metadata);
        setOverlayMetaHistories([overlayMetadata]);
      } catch (err) {
        router.push("/search");
      }
    };
    if (searchParams.get("id")) {
      const id = searchParams.get("id");
      if (typeof id === "string") {
        getLayoutDetails(id);
      }
    }
  }, [searchParams]);

  const setBackground = (item: TBackgroundItem) => {
    let updatedOverlayMetaHistories = structuredClone(overlayMetaHistories);
    if (updatedOverlayMetaHistories.length === 0) {
      updatedOverlayMetaHistories.push({
        background_ratio: [16, 9],
        background_url: item.url,
        elements: [],
        lastEleNo: null,
      });
      setOverlayMetaHistories(updatedOverlayMetaHistories);
      setCurrentHistoryIndex((prevIndex) => prevIndex + 1);
    } else {
      if (currentHistoryIndex === overlayMetaHistories.length - 1) {
        const lastestOverlayMetaHistoryItem = structuredClone(
          overlayMetaHistories[overlayMetaHistories.length - 1]
        );
        lastestOverlayMetaHistoryItem.background_url = item.url;
        updatedOverlayMetaHistories.push(lastestOverlayMetaHistoryItem);
        setOverlayMetaHistories(updatedOverlayMetaHistories);
        setCurrentHistoryIndex((prevIndex) => prevIndex + 1);
      } else {
        updatedOverlayMetaHistories = updatedOverlayMetaHistories.slice(
          0,
          currentHistoryIndex + 1
        );
        const lastestOverlayMetaHistoryItem = structuredClone(
          updatedOverlayMetaHistories[currentHistoryIndex]
        );
        lastestOverlayMetaHistoryItem.background_url = item.url;
        updatedOverlayMetaHistories.push(lastestOverlayMetaHistoryItem);
        setOverlayMetaHistories(updatedOverlayMetaHistories);
        setCurrentHistoryIndex(updatedOverlayMetaHistories.length - 1);
      }
    }
  };

  const renderBackgrounds = () => {
    return (
      <>
        {bgItems.map((bgItem) => (
          <BackgroundItem
            details={bgItem}
            key={bgItem.id}
            onSelect={(item) => setBackground(item)}
            isSelected={
              overlayMetaHistories[currentHistoryIndex].background_url ===
              bgItem.url
            }
          />
        ))}
      </>
    );
  };

  const renderElements = () => {
    return (
      <>
        <TextItem />
        <ImageItem />
        <SquareItem />
      </>
    );
  };

  const addText = (coords: XYCoord | null, relativeCoords: XYCoord | null) => {
    let updatedOverlayMetaHistories = [...overlayMetaHistories];
    if (updatedOverlayMetaHistories.length === 0) {
      const textItem: Element = {
        id: "element_1",
        coords,
        isShow: true,
        relativeCoords,
        style: {
          color: "#ffffff",
          fontSize: "20px",
          fontWeight: 400,
          opacity: 1,
          transform: "rotate(0deg)",
        },
        order: 1,
        details: {
          text: "New Text",
          type: ELEMENT_TYPES.TEXT,
        },
      };
      updatedOverlayMetaHistories.push({
        background_ratio: [16, 9],
        background_url: "",
        elements: [textItem],
        lastEleNo: 1,
      });
      setOverlayMetaHistories(updatedOverlayMetaHistories);
      setCurrentHistoryIndex((prevIndex) => prevIndex + 1);
    } else {
      const lastEleNo =
        updatedOverlayMetaHistories[updatedOverlayMetaHistories.length - 1]
          .lastEleNo;
      const textItem: Element = {
        id: lastEleNo ? `element_${lastEleNo + 1}` : "element_1",
        coords,
        relativeCoords,
        isShow: true,
        order: lastEleNo ? lastEleNo + 1 : 1,
        style: {
          color: "#ffffff",
          fontSize: "20px",
          fontWeight: 400,
          opacity: 1,
          transform: "rotate(0deg)",
        },
        details: {
          text: "New Text",
          type: ELEMENT_TYPES.TEXT,
        },
      };
      if (currentHistoryIndex === updatedOverlayMetaHistories.length - 1) {
        updatedOverlayMetaHistories.push({
          ...updatedOverlayMetaHistories[
            updatedOverlayMetaHistories.length - 1
          ],
          elements: [
            ...updatedOverlayMetaHistories[
              updatedOverlayMetaHistories.length - 1
            ].elements,
            textItem,
          ],
          lastEleNo: lastEleNo ? lastEleNo + 1 : 1,
        });
        setOverlayMetaHistories(updatedOverlayMetaHistories);
        setCurrentHistoryIndex(updatedOverlayMetaHistories.length - 1);
      } else {
        updatedOverlayMetaHistories = updatedOverlayMetaHistories.slice(
          0,
          currentHistoryIndex + 1
        );
        const lastEleNo =
          updatedOverlayMetaHistories[updatedOverlayMetaHistories.length - 1]
            .lastEleNo;
        updatedOverlayMetaHistories.push({
          ...updatedOverlayMetaHistories[
            updatedOverlayMetaHistories.length - 1
          ],
          elements: [
            ...updatedOverlayMetaHistories[
              updatedOverlayMetaHistories.length - 1
            ].elements,
            textItem,
          ],
          lastEleNo: lastEleNo ? lastEleNo + 1 : 1,
        });
        setOverlayMetaHistories(updatedOverlayMetaHistories);
        setCurrentHistoryIndex(updatedOverlayMetaHistories.length - 1);
      }
    }
  };

  const addImage = (coords: XYCoord | null, relativeCoords: XYCoord | null) => {
    let updatedOverlayMetaHistories = [...overlayMetaHistories];
    if (updatedOverlayMetaHistories.length === 0) {
      const imageItem: Element = {
        id: `element_1`,
        coords,
        isShow: true,
        relativeCoords,
        style: {
          width: "100px",
          height: "100px",
          borderRadius: "0px",
          transform: "rotate(0deg)",
        },
        order: 1,
        details: {
          url: "https://cc-prod.scene7.com/is/image/CCProdAuthor/What-is-Stock-Photography_P1_mobile?$pjpeg$&jpegSize=200&wid=720",
          type: ELEMENT_TYPES.IMAGE,
        },
      };
      updatedOverlayMetaHistories.push({
        background_ratio: [16, 9],
        background_url: "",
        elements: [imageItem],
        lastEleNo: 1,
      });
      setOverlayMetaHistories(updatedOverlayMetaHistories);
      setCurrentHistoryIndex((prevIndex) => prevIndex + 1);
    } else {
      const lastEleNo =
        updatedOverlayMetaHistories[updatedOverlayMetaHistories.length - 1]
          .lastEleNo;
      const imageItem: Element = {
        id: lastEleNo ? `element_${lastEleNo + 1}` : "element_1",
        coords,
        order: lastEleNo ? lastEleNo + 1 : 1,
        relativeCoords,
        isShow: true,
        style: {
          width: "100px",
          height: "100px",
          borderRadius: "0px",
          transform: "rotate(0deg)",
        },
        details: {
          url: "https://cc-prod.scene7.com/is/image/CCProdAuthor/What-is-Stock-Photography_P1_mobile?$pjpeg$&jpegSize=200&wid=720",
          type: ELEMENT_TYPES.IMAGE,
        },
      };
      if (currentHistoryIndex === updatedOverlayMetaHistories.length - 1) {
        const newOverlayMetaHistoryItem = structuredClone(
          updatedOverlayMetaHistories[updatedOverlayMetaHistories.length - 1]
        );
        newOverlayMetaHistoryItem.elements.push(imageItem);
        newOverlayMetaHistoryItem.lastEleNo = lastEleNo ? lastEleNo + 1 : 1;
        updatedOverlayMetaHistories.push(newOverlayMetaHistoryItem);
      } else {
        updatedOverlayMetaHistories = updatedOverlayMetaHistories.slice(
          0,
          currentHistoryIndex + 1
        );
        updatedOverlayMetaHistories.push({
          ...updatedOverlayMetaHistories[
            updatedOverlayMetaHistories.length - 1
          ],
          elements: [
            ...updatedOverlayMetaHistories[
              updatedOverlayMetaHistories.length - 1
            ].elements,
            imageItem,
          ],
          lastEleNo: lastEleNo ? lastEleNo + 1 : 1,
        });
      }
      setOverlayMetaHistories(updatedOverlayMetaHistories);
      setCurrentHistoryIndex(updatedOverlayMetaHistories.length - 1);
    }
  };

  const addSquare = (
    coords: XYCoord | null,
    relativeCoords: XYCoord | null
  ) => {
    let updatedOverlayMetaHistories = [...overlayMetaHistories];
    if (updatedOverlayMetaHistories.length === 0) {
      const squareItem: Element = {
        id: `element_1`,
        coords,
        isShow: true,
        relativeCoords,
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
      };
      updatedOverlayMetaHistories.push({
        background_ratio: [16, 9],
        background_url: "",
        elements: [squareItem],
        lastEleNo: 1,
      });
      setOverlayMetaHistories(updatedOverlayMetaHistories);
      setCurrentHistoryIndex((prevIndex) => prevIndex + 1);
    } else {
      const lastEleNo =
        updatedOverlayMetaHistories[updatedOverlayMetaHistories.length - 1]
          .lastEleNo;
      const squareItem: Element = {
        id: lastEleNo ? `element_${lastEleNo + 1}` : "element_1",
        coords,
        isShow: true,
        relativeCoords,
        order: lastEleNo ? lastEleNo + 1 : 1,
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
      };
      if (currentHistoryIndex === updatedOverlayMetaHistories.length - 1) {
        const newOverlayMetaHistoryItem = structuredClone(
          updatedOverlayMetaHistories[updatedOverlayMetaHistories.length - 1]
        );
        newOverlayMetaHistoryItem.elements.push(squareItem);
        newOverlayMetaHistoryItem.lastEleNo = lastEleNo ? lastEleNo + 1 : 1;
        updatedOverlayMetaHistories.push(newOverlayMetaHistoryItem);
      } else {
        updatedOverlayMetaHistories = updatedOverlayMetaHistories.slice(
          0,
          currentHistoryIndex + 1
        );
        updatedOverlayMetaHistories.push({
          ...updatedOverlayMetaHistories[
            updatedOverlayMetaHistories.length - 1
          ],
          elements: [
            ...updatedOverlayMetaHistories[
              updatedOverlayMetaHistories.length - 1
            ].elements,
            squareItem,
          ],
          lastEleNo: lastEleNo ? lastEleNo + 1 : 1,
        });
      }
      setOverlayMetaHistories(updatedOverlayMetaHistories);
      setCurrentHistoryIndex(updatedOverlayMetaHistories.length - 1);
    }
  };

  const updateElementCoords = (newCoords: XYCoord, elementId: string) => {
    const updatedOverlayMetaHistories = [...overlayMetaHistories];
    const index = updatedOverlayMetaHistories[
      currentHistoryIndex
    ].elements.findIndex((ele) => ele.id === elementId);
    if (index === -1) return;
    const element =
      updatedOverlayMetaHistories[currentHistoryIndex].elements[index];

    let currentRelativeCoordX =
      updatedOverlayMetaHistories[currentHistoryIndex].elements[index]
        .relativeCoords?.x ?? 0;
    let currentRelativeCoordY =
      updatedOverlayMetaHistories[currentHistoryIndex].elements[index]
        .relativeCoords?.y ?? 0;

    if (element.coords?.x && element.coords?.y) {
      const newCordX = newCoords.x;
      const newCordY = newCoords.y;
      if (element.coords.x <= newCordX) {
        currentRelativeCoordX =
          currentRelativeCoordX + newCordX - element.coords.x;
      } else {
        currentRelativeCoordX =
          currentRelativeCoordX - (element.coords.x - newCordX);
      }
      if (element.coords.y <= newCordY) {
        currentRelativeCoordY =
          currentRelativeCoordY + newCordY - element.coords.y;
      } else {
        currentRelativeCoordY =
          currentRelativeCoordY - (element.coords.y - newCordY);
      }
    }
    updatedOverlayMetaHistories[currentHistoryIndex].elements[index].coords =
      newCoords;
    updatedOverlayMetaHistories[currentHistoryIndex].elements[
      index
    ].relativeCoords = {
      x: currentRelativeCoordX,
      y: currentRelativeCoordY,
    };
    setOverlayMetaHistories(updatedOverlayMetaHistories);
  };

  const updateElementSize = (
    newSize: { width: number; height: number },
    elementId: string
  ) => {
    const updatedOverlayMetaHistories = structuredClone(
      overlayMetaHistories.slice(0, currentHistoryIndex + 1)
    );
    updatedOverlayMetaHistories.push(
      structuredClone(updatedOverlayMetaHistories[currentHistoryIndex])
    );
    const element = updatedOverlayMetaHistories[
      currentHistoryIndex + 1
    ].elements.filter((ele) => ele.id === elementId)[0];
    if (
      element.details.type === ELEMENT_TYPES.IMAGE ||
      element.details.type === ELEMENT_TYPES.SQUARE
    ) {
      element.style.width = newSize.width;
      element.style.height = newSize.height;
    }
    setOverlayMetaHistories(updatedOverlayMetaHistories);
    setCurrentHistoryIndex(currentHistoryIndex + 1);
  };

  const removeElement = useCallback(
    (elementId: string) => {
      let updatedOverlayMetaHistories = structuredClone(overlayMetaHistories);
      if (currentHistoryIndex === updatedOverlayMetaHistories.length - 1) {
        const newOverlayMetaItem = structuredClone(
          updatedOverlayMetaHistories[currentHistoryIndex]
        );
        newOverlayMetaItem.elements = newOverlayMetaItem.elements.filter(
          (element) => element.id !== elementId
        );
        updatedOverlayMetaHistories.push(newOverlayMetaItem);
        setOverlayMetaHistories(updatedOverlayMetaHistories);
        setCurrentHistoryIndex((prevIndex) => prevIndex + 1);
      } else {
        updatedOverlayMetaHistories = updatedOverlayMetaHistories.slice(
          0,
          currentHistoryIndex + 1
        );
        const newOverlayMetaItem = structuredClone(
          updatedOverlayMetaHistories[currentHistoryIndex]
        );
        newOverlayMetaItem.elements = newOverlayMetaItem.elements.filter(
          (element) => element.id !== elementId
        );
        updatedOverlayMetaHistories.push(newOverlayMetaItem);
        setOverlayMetaHistories(updatedOverlayMetaHistories);
        setCurrentHistoryIndex(updatedOverlayMetaHistories.length - 1);
      }
    },
    [overlayMetaHistories, currentHistoryIndex]
  );

  const removeMultipleElements = useCallback(
    (ids: string[]) => {
      const updatedOverlayMetaHistories = structuredClone(overlayMetaHistories);
      const newOverlayMetaHistoryItem = structuredClone(
        updatedOverlayMetaHistories[updatedOverlayMetaHistories.length - 1]
      );
      newOverlayMetaHistoryItem.elements =
        newOverlayMetaHistoryItem.elements.filter(
          (ele) => !ids.includes(ele.id)
        );
      updatedOverlayMetaHistories.push(newOverlayMetaHistoryItem);
      setOverlayMetaHistories(updatedOverlayMetaHistories);
      setCurrentHistoryIndex(updatedOverlayMetaHistories.length - 1);
    },
    [overlayMetaHistories]
  );

  const copyElement = useCallback(
    (elementId: string) => {
      const copiedElement =
        overlayMetaHistories[currentHistoryIndex].elements.find(
          (e) => e.id === elementId
        ) ?? null;
      setCopiedElement(structuredClone(copiedElement));
      writeCB({ copiedElement, copiedElements: [] });
    },
    [overlayMetaHistories, currentHistoryIndex, writeCB]
  );

  const pasteElement = useCallback(
    async (
      coord: { x: number; y: number },
      relaviteCoord: { x: number; y: number }
    ) => {
      let updatedOverlayMetaHistories = structuredClone(overlayMetaHistories);
      const data = await getCB<{
        copiedElement: Element | null;
        copiedElements: Element[];
      }>();
      if (!copiedElement) return;
      const lastEleNo =
        updatedOverlayMetaHistories[updatedOverlayMetaHistories.length - 1]
          .lastEleNo;
      const pastedElement = structuredClone(copiedElement);
      pastedElement.order = lastEleNo ? lastEleNo + 1 : 1;
      pastedElement.id = lastEleNo ? `element_${lastEleNo + 1}` : `element_1`;
      pastedElement.relativeCoords = { x: relaviteCoord.x, y: relaviteCoord.y };
      pastedElement.coords = { x: coord.x, y: coord.y };
      if (currentHistoryIndex < overlayMetaHistories.length - 1) {
        updatedOverlayMetaHistories = updatedOverlayMetaHistories.slice(
          0,
          currentHistoryIndex + 1
        );
        const newOverlayHistoryItem = structuredClone(
          updatedOverlayMetaHistories[currentHistoryIndex]
        );
        newOverlayHistoryItem.lastEleNo = lastEleNo ? lastEleNo + 1 : 1;
        newOverlayHistoryItem.elements.push(pastedElement);
        updatedOverlayMetaHistories.push(newOverlayHistoryItem);
        setCurrentHistoryIndex(updatedOverlayMetaHistories.length - 1);
      } else {
        const newOverlayHistoryItem = structuredClone(
          updatedOverlayMetaHistories[currentHistoryIndex]
        );
        newOverlayHistoryItem.lastEleNo = lastEleNo ? lastEleNo + 1 : 1;
        newOverlayHistoryItem.elements.push(pastedElement);
        updatedOverlayMetaHistories.push(newOverlayHistoryItem);
        setCurrentHistoryIndex((prevIndex) => prevIndex + 1);
      }
      if (copyType === "cut") {
        setCopiedElement(null);
      }
      setOverlayMetaHistories(updatedOverlayMetaHistories);
    },
    [overlayMetaHistories, currentHistoryIndex, copiedElement, copyType]
  );

  const pasteMultipleElements = useCallback(
    (cursorCoord?: { x: number; y: number }) => {
      let updatedOverlayMetaHistories = structuredClone(overlayMetaHistories);
      if (copiedElements.length === 0) return;
      const lastEleNo =
        updatedOverlayMetaHistories[updatedOverlayMetaHistories.length - 1]
          .lastEleNo;
      const pastedElements: Element[] = [];
      for (let i = 0; i < copiedElements.length; ++i) {
        const copiedElement = structuredClone(copiedElements[i]);
        copiedElement.id = lastEleNo
          ? `element_${lastEleNo + 1 + i}`
          : i === 0
          ? `element_1`
          : `element_${i + 1}`;
        copiedElement.coords = {
          x: copiedElement.coords!.x + 25,
          y: copiedElement.coords!.y + 25,
        };
        pastedElements.push(copiedElement);
      }
      if (currentHistoryIndex < overlayMetaHistories.length - 1) {
        updatedOverlayMetaHistories = updatedOverlayMetaHistories.slice(
          0,
          currentHistoryIndex + 1
        );
        const newOverlayHistoryItem = structuredClone(
          updatedOverlayMetaHistories[currentHistoryIndex]
        );
        newOverlayHistoryItem.lastEleNo = parseInt(
          pastedElements[pastedElements.length - 1].id.split("_")[1]
        );
        newOverlayHistoryItem.elements = [
          ...newOverlayHistoryItem.elements,
          ...pastedElements,
        ];
        updatedOverlayMetaHistories.push(newOverlayHistoryItem);
        setCurrentHistoryIndex(updatedOverlayMetaHistories.length - 1);
      } else {
        const newOverlayHistoryItem = structuredClone(
          updatedOverlayMetaHistories[currentHistoryIndex]
        );
        newOverlayHistoryItem.lastEleNo = parseInt(
          pastedElements[pastedElements.length - 1].id.split("_")[1]
        );
        newOverlayHistoryItem.elements = [
          ...newOverlayHistoryItem.elements,
          ...pastedElements,
        ];
        updatedOverlayMetaHistories.push(newOverlayHistoryItem);
        setCurrentHistoryIndex((prevIndex) => prevIndex + 1);
      }
      if (copyType === "cut") {
        setCopiedElement(null);
        setCopiedElements([]);
      }
      setOverlayMetaHistories(updatedOverlayMetaHistories);
    },
    [overlayMetaHistories, currentHistoryIndex, copiedElements, copyType]
  );

  const handleSelectElement = (elementId: string) => {
    if (
      currentCursorToolOption === CURSOR_TOOL_OPTIONS.DEFAULT &&
      inSelectZoneIds.length > 0
    ) {
      setInSelectZoneIds([]);
    }
    setSelectedElementId(elementId);
  };

  const getElementById = (elementId: string | null) => {
    if (!elementId || elementId === "") return null;
    return (
      overlayMetaHistories[currentHistoryIndex].elements.find(
        (element) => element.id === elementId
      ) ?? null
    );
  };

  const handleUpdateElement = (updatedElement: Element) => {
    let updatedOverlayMetaHistories = structuredClone(overlayMetaHistories);
    if (currentHistoryIndex === updatedOverlayMetaHistories.length - 1) {
      const newOverlayMetaHistoryItem = structuredClone(
        updatedOverlayMetaHistories[currentHistoryIndex]
      );

      for (let i = 0; i < newOverlayMetaHistoryItem.elements.length; i++) {
        const elementId = newOverlayMetaHistoryItem.elements[i].id;
        if (elementId === updatedElement.id) {
          newOverlayMetaHistoryItem.elements[i] = updatedElement;
          break;
        }
      }
      updatedOverlayMetaHistories.push(newOverlayMetaHistoryItem);
      setOverlayMetaHistories(updatedOverlayMetaHistories);
      setCurrentHistoryIndex(updatedOverlayMetaHistories.length - 1);
    } else {
      updatedOverlayMetaHistories = updatedOverlayMetaHistories.slice(
        0,
        currentHistoryIndex + 1
      );

      const newOverlayMetaHistoryItem = structuredClone(
        updatedOverlayMetaHistories[currentHistoryIndex]
      );

      for (let i = 0; i < newOverlayMetaHistoryItem.elements.length; i++) {
        const elementId = newOverlayMetaHistoryItem.elements[i].id;
        if (elementId === updatedElement.id) {
          newOverlayMetaHistoryItem.elements[i] = updatedElement;
          break;
        }
      }
      updatedOverlayMetaHistories.push(newOverlayMetaHistoryItem);
      setOverlayMetaHistories(updatedOverlayMetaHistories);
      setCurrentHistoryIndex(updatedOverlayMetaHistories.length - 1);
    }
  };

  useEffect(() => {
    // const address = "ws://127.0.0.1:4455";
    // obsRef.current.connect(address);
    // obsRef.current.on("ConnectionOpened", () => {
    //   setConnected(true);
    // });

    document.oncontextmenu = function (e) {
      stopEvent(e);
    };
  }, []);

  const downloadLayout = async () => {
    if (exportContainerRef && exportContainerRef.current) {
      // exportComponentAsJPEG(exportContainerRef, {
      //   html2CanvasOptions: {},
      // });
    }
  };

  const generateRenderChildElementsCode = () => {
    let text = "\n";
    overlayMetaHistories[currentHistoryIndex].elements.forEach((ele) => {
      const eleId =
        ele.id.substring(0, 1).toUpperCase() +
        ele.id.substring(1, ele.id.length);
      if (ele.details.type === ELEMENT_TYPES.TEXT) {
        text += `\t     <${eleId.replace("_", "")}>${
          ele.details.text
        }</${eleId.replace("_", "")}> \n`;
      } else if (ele.details.type === ELEMENT_TYPES.IMAGE) {
        text += `\t     <${eleId.replace("_", "")} src="${
          ele.details.url
        }"/> \n`;
      } else {
        text += `\t     <${eleId.replace("_", "")} /> \n`;
      }
    });
    return text;
  };

  const generateCode = () => {
    setOpenCodeGenModal(true);
    const containerElement = document.getElementById("drop-zone-element");
    if (!containerElement) return;
    const containerEleWidth = containerElement.clientWidth;
    const containerEleHeight = containerElement.clientHeight;
    let text = `import styled from "styled-components" \n\n`;
    let stylesText = `const Container = styled.div${"`"}\n`;
    stylesText += `\tposition: absolute;\n`;
    stylesText += `\ttop: 0;\n`;
    stylesText += `\tleft: 0;\n`;
    stylesText += `\twidth: 800px;\n`;
    stylesText += `\taspect-ratio: 16/9;\n`;
    stylesText += `\tbackground-image: url("${overlayMetaHistories[currentHistoryIndex].background_url}");\n`;
    stylesText += `${"`"};\n\n`;
    overlayMetaHistories[currentHistoryIndex].elements.forEach((ele) => {
      const eleId =
        ele.id.substring(0, 1).toUpperCase() +
        ele.id.substring(1, ele.id.length);
      let componentType = "";
      switch (ele.details.type) {
        case ELEMENT_TYPES.IMAGE:
          componentType = "styled.img";
          break;
        case ELEMENT_TYPES.SQUARE:
          componentType = "styled.div";
          break;
        case ELEMENT_TYPES.TEXT:
          componentType = "styled.h1";
          break;
      }
      let styleText = `const ${eleId.replace(
        "_",
        ""
      )} = ${componentType}${"`"}\n`;
      styleText += `\tposition: absolute;\n`;
      styleText += `\tleft: ${
        ele.relativeCoords?.x
          ? parseInt(
              ((ele.relativeCoords.x / containerEleWidth) * 100).toString()
            )
          : 0
      }%;\n`;
      styleText += `\ttop: ${
        ele.relativeCoords?.y
          ? parseInt(
              ((ele.relativeCoords.y / containerEleHeight) * 100).toString()
            )
          : 0
      }%;\n`;
      Object.keys(ele.style).forEach((key) => {
        const formattedKey = key
          .split(/(?=[A-Z])/)
          .join("-")
          .toLowerCase();
        const value = ele.style[key as keyof typeof ele.style];
        styleText += `\t${formattedKey}: ${value};\n`;
      });
      styleText += `${"`"}`;
      stylesText += styleText + "; \n\n";
    });
    text += stylesText;
    text += "\n";
    text += `const MyComponent = () => { \n\treturn (\n\t  <Container>${generateRenderChildElementsCode()}\t  </Container>\n\t) \n}\n\n`;
    text += `export default MyComponent;`;
    setGeneratedCode(text);
    setTimeout(() => {
      setSelectedElementId(null);
      setCurrentMode("code");
    }, 50);
  };

  function stopEvent(event: any) {
    if (event.preventDefault != undefined) event.preventDefault();
    if (event.stopPropagation != undefined) event.stopPropagation();
  }

  const copyMultipleElements = useCallback(
    (ids: string[]) => {
      const copiedElements = overlayMetaHistories[
        currentHistoryIndex
      ].elements.filter((e) => ids.includes(e.id));
      if (copiedElements.length === 0) return;
      setCopiedElements(copiedElements);
      navigator.clipboard.writeText(
        JSON.stringify({ copiedElements, copyElement: null })
      );
    },
    [overlayMetaHistories, currentHistoryIndex]
  );

  useEffect(() => {
    const handleClipboardContent = async () => {
      try {
        const clipboardContents = await navigator.clipboard.read();
        for (const item of clipboardContents) {
          for (const mimeType of item.types) {
            switch (mimeType) {
              case "text/html":
                const blob = await item.getType("text/html");
                const blobText = await blob.text();
                const container = document.getElementById("drop-zone-element");
                if (container) {
                  container.innerText = blobText;
                }
                console.log(blobText);
                // const clipHTML = document.createElement("pre");
                // clipHTML.innerText = blobText;
                // destinationDiv.appendChild(clipHTML);
                break;
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (currentMode !== "canvas") return;
    if (pressedKies.length > 0) {
      if (pressedKies.length === 1) {
        if (
          pressedKies[0] === "Delete" &&
          (selectedElementId || inSelectZoneIds.length > 0)
        ) {
          if (selectedElementId) {
            removeElement(selectedElementId);
          }
          if (inSelectZoneIds.length > 0) {
            removeMultipleElements(inSelectZoneIds);
          }
        }
      } else {
        if (
          pressedKies[0] === "Control" &&
          pressedKies[1] === "c" &&
          (selectedElementId || inSelectZoneIds.length > 0)
        ) {
          setCopyType("copy");
          if (selectedElementId) {
            setCopiedElements([]);
            copyElement(selectedElementId);
          } else {
            setCopiedElement(null);
            copyMultipleElements(inSelectZoneIds);
          }
        }

        if (
          pressedKies[0] === "Control" &&
          pressedKies[1] === "v" &&
          (copiedElement || copiedElements.length > 0)
        ) {
          // handleClipboardContent();

          if (copiedElement) {
            pasteElement(
              {
                x: copiedElement.coords!.x + 25,
                y: copiedElement.coords!.y + 25,
              },
              {
                x: copiedElement.relativeCoords!.x + 25,
                y: copiedElement.relativeCoords!.y + 25,
              }
            );
          } else {
            pasteMultipleElements();
          }
        }

        if (
          pressedKies[0] === "Control" &&
          pressedKies[1] === "x" &&
          (selectedElementId || inSelectZoneIds.length > 0)
        ) {
          setCopyType("cut");
          if (selectedElementId) {
            setCopiedElements([]);
            copyElement(selectedElementId);
            removeElement(selectedElementId);
          } else {
            setCopiedElement(null);
            copyMultipleElements(inSelectZoneIds);
            removeMultipleElements(inSelectZoneIds);
          }
        }

        if (
          pressedKies[0] === "Control" &&
          pressedKies[1] === "z" &&
          currentHistoryIndex > 0
        ) {
          setCurrentHistoryIndex((prevIndex) => prevIndex - 1);
        }

        if (
          pressedKies[0] === "Control" &&
          pressedKies[1] === "y" &&
          currentHistoryIndex < overlayMetaHistories.length - 1
        ) {
          setCurrentHistoryIndex((prevIndex) => prevIndex + 1);
        }

        if (pressedKies[0] === "Control" && pressedKies[1] === "a") {
          setInSelectZoneIds(
            overlayMetaHistories[currentHistoryIndex].elements.map(
              (element) => element.id
            )
          );
        }
      }
    }
  }, [pressedKies, currentMode]);

  const updateElementState = (state: number, elementId: string) => {
    const updatedOverlayMetaHistories = structuredClone(overlayMetaHistories);
    const eleIndex = updatedOverlayMetaHistories[
      currentHistoryIndex
    ].elements.findIndex((ele) => ele.id === elementId);
    if (eleIndex === -1) return;
    updatedOverlayMetaHistories[currentHistoryIndex].elements[eleIndex].isShow =
      state === 0 ? false : true;
    setOverlayMetaHistories(updatedOverlayMetaHistories);
  };

  const reorderElement = (elementId: string, type: "up" | "down") => {
    const updatedOverlayMetaHistories = structuredClone(overlayMetaHistories);
    const eleIndex = updatedOverlayMetaHistories[
      currentHistoryIndex
    ].elements.findIndex((ele) => ele.id === elementId);
    if (eleIndex === -1) return;
    if (type === "up") {
      if (
        eleIndex <
        updatedOverlayMetaHistories[currentHistoryIndex].elements.length - 1
      ) {
        const temp = structuredClone(
          updatedOverlayMetaHistories[currentHistoryIndex].elements[
            eleIndex + 1
          ]
        );
        temp.order -= 1;
        updatedOverlayMetaHistories[currentHistoryIndex].elements[
          eleIndex + 1
        ] = updatedOverlayMetaHistories[currentHistoryIndex].elements[eleIndex];
        updatedOverlayMetaHistories[currentHistoryIndex].elements[
          eleIndex + 1
        ].order += 1;
        updatedOverlayMetaHistories[currentHistoryIndex].elements[eleIndex] =
          temp;
      }
    } else {
      if (eleIndex > 0) {
        const temp = structuredClone(
          updatedOverlayMetaHistories[currentHistoryIndex].elements[
            eleIndex - 1
          ]
        );
        temp.order += 1;
        updatedOverlayMetaHistories[currentHistoryIndex].elements[
          eleIndex - 1
        ] = updatedOverlayMetaHistories[currentHistoryIndex].elements[eleIndex];
        updatedOverlayMetaHistories[currentHistoryIndex].elements[
          eleIndex - 1
        ].order -= 1;
        updatedOverlayMetaHistories[currentHistoryIndex].elements[eleIndex] =
          temp;
      }
    }

    setOverlayMetaHistories(updatedOverlayMetaHistories);
  };

  const save = () => {
    if (userInfo) {
      setOpenSaveModal(true);
    } else {
      notification.open({
        message: "You need to login to be able to save layout",
      });
    }
  };

  if (isLoading) return <Loading />;
  return (
    <Container>
      <Header>
        <HeaderLeft>
          <button
            onClick={() => {
              router.back();
            }}
          >
            <ArrowLeftOutlined />
          </button>
          <button
            className={currentHistoryIndex <= 0 ? "disabled" : ""}
            onClick={() =>
              currentHistoryIndex > 0 &&
              setCurrentHistoryIndex((prevIndex) => prevIndex - 1)
            }
          >
            Undo
          </button>
          <button
            className={
              currentHistoryIndex >= overlayMetaHistories.length - 1
                ? "disabled"
                : ""
            }
            onClick={() =>
              currentHistoryIndex < overlayMetaHistories.length - 1 &&
              setCurrentHistoryIndex((prevIndex) => prevIndex + 1)
            }
          >
            Redo
          </button>
        </HeaderLeft>
        <HeaderCenter>
          <div
            onClick={() => {
              if (currentCursorToolOption !== CURSOR_TOOL_OPTIONS.DEFAULT) {
                setCurrentCursorToolOpt(CURSOR_TOOL_OPTIONS.DEFAULT);
              }
            }}
            className={
              currentCursorToolOption === CURSOR_TOOL_OPTIONS.DEFAULT
                ? "selected"
                : ""
            }
          >
            <AdsClickIcon color="inherit" fontSize="inherit" />
          </div>
          <div
            onClick={() => {
              if (currentCursorToolOption !== CURSOR_TOOL_OPTIONS.ZONE_SELECT) {
                setCurrentCursorToolOpt(CURSOR_TOOL_OPTIONS.ZONE_SELECT);
              } else {
                setCurrentCursorToolOpt(CURSOR_TOOL_OPTIONS.DEFAULT);
              }
            }}
            className={
              currentCursorToolOption === CURSOR_TOOL_OPTIONS.ZONE_SELECT
                ? "selected"
                : ""
            }
          >
            <HighlightAltIcon color="inherit" fontSize="inherit" />
          </div>
        </HeaderCenter>
        <HeaderRight>
          {/* <button onClick={downloadLayout}>Tải layout</button> */}
          {/* <button onClick={generateCode}>Generate Code</button> */}
          <button onClick={save}>Save layout</button>
        </HeaderRight>
      </Header>
      <Body>
        <LeftPanel>
          <Tabs>
            <Tab
              onClick={() => setCurrentTab(0)}
              className={currentTab === 0 ? "selected" : ""}
            >
              Background
            </Tab>
            <Tab
              onClick={() => setCurrentTab(1)}
              className={currentTab === 1 ? "selected" : ""}
            >
              Item
            </Tab>
            {/* <Tab
              onClick={() => setCurrentTab(2)}
              className={currentTab === 2 ? "selected" : ""}
            >
              Layers
            </Tab> */}
          </Tabs>
          {currentTab === 0 && renderBackgrounds()}
          {currentTab === 1 && renderElements()}
          {currentTab === 2 && (
            <Layers
              updateElementState={updateElementState}
              reorderElement={reorderElement}
              selectedElementId={selectedElementId}
              setSelectedElementId={setSelectedElementId}
              elements={overlayMetaHistories[currentHistoryIndex].elements}
            />
          )}
        </LeftPanel>
        <Center>
          <CenterTabs>
            <CenterTab
              onClick={() => setCurrentMode("canvas")}
              className={currentMode === "canvas" ? "selected" : ""}
            >
              Canvas
            </CenterTab>
            <CenterTab
              onClick={() => {
                generateCode();
              }}
              className={currentMode === "code" ? "selected" : ""}
            >
              Code
            </CenterTab>
          </CenterTabs>
          {overlayMetaHistories[currentHistoryIndex] &&
            currentMode === "canvas" && (
              <OverlayView
                selectedEleId={selectedElementId}
                setSelectedEleId={setSelectedElementId}
                setCopyType={setCopyType}
                inSelectZoneIds={inSelectZoneIds}
                setInSelectZoneIds={(ids) => {
                  setSelectedElementId(null);
                  setInSelectZoneIds(ids);
                }}
                currentCursorToolOption={currentCursorToolOption}
                copiedElement={copiedElement}
                copiedElements={copiedElements}
                key={currentHistoryIndex}
                updateElementSize={updateElementSize}
                exportContainerRef={exportContainerRef}
                selectElement={handleSelectElement}
                removeElement={removeElement}
                copyElement={copyElement}
                pasteElement={pasteElement}
                pasteMultipleElements={pasteMultipleElements}
                updateElementCoords={updateElementCoords}
                addText={(coords, relativeCoords) =>
                  addText(coords, relativeCoords)
                }
                addImage={(coords, relativeCoords) =>
                  addImage(coords, relativeCoords)
                }
                addSquare={(coords, relativeCoords) =>
                  addSquare(coords, relativeCoords)
                }
                overlayMetadata={overlayMetaHistories[currentHistoryIndex]}
              />
            )}
          {currentMode === "code" && generatedCode && (
            <div
              style={{
                width: "100%",
                height: "550px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <CodeEditor
                value={generatedCode ?? ""}
                language="js"
                disabled
                data-color-mode="dark"
                onChange={(e) => {}}
                style={{
                  position: "relative",
                  width: "90%",
                  height: "100%",
                  marginTop: "0px",
                  overflowY: "auto",
                  backgroundColor: "black",
                  boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.5)",
                  padding: "10px 10px",
                  fontFamily:
                    "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                }}
              />
            </div>
          )}
        </Center>
        <Right>
          <ElementPropertiesPanel
            updateElement={handleUpdateElement}
            selectedElement={getElementById(selectedElementId)}
          />
        </Right>
      </Body>
      <Modal
        title={null}
        closeIcon={null}
        open={isOpenSaveModal}
        onOk={() => {}}
        onCancel={() => setOpenSaveModal(false)}
        footer={null}
      >
        <SaveLayoutModal
          closeModal={() => setOpenSaveModal(false)}
          overlayMetadata={overlayMetaHistories[currentHistoryIndex]}
        />
      </Modal>
    </Container>
  );
};

export default SetupPage;
