import { LitElement, html, css } from 'lit-element';

import { initShaderProgram } from '../jae-shader/shaders.js';
import Scene from '../jae-scene/scene.js';
import RotatingCubeScene from '../jae-scene/rotating-cube-scene.js';

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

  gl: WebGLRenderingContext | undefined;

  scene: Scene | undefined;

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
      // eslint-disable-next-line no-alert
      alert(`Unable to initialize the shader`);
      return;
    }

    this.scene = new RotatingCubeScene(this.gl, shaderProgram);

    const context = this;
    function renderCanvas(now: number) {
      context.scene!.draw(now);
      requestAnimationFrame(renderCanvas);
    }

    requestAnimationFrame(renderCanvas);
  }
}

customElements.define('jae-canvas', jaeCanvas);
