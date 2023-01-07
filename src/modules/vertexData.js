import { vec3 } from "gl-matrix";

const geometryModelDatas = [];

function createVertexDataTorus() {
    var n = 16;
    var m = 32;

    // Positions.
    this.vertices = new Float32Array(3 * (n + 1) * (m + 1));
    var vertices = this.vertices;
    // Normals.
    this.normals = new Float32Array(3 * (n + 1) * (m + 1));
    var normals = this.normals;
    //Texture
    this.textureCoord = new Float32Array(2 * (n + 1) * (m + 1));
    var textureCoord = this.textureCoord;
    // Index data.
    this.indicesLines = new Uint16Array(2 * 2 * n * m);
    var indicesLines = this.indicesLines;
    this.indicesTris = new Uint16Array(3 * 2 * n * m);
    var indicesTris = this.indicesTris;

    var du = (2 * Math.PI) / n;
    var dv = (2 * Math.PI) / m;
    var r = 0.3;
    var R = 0.5;
    // Counter for entries in index array.
    var iLines = 0;
    var iTris = 0;

    // Loop angle u.
    for (var i = 0, u = 0; i <= n; i++, u += du) {
        // Loop angle v.
        for (var j = 0, v = 0; j <= m; j++, v += dv) {
            var iVertex = i * (m + 1) + j;

            var x = (R + r * Math.cos(u)) * Math.cos(v);
            var y = (R + r * Math.cos(u)) * Math.sin(v);
            var z = r * Math.sin(u);

            // Set vertex positions.
            vertices[iVertex * 3] = x;
            vertices[iVertex * 3 + 1] = y;
            vertices[iVertex * 3 + 2] = z;

            // Calc and set normals.
            var nx = Math.cos(u) * Math.cos(v);
            var ny = Math.cos(u) * Math.sin(v);
            var nz = Math.sin(u);
            normals[iVertex * 3] = nx;
            normals[iVertex * 3 + 1] = ny;
            normals[iVertex * 3 + 2] = nz;

            textureCoord[iVertex * 2] = u / (2 * Math.PI); // s
            textureCoord[iVertex * 2 + 1] = v / Math.PI; // t

            // Set index.
            // Line on beam.
            if (j > 0 && i > 0) {
                indicesLines[iLines++] = iVertex - 1;
                indicesLines[iLines++] = iVertex;
            }
            // Line on ring.
            if (j > 0 && i > 0) {
                indicesLines[iLines++] = iVertex - (m + 1);
                indicesLines[iLines++] = iVertex;
            }

            // Set index.
            // Two Triangles.
            if (j > 0 && i > 0) {
                indicesTris[iTris++] = iVertex;
                indicesTris[iTris++] = iVertex - 1;
                indicesTris[iTris++] = iVertex - (m + 1);
                //
                indicesTris[iTris++] = iVertex - 1;
                indicesTris[iTris++] = iVertex - (m + 1) - 1;
                indicesTris[iTris++] = iVertex - (m + 1);
            }
        }
    }
}

