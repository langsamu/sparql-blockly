import "./blocks"
import BlockGenerator from "./BlockGenerator"
import CodeGenerator from "./CodeGenerator"
import * as SparqlJS from "sparqljs"
import * as Blockly from "blockly"

export function sparqlToBlockly(sparql: SparqlJS.SparqlQuery): Element {
    return new BlockGenerator().visit(sparql)?.xml
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function blocklyToSparql(block: Blockly.Block): string | any[] {
    return new CodeGenerator().blockToCode(block) 
}
