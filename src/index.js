import "@webcomponents/webcomponentsjs/webcomponents-bundle"
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js'
import '@polymer/polymer/lib/elements/dom-if.js'

class StartPolymer3 extends PolymerElement {
  static get properties() {
    return {
      name: String
    };
  }
  constructor() {
    super()
  }
  computeName(name) {
    return name == 'hel'
  }
  static get template() {
    return html`
    <template is="dom-if" if="{{computeName(name)}}">
      我爱你
    </template>
    [[name]]
    `
  }
}

customElements.define('start-polymer3', StartPolymer3)

// editor
class Editor {
  constructor(el) {
    this.el = el
  }
  html(d) {
    this.el.innerHTML = d
  }
  append(d) {
    this.el.insertAdjacentHTML('beforeend', d)
  }
}

let editor = new Editor(document.getElementById('editor'))

Vue.component('c-control', {
  template: '#c-control-tpl',
  methods: {
    addAText() {
      editor.append('<c-text>sdsdsdsds</c-text>')
    }
  }
})

var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})
