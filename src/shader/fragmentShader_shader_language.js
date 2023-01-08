//Fragment Shader dienen unter anderem der Einfärbung
export default `

//    precision mediump float;
//
//    uniform sampler2D uTexture;
//            
//    varying vec4 vColor;
//
//    varying vec2 vTextureCoord;
//            
//    void main() {
//        // gl_FragColor = vColor;
//
//        gl_FragColor = texture2D(uTexture, vTextureCoord);
//    }
    precision mediump float;
			
	uniform sampler2D uTexture;
			
	varying vec2 vTextureCoord;
						
	varying vec3 vNormal;
	varying vec4 vPosition;
			
			
			// Material.
			struct PhongMaterial {
				vec3 ka;
				vec3 kd;
				vec3 ks;
				float ke; 
			};
			uniform PhongMaterial material;
			
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
			
			void main() {
				// Calculate view vector.
				// For ortho projection:
				vec3 v = vec3(0,0,-1);
				
				vec3 vNormal = normalize(vNormal);
								
				float strips = mod(floor(vTextureCoord.s * 144.), 4.);
				vec4 tColor = vec4(strips,0.9,0,1);
				vec4 lighting = vec4( phong(vPosition.xyz, vNormal, v), 1.0);
				gl_FragColor = tColor * lighting;
			}			

`;
