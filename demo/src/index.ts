// TODO: sparqljs prefixes bnode with "e_" `select * {_:x ?p ?o}`

import { AppMain } from "./AppMain"
import { BlocklySection } from "./BlocklySection"
import { SparqlTextarea } from "./SparqlTextarea"

customElements.define("app-main", AppMain, { extends: "main" })
customElements.define("blockly-section", BlocklySection, { extends: "section" })
customElements.define("sparql-textarea", SparqlTextarea, { extends: "textarea" })
