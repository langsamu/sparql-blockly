import * as SparqlBlockly from "sparql-blockly"

export class SparqlEditor extends HTMLElement {
    private async connectedCallback() {
        this.editorElement.addEventListener("input", this.input.bind(this))
    }

    private get editorElement(): HTMLTextAreaElement {
        return this.querySelector("textarea") as HTMLTextAreaElement
    }

    private get errorElement(): HTMLSpanElement {
        return this.querySelector("span") as HTMLSpanElement
    }

    private set error(value: string) {
        this.errorElement.innerText = value
    }

    public get value(): string {
        return this.editorElement.value
    }

    public set value(value: string) {
        this.editorElement.value = value
        this.validate()
    }

    public setAndNotify(value: string): void {
        this.editorElement.value = value
        this.input()
    }

    private input(): void {
        const query = this.validate()

        if (query) {
            this.dispatchEvent(new CustomEvent<Element>("sparql", { detail: query }))
        }
    }

    private validate(): Element {
        this.error = ""
        this.classList.remove("invalid")
        this.classList.remove("valid")

        const sparql = this.value

        if (sparql) {
            try {
                const blocklyDom = SparqlBlockly.sparqlToBlockly(sparql)

                this.classList.add("valid")

                return blocklyDom
            }
            catch (e) {
                this.error = e.message

                this.classList.add("invalid")
            }
        }
    }
}
