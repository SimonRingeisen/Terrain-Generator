import { LitElement, html, css, property } from 'lit-element';

import { initShaderProgram } from '../jae-shader/shaders.js';
import Scene from '../jae-scene/scene.js';
import TerrainScene from '../jae-scene/terrain-scene.js';

export default class jaeCanvas extends LitElement {
  static styles = css`
    canvas {
      display: block;
      width: 100vw;
      height: 100vh;
    }
  `;

  @property({ type: Object }) sceneConfig = {
    scale: 1,
    maxHeight: 1,
    octaves: 8,
    persistance: 0.45,
    lacunarity: 1.7,
  };

  canvas: HTMLCanvasElement | undefined = undefined;

  gl: WebGLRenderingContext | undefined;

  scene: Scene | undefined;

  render() {
    return html` <canvas id="glCanvas"></canvas> `;
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
      // eslint-disable-next-line no-alert
      alert(`Unable to initialize the shader`);
      return;
    }

    this.scene = new TerrainScene(this.gl, shaderProgram, this.sceneConfig);

    const context = this;

    // Resizes the canvas to match its size on the screen. Returns true, if the size has changed.
    function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      const needResize =
        canvas.width !== displayWidth || canvas.height !== displayHeight;

      if (needResize) {
        // eslint-disable-next-line no-param-reassign
        canvas.width = displayWidth;
        // eslint-disable-next-line no-param-reassign
        canvas.height = displayHeight;
      }

      return needResize;
    }

    function renderCanvas(now: number) {
      if (context.gl && context.gl!.canvas instanceof HTMLCanvasElement) {
        if (resizeCanvasToDisplaySize(context.gl!.canvas)) {
          context.gl.viewport(
            0,
            0,
            context.gl.canvas.width,
            context.gl.canvas.height
          );
          context.scene!.updateProjectionMatrix();
        }
      }
      context.scene!.draw(now);
      requestAnimationFrame(renderCanvas);
    }

    requestAnimationFrame(renderCanvas);
  }
}

customElements.define('jae-canvas', jaeCanvas);
