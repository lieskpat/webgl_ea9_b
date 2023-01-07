//in Rendering Pipeline gelangen Vertex Daten zu erst in den Vertex Shader
function bindVertexBuffer(gl, program) {
    //liefert Referenz auf Attribut des Vertex-Shaders (pos)
    const posAttrib = gl.getAttribLocation(program, "pos");
    const translationAttrib = gl.getUniformLocation(program, "translation");
    const rotationAttrib = gl.getUniformLocation(program, "rotation");
    //definiert Datenformat eines Buffers für ein Attribut
    //z.b. ob dieser einzelne Werte oder Vektoren einer bestimmten Dimension enthält
    //2 -> Zweidimensionale Vektoren
    //gl.FLOAT -> Fließkomma Vektoren
    //false -> nicht normalisiert
    //0, 0 -> direkt am Anfang des Arrays beginnend
    gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);
    //verbindet Shader und Buffer
    gl.enableVertexAttribArray(posAttrib);

    return {
        pos_Attrib: posAttrib,
        translation_Attrib: translationAttrib,
        rotation_Attrib: rotationAttrib,
    };
}

export { bindVertexBuffer };
