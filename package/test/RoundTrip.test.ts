import "../src/defineCustomBlocks"
import "jest"
import * as Blockly from "blockly"
import BlockGenerator from "../src/BlockGenerator"
import CodeGenerator from "../src/CodeGenerator"
import { parseSparql } from "../src/parser"

describe("Round trip", function () {
    const cases: [string, string][] = [
        ["IN under negation", "!(?a IN (1))"],
        ["NOT IN under negation", "!(?a NOT IN (1))"],
        ["IN under unary minus", "-(?a IN (1))"],
        ["IN under multiplication", "(?a IN (1)) * 2"],
        ["IN under addition", "(?a IN (1)) + 2"],
        ["NOT IN under relational", "(?a NOT IN (1)) = true"],
        ["IN under conjunction", "?a IN (1) && ?b"],
        ["NOT IN under disjunction", "?a NOT IN (1) || ?b"],
    ]

    for (const [name, expression] of cases) {
        it(name, function () {
            const query = parseSparql(`SELECT * WHERE { FILTER(${expression}) }`)
            const block = new BlockGenerator().visit(query)
            const workspace = new Blockly.Workspace()
            Blockly.Xml.domToWorkspace(block.xml, workspace)
            const actual = new CodeGenerator().workspaceToCode(workspace)

            expect(actual).toContain(`FILTER (${expression})`)
        })
    }
})
