import "../src/defineCustomBlocks"
import "jest"
import * as Blockly from "blockly"
import BlockGenerator from "../src/BlockGenerator"
import CodeGenerator from "../src/CodeGenerator"
import { parseSparql } from "../src/parser"

function roundTrip(sparql: string): string {
    const block = new BlockGenerator().visit(parseSparql(sparql))
    const workspace = new Blockly.Workspace()
    Blockly.Xml.domToWorkspace(block.xml, workspace)

    return new CodeGenerator().workspaceToCode(workspace)
}

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
            expect(roundTrip(`SELECT * WHERE { FILTER(${expression}) }`)).toContain(`FILTER (${expression})`)
        })
    }
})

describe("Literal round trip", function () {
    const cases: [string, string][] = [
        ["1", "1"],
        ["-1.5", "-1.5"],
        ["1e3", "1e3"],
        ["true", "true"],
        ['"1"^^<http://www.w3.org/2001/XMLSchema#integer>', "1"],
        ['"1.0"^^<http://www.w3.org/2001/XMLSchema#decimal>', "1.0"],
        ['"1.0e0"^^<http://www.w3.org/2001/XMLSchema#double>', "1.0e0"],
        ['"false"^^<http://www.w3.org/2001/XMLSchema#boolean>', "false"],
        ['"1"^^<http://www.w3.org/2001/XMLSchema#decimal>', "'1'^^<http://www.w3.org/2001/XMLSchema#decimal>"],
        ['"1.0"^^<http://www.w3.org/2001/XMLSchema#double>', "'1.0'^^<http://www.w3.org/2001/XMLSchema#double>"],
        ['"abc"^^<http://www.w3.org/2001/XMLSchema#integer>', "'abc'^^<http://www.w3.org/2001/XMLSchema#integer>"],
        ['"1"^^<http://www.w3.org/2001/XMLSchema#boolean>', "'1'^^<http://www.w3.org/2001/XMLSchema#boolean>"],
        ['"TRUE"^^<http://www.w3.org/2001/XMLSchema#boolean>', "'TRUE'^^<http://www.w3.org/2001/XMLSchema#boolean>"],
    ]

    for (const [input, expected] of cases) {
        it(input, function () {
            expect(roundTrip(`ASK { ?s ?p ${input} }`)).toContain(`?s ?p ${expected}`)
        })
    }
})
