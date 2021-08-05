import { mat4 } from 'gl-matrix';

export default class Mesh {
  private _transform: mat4 = mat4.create();

  set transform(value) {
    this._transform = value;
  }

  get transform() {
    return this._transform;
  }

  vertices: number[] = [];

  colors: number[] = [];

  indices: number[] = [];

  vertexNormals: number[] = [];
}
