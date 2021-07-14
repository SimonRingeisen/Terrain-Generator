const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexNormal;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      aVertexColor;
      vColor = vec4(aVertexNormal.z, aVertexNormal.z, aVertexNormal.z, 1.0);
    }
  `;

const fsSource = `
    varying lowp vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;//mix(vec4(1, 0, 0, 1),vec4(0, 1, 0, 1), (vHeight+1.0)/2.0) ;
    }
  `;

function loadShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) {
    // eslint-disable-next-line no-alert
    alert(`Unable to create shader`);
    return null;
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    // eslint-disable-next-line no-alert
    alert(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

export function initShaderProgram(gl: WebGLRenderingContext) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  if (!vertexShader || !fragmentShader) {
    // eslint-disable-next-line no-alert
    alert(`Unable to load shader`);
    return null;
  }

  const shaderProgram = gl.createProgram();
  if (!shaderProgram) {
    // eslint-disable-next-line no-alert
    alert(`Unable to create program`);
    return null;
  }
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    // eslint-disable-next-line no-alert
    alert(
      `Unable to initialize the shader program: ${gl.getProgramInfoLog(
        shaderProgram
      )}`
    );
    return null;
  }

  return shaderProgram;
}