function createVertexDataPlane() {
    var n = 100;
    var m = 100;

    // Positions.
    this.vertices = new Float32Array(3 * (n + 1) * (m + 1));
    var vertices = this.vertices;
    // Normals.
    this.normals = new Float32Array(3 * (n + 1) * (m + 1));
    var normals = this.normals;
    //Textures
    this.textureCoord = new Float32Array(2 * (n + 1) * (m + 1));
    var textureCoord = this.textureCoord;
    // Index data.
    this.indicesLines = new Uint16Array(2 * 2 * n * m);
    var indicesLines = this.indicesLines;
    this.indicesTris = new Uint16Array(3 * 2 * n * m);
    var indicesTris = this.indicesTris;

    var du = 20 / n;
    var dv = 20 / m;
    var r = 0.3;
    var R = 0.5;
    // Counter for entries in index array.
    var iLines = 0;
    var iTris = 0;

    // Loop angle u.
    for (var i = 0, u = -10; i <= n; i++, u += du) {
        // Loop angle v.
        for (var j = 0, v = -10; j <= m; j++, v += dv) {
            var iVertex = i * (m + 1) + j;

            var x = u;
            var y = 0;
            var z = v;

            // Set vertex positions.
            vertices[iVertex * 3] = x;
            vertices[iVertex * 3 + 1] = y;
            vertices[iVertex * 3 + 2] = z;

            // Calc and set normals.
            //var nx = Math.cos(u) * Math.cos(v);
            //var ny = Math.cos(u) * Math.sin(v);
            //var nz = Math.sin(u);
            normals[iVertex * 3] = 0;
            normals[iVertex * 3 + 1] = 1;
            normals[iVertex * 3 + 2] = 0;

            // Set texture coordinate.
            //            textureCoord[iVertex * 2] = (u + 10) / 20;
            //            textureCoord[iVertex * 2 + 1] = (v + 10) / 20;
            //
            // Set texture coordinate.
            textureCoord[iVertex * 2] = u;
            textureCoord[iVertex * 2 + 1] = v;

            // Set index.
            // Line on beam.
            if (j > 0 && i > 0) {
                indicesLines[iLines++] = iVertex - 1;
                indicesLines[iLines++] = iVertex;
            }
            // Line on ring.
            if (j > 0 && i > 0) {
                indicesLines[iLines++] = iVertex - (m + 1);
                indicesLines[iLines++] = iVertex;
            }

            // Set index.
            // Two Triangles.
            if (j > 0 && i > 0) {
                indicesTris[iTris++] = iVertex;
                indicesTris[iTris++] = iVertex - 1;
                indicesTris[iTris++] = iVertex - (m + 1);
                //
                indicesTris[iTris++] = iVertex - 1;
                indicesTris[iTris++] = iVertex - (m + 1) - 1;
                indicesTris[iTris++] = iVertex - (m + 1);
            }
        }
    }
}

function createVertexDataPillow() {
    const m = 7;
    const n = 32;
    // Positions.
    this.vertices = new Float32Array(3 * (n + 1) * (m + 1));
    var vertices = this.vertices;
    // Normals.
    this.normals = new Float32Array(3 * (n + 1) * (m + 1));
    var normals = this.normals;
    // Index data.
    this.indicesLines = new Uint16Array(2 * 2 * n * m);
    var indicesLines = this.indicesLines;
    this.indicesTris = new Uint16Array(3 * 2 * n * m);
    var indicesTris = this.indicesTris;

    const umin = 0;
    const umax = Math.PI;
    const vmin = -1 * Math.PI;
    const vmax = Math.PI;
    const a = 0.5;
    const du = (umin + umax) / n;
    const dv = (vmin - vmax) / m;
    let iIndex = 0;
    let iTriangles = 0;

    for (let i = 0, u = 0; i <= n; i++, u += du) {
        for (let j = 0, v = 0; j <= m; j++, v += dv) {
            let iVertex = i * (m + 1) + j;
            let x = Math.cos(u);
            let z = Math.cos(v);
            let y = a * Math.sin(u) * Math.sin(v);
            vertices[iVertex * 3] = x;
            vertices[iVertex * 3 + 1] = y;
            vertices[iVertex * 3 + 2] = z;

            // Calc and set normals.
            var nx = Math.cos(u) * Math.cos(v);
            var ny = Math.cos(u) * Math.sin(v);
            var nz = Math.sin(u);
            normals[iVertex * 3] = nx;
            normals[iVertex * 3 + 1] = ny;
            normals[iVertex * 3 + 2] = nz;

            if (j > 0 && i > 0) {
                indicesLines[iIndex++] = iVertex - 1;
                indicesLines[iIndex++] = iVertex;
            }
            if (j > 0 && i > 0) {
                indicesLines[iIndex++] = iVertex - (m + 1);
                indicesLines[iIndex++] = iVertex;
            }
            if (j > 0 && i > 0) {
                indicesTris[iTriangles++] = iVertex;
                indicesTris[iTriangles++] = iVertex - 1;
                indicesTris[iTriangles++] = iVertex - (m + 1);

                indicesTris[iTriangles++] = iVertex - 1;
                indicesTris[iTriangles++] = iVertex - (m + 1) - 1;
                indicesTris[iTriangles++] = iVertex - (m + 1);
            }
        }
    }
}

