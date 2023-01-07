import { createShader } from "../shader/createShader.js";
import vertexGlsl from "../shader/vertexShader_shader_language.js";
import fragmentGlsl from "../shader/fragmentShader_shader_language.js";
import { createProgram } from "../shader/createProgram.js";
import { loadVertexData } from "./loadVertexData.js";

function initBuffer(
    gl,
    arrayOfBufferData,
    bufferType,
    prog,
    objectOfShaderVars,
    numberOfComponents
) {
    //const n = vertices.length / 2;
    //create a buffer object
    const buffer = gl.createBuffer();
    //bind the buffer object to target (for example ARRAY_BUFFER)
    gl.bindBuffer(bufferType, buffer);
    //write data into the buffer object
    gl.bufferData(bufferType, arrayOfBufferData, gl.STATIC_DRAW);
    const positionAttributeLocation = gl.getAttribLocation(
        prog,
        objectOfShaderVars
    );
    const translationAttrib = gl.getUniformLocation(prog, objectOfShaderVars);
    gl.vertexAttribPointer(
        positionAttributeLocation,
        numberOfComponents,
        gl.FLOAT,
        false,
        0,
        0
    );
    gl.enableVertexAttribArray(positionAttributeLocation);
    //return n;
}

function initWebGl(gl) {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexGlsl);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentGlsl);
    const prog = createProgram(gl, vertexShader, fragmentShader);
    return {
        shader: {
            vertex_shader: vertexShader,
            fragment_shader: fragmentShader,
        },
        program: prog,
    };
}

export { initWebGl, initBuffer };
