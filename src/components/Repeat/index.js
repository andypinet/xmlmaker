export class RepeatComponent extends HTMLElement {
  constructor() {
    super()
    this._shadowRoot = this.attachShadow({ mode: 'open' })

    this._render()
  }

  get _dataItems() {
    let items = this.getAttribute('items')
    if (items) {
      try {
        return JSON.parse(items)
      } catch (e) {
        console.error(e)
      }
    } else {
      return []
    }
  }

  _render() {
    let shadowRoot = this._shadowRoot

    let template = this.children[0]
    if (HTMLTemplateElement && template instanceof HTMLTemplateElement) {
      let templateContent = template.content

      // clear
      while (shadowRoot.firstChild) {
        shadowRoot.removeChild(shadowRoot.firstChild);
      }

      this._dataItems.forEach(function(item) {
        shadowRoot.appendChild(templateContent.cloneNode(true))
      })
    }
  }
}

export default class Repeat extends RepeatComponent {}

Repeat.install = () => {
  customElements.define('c-repeat', Repeat)
}