function createVertexDataRecSphere() {
    const vertexArray = [
        0, 1, 0, 0, 0, 1, 1, 0, 0, -1, 0, 0, 0, 0, -1, 0, -1, 0,
    ];
    //let vertexArray = [];
    let lineArray = [];
    const recursionDepth = 1;

    // top
    const vectorA = [0, 1.0, 0];
    // middle
    const vectorB = [0, 0, 1.0];
    //middle right
    const vectorC = [1.0, 0, 0];
    //middle left
    const vectorD = [-1.0, 0, 0];
    //back
    const vectorE = [0, 0, -1.0];
    //bottom
    const vectorF = [0, -1.0, 0];

    vec3.normalize(vectorA, vectorA);
    vec3.normalize(vectorB, vectorB);
    vec3.normalize(vectorC, vectorC);
    vec3.normalize(vectorD, vectorD);
    vec3.normalize(vectorE, vectorE);
    vec3.normalize(vectorF, vectorF);

    //tessellateTriangle(vertexArray, vectorA, vectorB, vectorC, recursionDepth);
    //tessellateTriangle(vertexArray, vectorA, vectorB, vectorD, recursionDepth);
    //tessellateTriangle(vertexArray, vectorA, vectorC, vectorD, recursionDepth);
    //tessellateTriangle(vertexArray, vectorB, vectorC, vectorD, recursionDepth);
    let triangles = [
        [2, 0, 1],
        [5, 2, 1],
        [3, 0, 2],
        [5, 3, 2],
        [4, 0, 3],
        [5, 4, 3],
        [1, 0, 4],
        [5, 1, 4],
    ];

    lineArray = [
        0, 1, 0, 2, 0, 3, 0, 4,

        1, 2, 1, 3, 2, 4, 3, 4,

        1, 5, 2, 5, 3, 5, 4, 5,
    ];
    // Positions.
    this.vertices = new Float32Array(vertexArray);
    // Normals.
    //this.normals = new Float32Array(3 * (n + 1) * (m + 1));
    // Index data.
    this.indicesLines = new Uint16Array(lineArray);
    this.indicesTris = new Uint16Array(triangles);
}

function middleVector(vectorOne, vectorTwo) {
    // add the two vector to create a direction vector (median)
    var c = vec3.create();
    vec3.add(vectorOne, vectorTwo, c);
    return normalize(c);
}

function normalize(vec) {
    // the normalization function return the center (vector) of the median
    vec3.normalize(vec);
    var normalizedVector = [vec[0], vec[1], vec[2]];
    return normalizedVector;
}

function tessellateTriangle(
    vertexArray,
    vectorOne,
    vectorTwo,
    vectorThree,
    depth
) {
    if (depth == 1) {
        // a recursion depth of 1 means to store the vertices and to break
        // the recursion
        vertexArray.push(vectorOne[0], vectorOne[1], vectorOne[2]);
        vertexArray.push(vectorTwo[0], vectorTwo[1], vectorTwo[2]);
        vertexArray.push(vectorThree[0], vectorThree[1], vectorThree[2]);
    } else {
        // calculate the medians...
        var vectorOne_vectorTwo = middleVector(vectorOne, vectorTwo);
        var vectorOne_vectorThree = middleVector(vectorOne, vectorThree);
        var vectorTwo_vectorThree = middleVector(vectorTwo, vectorThree);

        // ...and use them to span four new triangles which then gets tessellated again
        tessellateTriangle(
            vectorOne,
            vectorOne_vectorTwo,
            vectorOne_vectorThree,
            depth - 1
        );
        tessellateTriangle(
            vectorOne_vectorThree,
            vectorTwo_vectorThree,
            vectorThree,
            depth - 1
        );
        tessellateTriangle(
            vectorOne_vectorTwo,
            vectorTwo,
            vectorTwo_vectorThree,
            depth - 1
        );
        tessellateTriangle(
            vectorOne_vectorTwo,
            vectorOne_vectorThree,
            vectorTwo_vectorThree,
            depth - 1
        );
    }
}

