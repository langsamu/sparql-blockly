import "./defineCustomBlocks"
import "./unregisterDefaultMenuItems"
import "./registerCustomMenuItems"
import * as Blockly from "blockly"
import CodeGenerator from "./CodeGenerator"

// This is what's displayed when block collapsed
Blockly.Block.prototype.toString = function () {
    const code = new CodeGenerator().blockToCode(this, true)

    if (code instanceof Array)
        return code[0]
    else
        return code
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const blockly = Blockly as any
blockly.COLLAPSE_CHARS = 3000

Blockly.Field.prototype.maxDisplayLength = 3000
