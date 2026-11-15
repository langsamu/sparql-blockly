import { AppMain } from "./AppMain.ts"
import { BlocklyCanvas } from "./BlocklyCanvas.ts"
import { SparqlEditor } from "./SparqlEditor.ts"

customElements.define("app-main", AppMain)
customElements.define("blockly-canvas", BlocklyCanvas)
customElements.define("sparql-editor", SparqlEditor)
