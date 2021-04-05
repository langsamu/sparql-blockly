import * as SparqlJS from "sparqljs"
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

    public get value() {
        return this.editorElement.value
    }

    public set value(value: string) {
        this.editorElement.value = value
        this.validate()
    }

    public setAndNotify(value: string) {
        this.editorElement.value = value
        this.input()
    }

    private input(): void {
        const query = this.validate()

        if (query) {
            this.dispatchEvent(new CustomEvent<Element>("sparql", { detail: SparqlBlockly.sparqlToBlockly(query) }))
        }
    }

    private validate(): SparqlJS.SparqlQuery {
        this.error = ""
        this.classList.remove("invalid")
        this.classList.remove("valid")

        const sparql = this.value

        if (sparql) {
            const parser = new SparqlJS.Parser({ sparqlStar: true })

            try {
                const query = parser.parse(sparql)

                this.classList.add("valid")

                return query
            }
            catch (e) {
                this.error = e.message

                this.classList.add("invalid")
            }
        }
    }
}
