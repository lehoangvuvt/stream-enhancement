"use client";

import styled from "styled-components";
import BackgroundItem, { TBackgroundItem } from "./components/background-item";
import OverlayView from "./components/overlay-view";
import { useEffect, useRef, useState } from "react";
import TextItem from "./components/elements/text-item";
import { XYCoord } from "react-dnd";
import HighlightAltIcon from "@mui/icons-material/HighlightAlt";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import {
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
  justify-content: space-between;
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

export enum CURSOR_TOOL_OPTIONS {
  DEFAULT,
  ZONE_SELECT,
}

const SetupPage = () => {
  const exportContainerRef = useRef<any>(null);
  const obsRef = useRef<OBSWebSocket>(new OBSWebSocket());
  const [currentCursorToolOption, setCurrentCursorToolOpt] =
    useState<CURSOR_TOOL_OPTIONS>(CURSOR_TOOL_OPTIONS.DEFAULT);
  const [isConnected, setConnected] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [copiedElement, setCopiedElement] = useState<Element | null>(null);
  const [overlayMetadata, setOverlayMetadata] = useState<OverlayMetadata>({
    background_ratio: [16, 9],
    background_url: "",
    elements: [],
    lastEleNo: null,
  });
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );

  const setBackground = (item: TBackgroundItem) => {
    const updatedOverlayMD = Object.assign({}, overlayMetadata);
    updatedOverlayMD.background_url = item.url;
    setOverlayMetadata(updatedOverlayMD);
  };

  const renderBackgrounds = () => {
    return (
      <>
        {bgItems.map((bgItem) => (
          <BackgroundItem
            details={bgItem}
            key={bgItem.id}
            onSelect={(item) => setBackground(item)}
            isSelected={overlayMetadata.background_url === bgItem.url}
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

  const addText = (coords: XYCoord | null) => {
    const updatedOverlayMD = Object.assign({}, overlayMetadata);
    const textItem: TextElement = {
      coords,
      font_color: "#ffffff",
      font_size: 20,
      font_weight: 400,
      opacity: 1,
      text: "New Text",
      type: ELEMENT_TYPES.TEXT,
      id: updatedOverlayMD.lastEleNo
        ? `element_${updatedOverlayMD.lastEleNo + 1}`
        : `element_1`,
    };
    updatedOverlayMD.lastEleNo = updatedOverlayMD.lastEleNo
      ? updatedOverlayMD.lastEleNo + 1
      : 1;
    updatedOverlayMD.elements.push(textItem);
    setOverlayMetadata(updatedOverlayMD);
  };

  const addImage = (coords: XYCoord | null) => {
    const updatedOverlayMD = Object.assign({}, overlayMetadata);
    const imageItem: ImageElement = {
      coords,
      url: "",
      type: ELEMENT_TYPES.IMAGE,
      width: 100,
      height: 100,
      id: updatedOverlayMD.lastEleNo
        ? `element_${updatedOverlayMD.lastEleNo + 1}`
        : `element_1`,
    };
    updatedOverlayMD.lastEleNo = updatedOverlayMD.lastEleNo
      ? updatedOverlayMD.lastEleNo + 1
      : 1;
    updatedOverlayMD.elements.push(imageItem);
    setOverlayMetadata(updatedOverlayMD);
  };

  const updateElementCoords = (newCoords: XYCoord, elementId: string) => {
    const updatedOverlayMD = Object.assign({}, overlayMetadata);
    const index = updatedOverlayMD.elements.findIndex(
      (ele) => ele.id === elementId
    );
    if (index === -1) return;
    updatedOverlayMD.elements[index].coords = newCoords;
    setOverlayMetadata(updatedOverlayMD);
  };

  const updateElementSize = (
    newSize: { width: number; height: number },
    elementId: string
  ) => {
    const updatedOverlayMD = Object.assign({}, overlayMetadata);
    const index = updatedOverlayMD.elements.findIndex(
      (ele) => ele.id === elementId
    );
    if (index === -1) return;
    const imageElement = updatedOverlayMD.elements[index] as ImageElement;
    imageElement.width = newSize.width;
    imageElement.height = newSize.height;
    updatedOverlayMD.elements[index] = imageElement;
    setOverlayMetadata(updatedOverlayMD);
  };

  const removeElement = (elementId: string) => {
    const updatedOverlayMD = Object.assign({}, overlayMetadata);

    updatedOverlayMD.elements = updatedOverlayMD.elements.filter(
      (element) => element.id !== elementId
    );
    setOverlayMetadata(updatedOverlayMD);
  };

  const copyElement = (elementId: string) => {
    const copiedElement =
      overlayMetadata?.elements.find((e) => e.id === elementId) ?? null;
    setCopiedElement(copiedElement);
  };

  const pasteElement = (coord: { x: number; y: number }) => {
    const updatedOverlayMD = Object.assign({}, overlayMetadata);
    if (!copiedElement) return;
    switch (copiedElement.type) {
      case ELEMENT_TYPES.IMAGE:
        const imageItem: ImageElement = Object.assign({}, copiedElement);
        imageItem.id = updatedOverlayMD.lastEleNo
          ? `element_${updatedOverlayMD.lastEleNo + 1}`
          : `element_1`;
        imageItem.coords = { x: coord.x, y: coord.y };
        updatedOverlayMD.elements.push(imageItem);
        break;
      case ELEMENT_TYPES.TEXT:
        const textItem: TextElement = Object.assign({}, copiedElement);
        textItem.id = updatedOverlayMD.lastEleNo
          ? `element_${updatedOverlayMD.lastEleNo + 1}`
          : `element_1`;
        textItem.coords = { x: coord.x, y: coord.y };
        updatedOverlayMD.elements.push(textItem);
        break;
    }
    updatedOverlayMD.lastEleNo = updatedOverlayMD.lastEleNo
      ? updatedOverlayMD.lastEleNo + 1
      : 1;
    setOverlayMetadata(updatedOverlayMD);
  };

  const handleSelectElement = (elementId: string) => {
    setSelectedElementId(elementId);
  };

  const getElementById = (elementId: string | null) => {
    if (!elementId || elementId === "") return null;
    return (
      overlayMetadata.elements.find((element) => element.id === elementId) ??
      null
    );
  };

  const handleUpdateElement = (updatedElement: Element) => {
    const updatedOverlayMD = Object.assign({}, overlayMetadata);
    for (let i = 0; i < updatedOverlayMD.elements.length; i++) {
      const elementId = updatedOverlayMD.elements[i].id;
      if (elementId === updatedElement.id) {
        updatedOverlayMD.elements[i] = updatedElement;
        break;
      }
    }
    setOverlayMetadata(updatedOverlayMD);
  };

  useEffect(() => {
    // const address = "ws://127.0.0.1:4455";
    // obsRef.current.connect(address);
    // obsRef.current.on("ConnectionOpened", () => {
    //   setConnected(true);
    // });
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
    localStorage.setItem("layout", JSON.stringify(overlayMetadata));
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

  useEffect(() => {
    document.oncontextmenu = function (e) {
      var evt = new Object({ keyCode: 93 });
      stopEvent(e);
    };
  }, []);

  return (
    <Container>
      <Header>
        <HeaderLeft></HeaderLeft>
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
          <OverlayView
            currentCursorToolOption={currentCursorToolOption}
            copiedElement={copiedElement}
            key={
              overlayMetadata.background_url + overlayMetadata.elements.length
            }
            updateElementSize={updateElementSize}
            exportContainerRef={exportContainerRef}
            selectElement={handleSelectElement}
            removeElement={removeElement}
            copyElement={copyElement}
            pasteElement={pasteElement}
            updateElementCoords={updateElementCoords}
            addText={(coords) => addText(coords)}
            addImage={(coords) => addImage(coords)}
            overlayMetadata={overlayMetadata}
          />
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
