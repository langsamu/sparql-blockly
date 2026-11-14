import type * as T12 from "@traqula/rules-sparql-1-2"
import { AstFactory } from "@traqula/rules-sparql-1-2"
import { CommonIRIs } from "@traqula/rules-sparql-1-1"
import type { OperatorDefinition, OperatorHierarchy } from "./aliases"
import { Block } from "./Block"

const F = new AstFactory()

const unsupportedOperators = ["langdir", "strlangdir", "haslang", "haslangdir", "istriple", "triple", "subject", "predicate", "object"]

export default class TraqulaBlockGenerator {
    private static hierarchy: OperatorHierarchy = {
        unaryexpression: {
            operators: ["uminus", "uplus", "!"],
            higher: {
                multiplicativeexpression: {
                    operators: ["*", "/"],
                    higher: {
                        additiveexpression: {
                            operators: ["+", "-"],
                            higher: {
                                relationalexpression: {
                                    operators: ["=", "!=", "<", ">", "<=", ">="],
                                    higher: {
                                        conditionalandexpression: {
                                            operators: ["&&"],
                                            higher: {
                                                conditionalorexpression: {
                                                    operators: ["||"]
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    public visit(node: T12.Term): Block {
        return this.term(node)
    }

    // #region Paths
    private verb(verb: T12.Path | T12.TermVariable): Block {
        if (verb.type === "path")
            return this.path(verb)
        else if (F.isTermNamed(verb) && !F.isTermNamedPrefixed(verb) && verb.value === CommonIRIs.TYPE)
            return new Block("a")
        else
            return this.term(verb)
    }
    private path(path: T12.PathPure): Block {
        switch (path.subType) {
            case "|":
                return this.pathAlternative(path)

            case "/":
                return this.pathSequence(path)

            case "^":
                return this.pathInverse(path)

            case "?":
            case "+":
            case "*":
                return this.pathModifier(path)

            case "!":
                return this.pathNegated(path)
        }
    }
    private pathAlternative(path: T12.PropertyPathChain): Block {
        const block = new Block("pathalternative")

        block.addItems("items", path.items, this.pathAlternativeItem, this)

        return block
    }
    private pathSequence(path: T12.PropertyPathChain): Block {
        const block = new Block("pathsequence")

        block.addItems("items", path.items, this.pathSequenceItem, this)

        return block
    }
    private pathModifier(path: T12.PathModified): Block {
        const block = new Block("pathwithmodifier")

        const verb = path.items[0]
        if (verb.type === "path" && ["/", "|", "^"].includes(verb.subType))
            block.addValue("value", this.brackettedPath(verb))
        else
            block.addValue("value", this.verb(verb))

        block.addField("modifier", path.subType)

        return block
    }
    private pathInverse(path: T12.PathModified): Block {
        const block = new Block("inversepath")

        const verb = path.items[0]
        if (verb.type === "path" && ["/", "|"].includes(verb.subType))
            block.addValue("value", this.brackettedPath(verb))
        else
            block.addValue("value", this.verb(verb))

        return block
    }
    private pathNegated(path: T12.PathNegated): Block {
        const verb = path.items[0]

        if (verb.type === "path")
            switch (verb.subType) {
                case "|":
                    return new Block("negatedpath", this.pathOneInPropertySetAlternative(verb))

                case "^":
                    return new Block("negatedpath", this.inversePathOneInPropertySet(verb))
            }
        else
            return new Block("negatedpath", this.verb(verb))
    }
    private inversePathOneInPropertySet(verb: T12.PathNegatedElt): Block {
        return new Block("inversepathoneinpropertyset", this.verb(verb.items[0]))
    }
    private pathOneInPropertySetAlternative(verb: T12.PathAlternativeLimited): Block {
        const block = new Block("pathoneinpropertysetalternative")

        block.addItems("items", verb.items, this.pathOneInPropertySetAlternativeItem, this)

        return block
    }
    private brackettedPath(verb: T12.Path): Block {
        return new Block("bracketedpath", this.verb(verb))
    }
    // #endregion

    // #region Expressions
    private expression(expression: T12.Expression): Block {
        if (expression.type === "term")
            return this.term(expression)

        switch (expression.subType) {
            case "operation":
                return this.operation(expression)

            case "functionCall":
                return this.functionCall(expression)

            case "aggregate":
                return this.aggregate(expression)

            case "patternOperation":
                throw new Error(`Unsupported expression: ${expression.operator.toUpperCase()}`)
        }
    }
    private operation(expression: T12.ExpressionOperation): Block {
        switch (expression.operator) {
            case "||":
            case "&&":
            case "=":
            case "!=":
            case "<":
            case ">":
            case "<=":
            case ">=":
            case "+":
            case "-":
            case "*":
            case "/":
            case "!":
            case "uminus":
            case "uplus":
                return this.unibinary(expression)

            case "notin":
            case "in":
                return this.in(expression)

            case "bound":
                return this.bound(expression)

            case "concat":
            case "coalesce":
                return this.builtInCallN(expression)
        }

        if (unsupportedOperators.includes(expression.operator))
            throw new Error(`Unsupported SPARQL 1.2 function: ${expression.operator.toUpperCase()}`)

        switch (expression.args.length) {
            case 0:
                return this.builtInCall0(expression)

            case 1:
                return this.builtInCall1(expression)

            case 2:
                return this.builtInCall2(expression)

            case 3:
                return this.builtInCall3(expression)

            case 4:
                return this.builtInCall4(expression)

            default:
                throw new Error(`Unsupported number of arguments for ${expression.operator.toUpperCase()}: ${expression.args.length}`)
        }
    }
    private functionCall(expression: T12.ExpressionFunctionCall): Block {
        const block = new Block("iriorfunction")

        block.addValue("iri", this.namedNode(expression.function))
        if (expression.distinct) block.addField("distinct", "DISTINCT")
        block.addItems("args", expression.args, this.expressionListItem, this)

        return block
    }
    private aggregate(expression: T12.ExpressionAggregate): Block {
        switch (expression.aggregation) {
            case "sum":
            case "min":
            case "max":
            case "avg":
            case "sample":
                return this.aggregateCommon(expression)

            case "group_concat":
                return this.group_concat(expression)

            case "count":
                return this.count(expression)

            default:
                throw new Error(`Unsupported aggregate: ${expression.aggregation.toUpperCase()}`)
        }
    }
    private builtInCall0(expression: T12.ExpressionOperation): Block {
        const block = new Block("builtincall0")

        block.addField("operator", expression.operator.toUpperCase())

        return block
    }
    private builtInCall1(expression: T12.ExpressionOperation): Block {
        const block = new Block("builtincall1")

        block.addValue("arg1", this.expression(expression.args[0]))
        block.addField("operator", expression.operator.toUpperCase())

        return block
    }
    private builtInCall2(expression: T12.ExpressionOperation): Block {
        const block = new Block("builtincall2")

        block.addValue("arg1", this.expression(expression.args[0]))
        block.addValue("arg2", this.expression(expression.args[1]))
        block.addField("operator", expression.operator.toUpperCase())

        return block
    }
    private builtInCall3(expression: T12.ExpressionOperation): Block {
        const block = new Block("builtincall3")

        block.addValue("arg1", this.expression(expression.args[0]))
        block.addValue("arg2", this.expression(expression.args[1]))
        block.addValue("arg3", this.expression(expression.args[2]))
        block.addField("operator", expression.operator.toUpperCase())

        return block
    }
    private builtInCall4(expression: T12.ExpressionOperation): Block {
        const block = new Block("builtincall4")

        block.addValue("arg1", this.expression(expression.args[0]))
        block.addValue("arg2", this.expression(expression.args[1]))
        block.addValue("arg3", this.expression(expression.args[2]))
        block.addValue("arg4", this.expression(expression.args[3]))
        block.addField("operator", expression.operator.toUpperCase())

        return block
    }
    private builtInCallN(expression: T12.ExpressionOperation): Block {
        const block = new Block("builtincalln")

        block.addField("operator", expression.operator.toUpperCase())
        block.addItems("args", expression.args, this.expressionListItem, this)

        return block
    }
    private bound(expression: T12.ExpressionOperation): Block {
        return new Block("bound", this.expression(expression.args[0]))
    }
    private bracketted(expression: T12.Expression): Block {
        return new Block("brackettedexpression", this.expression(expression))
    }
    private unibinary(expression: T12.ExpressionOperation, hierarchy: OperatorHierarchy = TraqulaBlockGenerator.hierarchy): Block {
        const [name, definition] = Object.entries(hierarchy)[0]

        if (definition.operators.includes(expression.operator)) {
            const block = new Block(name)

            block.addValue("left", this.bracketArgument(expression.args[0], definition))

            if (expression.args.length > 1)
                block.addValue("right", this.bracketArgument(expression.args[1], definition))

            if (!["&&", "||"].includes(expression.operator))
                block.addField("operator", TraqulaBlockGenerator.operatorField(expression.operator))

            return block
        }
        else {
            return this.unibinary(expression, definition.higher)
        }
    }
    private bracketArgument(argument: T12.Expression, definition: OperatorDefinition = TraqulaBlockGenerator.hierarchy.unaryexpression): Block {
        if (argument.type === "expression" && argument.subType === "operation") {
            if (definition.operators.includes(argument.operator)) {
                return this.bracketted(argument)
            }

            if (definition.higher) {
                const [, higher] = Object.entries(definition.higher)[0]
                return this.bracketArgument(argument, higher)
            }
        }

        return this.expression(argument)
    }
    private in(expression: T12.ExpressionOperation): Block {
        const [left, ...right] = expression.args
        const block = new Block("relationalexpressionin")

        block.addValue("left", this.expression(left))
        block.addField("operator", expression.operator.toUpperCase().replace("NOTIN", "NOT IN"))
        block.addItems("right", right, this.expressionListItem, this)

        return block
    }
    private group_concat(aggregate: T12.ExpressionAggregate): Block {
        const block = new Block("group_concat")

        block.addValue("arg1", this.expression(aggregate.expression[0] as T12.Expression))
        block.addValue("separator", this.string("separator" in aggregate ? aggregate.separator : " "))
        if (aggregate.distinct) block.addField("distinct", "DISTINCT")

        return block
    }
    private count(aggregate: T12.ExpressionAggregate): Block {
        const block = new Block("count")

        if (aggregate.distinct) block.addField("distinct", "DISTINCT")

        const argument = aggregate.expression[0]
        if (argument.type === "wildcard")
            block.addField("star", "*")
        else
            block.addValue("arg1", this.expression(argument))

        return block
    }
    private aggregateCommon(aggregate: T12.ExpressionAggregate): Block {
        const block = new Block("aggregate")

        block.addValue("arg1", this.expression(aggregate.expression[0] as T12.Expression))
        block.addField("operator", aggregate.aggregation.toUpperCase())
        if (aggregate.distinct) block.addField("distinct", "DISTINCT")

        return block
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

    // #region Collection items
    private expressionListItem(expression: T12.Expression): Block {
        return new Block("expressionlistitem", this.expression(expression))
    }
    private pathAlternativeItem(verb: T12.Path): Block {
        return new Block("pathalternativeitem", this.verb(verb))
    }
    private pathSequenceItem(verb: T12.Path): Block {
        if (verb.type === "path" && verb.subType === "|")
            return new Block("pathsequencitem", this.brackettedPath(verb))
        else
            return new Block("pathsequencitem", this.verb(verb))
    }
    private pathOneInPropertySetAlternativeItem(verb: T12.TermIri | T12.PathNegatedElt): Block {
        if (verb.type === "path")
            return new Block("pathoneinpropertysetalternativeitem", this.inversePathOneInPropertySet(verb))
        else
            return new Block("pathoneinpropertysetalternativeitem", this.verb(verb))
    }
    // #endregion

    private static operatorField(operator: string): string {
        switch (operator) {
            case "uminus":
                return "UMINUS"

            case "uplus":
                return "+"

            default:
                return operator
        }
    }
}
