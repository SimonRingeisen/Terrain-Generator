import { LitElement, html, css, property } from 'lit-element';
import './jae-canvas/jae-canvas.js';

import '@esri/calcite-components';
import jaeCanvas from './jae-canvas/jae-canvas.js';

import TerrainScene from './jae-scene/terrain-scene.js';

export class JsAnimationEditor extends LitElement {
  @property({ type: Boolean }) showTerrainSetting = false;

  @property({ type: Boolean }) showShaderSetting = false;

  @property({ type: Number }) scale = 1;

  @property({ type: Number }) height = 1;

  @property({ type: Number }) octaves = 4;

  @property({ type: Number }) persistance = 0.5;

  @property({ type: Number }) lacunarity = 2;

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
        <jae-canvas id="main-canvas"></jae-canvas>
        <div class="settings-overlay">
          <calcite-panel class="settings-panes-container">
            <calcite-block heading="Terrain Generator" collapsible>
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
                  value="${this.scale}"
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
                  max="5"
                  value="1"
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
                  value="4"
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
                  value="0.5"
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
                  value="2"
                  step="0.1"
                  label="Lacunarity"
                  ticks="0"
                  label-handles
                  page-step="0.1"
                  snap
                ></calcite-slider>
              </calcite-label>

              <div
                style="width: 300px; max-width: 100%; display: flex; flex-direction: row; background-color: #fff"
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

            <calcite-block heading="Shader" collapsible>
              <div slot="icon">
                <calcite-icon icon="paintBucket"></calcite-icon>
              </div>
              <calcite-block-section
                text="Animals"
                open=""
                toggle-display="button"
                intl-collapse="Collapse"
                intl-expand="Expand"
              >
                <img
                  alt="demo"
                  src="data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22320%22%20height%3D%22240%22%20viewBox%3D%220%200%20320%20240%22%3E%20%3Crect%20fill%3D%22%23ddd%22%20width%3D%22320%22%20height%3D%22240%22%2F%3E%20%3Ctext%20fill%3D%22rgba%280%2C0%2C0%2C0.5%29%22%20font-family%3D%22sans-serif%22%20font-size%3D%2248%22%20dy%3D%2216.799999999999997%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%3E320%C3%97240%3C%2Ftext%3E%20%3C%2Fsvg%3E"
                />
              </calcite-block-section>

              <calcite-block-section text="Nature" open="">
                <img
                  alt="demo"
                  src="data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22320%22%20height%3D%22240%22%20viewBox%3D%220%200%20320%20240%22%3E%20%3Crect%20fill%3D%22%23ddd%22%20width%3D%22320%22%20height%3D%22240%22%2F%3E%20%3Ctext%20fill%3D%22rgba%280%2C0%2C0%2C0.5%29%22%20font-family%3D%22sans-serif%22%20font-size%3D%2248%22%20dy%3D%2216.799999999999997%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%3E320%C3%97240%3C%2Ftext%3E%20%3C%2Fsvg%3E"
                />
              </calcite-block-section>
            </calcite-block>
          </calcite-panel>
        </div>
      </main>
    `;
  }

  toggleTerrain() {
    this.showTerrainSetting = !this.showTerrainSetting;
    if (this.showTerrainSetting) {
      this.shadowRoot
        ?.getElementById('action-terrain-settings')
        ?.setAttribute('active', 'active');
    } else {
      this.shadowRoot
        ?.getElementById('action-terrain-settings')
        ?.removeAttribute('active');
    }
  }

  toggleShader() {
    this.showShaderSetting = !this.showShaderSetting;
    if (this.showShaderSetting) {
      this.shadowRoot
        ?.getElementById('action-shader-settings')
        ?.setAttribute('active', 'active');
    } else {
      this.shadowRoot
        ?.getElementById('action-shader-settings')
        ?.removeAttribute('active');
    }
  }

  getScene() {
    const canvas = this.shadowRoot?.getElementById('main-canvas') as jaeCanvas;
    return canvas.scene as TerrainScene;
  }

  updateConfigFromSliders() {
    this.scale = (this.shadowRoot?.getElementById(
      'scale-input'
      // eslint-disable-next-line no-undef
    ) as HTMLCalciteSliderElement).value!;

    this.height = (this.shadowRoot?.getElementById(
      'height-input'
      // eslint-disable-next-line no-undef
    ) as HTMLCalciteSliderElement).value!;

    this.octaves = (this.shadowRoot?.getElementById(
      'octaves-input'
      // eslint-disable-next-line no-undef
    ) as HTMLCalciteSliderElement).value!;

    this.persistance = (this.shadowRoot?.getElementById(
      'persistance-input'
      // eslint-disable-next-line no-undef
    ) as HTMLCalciteSliderElement).value!;

    this.lacunarity = (this.shadowRoot?.getElementById(
      'lacunarity-input'
      // eslint-disable-next-line no-undef
    ) as HTMLCalciteSliderElement).value!;
  }

  randomizeSeed() {
    this.updateConfigFromSliders();
    this.getScene().changeSeed(
      this.scale,
      this.height * this.scale,
      this.octaves,
      this.persistance,
      this.lacunarity
    );
  }

  regenerate() {
    this.updateConfigFromSliders();
    this.getScene().changeConfig(
      this.scale,
      this.height * this.scale,
      this.octaves,
      this.persistance,
      this.lacunarity
    );
  }
}

customElements.define('js-animation-editor', JsAnimationEditor);
