import * as SparqlJS from "sparqljs"
import { Block } from "./Block"

export interface Processor<T> {
    (item: T): Block;
}
export interface TriplesSameSubjectPattern {
    type: "triplesSameSubject";
    subject: SparqlJS.Term;
    predicates: PropertyList;
}
export interface CollectionPattern {
    type: "collection";
    items: SparqlJS.Term[];
}

export type Pattern =
    SparqlJS.Pattern |
    TriplesSameSubjectPattern |
    CollectionPattern
export type Quads =
    SparqlJS.GraphQuads |
    TriplesSameSubjectPattern
export type ObjectList = Set<SparqlJS.Term>
export type Verb =
    SparqlJS.IriTerm |
    SparqlJS.VariableTerm |
    SparqlJS.PropertyPath
export type Value =
    SparqlJS.IriTerm |
    SparqlJS.BlankTerm |
    SparqlJS.LiteralTerm |
    undefined
export type PropertyList = Map<Verb, ObjectList>
export type TriplesSameSubject = Map<SparqlJS.Term, PropertyList>
export type OperatorDefinition = {
    operators: string[];
    higher?: OperatorHierarchy;
}
export type OperatorHierarchy = {
    [key: string]: OperatorDefinition;
}
export type Using = {
    default: SparqlJS.IriTerm[];
    named: SparqlJS.IriTerm[];
}
export type CodeTuple = [string, Order]

export enum RDF {
    type = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
    langString = "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString",
    nil = "http://www.w3.org/1999/02/22-rdf-syntax-ns#nil",
    first = "http://www.w3.org/1999/02/22-rdf-syntax-ns#first",
    rest = "http://www.w3.org/1999/02/22-rdf-syntax-ns#rest",
}
export enum XSD {
    string = "http://www.w3.org/2001/XMLSchema#string",
    integer = "http://www.w3.org/2001/XMLSchema#integer",
    decimal = "http://www.w3.org/2001/XMLSchema#decimal",
    double = "http://www.w3.org/2001/XMLSchema#double",
    boolean = "http://www.w3.org/2001/XMLSchema#boolean",
}
export enum Order {
    None = 0,
    Atomic = 1,
}

