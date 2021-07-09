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

    this.vertexNormals = [];
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
}
