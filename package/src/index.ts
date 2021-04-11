import "./initialiseBlockly"
import BlockGenerator from "./BlockGenerator"
import CodeGenerator from "./CodeGenerator"
import * as SparqlJS from "sparqljs"
import * as Blockly from "blockly"

export function sparqlToBlockly(sparql: string): Element {
    const parser = new SparqlJS.Parser({ sparqlStar: true })
    const query = parser.parse(sparql)

    return new BlockGenerator().visit(query)?.xml
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function blocklyToSparql(block: Blockly.Block): string | any[] {
    return new CodeGenerator().blockToCode(block)
}
