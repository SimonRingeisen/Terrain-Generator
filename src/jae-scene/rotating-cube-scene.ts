import { mat4 } from 'gl-matrix';

import Scene from './scene.js';
import Cube from '../jae-primitives/cube.js';

export default class RotatingCubeScene extends Scene {
  cubeRotation: number = 0;

  cube: Cube = new Cube();

  constructor(gl: WebGLRenderingContext, shaderProgram: WebGLProgram) {
    super(gl, shaderProgram);

    this.cube.transform = this.calculateCubeModelMatrix();
    this.addModel(this.cube);
    this.updateBuffer(); // TODO find a better place for this
  }

  draw(now: number) {
    const deltaTime = now - this.lastCallTime;
    this.cubeRotation += deltaTime / 1000;
    this.cube.transform = this.calculateCubeModelMatrix();

    super.draw(now);
  }

  // eslint-disable-next-line class-methods-use-this
  calculateCubeModelMatrix() {
    const cubeMMatrix = mat4.create();

    mat4.translate(cubeMMatrix, cubeMMatrix, [-0.0, 0.0, -6.0]);
    mat4.rotate(cubeMMatrix, cubeMMatrix, this.cubeRotation, [0, 0, 1]);
    mat4.rotate(cubeMMatrix, cubeMMatrix, this.cubeRotation * 0.7, [0, 1, 0]);

    return cubeMMatrix;
  }
}
