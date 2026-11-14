import { describe, it } from "node:test"
import * as assert from "node:assert/strict"
import "../src/defineCustomBlocks"
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
            const actual = roundTrip(`SELECT * WHERE { FILTER(${expression}) }`)
            assert.ok(actual.includes(`FILTER (${expression})`), actual)
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
            const actual = roundTrip(`ASK { ?s ?p ${input} }`)
            assert.ok(actual.includes(`?s ?p ${expected}`), actual)
        })
    }
})

describe("VALUES round trip", function () {
    const cases: [string, string, string[]][] = [
        ["empty, one variable", "VALUES ?x {}", ["?x"]],
        ["empty, more than one variable", "VALUES (?x ?y) {}", ["?x", "?y"]],
        ["UNDEF, one variable", "VALUES ?x { UNDEF 1 }", ["?x", "UNDEF", "1"]],
        ["UNDEF, more than one variable", "VALUES (?x ?y) { (UNDEF 1) (2 UNDEF) }", ["?x", "?y", "UNDEF", "1", "2"]],
    ]

    for (const [name, values, expected] of cases) {
        it(name, function () {
            const result = roundTrip(`SELECT * WHERE { ${values} }`)

            for (const fragment of expected) assert.ok(result.includes(fragment), result)
        })
    }
})