//============================Begin Sphere=====================================================================================================

function createVertexDataSphere() {
    var n = 32;
    var m = 32;

    // Positions.
    this.vertices = new Float32Array(3 * (n + 1) * (m + 1));
    var vertices = this.vertices;
    // Normals.
    this.normals = new Float32Array(3 * (n + 1) * (m + 1));
    var normals = this.normals;
    // Textures
    this.textureCoord = new Float32Array(2 * (n + 1) * (m + 1));
    var textureCoord = this.textureCoord;
    // Index data.
    this.indicesLines = new Uint16Array(2 * 2 * n * m);
    var indicesLines = this.indicesLines;
    this.indicesTris = new Uint16Array(3 * 2 * n * m);
    var indicesTris = this.indicesTris;

    var du = (2 * Math.PI) / n;
    var dv = Math.PI / m;
    var r = 1;
    // Counter for entries in index array.
    var iLines = 0;
    var iTris = 0;

    // Loop angle u.
    for (var i = 0, u = 0; i <= n; i++, u += du) {
        // Loop angle v.
        for (var j = 0, v = 0; j <= m; j++, v += dv) {
            var iVertex = i * (m + 1) + j;

            var x = r * Math.sin(v) * Math.cos(u);
            var y = r * Math.sin(v) * Math.sin(u);
            var z = r * Math.cos(v);

            // Set vertex positions.
            vertices[iVertex * 3] = x;
            vertices[iVertex * 3 + 1] = y;
            vertices[iVertex * 3 + 2] = z;

            // Calc and set normals.
            var vertexLength = Math.sqrt(x * x + y * y + z * z);
            normals[iVertex * 3] = x / vertexLength;
            normals[iVertex * 3 + 1] = y / vertexLength;
            normals[iVertex * 3 + 2] = z / vertexLength;

            textureCoord[iVertex * 2] = u / (2 * Math.PI); // s
            textureCoord[iVertex * 2 + 1] = v / Math.PI; // t

            // Set index.
            // Line on beam.
            if (j > 0 && i > 0) {
                indicesLines[iLines++] = iVertex - 1;
                indicesLines[iLines++] = iVertex;
            }
            // Line on ring.
            if (j > 0 && i > 0) {
                indicesLines[iLines++] = iVertex - (m + 1);
                indicesLines[iLines++] = iVertex;
            }

            // Set index.
            // Two Triangles.
            if (j > 0 && i > 0) {
                indicesTris[iTris++] = iVertex;
                indicesTris[iTris++] = iVertex - 1;
                indicesTris[iTris++] = iVertex - (m + 1);
                //
                indicesTris[iTris++] = iVertex - 1;
                indicesTris[iTris++] = iVertex - (m + 1) - 1;
                indicesTris[iTris++] = iVertex - (m + 1);
            }
        }
    }
}

//============================End Sphere=======================================================================================================

geometryModelDatas.push({
    description: "torus",
    function: createVertexDataTorus,
});
geometryModelDatas.push({
    description: "plane",
    function: createVertexDataPlane,
});
//geometryModelDatas.push({
//    description: "pillow",
//    function: createVertexDataPillow,
//});
//geometryModelDatas.push({
//    description: "sphere-rekursiv",
//    function: createVertexDataRecSphere,
//});
geometryModelDatas.push({
    description: "sphere",
    function: createVertexDataSphere,
});

export { geometryModelDatas };
