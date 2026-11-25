import { describe, it } from "node:test"
import assert from "node:assert/strict"
import "../src/defineCustomBlocks.ts"
import * as Blockly from "blockly"
import BlockGenerator from "../src/BlockGenerator.ts"
import CodeGenerator from "../src/CodeGenerator.ts"
import { parseSparql } from "../src/parser.ts"

function roundTrip(sparql: string): string {
    const block = new BlockGenerator().visit(parseSparql(sparql))
    const workspace = new Blockly.Workspace()
    Blockly.serialization.blocks.append(block, workspace)

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

describe("Save and load", function () {
    const queries = [
        "SELECT ?s WHERE { ?s ?p ?o . ?o ?q 1 . FILTER(?s IN (1, 2) && !?o) } ORDER BY ?s LIMIT 5",
        "SELECT * WHERE { VALUES (?x ?y) { (UNDEF 1) (2 UNDEF) } OPTIONAL { ?a ?b \"c\"@en } }",
    ]

    function stripIds(state: unknown): unknown {
        return JSON.parse(JSON.stringify(state, (key, value) => (key === "id" || key === "x" || key === "y" ? undefined : value)))
    }

    for (const query of queries) {
        it(query, function () {
            const first = new Blockly.Workspace()
            Blockly.serialization.blocks.append(new BlockGenerator().visit(parseSparql(query)), first)
            const saved = Blockly.serialization.workspaces.save(first)

            const second = new Blockly.Workspace()
            Blockly.serialization.workspaces.load(saved, second)

            assert.deepEqual(
                stripIds(Blockly.serialization.workspaces.save(second)),
                stripIds(saved))
        })
    }
})

function blockTypes(state: unknown): string[] {
    const types: string[] = []
    JSON.stringify(state, (key, value) => {
        if (key === "type" && typeof value === "string") types.push(value)
        return value
    })

    return types
}

describe("Triple term round trip", function () {
    const cases: [string, string, string, string[], string[]][] = [
        ["triple term in BIND", "SELECT * { BIND (<<( ?p <x:a> ?a )>> AS ?t) }", "BIND (<<( ?p <x:a> ?a )>> AS ?t)", ["sparql11_exprtripleterm"], ["sparql11_tripleterm", "sparql11_tripletermdata"]],
        ["triple term in FILTER", "SELECT * { FILTER (?t = <<( ?p <x:a> 1 )>>) }", "FILTER (?t = <<( ?p <x:a> 1 )>>)", ["sparql11_exprtripleterm"], ["sparql11_tripleterm", "sparql11_tripletermdata"]],
        ["nested triple term in BIND", "SELECT * { BIND (<<( <x:s> <x:a> <<( <x:s> a ?o )>> )>> AS ?t) }", "BIND (<<( <x:s> <x:a> <<( <x:s> a ?o )>> )>> AS ?t)", ["sparql11_exprtripleterm"], ["sparql11_tripleterm", "sparql11_tripletermdata"]],
        ["triple term as object", "SELECT * { ?s ?p <<( ?a <x:a> ?b )>> }", "?s ?p <<( ?a <x:a> ?b )>>", ["sparql11_tripleterm"], ["sparql11_tripletermdata", "sparql11_exprtripleterm"]],
        ["nested triple term as object", "SELECT * { ?s ?p <<( _:a <x:a> <<( ?a <x:b> 1 )>> )>> }", "?s ?p <<( _:e_a <x:a> <<( ?a <x:b> 1 )>> )>>", ["sparql11_tripleterm"], ["sparql11_tripletermdata", "sparql11_exprtripleterm"]],
        ["triple term in VALUES, one variable", "SELECT * { VALUES ?t { <<( <x:s> <x:a> 1 )>> UNDEF } }", "<<( <x:s> <x:a> 1 )>>", ["sparql11_tripletermdata"], ["sparql11_tripleterm", "sparql11_exprtripleterm"]],
        ["triple term in VALUES, more than one variable", "SELECT * { VALUES (?t ?u) { (<<( <x:s> a <<( <x:s> <x:a> \"b\" )>> )>> 2) } }", "<<( <x:s> a <<( <x:s> <x:a> 'b' )>> )>>", ["sparql11_tripletermdata"], ["sparql11_tripleterm", "sparql11_exprtripleterm"]],
        ["reified triple", "SELECT * { << ?a <x:a> ?b >> ?p ?o }", "<< ?a <x:a> ?b >> ?p ?o", ["sparql11_embtp"], ["sparql11_tripleterm", "sparql11_tripletermdata", "sparql11_exprtripleterm"]],
    ]

    for (const [name, sparql, expected, used, unused] of cases) {
        it(name, function () {
            const state = new BlockGenerator().visit(parseSparql(sparql))
            const types = blockTypes(state)
            for (const type of used) assert.ok(types.includes(type), `${type} in ${types}`)
            for (const type of unused) assert.ok(!types.includes(type), `${type} in ${types}`)

            const actual = roundTrip(sparql)
            assert.ok(actual.includes(expected), actual)
            parseSparql(actual)
        })
    }
})
