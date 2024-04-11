import $ from "jquery";

declare global {
  interface Window { 
    FromUnity_ApplicationStarted: Function, 
    createUnityInstance: Function
  }
}
const canvasid = "unity-canvas";
var UnityInstance = null;

/** Unity progress loader UI and loaded init handling */
export function LoadUnity() {
    const loader = `<div id="loading-cover">
                      <div id="logo"></div> 
                      <div id="unity-loading-bar">        
                      <div id="unity-progress-bar-empty" ></div>
                          <div id="unity-progress-bar-full"></div>
                      </div>
                      <div class="spinner"></div>
                    </div> </div>`;
    $("body").prepend($(loader));

    const buildUrl = "Build/UnityModel";
    const canvas = document.createElement("canvas") as HTMLCanvasElement;	  
    
    const loaderUrl = buildUrl + ".loader.js";
    const config = {
      dataUrl: buildUrl + ".data.gz",
      frameworkUrl: buildUrl + ".framework.js.gz",
      codeUrl: buildUrl + ".wasm.gz",
      streamingAssetsUrl: "StreamingAssets",
      companyName: "BCIT SOH",
      productName: "Heme Analyzer",
      productVersion: "0.1",
    };
  
    const loadingCover = document.querySelector("#loading-cover") as HTMLDivElement;
    const progressBarEmpty = document.querySelector("#unity-progress-bar-empty") as HTMLDivElement;
    const progressBarFull = document.querySelector("#unity-progress-bar-full") as HTMLDivElement;
    const spinner = document.querySelector(".spinner") as HTMLDivElement;
  
    const script = document.createElement("script");

    canvas.setAttribute("id", canvasid);
    document.body.appendChild(canvas);
    script.src = loaderUrl;
  
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
        spinner.style.display = "none";
        progressBarEmpty.style.display = "";
        progressBarFull.style.width = `${100 * progress}%`;
      })
        .then((unityInstance) => {
          loadingCover.style.display = "none";
          UnityInstance = unityInstance;
        })
        .catch((message) => {
          alert(message);
        });
    };
    document.body.appendChild(script);

    InitFromUnity();
} 

// SendMessage Methods: calls to Unity 
export function UnityResetScene() {
  // reloads active scene
  UnityInstance.SendMessage('Main', 'ResetScene');
}

// Handles communication coming from Unity Object to page
function InitFromUnity() {
  /** Unity SelectableObject broadcasts string `transform_name` on Select */ 
   /*window.FromUnity_Select = function(transform_name) {
    
   
    var $dialog = $("#hs_popup");
    
    $dialog.dialog("close");
    
    var key = transform_name.trim();
    if (key in data){
      $dialog.html(data[key])
        .dialog( "option", {
          "title": transform_name
        } )
        .dialog( "open" );
    }    
  } */

  /** Scene Start handler: called from Unity main>ActivityController>Start 
   * @param {string} str Active scene name
  */
  window.FromUnity_ApplicationStarted = function( str: string) {
    
    // let web app know that Unity object is ready 
    console.log(str + " scene started");
    SceneStart(str);
    
  }

}

function SceneStart( sceneName: string ) {
	
}