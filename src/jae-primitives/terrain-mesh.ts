import { vec3 } from 'gl-matrix';

import Mesh from './mesh.js';
import Perlin from '../util/perlin.js';

export default class TerrainMesh extends Mesh {
  private seed: number;

  constructor(width: number, depth: number, maxHeight: number, size: number) {
    super();

    this.seed = Math.random();

    const perlinNoise = new Perlin();

    const scale = 1;
    const octaves = 4;
    const persistance = 0.5;
    const lacunarity = 2;

    this.vertices = TerrainMesh.getVertices(
      width,
      depth,
      maxHeight,
      size,
      (x, y) =>
        perlinNoise.getLayeredNoise(
          x,
          y,
          scale,
          octaves,
          persistance,
          lacunarity
        )
    );

    for (let j = 0; j < width * depth; j += 1) {
      const c = this.vertices[3 * j + 2] / (maxHeight * 2 * Math.PI) + 0.5;
      this.colors = this.colors.concat(c, c, c, 1.0);
    }

    for (let j = 0; j < depth - 1; j += 1) {
      for (let i = 0; i < width - 1; i += 1) {
        this.indices = this.indices.concat(
          j * width + i,
          j * width + i + 1,
          (j + 1) * width + i + 1,
          j * width + i,
          (j + 1) * width + i + 1,
          (j + 1) * width + i
        );
      }
    }

    this.vertexNormals = this.getNormals(width, depth);
  }

  static getVertices(
    width: number,
    depth: number,
    maxHeight: number,
    size: number,
    zValue: (x: number, y: number) => number
  ) {
    const vertices: number[] = new Array(width * depth * 3);

    for (let i = 0; i < width; i += 1) {
      for (let j = 0; j < depth; j += 1) {
        const x = (i / width - 0.5) * size;
        const y = (j / depth - 0.5) * size;
        const z = zValue(x, y) * maxHeight;
        vertices[3 * (width * j + i)] = x;
        vertices[3 * (width * j + i) + 1] = y;
        vertices[3 * (width * j + i) + 2] = z;
      }
    }
    return vertices;
  }

  getNormals(width: number, depth: number) {
    const normals: number[] = new Array(this.vertices.length);

    for (let i = 0; i < width; i += 1) {
      for (let j = 0; j < depth; j += 1) {
        const deltaX: vec3 = vec3.create();
        const deltaY: vec3 = vec3.create();

        const startX = Math.max(1, i - 1);
        const endX = Math.min(i + 1, width - 2);

        const startY = Math.max(1, j - 1);
        const endY = Math.min(j + 1, depth - 2);

        vec3.sub(
          deltaX,
          [
            this.vertices[(j * width + endX) * 3],
            this.vertices[(j * width + endX) * 3 + 1],
            this.vertices[(j * width + endX) * 3 + 2],
          ],
          [
            this.vertices[(j * width + startX) * 3],
            this.vertices[(j * width + startX) * 3 + 1],
            this.vertices[(j * width + startX) * 3 + 2],
          ]
        );

        vec3.sub(
          deltaY,
          [
            this.vertices[(endY * width + i) * 3],
            this.vertices[(endY * width + i) * 3 + 1],
            this.vertices[(endY * width + i) * 3 + 2],
          ],
          [
            this.vertices[(startY * width + i) * 3],
            this.vertices[(startY * width + i) * 3 + 1],
            this.vertices[(startY * width + i) * 3 + 2],
          ]
        );

        const n: vec3 = vec3.create();
        vec3.normalize(deltaX, deltaX);
        vec3.normalize(deltaY, deltaY);
        vec3.cross(n, deltaX, deltaY);

        [
          normals[(j * width + i) * 3],
          normals[(j * width + i) * 3 + 1],
          normals[(j * width + i) * 3 + 2],
        ] = n;
      }
    }

    return normals;
  }
}
