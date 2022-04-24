
const shaders = {
    vertexShader: `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;

    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;

      // Apply lighting effect

      highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
      highp vec3 directionalLightColor = vec3(1, 1, 1);
      highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

      highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
      vLighting = ambientLight + (directionalLightColor * directional);
    }
  `,

    fragmentShader: `
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    uniform sampler2D uSampler;
    uniform highp vec2 uCenter;
    uniform highp float uDistSq;
    uniform highp float uWidth;

    void main(void) {
      highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
      
      highp vec2 distV = vTextureCoord - uCenter;
      highp float v = distV[0] * distV[0] + distV[1] * distV[1];
      
      if (v < uDistSq) {
        if (sqrt(v) < sqrt(uDistSq) - uWidth) {
          highp vec2 dirV = vTextureCoord - uCenter;
          highp float norm = sqrt(dirV[0] * dirV[0] + dirV[1] * dirV[1]);
          highp float scaleC = uDistSq / norm / norm;
          highp vec2 scaledV = dirV * scaleC;
          highp vec2 inversedV = scaledV + uCenter;
          
          if (inversedV[0] > 1.0 || inversedV[0] < 0.0 || inversedV[1] > 1.0 || inversedV[1] < 0.0) {
            gl_FragColor = vec4(0,0,0,texelColor.a);
          } else {
            texelColor = texture2D(uSampler, inversedV);
            gl_FragColor = texelColor;
          }
        } else {
          gl_FragColor = vec4(0.0,0.0,0.0,texelColor.a);
        }
      } else {
        gl_FragColor = texelColor;
      }
        // gl_FragColor = vec4(gl_FragColor.rgb * vLighting, gl_FragColor.a);
    }
  `
}