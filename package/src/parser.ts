import { Parser } from "@traqula/parser-sparql-1-2"
import { AstFactory } from "@traqula/rules-sparql-1-2"
import type * as T12 from "@traqula/rules-sparql-1-2"

let parser: Parser | undefined

export function parseSparql(text: string): T12.SparqlQuery {
    parser ??= new Parser()

    return parser.parse(text, { astFactory: new AstFactory() })
}
