"use client";
import OBSWebSocket from "obs-websocket-js";
import { useEffect, useRef, useState } from "react";
import { BrowserInputSettings } from "./types/obs.types";

export default function Home() {
  const obsRef = useRef<OBSWebSocket>(new OBSWebSocket());
  const [isConnected, setConnected] = useState(false);
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
        url: "http://www.localhost:3000/templates/1",
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
        {
          requestType: "CreateInput",
          requestData: {
            inputKind: "browser_source",
            inputName: "donation",
            inputSettings: {
              height: 1080,
              width: 1920,
              css: "body { background-color:rgba(0,0,0,0); margin: 0px auto; overflow: hidden; }",
              url: "http://www.localhost:3000/donation",
            },
            sceneName: currentProgramSceneName,
          },
        },
      ]);
    } else {
      const inputSettings: BrowserInputSettings = {
        height: 1080,
        width: 1920,
        css: "body { background-color:red; margin: 0px auto; overflow: hidden; }",
        url: "http://www.localhost:3000/templates/2",
      };
      await obsRef.current.call("SetInputSettings", {
        inputName: "layout",
        inputSettings,
      });
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>
  );
}
