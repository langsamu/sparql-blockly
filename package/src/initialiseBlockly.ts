import "./defineCustomBlocks.ts"
import "./unregisterDefaultMenuItems.ts"
import "./registerCustomMenuItems.ts"
import * as Blockly from "blockly"
import CodeGenerator from "./CodeGenerator.ts"

// This is what's displayed when block collapsed
Blockly.Block.prototype.toString = function () {
    const code = new CodeGenerator().blockToCode(this, true)

    if (code instanceof Array)
        return code[0]
    else
        return code
}

Blockly.Field.prototype.maxDisplayLength = 3000
