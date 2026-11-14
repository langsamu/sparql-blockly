import type * as T12 from "@traqula/rules-sparql-1-2"
import { AstFactory } from "@traqula/rules-sparql-1-2"
import { CommonIRIs } from "@traqula/rules-sparql-1-1"
import { Block } from "./Block"

const F = new AstFactory()

export default class TraqulaBlockGenerator {
    public visit(node: T12.Term): Block {
        return this.term(node)
    }

    // #region Paths
    private verb(verb: T12.TermIri | T12.TermVariable): Block {
        if (F.isTermNamed(verb) && !F.isTermNamedPrefixed(verb) && verb.value === CommonIRIs.TYPE)
            return new Block("a")
        else
            return this.term(verb)
    }
    // #endregion

    // #region Terms
    private term(term: T12.Term): Block {
        switch (term.subType) {
            case "variable":
                return this.variable(term)

            case "namedNode":
                if (!F.isTermNamedPrefixed(term) && term.value === CommonIRIs.NIL)
                    return new Block("nil")
                else
                    return this.namedNode(term)

            case "blankNode":
                return this.blankNode(term)

            case "literal":
                return this.literal(term)

            case "triple":
                return this.triple(term)
        }
    }
    private namedNode(term: T12.TermIri): Block {
        if (F.isTermNamedPrefixed(term)) {
            if (term.prefix)
                if (term.value)
                    return this.prefixedNamePrefixLocalName(term.prefix, term.value)
                else
                    return this.prefixedNamePrefix(term.prefix)
            else
                if (term.value)
                    return this.prefixedNameLocalName(term.value)
                else
                    return this.prefixedName()
        }

        if (term.value)
            return this.iriref(term.value)
        else
            return new Block("irirefdefault")
    }
    private triple(term: T12.TermTriple): Block {
        const block = new Block("embtp")

        block.addValue("subject", this.term(term.subject))
        block.addValue("predicate", this.verb(term.predicate))
        block.addValue("object", this.term(term.object))

        return block
    }
    private prefixedName(): Block {
        return new Block("prefixedname")
    }
    private prefixedNameLocalName(localName: string): Block {
        const block = new Block("prefixednamelocalname")

        block.addField("localName", localName)

        return block
    }
    private prefixedNamePrefix(prefix: string): Block {
        const block = new Block("prefixednameprefix")

        block.addField("prefix", prefix)

        return block
    }
    private prefixedNamePrefixLocalName(prefix: string, localName: string): Block {
        const block = new Block("prefixednameprefixlocalname")

        block.addField("localName", localName)
        block.addField("prefix", prefix)

        return block
    }
    private iriref(iri: string): Block {
        return new Block("iriref", iri)
    }
    private blankNode(term: T12.TermBlank): Block {
        return new Block("blanknodelabel", term.label)
    }
    private literal(term: T12.TermLiteral): Block {
        const datatype = term.langOrIri

        if (datatype === undefined)
            return this.string(term.value)
        else if (typeof datatype === "string")
            return this.langString(term, datatype)
        else if (F.isTermNamedPrefixed(datatype))
            return this.typedLiteral(term, datatype)
        else
            switch (datatype.value) {
                case CommonIRIs.STRING:
                    return this.string(term.value)

                case CommonIRIs.INTEGER:
                case CommonIRIs.DECIMAL:
                case CommonIRIs.DOUBLE:
                    return this.numeric(term.value)

                case CommonIRIs.BOOLEAN:
                    return this.boolean(term.value)

                default:
                    return this.typedLiteral(term, datatype)
            }
    }
    private string(value: string): Block {
        return new Block("string", value)
    }
    private langString(term: T12.TermLiteral, language: string): Block {
        const block = new Block("langstring", this.string(term.value))

        block.addField("language", language)

        return block
    }
    private numeric(value: string): Block {
        return new Block("numericliteral", value)
    }
    private boolean(value: string): Block {
        return new Block("booleanliteral", value.toUpperCase())
    }
    private typedLiteral(term: T12.TermLiteral, datatype: T12.TermIri): Block {
        const block = new Block("typedliteral", this.string(term.value))

        block.addValue("datatype", this.namedNode(datatype))

        return block
    }
    private variable(term: T12.TermVariable): Block {
        return new Block("var1", term.value)
    }
    // #endregion
}
