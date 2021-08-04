import { vec3 } from 'gl-matrix';

import Mesh from './mesh.js';
import Perlin from '../util/perlin.js';

interface TerrainConfig {
  scale: number;
  octaves: number;
  persistance: number;
  lacunarity: number;
  maxHeight: number;
}

export default class TerrainMesh extends Mesh {
  private perlinNoise: Perlin;

  private width: number;

  private depth: number;

  private size: number;

  terrainConfig: TerrainConfig;

  constructor(
    width: number,
    depth: number,
    size: number,
    terrainConfig: TerrainConfig
  ) {
    super();

    this.width = width;
    this.depth = depth;
    this.size = size;
    this.terrainConfig = terrainConfig;

    this.perlinNoise = new Perlin();

    this.generateMesh();
  }

  public changeNoise() {
    this.perlinNoise = new Perlin();
    this.generateMesh();
  }

  public generateMesh() {
    this.indices = this.getIndices();
    this.vertices = this.getVertices();
    this.colors = this.getColors();
    this.vertexNormals = this.getNormals();
  }

  getVertices() {
    const vertices: number[] = new Array(this.width * this.depth * 3);

    const zValue: (x: number, y: number) => number = (x, y) =>
      this.perlinNoise.getLayeredNoise(
        x,
        y,
        this.terrainConfig.scale,
        this.terrainConfig.octaves,
        this.terrainConfig.persistance,
        this.terrainConfig.lacunarity
      );

    for (let i = 0; i < this.width; i += 1) {
      for (let j = 0; j < this.depth; j += 1) {
        const x = (i / this.width - 0.5) * this.size;
        const y = (j / this.depth - 0.5) * this.size;
        const z = zValue(x, y) * this.terrainConfig.maxHeight;
        vertices[3 * (this.width * j + i)] = x;
        vertices[3 * (this.width * j + i) + 1] = y;
        vertices[3 * (this.width * j + i) + 2] = z;
      }
    }
    return vertices;
  }

  getIndices() {
    const indices: number[] = new Array(this.width * this.depth * 6);
    let idx: number = 0;
    for (let j = 0; j < this.depth - 1; j += 1) {
      for (let i = 0; i < this.width - 1; i += 1) {
        indices[idx++] = j * this.width + i;
        indices[idx++] = j * this.width + i + 1;
        indices[idx++] = (j + 1) * this.width + i + 1;
        indices[idx++] = j * this.width + i;
        indices[idx++] = (j + 1) * this.width + i + 1;
        indices[idx++] = (j + 1) * this.width + i;
      }
    }
    return indices;
  }

  getColors() {
    const colors: number[] = new Array(this.width * this.depth * 4);
    for (let j = 0; j < this.width * this.depth; j += 1) {
      const c =
        this.vertices[3 * j + 2] /
          (this.terrainConfig.maxHeight * 2 * Math.PI) +
        0.5;
      colors[j * 4] = c;
      colors[j * 4 + 1] = c;
      colors[j * 4 + 2] = c;
      colors[j * 4 + 3] = 1.0;
    }
    return colors;
  }

  getNormals() {
    const normals: number[] = new Array(this.vertices.length);

    for (let i = 0; i < this.width; i += 1) {
      for (let j = 0; j < this.depth; j += 1) {
        const deltaX: vec3 = vec3.create();
        const deltaY: vec3 = vec3.create();

        const startX = Math.max(1, i - 1);
        const endX = Math.min(i + 1, this.width - 2);

        const startY = Math.max(1, j - 1);
        const endY = Math.min(j + 1, this.depth - 2);

        vec3.sub(
          deltaX,
          [
            this.vertices[(j * this.width + endX) * 3],
            this.vertices[(j * this.width + endX) * 3 + 1],
            this.vertices[(j * this.width + endX) * 3 + 2],
          ],
          [
            this.vertices[(j * this.width + startX) * 3],
            this.vertices[(j * this.width + startX) * 3 + 1],
            this.vertices[(j * this.width + startX) * 3 + 2],
          ]
        );

        vec3.sub(
          deltaY,
          [
            this.vertices[(endY * this.width + i) * 3],
            this.vertices[(endY * this.width + i) * 3 + 1],
            this.vertices[(endY * this.width + i) * 3 + 2],
          ],
          [
            this.vertices[(startY * this.width + i) * 3],
            this.vertices[(startY * this.width + i) * 3 + 1],
            this.vertices[(startY * this.width + i) * 3 + 2],
          ]
        );

        const n: vec3 = vec3.create();
        vec3.normalize(deltaX, deltaX);
        vec3.normalize(deltaY, deltaY);
        vec3.cross(n, deltaX, deltaY);

        [
          normals[(j * this.width + i) * 3],
          normals[(j * this.width + i) * 3 + 1],
          normals[(j * this.width + i) * 3 + 2],
        ] = n;
      }
    }

    return normals;
  }
}
