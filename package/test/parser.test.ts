import "jest"
import { AstFactory } from "@traqula/rules-sparql-1-2"
import type * as T12 from "@traqula/rules-sparql-1-2"
import { parseSparql } from "../src/parser"

describe("Parser", function () {
    it("parses a query and marks repeated subjects as noMaterialize", function () {
        const query = parseSparql("PREFIX : <http://e/> SELECT * { :s :p :o ; :q :r }") as T12.QuerySelect
        const factory = new AstFactory()

        expect(query.type).toBe("query")
        expect(query.context.some(definition => definition.type === "contextDef" && definition.subType === "prefix")).toBe(true)

        const bgp = query.where.patterns[0] as T12.PatternBgp
        const triples = bgp.triples as T12.TripleNesting[]
        expect(triples).toHaveLength(2)
        expect(factory.isSourceLocationNoMaterialize(triples[0].subject.loc)).toBe(false)
        expect(factory.isSourceLocationNoMaterialize(triples[1].subject.loc)).toBe(true)
    })
})
