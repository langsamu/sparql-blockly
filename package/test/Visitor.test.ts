import "jest"
import "jest-xml-matcher"
import { readFileSync } from "fs"
import BlockGenerator from "../src/BlockGenerator"
import * as SparqlJS from "sparqljs";

describe("Block generation", function () {
    const text = readFileSync("test/BlockGeneratorTests.xml", "utf-8")
    const suite = new DOMParser().parseFromString(text, "text/xml")

    const tests = suite.evaluate("test", suite.documentElement, null, 4)
    for (let test = tests.iterateNext() as Element; test; test = tests.iterateNext() as Element) {
        const testName = test.getAttribute("name")

        const sparql = test.getElementsByTagName("sparql")[0].textContent
        const parser = new SparqlJS.Parser({ sparqlStar: true });
        const query = parser.parse(sparql)
        const expected = test.getElementsByTagName("xml")[0] as Element

        it(testName, function () {
            const visitor = new BlockGenerator()
            const block = visitor.visit(query)
            const actual = block.xml

            compare(actual, expected)
        })
    }
})

function compare(a, b) {
    const s = new XMLSerializer()
    expect(s.serializeToString(a)).toEqualXML(s.serializeToString(b))
}
