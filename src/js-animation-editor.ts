import { LitElement, html, css } from 'lit-element';

import '@esri/calcite-components';

// eslint-disable-next-line import/no-duplicates
import './jae-canvas/jae-canvas.js';
// eslint-disable-next-line import/no-duplicates
import jaeCanvas from './jae-canvas/jae-canvas.js';

import TerrainScene from './jae-scene/terrain-scene.js';

export class JsAnimationEditor extends LitElement {
  terrainConfig = {
    scale: 1,
    maxHeight: 1,
    octaves: 8,
    persistance: 0.45,
    lacunarity: 1.7,
  };

  static get styles() {
    return css`
      jae-canvas {
        position: absolute;
        top: 0;
        left: 0;
      }

      .settings-overlay {
        display: flex;
      }

      calcite-panel {
        width: auto;
      }

      .settings-panes-container {
        flex-grow: 0;
      }
    `;
  }

  render() {
    return html`
      <main>
        <jae-canvas
          id="main-canvas"
          .scene-config="${this.terrainConfig}"
        ></jae-canvas>
        <div class="settings-overlay">
          <calcite-panel class="settings-panes-container">
            <calcite-block heading="Terrain Configuration" collapsible open>
              <div slot="icon">
                <calcite-icon icon="map"></calcite-icon>
              </div>

              <calcite-label
                class="sc-calcite-label-h sc-calcite-label-s"
                alignment="start"
                status="idle"
                scale="m"
                layout="default"
              >
                Scale
                <calcite-slider
                  id="scale-input"
                  min="0.2"
                  max="5"
                  .value="${this.terrainConfig.scale}"
                  step="0.1"
                  label="Scale"
                  ticks="0"
                  label-handles
                  page-step="0.2"
                  snap
                ></calcite-slider>
              </calcite-label>

              <calcite-label
                class="sc-calcite-label-h sc-calcite-label-s"
                alignment="start"
                status="idle"
                scale="m"
                layout="default"
              >
                Height
                <calcite-slider
                  id="height-input"
                  min="0"
                  max="2"
                  .value="${this.terrainConfig.maxHeight}"
                  step="0.1"
                  label="Height"
                  ticks="0"
                  label-handles
                  page-step="0.1"
                  snap
                ></calcite-slider>
              </calcite-label>

              <calcite-label
                class="sc-calcite-label-h sc-calcite-label-s"
                alignment="start"
                status="idle"
                scale="m"
                layout="default"
              >
                Number of Octaves
                <calcite-slider
                  id="octaves-input"
                  min="1"
                  max="10"
                  .value="${this.terrainConfig.octaves}"
                  step="1"
                  label="Number of Octaves"
                  ticks="1"
                  label-handles
                  page-step="1"
                  snap
                ></calcite-slider>
              </calcite-label>

              <calcite-label
                class="sc-calcite-label-h sc-calcite-label-s"
                alignment="start"
                status="idle"
                scale="m"
                layout="default"
              >
                Persistance
                <calcite-slider
                  id="persistance-input"
                  min="0"
                  max="1"
                  .value="${this.terrainConfig.persistance}"
                  step="0.05"
                  label="Persistance"
                  ticks="0"
                  label-handles
                  page-step="0.1"
                  snap
                ></calcite-slider>
              </calcite-label>

              <calcite-label
                class="sc-calcite-label-h sc-calcite-label-s"
                alignment="start"
                status="idle"
                scale="m"
                layout="default"
              >
                Lacunarity
                <calcite-slider
                  id="lacunarity-input"
                  min="1"
                  max="5"
                  .value="${this.terrainConfig.lacunarity}"
                  step="0.1"
                  label="Lacunarity"
                  ticks="0"
                  label-handles
                  page-step="0.1"
                  snap
                ></calcite-slider>
              </calcite-label>

              <div
                style="width: 300px; max-width: 100%; display: flex; flex-direction: row;"
              >
                <calcite-button
                  width="half"
                  appearance="outline"
                  color="blue"
                  @click="${() => this.randomizeSeed.bind(this)()}"
                >
                  Randomize seed
                </calcite-button>
                <calcite-button
                  width="half"
                  appearance="solid"
                  color="blue"
                  @click="${() => this.regenerate.bind(this)()}"
                >
                  Regnerate
                </calcite-button>
              </div>
            </calcite-block>
          </calcite-panel>
        </div>
      </main>
    `;
  }

  getScene() {
    const canvas = this.shadowRoot?.getElementById('main-canvas') as jaeCanvas;
    return canvas.scene as TerrainScene;
  }

  updateConfigFromSliders() {
    this.terrainConfig.scale = (this.shadowRoot?.getElementById(
      'scale-input'
      // eslint-disable-next-line no-undef
    ) as HTMLCalciteSliderElement).value!;

    this.terrainConfig.maxHeight = (this.shadowRoot?.getElementById(
      'height-input'
      // eslint-disable-next-line no-undef
    ) as HTMLCalciteSliderElement).value!;

    this.terrainConfig.octaves = (this.shadowRoot?.getElementById(
      'octaves-input'
      // eslint-disable-next-line no-undef
    ) as HTMLCalciteSliderElement).value!;

    this.terrainConfig.persistance = (this.shadowRoot?.getElementById(
      'persistance-input'
      // eslint-disable-next-line no-undef
    ) as HTMLCalciteSliderElement).value!;

    this.terrainConfig.lacunarity = (this.shadowRoot?.getElementById(
      'lacunarity-input'
      // eslint-disable-next-line no-undef
    ) as HTMLCalciteSliderElement).value!;
  }

  randomizeSeed() {
    this.updateConfigFromSliders();
    this.getScene().changeSeed(
      1 / this.terrainConfig.scale,
      this.terrainConfig.maxHeight / this.terrainConfig.scale,
      this.terrainConfig.octaves,
      this.terrainConfig.persistance,
      this.terrainConfig.lacunarity
    );
  }

  regenerate() {
    this.updateConfigFromSliders();
    this.getScene().changeConfig(
      1 / this.terrainConfig.scale,
      this.terrainConfig.maxHeight / this.terrainConfig.scale,
      this.terrainConfig.octaves,
      this.terrainConfig.persistance,
      this.terrainConfig.lacunarity
    );
  }
}

customElements.define('js-animation-editor', JsAnimationEditor);
