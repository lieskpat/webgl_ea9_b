// create a shader
function createShader(gl, type, source) {
    //createShader erzeugt Shader Objekt
    //in das Shader-Programm geladen wird
    const shader = gl.createShader(type);
    //lädt Programmcode in Shader-Objekt
    gl.shaderSource(shader, source);
    //übersetzt Programm im Shader
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log("error: compiling shader");
    }
    return shader;
}

export { createShader };
