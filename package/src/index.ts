import "./initialiseBlockly.ts"
import BlockGenerator from "./BlockGenerator.ts"
import CodeGenerator from "./CodeGenerator.ts"
import { parseSparql } from "./parser.ts"
import * as Blockly from "blockly"

export function sparqlToBlockly(sparql: string): Element {
    return new BlockGenerator().visit(parseSparql(sparql))?.xml
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function blocklyToSparql(block: Blockly.Block): string | any[] {
    return new CodeGenerator().blockToCode(block)
}
