import { LitElement, html, property } from 'lit-element';
import './jae-canvas/jae-canvas.js';

export class JsAnimationEditor extends LitElement {
  @property({ type: String }) title = 'My app';

  render() {
    return html`
      <main>
        <jae-canvas></jae-canvas>
      </main>
    `;
  }
}

customElements.define('js-animation-editor', JsAnimationEditor);
