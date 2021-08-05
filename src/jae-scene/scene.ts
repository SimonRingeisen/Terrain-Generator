import { mat4 } from 'gl-matrix';
import Mesh from '../jae-primitives/mesh.js';

export default class Scene {
  models: Mesh[] = [];

  lastCallTime: number;

  gl: WebGLRenderingContext;

  programInfo: any = undefined;

  vertexBuffer: WebGLBuffer | null = null;

  colorBuffer: WebGLBuffer | null = null;

  indexBuffer: WebGLBuffer | null = null;

  normalBuffer: WebGLBuffer | null = null;

  private _fieldOfView: number = 45;

  projectionMatrix: mat4 = mat4.create();

  set fieldOfView(value: number) {
    this._fieldOfView = value;
    this.updateProjectionMatrix();
  }

  get fieldOfView() {
    return this._fieldOfView;
  }

  constructor(gl: WebGLRenderingContext, shaderProgram: WebGLProgram) {
    this.lastCallTime = 0;
    this.gl = gl;
    this.updateProjectionMatrix();
    this.initBuffers();

    this.programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
        vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(
          shaderProgram,
          'uProjectionMatrix'
        ),
        modelViewMatrix: gl.getUniformLocation(
          shaderProgram,
          'uModelViewMatrix'
        ),
      },
    };
  }

  addModel(model: Mesh): void {
    this.models.push(model);
  }

  draw(now: number): void {
    this.clearCanvas();

    {
      // Vertex Buffer
      const numComponents = 3;
      const type = this.gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
      this.gl.vertexAttribPointer(
        this.programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset
      );
      this.gl.enableVertexAttribArray(
        this.programInfo.attribLocations.vertexPosition
      );
    }

    {
      // Normal Buffer
      const numComponents = 3;
      const type = this.gl.FLOAT;
      const normalize = true;
      const stride = 0;
      const offset = 0;
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
      this.gl.vertexAttribPointer(
        this.programInfo.attribLocations.vertexNormal,
        numComponents,
        type,
        normalize,
        stride,
        offset
      );
      this.gl.enableVertexAttribArray(
        this.programInfo.attribLocations.vertexNormal
      );
    }

    {
      // Color Buffer
      const numComponents = 4;
      const type = this.gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
      this.gl.vertexAttribPointer(
        this.programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset
      );
      this.gl.enableVertexAttribArray(
        this.programInfo.attribLocations.vertexColor
      );
    }

    // Index Buffer
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.gl.useProgram(this.programInfo.program);

    this.gl.uniformMatrix4fv(
      this.programInfo.uniformLocations.projectionMatrix,
      false,
      this.projectionMatrix
    );

    this.gl.uniformMatrix4fv(
      this.programInfo.uniformLocations.modelViewMatrix,
      false,
      this.models[0].transform // TODO this should not only be the first model transform!
    );

    {
      const vertexCount = this.models[0].indices.length;
      const type = this.gl.UNSIGNED_SHORT;
      const offset = 0;
      this.gl.drawElements(this.gl.TRIANGLES, vertexCount, type, offset);
    }

    this.lastCallTime = now;
  }

  initBuffers() {
    this.vertexBuffer = this.gl.createBuffer();
    this.normalBuffer = this.gl.createBuffer();
    this.colorBuffer = this.gl.createBuffer();
    this.indexBuffer = this.gl.createBuffer();
  }

  updateBuffer() {
    let vertices: number[] = [];
    this.models.forEach(model => {
      vertices = vertices.concat(model.vertices);
    });

    let colors: number[] = [];
    this.models.forEach(model => {
      colors = colors.concat(model.colors);
    });

    let vertexNormals: number[] = [];
    this.models.forEach(model => {
      vertexNormals = vertexNormals.concat(model.vertexNormals);
    });

    let counter = 0;
    let indices: number[] = [];
    this.models.forEach(model => {
      indices = indices.concat(model.indices.map(i => i + counter));
      counter += model.indices.length;
    });

    // Vertex Buffer

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(vertices),
      this.gl.STATIC_DRAW
    );

    // Normal Buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(vertexNormals),
      this.gl.STATIC_DRAW
    );

    // Color Buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(colors),
      this.gl.STATIC_DRAW
    );

    // Index Buffer
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      this.gl.STATIC_DRAW
    );
  }

  updateProjectionMatrix() {
    const fov = (this.fieldOfView * Math.PI) / 180;
    const aspect =
      (<HTMLCanvasElement>this.gl!.canvas).clientWidth /
      (<HTMLCanvasElement>this.gl!.canvas).clientHeight;
    const zNear = 0.1;
    const zFar = 1000.0;
    this.projectionMatrix = mat4.create();

    mat4.perspective(this.projectionMatrix, fov, aspect, zNear, zFar);
  }

  private clearCanvas() {
    this.gl!.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl!.clearDepth(1.0);
    this.gl!.enable(this.gl!.DEPTH_TEST);
    this.gl!.depthFunc(this.gl!.LEQUAL);

    // eslint-disable-next-line no-bitwise
    this.gl!.clear(this.gl!.COLOR_BUFFER_BIT | this.gl!.DEPTH_BUFFER_BIT);
  }
}
