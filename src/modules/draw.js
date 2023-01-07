"use strict";

//import { linkShader } from "../shader/linkShader.js";
import { loadVertexData } from "./loadVertexData.js";
import { bindVertexBuffer } from "./bindVertexBuffer.js";

function initRenderPipeline(gl) {
    //setzt Hintergrundfarbe
    gl.clearColor(0, 0, 0, 1);
    //Löscht den Zeichenbereich mit der Hintergrundfarbe
    gl.clear(gl.COLOR_BUFFER_BIT);
    //Vorbereitung der Shader Programme
    const program = linkShader(gl);
    //Bereitstellung der 3D Modelle aus Vertex Daten
    loadVertexData(gl);
    //Konfiguration der Rendering Pipeline
    // Bind vertex buffer to attribute variable
    const attributes = bindVertexBuffer(gl, program);
    //schickt alle aktiven Buffer mit Vertex-Daten in Rendering Pipeline
    //gl.drawArrays(gl.LINES, 0, 2);
    return attributes;
}

export { initRenderPipeline };
