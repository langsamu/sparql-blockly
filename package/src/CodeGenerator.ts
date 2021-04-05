import type { CodeTuple } from "./aliases"
import { Order } from "./aliases"
import * as Blockly from "blockly"

function codeTuple(code: string): CodeTuple {
    return [code, Order.None]
}
function join(delimiter: string, ...clauses: string[]) {
    return clauses.filter(Boolean).join(delimiter)
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function joinO(delimiter: string, ...clauses: Array<[any, string] | string>): string {
    return clauses.filter(clause => clause instanceof Array ? clause[0] : clause).map(clause => clause instanceof Array ? clause[1] : clause).join(delimiter)
}
function prefixedName(prefix, localName): CodeTuple {
    const code = `${prefix}:${localName}`

    return codeTuple(code)
}
function iriref(value = ""): CodeTuple {
    const code = `<${value}>`

    return codeTuple(code)
}

export default class CodeGenerator extends Blockly.Generator {
    constructor() {
        super("SPARQL 1.1")

        // This is used by base class to indent all statements, which we don't want as statements are collection items
        this.INDENT = ""

        this.addCodeGeneratorProperties()
    }

    private addCodeGeneratorProperties() {
        const prefix = "sparql"
        const isGenerator = name => name.startsWith(prefix)
        const toPropertyName = name => name.replace(prefix, "sparql11_").toLowerCase()
        const toWrappedGenerator = generatorName => block => this[generatorName](block)
        const addPropertyName = generatorName => [toPropertyName(generatorName), generatorName]
        const closeOverThis = ([propertyName, generatorName]) => [propertyName, toWrappedGenerator(generatorName)]
        const addToInstance = ([propertyName, generatorFunction]) => this[propertyName] = generatorFunction

        // Generator functions on this class are the ones prefixed with 'sparql'.
        // Blockly expects them to be properties of the generator instance.
        // They need to be named exactly as the block type.
        // They're called without 'this': `generator.call(block, block)`, so we need to wrap them capture it.
        Object.getOwnPropertyNames(CodeGenerator.prototype)
            .filter(isGenerator)
            .map(addPropertyName)
            .map(closeOverThis)
            .forEach(addToInstance)
    }

    public sparqlQuery(block: Blockly.Block): string {
        const prologue = this.statementToCode(block, "prologue")
        const value = this.valueToCode(block, "value")
        const values = this.valueToCode(block, "values")

        const code = join("\n\n", prologue, join("\n", value, values))

        return code
    }
    public sparqlSelectQuery(block: Blockly.Block): CodeTuple {
        const select = this.valueToCode(block, "select")
        const where = this.valueToCode(block, "where")

        const code = join("\n", select, where)

        return codeTuple(code)
    }
    public sparqlDescribeQuery(block: Blockly.Block): CodeTuple {
        const star = block.getFieldValue("star")
        const subject = this.statementToCode(block, "subject")
        const where = this.valueToCode(block, "where")

        const code = join("\n", join(" ", "DECRIBE", star, subject), where)

        return codeTuple(code)
    }
    public sparqlAskQuery(block: Blockly.Block): CodeTuple {
        const value = this.valueToCode(block, "value")

        const code = join(" ", "ASK", value)

        return codeTuple(code)
    }
    public sparqlSimpleConstructquery(block: Blockly.Block): CodeTuple {
        const datasets = this.statementToCode(block, "datasets")
        const where = this.statementToCode(block, "where")
        const modifiers = this.valueToCode(block, "modifiers")

        const code = join("\n", "CONSTRUCT", datasets, join("\n", "WHERE {", this.indent(where), "}"), modifiers)

        return codeTuple(code)
    }
    public sparqlConstructQuery(block: Blockly.Block): CodeTuple {
        const template = this.statementToCode(block, "template")
        const where = this.valueToCode(block, "where")

        const code = join("\n",
            join("\n",
                "CONSTRUCT {",
                this.indent(template),
                "}"),
            where)

        return codeTuple(code)
    }

    public sparqlUpdate(block: Blockly.Block): string {
        const prologue = this.statementToCode(block, "prologue")
        const items = this.statementToCode(block, "items")

        const code = join("\n\n", prologue, items)

        return code
    }
    public sparqlLoad(block: Blockly.Block): CodeTuple {
        const source = this.valueToCode(block, "source")
        const silent = block.getFieldValue("silent")
        const destination = this.valueToCode(block, "destination")

        const code = joinO(" ", [true, join(" ", "LOAD", silent, source)], [destination, join(" ", "INTO", destination)])

        return codeTuple(code)
    }
    public sparqlGraphRef(block: Blockly.Block): CodeTuple {
        const value = this.valueToCode(block, "value")

        const code = join(" ", "GRAPH", value)

        return codeTuple(code)
    }
    public sparqlCreate(block: Blockly.Block): CodeTuple {
        const silent = block.getFieldValue("silent")
        const graph = this.valueToCode(block, "graph")

        const code = join(" ", "CREATE", silent, graph)

        return codeTuple(code)
    }
    public sparqlAddMoveCopy(block: Blockly.Block): CodeTuple {
        const operator = block.getFieldValue("operator")
        const silent = block.getFieldValue("silent")
        const source = this.valueToCode(block, "source")
        const destination = this.valueToCode(block, "destination")

        const code = join(" ", operator, silent, source, "TO", destination)

        return codeTuple(code)
    }
    public sparqlClearDrop(block: Blockly.Block): CodeTuple {
        const operator = block.getFieldValue("operator")
        const silent = block.getFieldValue("silent")
        const graph = this.valueToCode(block, "graph")

        const code = join(" ", operator, silent, graph)

        return codeTuple(code)
    }
    public sparqlQuadPattern(block: Blockly.Block): CodeTuple {
        const items = this.statementToCode(block, "items")

        const code = join("\n", "{", this.indent(items), "}")

        return codeTuple(code)
    }
    public sparqlInsertDeleteWhere(block: Blockly.Block): CodeTuple {
        const operator = block.getFieldValue("operator")
        const pattern = this.valueToCode(block, "pattern")

        const code = join(" ", operator, pattern)

        return codeTuple(code)
    }
    public sparqlModify(block: Blockly.Block): CodeTuple {
        const iri = this.valueToCode(block, "iri")
        const deleteClause = this.valueToCode(block, "delete")
        const insert = this.valueToCode(block, "insert")
        const using = this.statementToCode(block, "using")
        const where = this.valueToCode(block, "where")

        const code = joinO("\n",
            [iri, join(" ", "WITH", iri)],
            [deleteClause, join(" ", "DELETE", deleteClause)],
            [insert, join(" ", "INSERT", insert)],
            using,
            join(" ", "WHERE", where))

        return codeTuple(code)
    }
    public sparqlUsingClause(block: Blockly.Block): string {
        const value = this.valueToCode(block, "value")

        const code = join(" ", "USING", value)

        return this.generateNext(block, code, "\n")
    }
    public sparqlGraphOrDefault(): CodeTuple {
        const code = "DEFAULT"

        return codeTuple(code)
    }
    public sparqlQuadsNotTriples(block: Blockly.Block): CodeTuple {
        const name = this.valueToCode(block, "name")
        const triples = this.statementToCode(block, "triples")

        const code = join(" ", "GRAPH", name, join("\n", "{", this.indent(triples), "}"))

        return codeTuple(code)
    }

    public sparqlSelectClause(block: Blockly.Block): CodeTuple {
        const distinctOrReduced = block.getFieldValue("distinctOrReduced")
        const star = block.getFieldValue("star")
        const vars = this.statementToCode(block, "vars")

        const code = join(" ", "SELECT", distinctOrReduced, star, vars)

        return codeTuple(code)
    }
    public sparqlExpressionAsVar(block: Blockly.Block): CodeTuple {
        const value = this.valueToCode(block, "value")
        const name = this.valueToCode(block, "name")

        const code = `(${value} AS ${name})`

        return codeTuple(code)
    }
    public sparqlQueryCommon(block: Blockly.Block): CodeTuple {
        const datasets = this.statementToCode(block, "datasets")
        const pattern = this.valueToCode(block, "pattern")
        const modifiers = this.valueToCode(block, "modifiers")

        const code = join("\n", datasets, join(" ", "WHERE", pattern), modifiers)

        return codeTuple(code)
    }

    public sparqlGroupGraphPattern(block: Blockly.Block): CodeTuple {
        const value = this.valueToCode(block, "value")

        const code = join("\n", "{", this.indent(value), "}")

        return codeTuple(code)
    }
    public sparqlSubSelect(block: Blockly.Block): CodeTuple {
        const select = this.valueToCode(block, "select")
        const pattern = this.valueToCode(block, "pattern")
        const values = this.valueToCode(block, "values")
        const modifiers = this.valueToCode(block, "modifiers")

        const code = join("\n", select, `WHERE ${pattern}`, modifiers, values)

        return codeTuple(code)
    }
    public sparqlTriplesSameSubject(block: Blockly.Block): CodeTuple {
        const subject = this.valueToCode(block, "subject")
        const predicates = this.statementToCode(block, "predicates")

        let code: string

        if (block.getInputTargetBlock("predicates")?.getNextBlock()) {
            code = join("\n", subject, this.indent(predicates))
        }
        else {
            code = join(" ", subject, predicates)
        }

        return codeTuple(code)
    }
    public sparqlPropertyListNotEmpty(block: Blockly.Block): string {
        const predicate = this.valueToCode(block, "predicate")
        const objects = this.statementToCode(block, "objects")

        const code = join(" ", predicate, objects)

        return this.generateNext(block, code, " ;\n")
    }
    public sparqlGroupGraphPatternSub(block: Blockly.Block): CodeTuple {
        const items = this.statementToCode(block, "items")

        const code = items

        return codeTuple(code)
    }
    public sparqlBlankNodePropertyList(block: Blockly.Block): CodeTuple {
        const p = block.getInputTargetBlock("predicates")
        const predicates = this.blockToCode(p) as string
        let code: string

        if (p && p.getNextBlock()) {
            code = join("\n", "[", this.indent(predicates), "]")
        }
        else {
            code = join(" ", "[", predicates, "]")
        }

        return codeTuple(code)
    }
    public sparqlCollection(block: Blockly.Block): CodeTuple {
        const items = this.statementToCode(block, "items")

        const code = join("", "(", items, ")")

        return codeTuple(code)
    }
    public sparqlOptionalGraphPattern(block: Blockly.Block): CodeTuple {
        const value = this.valueToCode(block, "value")

        const code = join(" ", "OPTIONAL", value)

        return codeTuple(code)
    }
    public sparqlGraphGraphPattern(block: Blockly.Block): CodeTuple {
        const iri = this.valueToCode(block, "iri")
        const patterns = this.valueToCode(block, "patterns")

        const code = join(" ", "GRAPH", iri, patterns)

        return codeTuple(code)
    }
    public sparqlServiceGraphPattern(block: Blockly.Block): CodeTuple {
        const iri = this.valueToCode(block, "iri")
        const silent = block.getFieldValue("silent")
        const patterns = this.valueToCode(block, "patterns")

        const code = join(" ", "SERVICE", silent, iri, patterns)

        return codeTuple(code)
    }
    public sparqlMinusGraphPattern(block: Blockly.Block): CodeTuple {
        const value = this.valueToCode(block, "value")

        const code = join(" ", "MINUS", value)

        return codeTuple(code)
    }
    public sparqlFilter(block: Blockly.Block): CodeTuple {
        const value = this.valueToCode(block, "value")

        const code = join(" ", "FILTER", value)

        return codeTuple(code)
    }
    public sparqlBind(block: Blockly.Block): CodeTuple {
        const value = this.valueToCode(block, "value")

        const code = join(" ", "BIND", value)

        return codeTuple(code)
    }
    public sparqlGroupOrUnionGraphPattern(block: Blockly.Block): CodeTuple {
        const items = this.statementToCode(block, "items")

        const code = join("", ...items)

        return codeTuple(code)
    }

    public sparqlPrefixDecl(block: Blockly.Block): CodeTuple {
        const prefix = block.getFieldValue("prefix")
        const value = this.valueToCode(block, "value")

        const code = `PREFIX ${prefix}: ${value}`

        return codeTuple(code)
    }
    public sparqlPrefixDeclDefault(block: Blockly.Block): CodeTuple {
        const value = this.valueToCode(block, "value")

        const code = `PREFIX : ${value}`

        return codeTuple(code)
    }
    public sparqlBase(block: Blockly.Block): CodeTuple {
        const value = this.valueToCode(block, "value")

        const code = `BASE ${value}`

        return codeTuple(code)
    }
    public sparqlNamedGraphClause(block: Blockly.Block): CodeTuple {
        const value = this.valueToCode(block, "value")

        const code = `NAMED ${value}`

        return codeTuple(code)
    }
    public sparqlSolutionModifier(block: Blockly.Block): CodeTuple {
        const group = this.statementToCode(block, "group")
        const having = this.statementToCode(block, "having")
        const order = this.statementToCode(block, "order")
        const limit = this.valueToCode(block, "limit")
        const offset = this.valueToCode(block, "offset")

        const code = joinO("\n", [group, `GROUP BY ${group}`], [having, `HAVING ${having}`], [order, `ORDER BY ${order}`], [limit, `LIMIT ${limit}`], [offset, `OFFSET ${offset}`])

        return codeTuple(code)
    }
    public sparqlOrdercondition(block: Blockly.Block): CodeTuple {
        const operator = block.getFieldValue("operator")
        const value = this.valueToCode(block, "value")

        const code = join("", operator, value)

        return codeTuple(code)
    }
    public sparqlInlineData(block: Blockly.Block): CodeTuple {
        const value = this.valueToCode(block, "value")

        const code = join(" ", "VALUES", value)

        return codeTuple(code)
    }
    public sparqlInlineDataOneVar(block: Blockly.Block): CodeTuple {
        const variable = this.valueToCode(block, "variable")
        const values = this.statementToCode(block, "values")

        const code = join(" ", variable, join(" ", "{", values, " }"))

        return codeTuple(code)
    }
    public sparqlInlineDataFull(block: Blockly.Block): CodeTuple {
        const variables = this.statementToCode(block, "variables")
        const values = this.statementToCode(block, "values")

        const code = join(" ", join("", "(", variables, ")"), join("\n", "{", this.indent(values), "}"))

        return codeTuple(code)
    }

    public sparqlA(): CodeTuple {
        return codeTuple("a")
    }
    public sparqlNegatedPath(block: Blockly.Block): CodeTuple {
        const value = this.valueToCode(block, "value")

        const code = join("", "!", value)

        return codeTuple(code)
    }
    public sparqlBracketedPath(block: Blockly.Block): CodeTuple {
        const value = this.valueToCode(block, "value")

        const code = join("", "(", value, ")")

        return codeTuple(code)
    }
    public sparqlPathWithModifier(block: Blockly.Block): CodeTuple {
        const modifier = block.getFieldValue("modifier")
        const value = this.valueToCode(block, "value")

        const code = join("", value, modifier)

        return codeTuple(code)
    }
    public sparqlInversePath(block: Blockly.Block): CodeTuple {
        const value = this.valueToCode(block, "value")

        const code = join("", "^", value)

        return codeTuple(code)
    }
    public sparqlPathAlternative(block: Blockly.Block): CodeTuple {
        const items = this.statementToCode(block, "items")

        const code = items

        return codeTuple(code)
    }
    public sparqlPathSequence(block: Blockly.Block): CodeTuple {
        const items = this.statementToCode(block, "items")

        const code = items

        return codeTuple(code)
    }
    public sparqlInversePathOneInPropertySet(block: Blockly.Block): CodeTuple {
        const value = this.valueToCode(block, "value")

        const code = join("", "^", value)

        return codeTuple(code)
    }
    public sparqlPathOneInPropertySetAlternative(block: Blockly.Block): CodeTuple {
        const items = this.statementToCode(block, "items")

        const code = join("", "(", items, ")")

        return codeTuple(code)
    }

    public sparqlIrirefDefault(): CodeTuple {
        return iriref()
    }
    public sparqlIriref(block: Blockly.Block): CodeTuple {
        const value = block.getFieldValue("value")

        return iriref(value)
    }
    public sparqlPrefixedName(): CodeTuple {
        return prefixedName("", "")
    }
    public sparqlPrefixedNamePrefix(block: Blockly.Block): CodeTuple {
        const prefix = block.getFieldValue("prefix")

        return prefixedName(prefix, "")
    }
    public sparqlPrefixedNameLocalName(block: Blockly.Block): CodeTuple {
        const localName = block.getFieldValue("localName")

        return prefixedName("", localName)
    }
    public sparqlPrefixedNamePrefixLocalName(block: Blockly.Block): CodeTuple {
        const prefix = block.getFieldValue("prefix")
        const localName = block.getFieldValue("localName")

        return prefixedName(prefix, localName)
    }
    public sparqlString(block: Blockly.Block): CodeTuple {
        let value = block.getFieldValue("value")

        let delimiter = "'"
        if (value.indexOf(delimiter) > -1) {
            delimiter = '"'

            if (value.indexOf('"') > -1) {
                value = value.replace(/"/g, '\\"')
            }
        }

        if (value.indexOf("\n") > -1) {
            delimiter = [...Array(3)].map(() => delimiter).join("")
        }

        const code = `${delimiter}${value}${delimiter}`

        return codeTuple(code)
    }
    public sparqlTypedLiteral(block: Blockly.Block): CodeTuple {
        const value = this.valueToCode(block, "value")
        const datatype = this.valueToCode(block, "datatype")

        const code = `${value}^^${datatype}`

        return codeTuple(code)
    }
    public sparqlLangString(block: Blockly.Block): CodeTuple {
        const value = this.valueToCode(block, "value")
        const language = block.getFieldValue("language")

        const code = `${value}@${language}`

        return codeTuple(code)
    }
    public sparqlNumericLiteral(block: Blockly.Block): CodeTuple {
        const value = block.getFieldValue("value")

        const code = value.toString()

        return codeTuple(code)
    }
    public sparqlBooleanLiteral(block: Blockly.Block): CodeTuple {
        const value = block.getFieldValue("value")

        const code = (value === "TRUE").toString()

        return codeTuple(code)
    }
    public sparqlVar1(block: Blockly.Block): CodeTuple {
        return this.var(block, "?")
    }
    public sparqlVar2(block: Blockly.Block): CodeTuple {
        return this.var(block, "$")
    }
    public sparqlUndef(): CodeTuple {
        return codeTuple("UNDEF")
    }
    public sparqlNil(): CodeTuple {
        return codeTuple("()")
    }
    public sparqlAnon(): CodeTuple {
        return codeTuple("[]")
    }
    public sparqlBlankNodeLabel(block: Blockly.Block): CodeTuple {
        const value = block.getFieldValue("value")

        const code = `_:${value}`

        return codeTuple(code)
    }

    public sparqlGraphRefAllDefault(): CodeTuple {
        return codeTuple("DEFAULT")
    }
    public sparqlGraphRefAllNamed(): CodeTuple {
        return codeTuple("NAMED")
    }
    public sparqlGraphRefAllAll(): CodeTuple {
        return codeTuple("ALL")
    }

    public sparqlBrackettedExpression(block: Blockly.Block): CodeTuple {
        const value = this.valueToCode(block, "value")

        const code = `(${value})`

        return codeTuple(code)
    }
    public sparqlBuiltinCall1(block: Blockly.Block): CodeTuple {
        const operator = block.getFieldValue("operator")
        const arg1 = this.valueToCode(block, "arg1")

        const code = `${operator}(${arg1})`

        return codeTuple(code)
    }
    public sparqlBuiltinCall0(block: Blockly.Block): CodeTuple {
        const operator = block.getFieldValue("operator")

        const code = `${operator}()`

        return codeTuple(code)
    }
    public sparqlBuiltinCall2(block: Blockly.Block): CodeTuple {
        const operator = block.getFieldValue("operator")
        const arg1 = this.valueToCode(block, "arg1")
        const arg2 = this.valueToCode(block, "arg2")

        const code = `${operator}(${arg1}, ${arg2})`

        return codeTuple(code)
    }
    public sparqlBuiltinCall4(block: Blockly.Block): CodeTuple {
        const operator = block.getFieldValue("operator")
        const arg1 = this.valueToCode(block, "arg1")
        const arg2 = this.valueToCode(block, "arg2")
        const arg3 = this.valueToCode(block, "arg3")
        const arg4 = this.valueToCode(block, "arg4")

        const code = `${operator}(${arg1}, ${arg2}, ${arg3}, ${arg4})`

        return codeTuple(code)
    }
    public sparqlBuiltinCall3(block: Blockly.Block): CodeTuple {
        const operator = block.getFieldValue("operator")
        const arg1 = this.valueToCode(block, "arg1")
        const arg2 = this.valueToCode(block, "arg2")
        const arg3 = this.valueToCode(block, "arg3")

        const code = `${operator}(${arg1}, ${arg2}, ${arg3})`

        return codeTuple(code)
    }
    public sparqlBuiltinCallN(block: Blockly.Block): CodeTuple {
        const operator = block.getFieldValue("operator")
        const args = this.statementToCode(block, "args")

        const code = `${operator}(${args})`

        return codeTuple(code)
    }
    public sparqlAdditiveExpression(block: Blockly.Block): CodeTuple {
        const left = this.valueToCode(block, "left")
        const right = this.valueToCode(block, "right")
        const operator = block.getFieldValue("operator")

        const code = join(" ", left, operator, right)

        return codeTuple(code)
    }
    public sparqlMultiplicativeExpression(block: Blockly.Block): CodeTuple {
        const left = this.valueToCode(block, "left")
        const right = this.valueToCode(block, "right")
        const operator = block.getFieldValue("operator")

        const code = join(" ", left, operator, right)

        return codeTuple(code)
    }
    public sparqlRelationalExpression(block: Blockly.Block): CodeTuple {
        const left = this.valueToCode(block, "left")
        const right = this.valueToCode(block, "right")
        const operator = block.getFieldValue("operator")

        const code = join(" ", left, operator, right)

        return codeTuple(code)
    }
    public sparqlConditionalAndExpression(block: Blockly.Block): CodeTuple {
        const left = this.valueToCode(block, "left")
        const right = this.valueToCode(block, "right")

        const code = join(" ", left, "&&", right)

        return codeTuple(code)
    }
    public sparqlConditionalOrExpression(block: Blockly.Block): CodeTuple {
        const left = this.valueToCode(block, "left")
        const right = this.valueToCode(block, "right")

        const code = join(" ", left, "||", right)

        return codeTuple(code)
    }
    public sparqlRelationalExpressionIn(block: Blockly.Block): CodeTuple {
        const left = this.valueToCode(block, "left")
        const right = this.statementToCode(block, "right")
        const operator = block.getFieldValue("operator")

        const code = join(" ", left, join("", operator, " (", right, ")"))

        return codeTuple(code)
    }
    public sparqlUnaryexpression(block: Blockly.Block): CodeTuple {
        const operator = block.getFieldValue("operator")
        const left = this.valueToCode(block, "left")

        const code = join("", operator.replace("UMINUS", "-"), left)

        return codeTuple(code)
    }
    public sparqlIriOrFunction(block: Blockly.Block): CodeTuple {
        const iri = this.valueToCode(block, "iri")
        const distinct = block.getFieldValue("distinct")
        const args = this.statementToCode(block, "args")

        const code = join("", iri, "(", join(" ", distinct, args), ")")

        return codeTuple(code)
    }
    public sparqlBound(block: Blockly.Block): CodeTuple {
        const value = this.valueToCode(block, "value")

        const code = join("", "BOUND(", value, ")")

        return codeTuple(code)
    }
    public sparqlExists(block: Blockly.Block): CodeTuple {
        const operator = block.getFieldValue("operator")
        const value = this.valueToCode(block, "value")

        const code = join(" ", operator, value)

        return codeTuple(code)
    }
    public sparqlAggregate(block: Blockly.Block): CodeTuple {
        const operator = block.getFieldValue("operator")
        const distinct = block.getFieldValue("distinct")
        const arg1 = this.valueToCode(block, "arg1")

        const code = join("", operator, "(", join(" ", distinct, arg1), ")")

        return codeTuple(code)
    }
    public sparqlCount(block: Blockly.Block): CodeTuple {
        const arg1 = this.valueToCode(block, "arg1")
        const distinct = block.getFieldValue("distinct")
        const star = block.getFieldValue("star")

        const code = join("", "COUNT(", join(" ", distinct, star, arg1), ")")

        return codeTuple(code)
    }
    public sparqlGroup_Concat(block: Blockly.Block): CodeTuple {
        const arg1 = this.valueToCode(block, "arg1")
        const distinct = block.getFieldValue("distinct")
        const separator = this.valueToCode(block, "separator")

        const code = joinO("", "GROUP_CONCAT(", join(" ", distinct, arg1), [separator !== "' '", join(" ", "; SEPARATOR =", separator)], ")")

        return codeTuple(code)
    }

    public sparqlEmbTp(block: Blockly.Block): CodeTuple {
        const subject = this.valueToCode(block, "subject")
        const predicate = this.valueToCode(block, "predicate")
        const object = this.valueToCode(block, "object")

        const code = joinO(" ", "<<", subject, predicate, object, ">>")

        return codeTuple(code)
    }
    public sparqlObjectListItemAnootationPattern(block: Blockly.Block): string {
        const value = this.valueToCode(block, "value")
        const annotations = this.statementToCode(block, "annotations")

        const code = join(" ", value, join("\n", "{|", this.indent(annotations), "|}"))

        return this.generateNext(block, code, ", ")
    }


    public sparqlVarOrExpressionAsVarItem(block: Blockly.Block): string {
        return this.item(" ", block)
    }
    public sparqlObjectListItem(block: Blockly.Block): string {
        return this.item(", ", block)
    }
    public sparqlGroupGraphPatternSubItem(block: Blockly.Block): string {
        return this.item(" .\n", block)
    }
    public sparqlPrologueItem(block: Blockly.Block): string {
        return this.item("\n", block)
    }
    public sparqlVarOrIriItem(block: Blockly.Block): string {
        return this.item(" ", block)
    }
    public sparqlDatasetClause(block: Blockly.Block): string {
        const value = this.valueToCode(block, "value")

        const code = `FROM ${value}`

        return this.generateNext(block, code, "\n")
    }
    public sparqlExpressionListItem(block: Blockly.Block): string {
        return this.item(", ", block)
    }
    public sparqlGroupConditionItem(block: Blockly.Block): string {
        return this.item(" ", block)
    }
    public sparqlHavingConditionItem(block: Blockly.Block): string {
        return this.item(" ", block)
    }
    public sparqlOrderConditionItem(block: Blockly.Block): string {
        return this.item(" ", block)
    }
    public sparqlGraphNodeItem(block: Blockly.Block): string {
        return this.item(" ", block)
    }
    public sparqlUnaryExpressionItem(block: Blockly.Block): string {
        return this.item("", block)
    }
    public sparqlConditionalAndExpressionItem(block: Blockly.Block): string {
        return this.item("", block)
    }
    public sparqlMultiplicativeExpressionItem(block: Blockly.Block): string {
        return this.item("", block)
    }
    public sparqlGroupGraphPatternItem(block: Blockly.Block): string {
        return this.item("\nUNION\n", block)
    }
    public sparqlPathSequencItem(block: Blockly.Block): string {
        return this.item("/", block)
    }
    public sparqlPathAlternativeItem(block: Blockly.Block): string {
        return this.item("|", block)
    }
    public sparqlPathOneInPropertySetAlternativeItem(block: Blockly.Block): string {
        return this.item("|", block)
    }
    public sparqlDataBlockValuesItem(block: Blockly.Block): string {
        const items = this.statementToCode(block, "items")

        const code = join("", "(", join(" ", items), ")")

        return this.generateNext(block, code, "\n")
    }
    public sparqlDataBlockValueItem(block: Blockly.Block): string {
        return this.item(" ", block)
    }
    public sparqlVarItem(block: Blockly.Block): string {
        return this.item(" ", block)
    }
    public sparqlTriplesSameSubjectItem(block: Blockly.Block): string {
        return this.item(" .\n", block)
    }
    public sparqlUpdateItem(block: Blockly.Block): string {
        return this.item(" ;\n\n", block)
    }
    public sparqlQuadPatternItem(block: Blockly.Block): string {
        return this.item(" .\n", block)
    }

    public valueToCode(block: Blockly.Block, name: string): string {
        return super.valueToCode(block, name, Order.Atomic)
    }
    private indent(code: string): string {
        if (code)
            return this.prefixLines(code, "\t")
    }
    private var(block: Blockly.Block, prefix: string): CodeTuple {
        const value = block.getFieldValue("value")

        const code = `${prefix}${value}`

        return codeTuple(code)
    }
    private item(delimiter: string, block: Blockly.Block): string {
        const value = this.valueToCode(block, "value")

        const code = value

        return this.generateNext(block, code, delimiter)
    }
    private generateNext(block: Blockly.Block, code: string, delimiter: string): string {
        const next = this.blockToCode(block.getNextBlock())

        if (next) {
            code += delimiter + next
        }

        return code
    }
}

