
declare global {
    interface Window { 
        createUnityInstance: Function
    }
}

var UnityInstance = null;

// list of allowed animtrigger strings (as set up in Unity editor)
export type animTrigger = "qc" | "batch" | "manual" | "reset";

export async function LoadUnity(canvas: HTMLCanvasElement): Promise<void> {
    const folderName = "UnityModel/Build/UnityModel";
    const config = {
        dataUrl: folderName + `.data.unityweb`,
        frameworkUrl: folderName + `.framework.js.unityweb`,
        codeUrl: folderName + `.wasm.unityweb`,
        streamingAssetsUrl: folderName + "UnityModel/StreamingAssets",
        companyName: "BCIT",
        productName: "Hematology Analyzer",
        productVersion: "0.1",
    };
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "UnityModel/Build/UnityModel.loader.js";
    
    script.onload = () => {
      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        // Mobile device style: fill the whole browser client area with the game canvas:
        var meta = document.createElement("meta");
        meta.name = "viewport";
        meta.content =
          "width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes";
        document.getElementsByTagName("head")[0].appendChild(meta);
      }
  
      window.createUnityInstance(canvas, config, (progress) => {
        console.log("Unity Progress: ", progress);
      })
        .then((unityInstance) => {
         
          UnityInstance = unityInstance;
          
        })
        .catch((message) => {
          console.log(message);
        });
    };

    document.body.appendChild(script);
} 

export function SetAnimTrigger(btnid: string) {
  let trigger: animTrigger;
  switch (btnid) {
      case 'runqc-btn':
          trigger = "qc";
          break;
      case 'runpa-btn':
          trigger = "batch";
          break;
      case 'runma-btn':
          trigger = "manual";
          break;
      case 'reset-btn':
          trigger = "reset";
          break;
      default:
          throw new Error("Invalid button id");
  }
  UnityInstance.SendMessage("Hematology Analyzer","SetParam","reset,1");
  UnityInstance.SendMessage("Hematology Analyzer","SetParam",trigger+",1");
  
}