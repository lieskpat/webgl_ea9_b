var vertexGlsl = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec2 aTextureCoord;

    uniform mat4 uPMatrix;
    uniform mat4 uMVMatrix;
    uniform mat3 uNMatrix;

    varying vec2 vTextureCoord;
            
    //uniform vec4 uColor;
    varying vec4 vColor;
                        
    // Ambient light.
    uniform vec3 ambientLight;
            
    // Pointlights.
    const int MAX_LIGHT_SOURCES = 8;
    struct LightSource {
        bool isOn;
        vec3 position;
        vec3 color;
    };
    uniform LightSource light[MAX_LIGHT_SOURCES];
            
    // Material.
    struct PhongMaterial {
        vec3 ka;
        vec3 kd;
        vec3 ks;
        float ke; 
    };
    uniform PhongMaterial material;
            
    // Phong illumination for single light source,
    // no ambient light.
    vec3 phong(vec3 p, vec3 n, vec3 v, LightSource l) {
        vec3 L = l.color;

        vec3 s = normalize(l.position - p);
        vec3 r = reflect(-s, n);
	
        float sn = max( dot(s,n), 0.0);
        float rv = max( dot(r,v), 0.0);
				
        vec3 diffuse = material.kd * L * sn;
					
        vec3 specular = material.ks * L * pow(rv, material.ke);

        return diffuse + specular;			       
    }
            
    // Phong illumination for multiple light sources
    vec3 phong(vec3 p, vec3 n, vec3 v) {
            
        // Calculate ambient light.
        vec3 result = material.ka * ambientLight;
                
        // Add light from all light sources.
        for(int j=0; j < MAX_LIGHT_SOURCES; j++){
            if(light[j].isOn){
                result += phong(p, n, v, light[j]);
            }
        }
        return result;
    }
            
    void main(){
        // Calculate vertex position in eye coordinates. 
        vec4 tPosition = uMVMatrix * vec4(aPosition, 1.0);
        // Calculate projektion.
        gl_Position = uPMatrix * tPosition;
            
        vec3 tNormal = normalize(uNMatrix * aNormal);
                
        // Calculate view vector.
        // vec3 v = normalize(-tPosition.xyz);    
                                
        // vColor = vec4( phong(tPosition.xyz, tNormal, v), 1.0);

        vTextureCoord = aTextureCoord;

    }

`;

//Fragment Shader dienen unter anderem der Einfärbung
var fragmentGlsl = `

    precision mediump float;

    uniform sampler2D uTexture;
            
    varying vec4 vColor;

    varying vec2 vTextureCoord;
            
    void main() {
        // gl_FragColor = vColor;

        gl_FragColor = texture2D(uTexture, vTextureCoord);
    }

