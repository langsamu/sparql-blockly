import { BlocklyCanvas } from "./BlocklyCanvas"
import { SparqlEditor } from "./SparqlEditor"

export class AppMain extends HTMLElement {
    private monitorHash = true

    private connectedCallback() {
        document.addEventListener("DOMContentLoaded", this.onLoad.bind(this))
        window.addEventListener("hashchange", this.onHash.bind(this))
    }

    private get sparql(): SparqlEditor {
        return this.querySelector("sparql-editor")
    }

    private get blockly(): BlocklyCanvas {
        return this.querySelector("blockly-canvas")
    }

    private onHash() {
        if (this.monitorHash)
            this.setFromHash()
    }

    private onLoad() {
        this.sparql.addEventListener("sparql", this.onSparql.bind(this))
        this.sparql.addEventListener("input", this.onInput.bind(this))
        this.blockly.addEventListener("blocks", this.onBlocks.bind(this))
        this.blockly.addEventListener("load", this.onBlocklyLoad.bind(this))
    }

    private onSparql(e: CustomEvent<Element>) {
        this.blockly.dom = e.detail
    }

    private onInput() {
        this.updateUrl()
    }

    private onBlocks(e: CustomEvent<string>) {
        this.sparql.value = e.detail
        this.updateUrl()
    }

    private onBlocklyLoad() {
        this.setFromHash()
    }

    private setFromHash() {
        const sparqlFromLink = window.location.hash.split("#")[1]

        if (sparqlFromLink)
            this.sparql.setAndNotify(decodeURIComponent(sparqlFromLink))
    }

    private updateUrl() {
        // Disable monitoring hash change to avoid double update
        this.monitorHash = false

        window.location.hash = encodeURIComponent(this.sparql.value)

        // Delay enabling monitoring hash because that event is only dispatched after this listener returns
        window.setTimeout(() => this.monitorHash = true, 500)
    }
}
