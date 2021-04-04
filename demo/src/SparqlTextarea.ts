import * as SparqlJS from "sparqljs"
import * as SparqlBlockly from "sparql-blockly"

export class SparqlTextarea extends HTMLTextAreaElement {
    private async connectedCallback() {
        this.addEventListener("input", this.input)
    }

    private get errorElement(): HTMLTextAreaElement {
        return document.getElementById(this.getAttribute("error-element")) as HTMLTextAreaElement
    }

    private set error(value: string) {
        this.errorElement.value = value
    }

    public get value() {
        return super.value
    }

    public set value(value: string) {
        super.value = value
        this.validate()
        //this.input()
    }

    public setAndNotify(value: string) {
        super.value = value
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
