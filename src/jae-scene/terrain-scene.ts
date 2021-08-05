import { mat4 } from 'gl-matrix';

import Scene from './scene.js';
import { TerrainMesh, TerrainConfig } from '../jae-primitives/terrain-mesh.js';

export default class TerrainScene extends Scene {
  terrainRotation: number = 0;

  terrain: TerrainMesh;

  constructor(
    gl: WebGLRenderingContext,
    shaderProgram: WebGLProgram,
    config: TerrainConfig
  ) {
    super(gl, shaderProgram);

    this.terrain = new TerrainMesh(250, 250, 4, config);
    this.terrain.transform = this.calculateModelMatrix();
    this.addModel(this.terrain);
    this.updateBuffer();
  }

  draw(now: number) {
    const deltaTime = now - this.lastCallTime;
    this.terrainRotation += deltaTime / 5000;
    this.terrain.transform = this.calculateModelMatrix();

    super.draw(now);
  }

  changeConfig(
    scale: number,
    maxHeight: number,
    octaves: number,
    persistance: number,
    lacunarity: number
  ) {
    this.terrain.terrainConfig = {
      scale,
      octaves,
      persistance,
      lacunarity,
      maxHeight,
    };
    this.terrain.generateMesh();
    this.updateBuffer();
  }

  changeSeed(
    scale: number,
    maxHeight: number,
    octaves: number,
    persistance: number,
    lacunarity: number
  ) {
    this.terrain.terrainConfig = {
      scale,
      octaves,
      persistance,
      lacunarity,
      maxHeight,
    };
    this.terrain.changeNoise();
    this.updateBuffer();
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
