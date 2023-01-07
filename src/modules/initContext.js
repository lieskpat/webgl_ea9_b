function initContext(id) {
    const canvas = document.getElementById(id);
    const gl = canvas.getContext("webgl");
    if (!gl) {
        console.log("error: no gl context");
    }
    return gl;
}

export { initContext };
