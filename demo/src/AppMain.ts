import { BlocklyCanvas } from "./BlocklyCanvas"
import { SparqlEditor } from "./SparqlEditor"

export class AppMain extends HTMLElement {
    private get sparql(): SparqlEditor {
        return this.querySelector("sparql-editor")
    }

    private get blockly(): BlocklyCanvas {
        return this.querySelector("blockly-canvas")
    }

    private async connectedCallback() {
        document.addEventListener("DOMContentLoaded", () => {

            this.sparql.addEventListener("sparql", this.sparqlChanged.bind(this))
            this.sparql.addEventListener("input", this.sparqlInput.bind(this))
            this.blockly.addEventListener("blocks", this.blocksChanged.bind(this))
            this.blockly.addEventListener("load", this.blocksLoaded.bind(this))
        })
    }

    private sparqlChanged(e: CustomEvent<Element>) {
        this.blockly.dom = e.detail
    }

    private sparqlInput() {
        this.updateUrl()
    }

    private blocksChanged(e: CustomEvent<string>) {
        this.sparql.value = e.detail
        this.updateUrl()
    }

    private updateUrl() {
        window.location.hash = this.sparql.value
    }

    private blocksLoaded() {
        const h = window.location.hash.split("#")[1]
        if (h)
            this.sparql.setAndNotify(decodeURI(h))
    }
}
