//Fragment Shader dienen unter anderem der Einfärbung
export default `

    precision mediump float;

    uniform sampler2D uTexture;
            
    varying vec4 vColor;

    varying vec2 vTextureCoord;
            
    void main() {
        // gl_FragColor = vColor;

        gl_FragColor = texture2D(uTexture, vTextureCoord);
    }

`;