`;

/**
 * Common utilities
 * @module glMatrix
 */
// Configuration Constants
var EPSILON = 0.000001;
var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
if (!Math.hypot) Math.hypot = function () {
  var y = 0,
      i = arguments.length;

  while (i--) {
    y += arguments[i] * arguments[i];
  }

  return Math.sqrt(y);
};

/**
 * 3x3 Matrix
 * @module mat3
 */

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */

function create$2() {
  var out = new ARRAY_TYPE(9);

  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
  }

  out[0] = 1;
  out[4] = 1;
  out[8] = 1;
  return out;
}
/**
 * Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {ReadonlyMat4} a Mat4 to derive the normal matrix from
 *
 * @returns {mat3} out
 */

function normalFromMat4(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  return out;
}

/**
 * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
 * @module mat4
 */

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */

function create$1() {
  var out = new ARRAY_TYPE(16);

  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
  }

  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}
/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */

function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Multiplies two mat4s
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */

function multiply(out, a, b) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15]; // Cache only the current line of the second matrix

  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
}
/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to translate
 * @param {ReadonlyVec3} v vector to translate by
 * @returns {mat4} out
 */

function translate(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;

  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }

  return out;
}
/**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to scale
 * @param {ReadonlyVec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/

function scale(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateX(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[4] = a10 * c + a20 * s;
  out[5] = a11 * c + a21 * s;
  out[6] = a12 * c + a22 * s;
  out[7] = a13 * c + a23 * s;
  out[8] = a20 * c - a10 * s;
  out[9] = a21 * c - a11 * s;
  out[10] = a22 * c - a12 * s;
  out[11] = a23 * c - a13 * s;
  return out;
}
/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateY(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[0] = a00 * c - a20 * s;
  out[1] = a01 * c - a21 * s;
  out[2] = a02 * c - a22 * s;
  out[3] = a03 * c - a23 * s;
  out[8] = a00 * s + a20 * c;
  out[9] = a01 * s + a21 * c;
  out[10] = a02 * s + a22 * c;
  out[11] = a03 * s + a23 * c;
  return out;
}
/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateZ(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[0] = a00 * c + a10 * s;
  out[1] = a01 * c + a11 * s;
  out[2] = a02 * c + a12 * s;
  out[3] = a03 * c + a13 * s;
  out[4] = a10 * c - a00 * s;
  out[5] = a11 * c - a01 * s;
  out[6] = a12 * c - a02 * s;
  out[7] = a13 * c - a03 * s;
  return out;
}
/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */

function frustum(out, left, right, bottom, top, near, far) {
  var rl = 1 / (right - left);
  var tb = 1 / (top - bottom);
  var nf = 1 / (near - far);
  out[0] = near * 2 * rl;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = near * 2 * tb;
  out[6] = 0;
  out[7] = 0;
  out[8] = (right + left) * rl;
  out[9] = (top + bottom) * tb;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = far * near * 2 * nf;
  out[15] = 0;
  return out;
}
/**
 * Generates a perspective projection matrix with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
 * which matches WebGL/OpenGL's clip volume.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum, can be null or Infinity
 * @returns {mat4} out
 */

function perspectiveNO(out, fovy, aspect, near, far) {
  var f = 1.0 / Math.tan(fovy / 2),
      nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;

  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = (far + near) * nf;
    out[14] = 2 * far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -2 * near;
  }

  return out;
}
/**
 * Alias for {@link mat4.perspectiveNO}
 * @function
 */

var perspective = perspectiveNO;
/**
 * Generates a orthogonal projection matrix with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
 * which matches WebGL/OpenGL's clip volume.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */

function orthoNO(out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}
/**
 * Alias for {@link mat4.orthoNO}
 * @function
 */

var ortho = orthoNO;
/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis.
 * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {ReadonlyVec3} eye Position of the viewer
 * @param {ReadonlyVec3} center Point the viewer is looking at
 * @param {ReadonlyVec3} up vec3 pointing up
 * @returns {mat4} out
 */

function lookAt(out, eye, center, up) {
  var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
  var eyex = eye[0];
  var eyey = eye[1];
  var eyez = eye[2];
  var upx = up[0];
  var upy = up[1];
  var upz = up[2];
  var centerx = center[0];
  var centery = center[1];
  var centerz = center[2];

  if (Math.abs(eyex - centerx) < EPSILON && Math.abs(eyey - centery) < EPSILON && Math.abs(eyez - centerz) < EPSILON) {
    return identity(out);
  }

  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;
  len = 1 / Math.hypot(z0, z1, z2);
  z0 *= len;
  z1 *= len;
  z2 *= len;
  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;
  len = Math.hypot(x0, x1, x2);

  if (!len) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;
  len = Math.hypot(y0, y1, y2);

  if (!len) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }

  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out[15] = 1;
  return out;
}

/**
 * 4 Dimensional Vector
 * @module vec4
 */

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */

function create() {
  var out = new ARRAY_TYPE(4);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
  }

  return out;
}
/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the vector to transform
 * @param {ReadonlyMat4} m matrix to transform with
 * @returns {vec4} out
 */

function transformMat4(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2],
      w = a[3];
  out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
  out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
  out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
  out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
  return out;
}
/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

(function () {
  var vec = create();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 4;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      vec[3] = a[i + 3];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
      a[i + 3] = vec[3];
    }

    return a;
  };
})();

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

//const gl = initContext("gl_context");
let gl;

let lightsRun = false;
let currentLightPoint = ((2 * Math.PI) / 60) * 7;

// The shader program object is also used to
// store attribute and uniform locations.
let prog;

// Array of model objects.
const models = [];

const camera = {
    // Initial position of the camera.
    eye: [0, 1, 4],
    //eye: [0, 0, 0],
    // Point to look at.
    center: [0, 0, 0],
    //center: [0, 0, -1],
    // Roll and pitch of the camera.
    up: [0, 1, 0],
    // Opening angle given in radian.
    // radian = degree*2*PI/360.
    fovy: (60.0 * Math.PI) / 180,
    // Camera near plane dimensions:
    // value for left right top bottom in projection.
    lrtb: 2.0,
    // View matrix.
    // creates identy matrix
    vMatrix: create$1(),
    // Projection matrix.
    // creates identy matrix
    pMatrix: create$1(),
    // Projection types: ortho, perspective, frustum.
    //projectionType: "ortho",
    projectionType: "perspective",
    // Angle to Z-Axis for camera when orbiting the center
    // given in radian.
    zAngle: 0,
    // Distance in XZ-Plane from center when orbiting.
    distance: 4,
};

// Objekt with light sources characteristics in the scene.
var illumination = {
    ambientLight: [0.5, 0.5, 0.5],
    light: [
        {
            isOn: true,
            //position: [3, 1, 3],
            position: [
                Math.cos(((2 * Math.PI) / 60) * 7) * 2.3,
                1,
                Math.sin(((2 * Math.PI) / 60) * 7) * 2.3,
            ],
            color: [1, 1, 1],
        },
        {
            isOn: true,
            //position: [-3, 1, -3],
            position: [
                Math.cos(((2 * Math.PI) / 60) * 7 + Math.PI) * 2.3,
                1,
                Math.sin(((2 * Math.PI) / 60) * 7 + Math.PI) * 2.3,
            ],
            color: [1, 1, 1],
        },
    ],
};

function start() {
    init();
    render();
}

function init() {
    initWebGL();
    initShaderProgram();
    initUniforms();
    initModels();
    initEventHandler();
    initPipline();
}

function initWebGL() {
    // Get canvas and WebGL context.
    canvas = document.getElementById("gl_context");
    gl = canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
}

/**
 * Init pipeline parameters that will not change again.
 * If projection or viewport change, their setup must
 * be in render function.
 */
function initPipline() {
    gl.clearColor(0.95, 0.95, 0.95, 1);

    // Backface culling.
    gl.frontFace(gl.CCW);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    // Depth(Z)-Buffer.
    gl.enable(gl.DEPTH_TEST);

    // Polygon offset of rastered Fragments.
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(0.5, 0);

    // Set viewport.
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

    // Init camera.
    // Set projection aspect ratio.
    camera.aspect = gl.viewportWidth / gl.viewportHeight;
}

function initShaderProgram() {
    // Init vertex shader.
    const vs = initShader(gl.VERTEX_SHADER, vertexGlsl);
    // Init fragment shader.
    const fs = initShader(gl.FRAGMENT_SHADER, fragmentGlsl);
    // Link shader into a shader program.
    prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, "aPosition");
    gl.linkProgram(prog);
    gl.useProgram(prog);
}

/**
 * Create and init shader from source.
 *
 * @parameter shaderType: openGL shader type.
 * @parameter SourceTagId: Id of HTML Tag with shader source.
 * @returns shader object.
 */
function initShader(shaderType, shaderSource) {
    const shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log("Error: " + gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

function initUniforms() {
    // Projection Matrix.
    prog.pMatrixUniform = gl.getUniformLocation(prog, "uPMatrix");

    // Model-View-Matrix.
    prog.mvMatrixUniform = gl.getUniformLocation(prog, "uMVMatrix");

    prog.colorUniform = gl.getUniformLocation(prog, "uColor");

    prog.nMatrixUniform = gl.getUniformLocation(prog, "uNMatrix");

    // Light.
    prog.ambientLightUniform = gl.getUniformLocation(prog, "ambientLight");
    // Array for light sources uniforms.
    prog.lightUniform = [];
    // Loop over light sources.
    for (var j = 0; j < illumination.light.length; j++) {
        var lightNb = "light[" + j + "]";
        // Store one object for every light source.
        var l = {};
        l.isOn = gl.getUniformLocation(prog, lightNb + ".isOn");
        l.position = gl.getUniformLocation(prog, lightNb + ".position");
        l.color = gl.getUniformLocation(prog, lightNb + ".color");
        prog.lightUniform[j] = l;
    }

    // Material.
    prog.materialKaUniform = gl.getUniformLocation(prog, "material.ka");
    prog.materialKdUniform = gl.getUniformLocation(prog, "material.kd");
    prog.materialKsUniform = gl.getUniformLocation(prog, "material.ks");
    prog.materialKeUniform = gl.getUniformLocation(prog, "material.ke");

    // Texture.
    prog.textureUniform = gl.getUniformLocation(prog, "uTexture");
}

/**
 * @paramter material : objekt with optional ka, kd, ks, ke.
 * @retrun material : objekt with ka, kd, ks, ke.
 */
function createPhongMaterial(material) {
    material = material || {};
    // Set some default values,
    // if not defined in material paramter.
    material.ka = material.ka || [0.3, 0.3, 0.3];
    material.kd = material.kd || [0.6, 0.6, 0.6];
    material.ks = material.ks || [0.8, 0.8, 0.8];
    material.ke = material.ke || 10;

    return material;
}

function initModels() {
    // fill-style
    //const fs = "fillwireframe";
    const fs = "fill";

    // Create some default material.
    createPhongMaterial();
    var mRed = createPhongMaterial({ kd: [1, 0, 0] });
    createPhongMaterial({ kd: [0, 1, 0] });
    createPhongMaterial({ kd: [0, 0, 1] });
    createPhongMaterial({
        ka: [1, 1, 1],
        kd: [0.5, 0.5, 0.5],
        ks: [0, 0, 0],
    });

    createModel(
        "torus",
        fs,
        [1, 1, 1, 1],
        [0, 0, 0],
        [0, 0, 0],
        [2, 2, 2],
        mRed,
        "textures/schachbrett.png"
    );
}

/**
 * Create model object, fill it and push it in models array.
 *
 * @parameter geometryname: string with name of geometry.
 * @parameter fillstyle: wireframe, fill, fillwireframe.
 */
function createModel(
    geometryname,
    fillstyle,
    color,
    translate,
    rotate,
    scale,
    material,
    textureFilename
) {
    const model = {};
    model.fillstyle = fillstyle;
    model.color = color;
    model.material = material;
    if (textureFilename) {
        initTexture(model, textureFilename);
    }
    initDataAndBuffers(model, geometryname);
    initTransformations(model, translate, rotate, scale);
    models.push(model);
}

function initTexture(model, filename) {
    var texture = gl.createTexture();
    model.texture = texture;
    texture.loaded = false;
    texture.image = new Image();
    texture.image.onload = function () {
        onloadTextureImage(texture);
    };
    texture.image.src = filename;
}

function onloadTextureImage(texture) {
    texture.loaded = true;

    // Use texture object.
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Assigen image data.
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        texture.image
    );

    // Set texture parameter.
    // Min Filter: NEAREST,LINEAR, .. , LINEAR_MIPMAP_LINEAR,
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Mag Filter: NEAREST,LINEAR
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    // Use mip-Mapping.
    gl.generateMipmap(gl.TEXTURE_2D);

    // Release texture object.
    gl.bindTexture(gl.TEXTURE_2D, null);

    // Update the scene.
    render();
}

function initTransformations(model, translate, rotate, scale) {
    model.translate = translate;
    model.rotate = rotate;
    model.scale = scale;
    // mMatrix - ist Model Matrix
    model.mMatrix = create$1();
    //mvMatrix - ist ModelView Matrix
    model.mvMatrix = create$1();

    model.nMatrix = create$2();
}

function updateTransformations(model) {
    let mMatrix = model.mMatrix;
    let mvMatrix = model.mvMatrix;
    //mat4.copy(mvMatrix, camera.vMatrix);
    identity(mMatrix);
    identity(mvMatrix);

    translate(mMatrix, mMatrix, model.translate);
    //mat4.rotateZ(mMatrix, mMatrix, model.rotate[2]);
    //mat4.rotateY(mMatrix, mMatrix, model.rotate[1]);
    rotateX(mMatrix, mMatrix, model.rotate[0]);
    rotateY(mMatrix, mMatrix, model.rotate[1]);
    rotateZ(mMatrix, mMatrix, model.rotate[2]);
    scale(mMatrix, mMatrix, model.scale);

    multiply(mvMatrix, camera.vMatrix, mMatrix);

    // Calculate normal matrix from model-view matrix.
    normalFromMat4(model.nMatrix, mvMatrix);
}

/**
 * Init data and buffers for model object.
 *
 * @parameter model: a model object to augment with data.
 * @parameter geometryname: string with name of geometry.
 */
function initDataAndBuffers(model, geometryname) {
    // Provide model object with vertex data arrays.
    // Fill data arrays for Vertex-Positions, Normals, Index data:
    // vertices, normals, indicesLines, indicesTris;
    // Pointer this refers to the window.
    //this[geometryname]["createVertexData"].apply(model);
    for (let i = 0; i < geometryModelDatas.length; i++) {
        if (geometryModelDatas[i].description === geometryname) {
            geometryModelDatas[i].function.apply(model);
        }
    }

    // Setup position vertex buffer object.
    model.vboPos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, model.vboPos);
    gl.bufferData(gl.ARRAY_BUFFER, model.vertices, gl.STATIC_DRAW);
    // Bind vertex buffer to attribute variable.
    prog.positionAttrib = gl.getAttribLocation(prog, "aPosition");
    gl.enableVertexAttribArray(prog.positionAttrib);

    // Setup normal vertex buffer object.
    model.vboNormal = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, model.vboNormal);
    gl.bufferData(gl.ARRAY_BUFFER, model.normals, gl.STATIC_DRAW);
    // Bind buffer to attribute variable.
    prog.normalAttrib = gl.getAttribLocation(prog, "aNormal");
    gl.enableVertexAttribArray(prog.normalAttrib);

    // Setup lines index buffer object.
    model.iboLines = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboLines);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, model.indicesLines, gl.STATIC_DRAW);
    model.iboLines.numberOfElements = model.indicesLines.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    // Setup triangle index buffer object.
    model.iboTris = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboTris);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, model.indicesTris, gl.STATIC_DRAW);
    model.iboTris.numberOfElements = model.indicesTris.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    // Setup texture coordinate vertex buffer object.
    model.vboTextureCoord = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, model.vboTextureCoord);
    gl.bufferData(gl.ARRAY_BUFFER, model.textureCoord, gl.STATIC_DRAW);
    // Bind buffer to attribute variable.
    prog.textureCoordAttrib = gl.getAttribLocation(prog, "aTextureCoord");
    gl.enableVertexAttribArray(prog.textureCoordAttrib);
}

//animate spotlights around a circle
function runLights(fn) {
    if (lightsRun == false) {
        intervalStart = setInterval(fn, 120);
        lightsRun = true;
    } else {
        lightsRun = false;
        clearInterval(intervalStart);
    }
}

function initEventHandler() {
    const deltaRotate = Math.PI / 36;
    const deltaTranslate = 0.05;
    window.onkeydown = function (evt) {
        const sign = evt.shiftKey ? 1 : -1;
        const key = evt.which ? evt.which : evt.keyCode;
        const c = String.fromCharCode(key);

        // Change projection of scene.
        switch (c) {
            case "F":
                //camera.projectionType = "frustum";
                //camera.lrtb = 1.2;
                break;
            case "%":
                camera.zAngle -= deltaRotate;
                break;
            case "'":
                camera.zAngle += deltaRotate;
                break;
            case "N":
                // Camera near plane dimensions.
                camera.lrtb += sign * 0.1;
                camera.distance += sign * deltaTranslate;
                break;
            case "L":
                runLights(function () {
                    currentLightPoint += (2 * Math.PI) / 60;

                    illumination.light[0].position[0] =
                        Math.cos(currentLightPoint) * 2.3;
                    illumination.light[0].position[2] =
                        Math.sin(currentLightPoint) * 2.3;

                    illumination.light[1].position[0] =
                        Math.cos(currentLightPoint + Math.PI) * 2.3;
                    illumination.light[1].position[2] =
                        Math.sin(currentLightPoint + Math.PI) * 2.3;

                    render();
                });
        }

        // Render the scene again on any key pressed.
        render();
    };
}

/**
 * Run the rendering pipeline.
 */
function render() {
    // Clear framebuffer and depth-/z-buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // setze Projektionsmatrix camera.pMatrix (orthogonal, perspektivisch etc.)
    setProjection();

    //mat4.identity(camera.vMatrix);
    //mat4.rotate(camera.vMatrix, camera.vMatrix, (Math.PI * 1) / 8, [1, 0, 0]);
    // Kreisbahn der Kamera
    // Anpassung der x und z koordinaten
    calculateCameraOrbit();
    //1. Parameter - out -> Ergebniss der 4x4 Matrix wird in out geschrieben
    //2. Parameter - eye -> virtuelle Position der Kamera
    //3. Parameter - center -> der Punkt auf den die Kamera schaut
    //4. Parameter - up -> kann Kamera um die Achse des Objektives gedreht werden
    //eye(0, 1, 4), center(0, 0, 0), up(0, 1, 0)
    lookAt(camera.vMatrix, camera.eye, camera.center, camera.up);

    // NEW
    // Set light uniforms.
    gl.uniform3fv(prog.ambientLightUniform, illumination.ambientLight);
    // Loop over light sources.
    for (var j = 0; j < illumination.light.length; j++) {
        // bool is transferred as integer.
        gl.uniform1i(prog.lightUniform[j].isOn, illumination.light[j].isOn);
        // Tranform light postion in eye coordinates.
        // Copy current light position into a new array.
        var lightPos = [].concat(illumination.light[j].position);
        // Add homogenious coordinate for transformation.
        lightPos.push(1.0);
        transformMat4(lightPos, lightPos, camera.vMatrix);
        // Remove homogenious coordinate.
        lightPos.pop();
        gl.uniform3fv(prog.lightUniform[j].position, lightPos);
        gl.uniform3fv(prog.lightUniform[j].color, illumination.light[j].color);
    }

    // Loop over models.
    for (let i = 0; i < models.length; i++) {
        updateTransformations(models[i]);
        // Update modelview for model.
        // kopiert die Camera-Matrix in die Model-View-Matrix
        //mat4.copy(models[i].mvMatrix, camera.vMatrix);
        //mat4.scale(models[i].mvMatrix, models[i].mvMatrix, models[i].scale);
        //mat4.rotate(models[i].mvMatrix, models[i].mvMatrix, models[i].rotate);

        //mat4.translate(
        //models[i].mvMatrix,
        //models[i].mvMatrix,
        //models[i].translate
        //);
        //mat4.scale(models[i].mvMatrix, models[i].mvMatrix, models[i].scale);

        // Set uniforms for model.
        // binde die Model-View-Matrix zur Transformation der Vertex Welt-Koordinaten
        // in Kamera Koordinaten
        gl.uniformMatrix4fv(prog.mvMatrixUniform, false, models[i].mvMatrix);
        gl.uniform4fv(prog.colorUniform, models[i].color);
        gl.uniformMatrix3fv(prog.nMatrixUniform, false, models[i].nMatrix);

        // NEW
        // Material.
        gl.uniform3fv(prog.materialKaUniform, models[i].material.ka);
        gl.uniform3fv(prog.materialKdUniform, models[i].material.kd);
        gl.uniform3fv(prog.materialKsUniform, models[i].material.ks);
        gl.uniform1f(prog.materialKeUniform, models[i].material.ke);
        // Texture.
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, models[i].texture);
        gl.uniform1i(prog.textureUniform, 0);
        draw(models[i]);
    }
}

function calculateCameraOrbit() {
    // Calculate x,z position/eye of camera orbiting the center.
    // Kreisbahn um das Objekt
    const x = 0,
        z = 2;
    camera.eye[x] = camera.center[x];
    camera.eye[z] = camera.center[z];
    // camera.distance ist der Radius des Kreises (der Kamera-Kreisbahn)
    camera.eye[x] += camera.distance * Math.sin(camera.zAngle);
    camera.eye[z] += camera.distance * Math.cos(camera.zAngle);
}

function setProjection() {
    // Set projection Matrix.
    switch (camera.projectionType) {
        case "ortho":
            const v = camera.lrtb;
            ortho(camera.pMatrix, -v, v, -v, v, -10, 10);
            break;
        case "perspective":
            perspective(camera.pMatrix, camera.fovy, camera.aspect, 1, 10);
            break;

        case "frustum":
            const f = camera.lrtb;
            frustum(camera.pMatrix, -f / 2, f / 2, -f / 2, f / 2, 1, 10);
            break;
    }
    // Set projection uniform.
    gl.uniformMatrix4fv(prog.pMatrixUniform, false, camera.pMatrix);
}

function draw(model) {
    // Setup position VBO.
    gl.bindBuffer(gl.ARRAY_BUFFER, model.vboPos);
    gl.vertexAttribPointer(prog.positionAttrib, 3, gl.FLOAT, false, 0, 0);

    // Setup normal VBO.
    gl.bindBuffer(gl.ARRAY_BUFFER, model.vboNormal);
    gl.vertexAttribPointer(prog.normalAttrib, 3, gl.FLOAT, false, 0, 0);

    // Setup texture VBO.
    gl.bindBuffer(gl.ARRAY_BUFFER, model.vboTextureCoord);
    gl.vertexAttribPointer(prog.textureCoordAttrib, 2, gl.FLOAT, false, 0, 0);

    // Setup rendering tris.
    const fill = model.fillstyle.search(/fill/) != -1;
    if (fill) {
        gl.enableVertexAttribArray(prog.normalAttrib);
        gl.enableVertexAttribArray(prog.textureCoordAttrib);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboTris);
        gl.drawElements(
            gl.TRIANGLES,
            model.iboTris.numberOfElements,
            gl.UNSIGNED_SHORT,
            0
        );
    }

    // Setup rendering lines.
    const wireframe = model.fillstyle.search(/wireframe/) != -1;
    if (wireframe) {
        gl.disableVertexAttribArray(prog.normalAttrib);
        gl.disableVertexAttribArray(prog.textureCoordAttrib);
        gl.vertexAttrib3f(prog.normalAttrib, 0, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboLines);
        gl.drawElements(
            gl.LINES,
            model.iboLines.numberOfElements,
            gl.UNSIGNED_SHORT,
            0
        );
    }
}

start();
