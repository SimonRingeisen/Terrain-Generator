import { mat4 } from 'gl-matrix';

import Scene from './scene.js';
import TerrainMesh from '../jae-primitives/terrain-mesh.js';

export default class TerrainScene extends Scene {
  terrainRotation: number = 0;

  terrain: TerrainMesh = new TerrainMesh(100, 100, 1, 3);

  constructor(gl: WebGLRenderingContext, shaderProgram: WebGLProgram) {
    super(gl, shaderProgram);

    this.terrain.transform = this.calculateModelMatrix();
    this.addModel(this.terrain);
    this.fillBuffer(); // TODO find a better place for this
  }

  draw(now: number) {
    const deltaTime = now - this.lastCallTime;
    this.terrainRotation += deltaTime / 5000;
    this.terrain.transform = this.calculateModelMatrix();

    super.draw(now);
  }

  calculateModelMatrix() {
    const ModelMatrix = mat4.create();

    mat4.translate(ModelMatrix, ModelMatrix, [-0.0, 0.0, -6.0]);
    mat4.rotate(ModelMatrix, ModelMatrix, (Math.PI * 2) / 3, [1, 0, 0]);
    mat4.rotate(ModelMatrix, ModelMatrix, this.terrainRotation * 0.7, [
      0,
      0,
      1,
    ]);

    return ModelMatrix;
  }
}
