"use strict";

function generateComponent(options) {
  const {
    svg,
    style,
    className,
    customElementName
  } = options;
  return `class ${className} extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    this.shadowRoot.innerHTML = \`
    <style>
      svg {
        display: inline-block;
        vertical-align: middle;
        ${style || ''}
      }
    </style>
    ${svg}
    \`;
  }
}

customElements.define("${customElementName}", ${className});
`;
}

module.exports = generateComponent;