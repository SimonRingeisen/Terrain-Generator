import { LitElement, html, css, property } from 'lit-element';
import './jae-canvas/jae-canvas.js';

export class JsAnimationEditor extends LitElement {
  @property({ type: String }) title = 'My app';

  static styles = css`
    :host {
      width: 100%;
      height: 100%;
    }

    main {
      min-width: 100vw;
      min-height: 100vh;
    }
  `;

  render() {
    return html`
      <main>
        <jae-canvas></jae-canvas>
      </main>
    `;
  }
}

customElements.define('js-animation-editor', JsAnimationEditor);
