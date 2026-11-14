import "./initialiseBlockly"
import BlockGenerator from "./BlockGenerator"
import CodeGenerator from "./CodeGenerator"
import { parseSparql } from "./parser"
import * as Blockly from "blockly"

export function sparqlToBlockly(sparql: string): Element {
    return new BlockGenerator().visit(parseSparql(sparql))?.xml
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function blocklyToSparql(block: Blockly.Block): string | any[] {
    return new CodeGenerator().blockToCode(block)
}
