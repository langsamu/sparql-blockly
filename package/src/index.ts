import "./initialiseBlockly.ts"
import BlockGenerator from "./BlockGenerator.ts"
import CodeGenerator from "./CodeGenerator.ts"
import { parseSparql } from "./parser.ts"
import * as Blockly from "blockly"

export type WorkspaceState = {
    blocks: {
        languageVersion: number
        blocks: Blockly.serialization.blocks.State[]
    }
}

export function sparqlToBlockly(sparql: string): WorkspaceState | undefined {
    const block = new BlockGenerator().visit(parseSparql(sparql))

    return block && { blocks: { languageVersion: 0, blocks: [block] } }
}

export function blocklyToSparql(block: Blockly.Block): string | any[] {
    return new CodeGenerator().blockToCode(block)
}
