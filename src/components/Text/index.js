import { Component } from '@/components/component'
import "./index.scss"

export default class Text extends Component {
  constructor() {
    super({
      templateId: 'c-text'
    })
  }
}

Text.install = () => {
  customElements.define('c-text', Text)
}