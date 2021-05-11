import { LitElement, html, css } from 'lit-element';
import { mat4 } from 'gl-matrix';

import { initShaderProgram } from '../utils/shaders.js';

export class jaeCanvas extends LitElement {
  static styles = css`
    :host {
      min-width: 100vw;
      min-height: 100vh;
      width: 100vw;
      height: 100vh;
    }

    canvas {
      width: 100%;
      height: 100%;
    }
  `;

  canvas: HTMLCanvasElement | undefined = undefined;

  programInfo: any = undefined;

  gl: WebGLRenderingContext | undefined;

  render() {
    return html` <canvas id="glCanvas" width="640" height="480"></canvas> `;
  }

  firstUpdated() {
    this.canvas = this.shadowRoot?.querySelector(
      '#glCanvas'
    ) as HTMLCanvasElement;

    this.gl = this.canvas.getContext('webgl')!;

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    const shaderProgram = initShaderProgram(this.gl);
    if (!shaderProgram) {
      alert(`Unable to initialize the shader`);
      return;
    }

    this.programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: this.gl.getAttribLocation(
          shaderProgram,
          'aVertexPosition'
        ),
      },
      uniformLocations: {
        projectionMatrix: this.gl.getUniformLocation(
          shaderProgram,
          'uProjectionMatrix'
        ),
        modelViewMatrix: this.gl.getUniformLocation(
          shaderProgram,
          'uModelViewMatrix'
        ),
      },
    };

    // Draw the scene
    this.drawScene(this.gl, jaeCanvas.initBuffers(this.gl));
  }

  static initBuffers(gl: WebGLRenderingContext) {
    // Create a buffer for the square's positions.

    const positionBuffer = gl.createBuffer();

    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Now create an array of positions for the square.

    const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return {
      position: positionBuffer,
    };
  }

  //
  // Draw the scene.
  //
  drawScene(
    gl: WebGLRenderingContext,
    buffers: { position: WebGLBuffer | null }
  ) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things

    // Clear the canvas before we start drawing on it.

    // eslint-disable-next-line no-bitwise
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.

    const fieldOfView = (45 * Math.PI) / 180; // in radians
    const aspect =
      (<HTMLCanvasElement>gl.canvas).clientWidth /
      (<HTMLCanvasElement>gl.canvas).clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = mat4.create();

    // Now move the drawing position a bit to where we want to
    // start drawing the square.

    mat4.translate(
      modelViewMatrix, // destination matrix
      modelViewMatrix, // matrix to translate
      [-0.0, 0.0, -6.0]
    ); // amount to translate

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    {
      const numComponents = 2;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
      gl.vertexAttribPointer(
        this.programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset
      );
      gl.enableVertexAttribArray(
        this.programInfo.attribLocations.vertexPosition
      );
    }

    // Tell WebGL to use our program when drawing

    gl.useProgram(this.programInfo.program);

    // Set the shader uniforms

    gl.uniformMatrix4fv(
      this.programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix
    );
    gl.uniformMatrix4fv(
      this.programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix
    );

    {
      const offset = 0;
      const vertexCount = 4;
      gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
  }
}

customElements.define('jae-canvas', jaeCanvas);
