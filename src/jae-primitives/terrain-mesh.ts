import Mesh from './mesh.js';

export default class TerrainMesh extends Mesh {
  constructor(width: number, depth: number, maxHeight: number, size: number) {
    super();

    this.vertices = TerrainMesh.getVertices(
      width,
      depth,
      maxHeight,
      size,
      (x, y) => Math.sin(x * 4 * Math.PI) + Math.cos(y * 4 * Math.PI)
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

    console.log('vertices', this.vertices);
    console.log('indices', this.indices);
    console.log('colors', this.colors);

    this.vertexNormals = [];
  }

  static getVertices(
    width: number,
    depth: number,
    maxHeight: number,
    size: number,
    zValue: (x: number, y: number) => number
  ) {
    let vertices: number[] = [];
    for (let i = 0; i < width; i += 1) {
      for (let j = 0; j < depth; j += 1) {
        const x = (i / width - 0.5) * size;
        const y = (j / depth - 0.5) * size;
        const z = zValue(x, y) * maxHeight;
        vertices = vertices.concat(x, y, z);
      }
    }
    return vertices;
  }
}
