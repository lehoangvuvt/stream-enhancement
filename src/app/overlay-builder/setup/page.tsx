"use client";

import styled from "styled-components";
import BackgroundItem, { TBackgroundItem } from "./components/background-item";
import OverlayView from "./components/overlay-view";
import { MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import TextItem from "./components/elements/text-item";
import { XYCoord } from "react-dnd";
import HighlightAltIcon from "@mui/icons-material/HighlightAlt";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import {
  CURSOR_TOOL_OPTIONS,
  ELEMENT_TYPES,
  Element,
  ImageElement,
  TextElement,
} from "@/app/types/element.types";
import ElementPropertiesPanel from "./components/overlay-view/components/element-properties-panel";
import OBSWebSocket from "obs-websocket-js";
import { BrowserInputSettings } from "@/app/types/obs.types";
// import { exportComponentAsJPEG } from "react-component-export-image";
import ImageItem from "./components/elements/image-item";
import useKeyboard from "@/hooks/useKeyboard";
import useClipboard from "@/hooks/useClipboard";

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
  padding: 0px 25px;
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
  justify-content: flex-end;
  gap: 10px;
  box-sizing: border-box;
  padding-right: 20px;
  button {
    width: 32% !important;
    &.disabled {
      filter: brightness(50%);
      cursor: not-allowed;
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
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.1);
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
  const { get: getCB, write: writeCB } = useClipboard();
  const { pressedKies, setPressedKies } = useKeyboard();
  const [copyType, setCopyType] = useState<"copy" | "cut">("copy");
  const exportContainerRef = useRef<any>(null);
  const obsRef = useRef<OBSWebSocket>(new OBSWebSocket());
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
      </>
    );
  };

  const addText = (coords: XYCoord | null, relativeCoords: XYCoord | null) => {
    let updatedOverlayMetaHistories = [...overlayMetaHistories];
    if (updatedOverlayMetaHistories.length === 0) {
      const textItem: TextElement = {
        coords,
        relativeCoords,
        font_color: "#ffffff",
        font_size: 20,
        font_weight: 400,
        opacity: 1,
        text: "New Text",
        type: ELEMENT_TYPES.TEXT,
        id: "element_1",
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
      const textItem: TextElement = {
        coords,
        relativeCoords,
        font_color: "#ffffff",
        font_size: 20,
        font_weight: 400,
        opacity: 1,
        text: "New Text",
        type: ELEMENT_TYPES.TEXT,
        id: lastEleNo ? `element_${lastEleNo + 1}` : "element_1",
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
      const imageItem: ImageElement = {
        coords,
        relativeCoords,
        url: "",
        type: ELEMENT_TYPES.IMAGE,
        width: 100,
        height: 100,
        id: `element_1`,
        rotate: 0,
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
      const imageItem: ImageElement = {
        coords,
        relativeCoords,
        url: "",
        type: ELEMENT_TYPES.IMAGE,
        width: 100,
        height: 100,
        id: lastEleNo ? `element_${lastEleNo + 1}` : "element_1",
        rotate: 0,
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
    if (element.type === ELEMENT_TYPES.IMAGE) {
      element.width = newSize.width;
      element.height = newSize.height;
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
    async (coord: { x: number; y: number }) => {
      let updatedOverlayMetaHistories = structuredClone(overlayMetaHistories);
      const data = await getCB<{
        copiedElement: Element | null;
        copiedElements: Element[];
      }>();
      if (!copiedElement) return;
      const lastEleNo =
        updatedOverlayMetaHistories[updatedOverlayMetaHistories.length - 1]
          .lastEleNo;
      let pastedElement: any = null;
      switch (copiedElement.type) {
        case ELEMENT_TYPES.IMAGE:
          pastedElement = structuredClone(copiedElement);
          pastedElement.id = lastEleNo
            ? `element_${lastEleNo + 1}`
            : `element_1`;
          pastedElement.coords = { x: coord.x, y: coord.y };
          break;
        case ELEMENT_TYPES.TEXT:
          pastedElement = structuredClone(copiedElement);
          pastedElement.id = lastEleNo
            ? `element_${lastEleNo + 1}`
            : `element_1`;
          pastedElement.coords = { x: coord.x, y: coord.y };
          break;
      }
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
        const copiedElement = copiedElements[i];
        switch (copiedElement.type) {
          case ELEMENT_TYPES.IMAGE:
            const imageElement = structuredClone(copiedElement);
            imageElement.id = lastEleNo
              ? `element_${lastEleNo + 1 + i}`
              : i === 0
              ? `element_1`
              : `element_${i + 1}`;
            imageElement.coords = {
              x: copiedElement.coords!.x + 25,
              y: copiedElement.coords!.y + 25,
            };
            pastedElements.push(imageElement);
            break;
          case ELEMENT_TYPES.TEXT:
            const textElement = structuredClone(copiedElement);
            textElement.id = lastEleNo
              ? `element_${lastEleNo + 1 + i}`
              : i === 0
              ? `element_1`
              : `element_${i + 1}`;
            textElement.coords = {
              x: copiedElement.coords!.x + 25,
              y: copiedElement.coords!.y + 25,
            };
            pastedElements.push(textElement);
            break;
        }
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

  const test = async () => {
    if (!obsRef || !obsRef.current) return;
    const { currentProgramSceneName } = await obsRef.current.call(
      "GetCurrentProgramScene"
    );

    const { inputs } = await obsRef.current.call("GetInputList");
    console.log(inputs);
    if (!inputs.find((input) => input.inputName === "layout")) {
      const inputSettings: BrowserInputSettings = {
        height: 1080,
        width: 1920,
        css: "body { background-color:red; margin: 0px auto; overflow: hidden; }",
        url: "http://www.localhost:3000/iframe",
      };
      await obsRef.current.callBatch([
        {
          requestType: "CreateInput",
          requestData: {
            inputKind: "browser_source",
            inputName: "layout",
            inputSettings,
            sceneName: currentProgramSceneName,
          },
        },
        // {
        //   requestType: "CreateInput",
        //   requestData: {
        //     inputKind: "browser_source",
        //     inputName: "donation",
        //     inputSettings: {
        //       height: 1080,
        //       width: 1920,
        //       css: "body { background-color:rgba(0,0,0,0); margin: 0px auto; overflow: hidden; }",
        //       url: "http://www.localhost:3000/donation",
        //     },
        //     sceneName: currentProgramSceneName,
        //   },
        // },
      ]);
    } else {
      const inputSettings: BrowserInputSettings = {
        height: 1080,
        width: 1920,
        css: "body { background-color:red; margin: 0px auto; overflow: hidden; }",
        url: "http://www.localhost:3000/iframe?ref=1",
      };
      await obsRef.current.call("SetInputSettings", {
        inputName: "layout",
        inputSettings,
      });
    }
  };

  const applyLayout = () => {
    localStorage.setItem(
      "layout",
      JSON.stringify(overlayMetaHistories[currentHistoryIndex])
    );
    test();
  };

  const downloadLayout = async () => {
    if (exportContainerRef && exportContainerRef.current) {
      // exportComponentAsJPEG(exportContainerRef, {
      //   html2CanvasOptions: {},
      // });
    }
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
          if (copiedElement) {
            pasteElement({
              x: copiedElement.coords!.x + 25,
              y: copiedElement.coords!.y + 25,
            });
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
  }, [pressedKies]);

  return (
    <Container>
      <Header>
        <HeaderLeft>
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
          <button onClick={downloadLayout}>Tải layout</button>
          <button onClick={applyLayout}>Áp dụng layout</button>
        </HeaderRight>
      </Header>
      <Body>
        <LeftPanel>
          <Tabs>
            <Tab
              onClick={() => setCurrentTab(0)}
              className={currentTab === 0 ? "selected" : ""}
            >
              Nền
            </Tab>
            <Tab
              onClick={() => setCurrentTab(1)}
              className={currentTab === 1 ? "selected" : ""}
            >
              Thành phần
            </Tab>
            <Tab
              onClick={() => setCurrentTab(2)}
              className={currentTab === 2 ? "selected" : ""}
            >
              Donate
            </Tab>
          </Tabs>
          {currentTab === 0 && renderBackgrounds()}
          {currentTab === 1 && renderElements()}
        </LeftPanel>
        <Center>
          {overlayMetaHistories[currentHistoryIndex] && (
            <OverlayView
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
              overlayMetadata={overlayMetaHistories[currentHistoryIndex]}
            />
          )}
        </Center>
        <Right>
          <ElementPropertiesPanel
            updateElement={handleUpdateElement}
            selectedElement={getElementById(selectedElementId)}
          />
        </Right>
      </Body>
    </Container>
  );
};

export default SetupPage;
