function createProgram(gl, vertexShader, fragmentShader) {
    const prog = gl.createProgram();
    //fügt Shader-Objekt zu einem GPU-Programm hinzu
    gl.attachShader(prog, vertexShader);
    gl.attachShader(prog, fragmentShader);
    //verbindet die Shader und erzeugt ausführbares GPU Programm
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.log("Error: linking shader program");
    }
    return prog;
}

export { createProgram };
