export class Component extends HTMLElement {
  constructor({templateId} = {templateId: ''}) {
    super()
    let template = document.getElementById(templateId)
    let templateContent = template.content

    const shadowRoot = this.attachShadow({ mode: 'open' }).appendChild(
      templateContent.cloneNode(true)
    )
  }
}