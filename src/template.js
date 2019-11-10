function generateComponent(options) {
  const {
    svg,
    style,
    componentName,
    customElementName,
  } = options;

  return `class ${componentName} extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    this.shadowRoot.innerHTML = \`
    <style>
      :host
        display: inline-block;
        vertical-align: middle;
      }
      ${style || ''}
    </style>
    ${svg}
    \`;
  }
}

customElements.define("${customElementName}", ${componentName});
`;
}

module.exports = generateComponent;
