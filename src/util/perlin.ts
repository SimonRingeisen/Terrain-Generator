// This script is based on https://joeiddon.github.io/perlin/perlin.js
// and has been modified for easier usage in modern JS/TS setups

export default class Perlin {
  private gradients: { x: number; y: number }[][];

  constructor() {
    this.gradients = [];
  }

  private static getRandomVector() {
    const r = Math.random() * 2 * Math.PI;
    return { x: Math.cos(r), y: Math.sin(r) };
  }

  private dotProductGrid(x: number, y: number, vx: number, vy: number) {
    let GradientVector;
    const DeltaVector = { x: x - vx, y: y - vy };
    if (this.gradients[vx] && this.gradients[vx][vy]) {
      GradientVector = this.gradients[vx][vy];
    } else {
      GradientVector = Perlin.getRandomVector();
      this.gradients[vx] = this.gradients[vx] || [];
      this.gradients[vx][vy] = GradientVector;
    }
    return DeltaVector.x * GradientVector.x + DeltaVector.y * GradientVector.y;
  }

  private static interpolate(x: number, a: number, b: number) {
    const smootherstep = 6 * x ** 5 - 15 * x ** 4 + 10 * x ** 3;
    return a + smootherstep * (b - a);
  }

  public getNoise(x: number, y: number) {
    const xf = Math.floor(x);
    const yf = Math.floor(y);

    const topLeft = this.dotProductGrid(x, y, xf, yf);
    const topRight = this.dotProductGrid(x, y, xf + 1, yf);
    const bottomLeft = this.dotProductGrid(x, y, xf, yf + 1);
    const bottomRight = this.dotProductGrid(x, y, xf + 1, yf + 1);
    const xTop = Perlin.interpolate(x - xf, topLeft, topRight);
    const xBottom = Perlin.interpolate(x - xf, bottomLeft, bottomRight);
    return Perlin.interpolate(y - yf, xTop, xBottom);
  }

  public getLayeredNoise(
    x: number,
    y: number,
    scale: number,
    octaves: number,
    persistance: number,
    lacunarity: number
  ): number {
    let totalNoise = 0;
    let frequency = 1;
    let amplitude = 1;
    for (let i = 0; i < octaves; i += 1) {
      totalNoise +=
        this.getNoise((x / scale) * frequency, (y / scale) * frequency) *
        amplitude;
      amplitude *= persistance;
      frequency *= lacunarity;
    }

    return totalNoise;
  }
}
