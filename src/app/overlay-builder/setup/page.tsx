"use client";

import styled from "styled-components";
import BackgroundItem, { TBackgroundItem } from "./components/background-item";
import OverlayView from "./components/overlay-view";
import { useEffect, useRef, useState } from "react";
import TextItem from "./components/elements/text-item";
import { XYCoord } from "react-dnd";
import {
  ELEMENT_TYPES,
  Element,
  ImageElement,
  TextElement,
} from "@/app/types/element.types";
import ElementPropertiesPanel from "./components/overlay-view/components/element-properties-panel";
import OBSWebSocket from "obs-websocket-js";
import { BrowserInputSettings } from "@/app/types/obs.types";
import { exportComponentAsJPEG } from "react-component-export-image";
import ImageItem from "./components/elements/image-item";

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: column;
`;

const Header = styled.div`
  width: 100%;
  height: 60px;
  background-color: white;
  z-index: 1;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  box-sizing: border-box;
  padding: 0px 25px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
  gap: 10px;
  button {
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    color: white;
    border: none;
    outline: none;
    font-weight: 600;
    &:nth-child(1) {
      color: white;
      background: #8e2de2; /* fallback for old browsers */
      background: -webkit-linear-gradient(
        to right,
        #4a00e0,
        #8e2de2
      ); /* Chrome 10-25, Safari 5.1-6 */
      background: linear-gradient(
        to right,
        #4a00e0,
        #8e2de2
      ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    }
    &:nth-child(2) {
      color: white;
      background: #8e2de2; /* fallback for old browsers */
      background: -webkit-linear-gradient(
        to right,
        #4a00e0,
        #8e2de2
      ); /* Chrome 10-25, Safari 5.1-6 */
      background: linear-gradient(
        to right,
        #4a00e0,
        #8e2de2
      ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    }
  }
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
};

const SetupPage = () => {
  const exportContainerRef = useRef<any>(null);
  const obsRef = useRef<OBSWebSocket>(new OBSWebSocket());
  const [isConnected, setConnected] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [overlayMetadata, setOverlayMetadata] = useState<OverlayMetadata>({
    background_ratio: [16, 9],
    background_url: "",
    elements: [],
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
      id: `element_${updatedOverlayMD.elements.length}`,
    };
    updatedOverlayMD.elements.push(textItem);
    setOverlayMetadata(updatedOverlayMD);
  };

  const addImage = (coords: XYCoord | null) => {
    const updatedOverlayMD = Object.assign({}, overlayMetadata);
    const textItem: ImageElement = {
      coords,
      url: "",
      type: ELEMENT_TYPES.IMAGE,
      width: 100,
      height: 100,
      id: `element_${updatedOverlayMD.elements.length}`,
    };
    updatedOverlayMD.elements.push(textItem);
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
    const index = parseInt(elementId.split("_")[1]);
    updatedOverlayMD.elements = updatedOverlayMD.elements.filter(
      (_, i) => i !== index
    );
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
      exportComponentAsJPEG(exportContainerRef, {
        html2CanvasOptions: {},
      });
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
        <button onClick={downloadLayout}>Download layout</button>
        <button onClick={applyLayout}>Áp dụng layout</button>
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
            key={
              overlayMetadata.background_url + overlayMetadata.elements.length
            }
            updateElementSize={updateElementSize}
            exportContainerRef={exportContainerRef}
            selectElement={handleSelectElement}
            removeElement={removeElement}
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
