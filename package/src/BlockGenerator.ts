import type { OperatorHierarchy, Quads, Using, Pattern, TriplesSameSubjectPattern, CollectionPattern, Verb, Value, OperatorDefinition, ObjectList, TriplesSameSubject, } from "./aliases"
import { RDF, XSD } from "./aliases"
import * as SparqlJS from "sparqljs"
import { Block } from "./Block"
import { StringifiedMap } from "./StringifiedMap"
import TermSet = require("@rdfjs/term-set")
import TermMap = require("@rdfjs/term-map")

export default class BlockGenerator {
    private static hierarchy: OperatorHierarchy = {
        unaryexpression: {
            operators: ["UMINUS", "!"],
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
    private baseUri: string
    private prefixes = new Map<string, string>()

    public visit(query: SparqlJS.SparqlQuery): Block {
        switch (query.type) {
            case "query":
                return this.query(query)

            case "update":
                return this.update(query)
        }
    }

    // #region Queries
    private query(query: SparqlJS.Query): Block {
        const block = new Block("query")

        block.addItems("prologue", BlockGenerator.getPrologueItems(query), this.prologueItem, this)
        block.addValue("value", this[query.queryType.toLowerCase()](query))
        if (query.values) block.addValue("values", this.values(query.values))

        return block
    }
    private select(query: SparqlJS.SelectQuery): Block {
        const block = new Block("selectquery")

        block.addValue("select", this.selectClause(query))
        block.addValue("where", this.queryCommon(query))

        return block
    }
    private construct(query: SparqlJS.ConstructQuery): Block {
        const template = BlockGenerator.normalisePatterns([{ triples: query.template, type: "bgp" }])

        if (BlockGenerator.isSimpleConstruct(query)) {
            const block = new Block("simpleconstructquery")

            block.addValue("modifiers", this.solutionModifiers(query))
            block.addItems("where", [...template], this.triplesSameSubjectItem, this)
            if (query.from) this.dataset(block, query.from)

            return block
        }
        else {
            const block = new Block("constructquery")

            block.addValue("where", this.queryCommon(query))
            block.addItems("template", [...template], this.triplesSameSubjectItem, this)

            return block
        }
    }
    private describe(query: SparqlJS.DescribeQuery): Block {
        const variables = query.variables

        const block = new Block("describequery")

        if (query.where) block.addValue("where", this.queryCommon(query))
        if (BlockGenerator.isWildcard(variables))
            block.addField("star", "*")
        else
            block.addItems("template", variables as SparqlJS.VariableTerm[], this.varOrIriItem, this)

        return block
    }
    private ask(query: SparqlJS.AskQuery): Block {
        return new Block("askquery", this.queryCommon(query))
    }
    // #endregion

    // #region Update
    private update(query: SparqlJS.Update): Block {
        const block = new Block("update")

        block.addItems("prologue", BlockGenerator.getPrologueItems(query), this.prologueItem, this)
        block.addItems("items", query.updates, this.updateItem, this)

        return block
    }
    private updateItem(update: SparqlJS.UpdateOperation): Block {
        if ("type" in update)
            return new Block("updateitem", this.managementOperation(update))
        else
            return new Block("updateitem", this.insertDeleteOperation(update))
    }
    private managementOperation(update: SparqlJS.ManagementOperation): Block {
        switch (update.type) {
            case "clear":
            case "drop":
                return this.clearDrop(update)

            case "add":
            case "move":
            case "copy":
                return this.addMoveCopy(update)

            case "load":
                return this.load(update)

            case "create":
                return this.create(update)
        }
    }
    private insertDeleteOperation(update: SparqlJS.InsertDeleteOperation): Block {
        switch (update.updateType) {
            case "insert":
            case "delete":
            case "deletewhere":
                return this.insertDeleteWhere(update)

            case "insertdelete":
                return this.modify(update)
        }
    }
    private clearDrop(update: SparqlJS.ClearDropOperation): Block {
        const block = new Block("cleardrop")

        block.addValue("graph", this.graphRefAll(update.graph))
        block.addField("operator", update.type.toUpperCase())
        if (update.silent) block.addField("silent", "SILENT")

        return block
    }
    private addMoveCopy(update: SparqlJS.CopyMoveAddOperation): Block {
        const block = new Block("addmovecopy")

        block.addValue("source", this.graphRefAll(update.source))
        block.addValue("destination", this.graphRefAll(update.destination))
        block.addField("operator", update.type.toUpperCase())
        if (update.silent) block.addField("silent", "SILENT")

        return block
    }
    private load(update: SparqlJS.LoadOperation): Block {
        const block = new Block("load")

        block.addValue("source", this.namedNode(update.source))
        if (update.destination) block.addValue("destination", this.graphRef(update.destination as SparqlJS.IriTerm))
        if (update.silent) block.addField("silent", "silent")

        return block
    }
    private create(update: SparqlJS.CreateOperation): Block {
        const block = new Block("create")

        block.addValue("graph", this.graphRef(update.graph.name))
        if (update.silent) block.addField("silent", "silent")

        return block
    }
    private insertDeleteWhere(update: SparqlJS.InsertDeleteOperation): Block {
        const block = new Block("insertdeletewhere")

        block.addValue("pattern", this.quadPattern(update.insert ?? update.delete))
        block.addField("operator", update.updateType.replace("insert", "INSERT DATA").replace("deletewhere", "DELETE WHERE").replace("delete", "DELETE DATA"))

        return block
    }
    private quadPattern(items: SparqlJS.Quads[]): Block {
        const block = new Block("quadpattern")

        block.addItems("items", [...BlockGenerator.normaliseQuads(items)], this.quadPatternItem, this)

        return block
    }
    private quadPatternItem(item: Quads): Block {
        if (item.type === "triplesSameSubject")
            return new Block("quadpatternitem", this.triplesSameSubject(item))
        else
            return new Block("quadpatternitem", this.quadsNotTriples(item))
    }
    private quadsNotTriples(item: SparqlJS.GraphQuads): Block {
        const results = []
        for (const [subject, predicates] of BlockGenerator.toTriplesSameSubject(item.triples)) {
            results.push({ type: "triplesSameSubject", subject, predicates })
        }

        const block = new Block("quadsnottriples")

        block.addValue("name", this.term(item.name))
        block.addItems("triples", results, this.triplesSameSubjectItem, this)

        return block
    }
    private modify(update: SparqlJS.InsertDeleteOperation): Block {
        const block = new Block("modify")

        if (update.graph) block.addValue("iri", this.namedNode(update.graph))
        if (update.delete.length) block.addValue("delete", this.quadPattern(update.delete))
        if (update.insert.length) block.addValue("insert", this.quadPattern(update.insert))
        block.addValue("where", this.group(update.where))
        if (update.using) this.usings(block, update.using)

        return block
    }
    private graphRefAll(graph: SparqlJS.GraphReference): Block {
        if (graph.name)
            return this.graphRef(graph.name)
        else if (graph.all)
            return new Block("graphrefallall")
        else if (graph.default)
            return new Block("graphordefault")
        else if (graph.named)
            return new Block("graphrefallnamed")
    }
    private graphRef(iri: SparqlJS.IriTerm): Block {
        return new Block("graphref", this.namedNode(iri))
    }
    private usings(block: Block, from: Using): void {
        const convert = (isNamed, iri) => [isNamed, iri]
        const namedGraphs = from.named.map(convert.bind(null, true))
        const iris = from.default.map(convert.bind(null, false))

        block.addItems("using", iris.concat(namedGraphs), this.using, this)
    }
    private using([isNamed, iri]: [boolean, SparqlJS.IriTerm]): Block {
        if (isNamed)
            return new Block("usingclause", this.named(iri))
        else
            return new Block("usingclause", this.namedNode(iri))
    }
    // #endregion

    // #region Patterns
    private pattern(pattern: Pattern): Block {
        if ("queryType" in pattern)
            return this.subSelect(pattern)
        else
            switch (pattern.type) {
                case "group":
                    return this.group(pattern.patterns)

                case "values":
                    return this.values(pattern.values)

                default:
                    return this[pattern.type](pattern)
            }
    }
    private group(patterns: SparqlJS.Pattern[]): Block {
        const normalisedPatterns = BlockGenerator.normalisePatterns(patterns)

        if (normalisedPatterns.size === 0)
            return new Block("groupgraphpattern")
        else if (isSingle(normalisedPatterns))
            return new Block("groupgraphpattern", this.pattern(first(normalisedPatterns)))
        else if (normalisedPatterns.size > 1)
            return new Block("groupgraphpattern", this.groupGraphPatternSub([...normalisedPatterns]))
    }
    private groupGraphPatternSub(patterns: Pattern[]): Block {
        const block = new Block("groupgraphpatternsub")

        block.addItems("items", patterns, this.groupSubItem, this)

        return block
    }
    private bind(pattern: SparqlJS.BindPattern): Block {
        return new Block("bind", this.expressionAsVar(pattern.expression, pattern.variable))
    }
    private service(pattern: SparqlJS.ServicePattern): Block {
        const block = new Block("servicegraphpattern")

        block.addValue("iri", this.term(pattern.name))
        block.addValue("patterns", this.group(pattern.patterns))
        block.addField("silent", pattern.silent ? "SILENT" : "")

        return block
    }
    private optional(pattern: SparqlJS.OptionalPattern): Block {
        return new Block("optionalgraphpattern", this.group(pattern.patterns))
    }
    private graph(pattern: SparqlJS.GraphPattern): Block {
        const block = new Block("graphgraphpattern")

        block.addValue("iri", this.term(pattern.name))
        block.addValue("patterns", this.group(pattern.patterns))

        return block
    }
    private filter(pattern: SparqlJS.FilterPattern): Block {
        if (
            "termType" in pattern.expression
            || "operator" in pattern.expression && ["||", "&&", "=", "!=", "<", ">", "<=", ">=", "in", "notin", "!", "+", "UMINUS", "*", "/"].includes(pattern.expression.operator)) {
            return new Block("filter", this.bracketted(pattern.expression))
        }
        else {
            return new Block("filter", this.expression(pattern.expression))
        }
    }
    private minus(pattern: SparqlJS.MinusPattern): Block {
        return new Block("minusgraphpattern", this.group(pattern.patterns))
    }
    private union(pattern: SparqlJS.UnionPattern): Block {
        const block = new Block("grouporuniongraphpattern")

        block.addItems("items", pattern.patterns, this.groupItem, this)

        return block
    }
    private triplesSameSubject(pattern: TriplesSameSubjectPattern): Block {
        const block = new Block("triplessamesubject")

        block.addValue("subject", this.term(pattern.subject))
        block.addItems("predicates", [...pattern.predicates.entries()], this.propertyList, this)

        return block
    }
    private subSelect(query: SparqlJS.SelectQuery): Block {
        const block = new Block("subselect")

        block.addValue("select", this.selectClause(query))
        block.addValue("pattern", this.group(query.where))
        if (query.values) block.addValue("values", this.values(query.values))
        block.addValue("modifiers", this.solutionModifiers(query))

        return block
    }
    private solutionModifiers(query: SparqlJS.Query): Block {
        if (query.group || query.having || query.order || "limit" in query || "offset" in query) {
            const block = new Block("solutionmodifier")

            if ("limit" in query) block.addValue("limit", this.numeric(query.limit.toString()))
            if ("offset" in query) block.addValue("offset", this.numeric(query.offset.toString()))
            if (query.group) block.addItems("group", query.group, this.groupingItem, this)
            if (query.having) block.addItems("having", query.having, this.havingItem, this)
            if (query.order) block.addItems("order", query.order, this.orderItem, this)

            return block
        }
    }
    private collection(pattern: CollectionPattern): Block {
        const block = new Block("collection")

        block.addItems("items", pattern.items, this.graphNodeItem, this)

        return block
    }
    // #endregion

    // #region Paths
    private verb(verb: Verb): Block {
        if ("pathType" in verb)
            return this.path(verb)
        else if (verb.value === RDF.type)
            return new Block("a")
        else
            return this.term(verb)
    }
    private path(path: SparqlJS.PropertyPath): Block {
        switch (path.pathType) {
            case "|":
                return this.pathAlternative(path)
                break

            case "/":
                return this.pathSequence(path)
                break

            case "^":
                return this.pathInverse(path)
                break

            case "?":
            case "+":
            case "*":
                return this.pathModifier(path)
                break

            case "!":
                return this.pathNegated(path)
                break
        }
    }
    private pathAlternative(path: SparqlJS.PropertyPath): Block {
        const block = new Block("pathalternative")

        block.addItems("items", path.items, this.pathAlternativeItem, this)

        return block
    }
    private pathSequence(path: SparqlJS.PropertyPath): Block {
        const block = new Block("pathsequence")

        block.addItems("items", path.items, this.pathSequenceItem, this)

        return block
    }
    private pathModifier(path: SparqlJS.PropertyPath): Block {
        const block = new Block("pathwithmodifier")

        const verb = first(path.items)
        if ("pathType" in verb && ["/", "|", "^"].includes(verb.pathType))
            block.addValue("value", this.brackettedPath(verb))
        else
            block.addValue("value", this.verb(verb))

        block.addField("modifier", path.pathType)

        return block
    }
    private pathInverse(path: SparqlJS.PropertyPath): Block {
        const block = new Block("inversepath")

        const verb = first(path.items)
        if ("pathType" in verb && ["/", "|"].includes(verb.pathType))
            block.addValue("value", this.brackettedPath(verb))
        else
            block.addValue("value", this.verb(verb))

        return block
    }
    private pathNegated(path: SparqlJS.PropertyPath): Block {
        const verb = first(path.items)

        if ("pathType" in verb)
            switch (verb.pathType) {
                case "|":
                    return new Block("negatedpath", this.pathOneInPropertySetAlternative(verb))

                case "^":
                    return new Block("negatedpath", this.inversePathOneInPropertySet(verb))
            }
        else
            return this.verb(verb)
    }
    private inversePathOneInPropertySet(verb: SparqlJS.PropertyPath): Block {
        return new Block("inversepathoneinpropertyset", this.verb(first(verb.items)))
    }
    private pathOneInPropertySetAlternative(verb: SparqlJS.PropertyPath): Block {
        const block = new Block("pathoneinpropertysetalternative")

        block.addItems("items", verb.items, this.pathOneInPropertySetAlternativeItem, this)

        return block
    }
    private brackettedPath(verb: Verb): Block {
        return new Block("bracketedpath", this.verb(verb))
    }
    // #endregion

    // #region Clauses
    private prefix([prefix, namespace]: [string, string]): Block {
        this.prefixes.set(namespace, prefix)

        if (prefix)
            return this.prefixDecl(prefix, namespace)
        else
            return this.prefixDeclDefault(namespace)
    }
    private prefixDecl(prefix: string, value: string): Block {
        const block = new Block("prefixdecl", this.iriref(value))

        block.addField("prefix", prefix)

        return block
    }
    private prefixDeclDefault(value: string): Block {
        return new Block("prefixdecldefault", this.iriref(value))
    }
    private base(value: string): Block {
        this.baseUri = value;

        return new Block("base", this.iriref(value))
    }
    private queryCommon(query: SparqlJS.Query): Block {
        const block = new Block("querycommon")

        block.addValue("pattern", this.group(query.where))
        block.addValue("modifiers", this.solutionModifiers(query))
        if (query.from) this.dataset(block, query.from)

        return block
    }
    private dataset(block: Block, from) {
        const convert = (isNamed, iri) => [isNamed, iri]
        const namedGraphs = from.named.map(convert.bind(null, true))
        const iris = from.default.map(convert.bind(null, false))

        block.addItems("datasets", iris.concat(namedGraphs), this.from, this)
    }
    private from([isNamed, iri]: [boolean, SparqlJS.IriTerm]): Block {
        if (isNamed)
            return new Block("datasetclause", this.named(iri))
        else
            return new Block("datasetclause", this.namedNode(iri))
    }
    private named(iri: SparqlJS.IriTerm): Block {
        return new Block("namedgraphclause", this.namedNode(iri))
    }
    private selectClause(query: SparqlJS.SelectQuery): Block {
        const block = new Block("selectclause")

        if (query.distinct) block.addField("distinctOrReduced", "DISTINCT")
        if (query.reduced) block.addField("distinctOrReduced", "REDUCED")

        const variables = query.variables
        if (BlockGenerator.isWildcard(variables))
            block.addField("star", "*")
        else
            block.addItems("vars", variables, this.varOrExpressionAsVarItem, this)

        return block
    }
    private values(rows: SparqlJS.ValuePatternRow[]): Block {
        const variables = rows.reduce((a, b) => Object.keys(b), []).map(stringToVariable)
        const values = rows.map(Object.values)

        if (isSingle(variables))
            return new Block("inlinedata", this.inlineDataOneVar(first(variables), values.flat()))
        else
            return new Block("inlinedata", this.inlineDataFull(variables, values))
    }
    private inlineDataOneVar(variable: SparqlJS.VariableTerm, values: Value[][]): Block {
        const block = new Block("inlinedataonevar")

        block.addValue("variable", this.variable(variable))
        block.addItems("values", values.flat(), this.dataBlockValueItem, this)

        return block
    }
    private inlineDataFull(variables: SparqlJS.VariableTerm[], values: Value[][]): Block {
        const block = new Block("inlinedatafull")

        block.addItems("variables", variables, this.variableItem, this)
        block.addItems("values", values, this.dataBlockValuesItem, this)

        return block
    }
    private expressionAsVar(expression: SparqlJS.Expression, variable: SparqlJS.VariableTerm): Block {
        const block = new Block("expressionasvar", this.expression(expression))

        block.addValue("name", this.variable(variable))

        return block
    }
    private descending(expression: SparqlJS.Expression): Block {
        const block = new Block("ordercondition", this.bracketted(expression))

        block.addField("operator", "DESC")

        return block
    }
    // #endregion

    // #region Expressions
    private expression(expression: SparqlJS.Expression): Block {
        if ("type" in expression)
            return this[expression.type](expression)
        else if ("termType" in expression)
            return this.term(expression)
    }
    private operation(expression: SparqlJS.OperationExpression): Block {
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
            case "UMINUS":
                return this.unibinary(expression)

            case "notin":
            case "in":
                return this.in(expression)

            case "bound":
                return this.bound(expression)

            case "exists":
            case "notexists":
                return this.exists(expression)

            case "concat":
            case "coalesce":
                return this.builtInCallN(expression)

            default:
                return this[`builtInCall${expression.args.length}`](expression)
        }
    }
    private functionCall(expression: SparqlJS.FunctionCallExpression): Block {
        const block = new Block("iriorfunction")

        block.addValue("iri", this.namedNode(expression.function))
        if (expression.distinct) block.addField("distinct", "DISTINCT")
        block.addItems("args", expression.args, this.expressionListItem, this)

        return block
    }
    private aggregate(expression: SparqlJS.AggregateExpression): Block {
        switch (expression.aggregation) {
            case "sum":
            case "min":
            case "max":
            case "avg":
            case "sample":
                return this.aggregateCommon(expression)

            default:
                return this[expression.aggregation](expression)
        }
    }
    private exists(expression: SparqlJS.OperationExpression): Block {
        const block = new Block("exists")

        const args = expression.args as SparqlJS.Pattern[]
        const arg = first(args)

        if (arg.type === "group")
            block.addValue("value", this.pattern(arg))
        else
            block.addValue("value", this.group(expression.args as SparqlJS.Pattern[]))

        block.addField("operator", expression.operator.toUpperCase().replace("NOTEXISTS", "NOT EXISTS"))

        return block
    }
    private builtInCall0(expression: SparqlJS.OperationExpression): Block {
        const block = new Block("builtincall0")

        block.addField("operator", expression.operator.toUpperCase())

        return block
    }
    private builtInCall1(expression: SparqlJS.OperationExpression): Block {
        const block = new Block("builtincall1")

        block.addValue("arg1", this.expression(first(expression.args)))
        block.addField("operator", expression.operator.toUpperCase())

        return block
    }
    private builtInCall2(expression: SparqlJS.OperationExpression): Block {
        const block = new Block("builtincall2")

        block.addValue("arg1", this.expression(expression.args[0]))
        block.addValue("arg2", this.expression(expression.args[1]))
        block.addField("operator", expression.operator.toUpperCase())

        return block
    }
    private builtInCall3(expression: SparqlJS.OperationExpression): Block {
        const block = new Block("builtincall3")

        block.addValue("arg1", this.expression(expression.args[0]))
        block.addValue("arg2", this.expression(expression.args[1]))
        block.addValue("arg3", this.expression(expression.args[2]))
        block.addField("operator", expression.operator.toUpperCase())

        return block
    }
    private builtInCall4(expression: SparqlJS.OperationExpression): Block {
        const block = new Block("builtincall4")

        block.addValue("arg1", this.expression(expression.args[0]))
        block.addValue("arg2", this.expression(expression.args[1]))
        block.addValue("arg3", this.expression(expression.args[2]))
        block.addValue("arg4", this.expression(expression.args[3]))
        block.addField("operator", expression.operator.toUpperCase())

        return block
    }
    private builtInCallN(expression: SparqlJS.OperationExpression): Block {
        const block = new Block("builtincalln")

        block.addField("operator", expression.operator.toUpperCase())
        block.addItems("args", expression.args, this.expressionListItem, this)

        return block
    }
    private bound(expression: SparqlJS.OperationExpression): Block {
        return new Block("bound", this.expression(first(expression.args)))
    }
    private bracketted(expression: SparqlJS.Expression): Block {
        return new Block("brackettedexpression", this.expression(expression))
    }
    private unibinary(expression: SparqlJS.OperationExpression, hierarchy: OperatorHierarchy = BlockGenerator.hierarchy): Block {
        const [name, definition] = deconstruct(hierarchy)

        if (definition.operators.includes(expression.operator)) {
            const block = new Block(name)

            block.addValue("left", this.bracketArgument(expression.args[0], definition))

            if (expression.args.length > 1) {
                block.addValue("right", this.bracketArgument(expression.args[1], definition))
            }

            if (!["&&", "||"].includes(expression.operator)) block.addField("operator", expression.operator)

            return block
        }
        else {
            return this.unibinary(expression, definition.higher)
        }
    }
    private bracketArgument(argument: SparqlJS.Expression, definition: OperatorDefinition = BlockGenerator.hierarchy.unaryexpression): Block {
        if ("operator" in argument) {
            if (definition.operators.includes(argument.operator)) {
                // Equal or lower precedence operation needs bracketting
                return this.bracketted(argument)
            }

            if (definition.higher) {
                // Check higher precedence operations
                const [, higher] = deconstruct(definition.higher)
                return this.bracketArgument(argument, higher)
            }
        }

        // Term or higher precendence operation doesn't need bracketting
        return this.expression(argument)
    }
    private in(expression: SparqlJS.OperationExpression): Block {
        const block = new Block("relationalexpressionin")

        block.addValue("left", this.expression(expression.args[0]))
        block.addField("operator", expression.operator.toUpperCase().replace("NOTIN", "NOT IN"))
        block.addItems("right", expression.args[1] as SparqlJS.Expression[], this.expressionListItem, this)

        return block
    }
    private group_concat(aggregate: SparqlJS.AggregateExpression): Block {
        const block = new Block("group_concat")

        block.addValue("arg1", this.expression(aggregate.expression))
        block.addValue("separator", this.string(aggregate.separator))
        if (aggregate.distinct) block.addField("distinct", "DISTINCT")

        return block
    }
    private count(aggregate: SparqlJS.AggregateExpression): Block {
        const block = new Block("count")

        if (aggregate.distinct) block.addField("distinct", "DISTINCT")
        if (aggregate.expression instanceof SparqlJS.Wildcard)
            block.addField("star", "*")
        else
            block.addValue("arg1", this.expression(aggregate.expression))


        return block
    }
    private aggregateCommon(aggregate: SparqlJS.AggregateExpression): Block {
        const block = new Block("aggregate")

        block.addValue("arg1", this.expression(aggregate.expression))
        block.addField("operator", aggregate.aggregation.toUpperCase())
        if (aggregate.distinct) block.addField("distinct", "DISTINCT")

        return block
    }
    // #endregion

    // #region Terms
    private term(term: SparqlJS.Term): Block {
        if (term.value === RDF.nil)
            return new Block("nil")
        else
            return this[toCamel(term.termType)](term);
    }
    private namedNode(term: SparqlJS.IriTerm): Block {
        for (const [namespace, prefix] of this.prefixes)
            if (term.value.startsWith(namespace)) {
                const localName = term.value.replace(namespace, "");

                if (prefix)
                    if (localName)
                        return this.prefixedNamePrefixLocalName(prefix, localName)
                    else
                        return this.prefixedNamePrefix(prefix)
                else
                    if (localName)
                        return this.prefixedNameLocalName(localName)
                    else
                        return this.prefixedName()
            }

        if (this.baseUri)
            if (term.value.startsWith(this.baseUri)) {
                const iri = term.value.replace(this.baseUri, "")

                if (iri)
                    return this.iriref(iri)
                else
                    return new Block("irirefdefault")
            }

        return this.iriref(term.value)
    }
    private quad(term: SparqlJS.QuadTerm): Block {
        const block = new Block("embtp")

        block.addValue("subject", this.term(term.subject))
        block.addValue("predicate", this.verb(term.predicate))
        block.addValue("object", this.term(term.object))

        return block;
    }
    private prefixedName(): Block {
        return new Block("prefixedname")
    }
    private prefixedNameLocalName(localName: string): Block {
        const block = new Block("prefixednamelocalname")

        block.addField("localName", localName)

        return block;
    }
    private prefixedNamePrefix(prefix: string): Block {
        const block = new Block("prefixednameprefix")

        block.addField("prefix", prefix)

        return block;
    }
    private prefixedNamePrefixLocalName(prefix: string, localName: string): Block {
        const block = new Block("prefixednameprefixlocalname")

        block.addField("localName", localName)
        block.addField("prefix", prefix)

        return block;
    }
    private iriref(iri: string): Block {
        return new Block("iriref", iri)
    }
    private blankNode(term: SparqlJS.BlankTerm): Block {
        return new Block("blanknodelabel", term.value)
    }
    private literal(term: SparqlJS.LiteralTerm): Block {
        switch (term.datatype.value) {
            case XSD.string:
                return this.string(term.value)

            case XSD.integer:
            case XSD.decimal:
            case XSD.double:
                return this.numeric(term.value)

            case XSD.boolean:
                return this.boolean(term)

            case RDF.langString:
                return this.langString(term)

            default:
                return this.typedLiteral(term)
        }
    }
    private string(value: string): Block {
        return new Block("string", value)
    }
    private langString(term: SparqlJS.LiteralTerm): Block {
        const block = new Block("langstring", this.string(term.value))

        block.addField("language", term.language)

        return block
    }
    private numeric(value: string): Block {
        return new Block("numericliteral", value)
    }
    private boolean(term: SparqlJS.LiteralTerm): Block {
        return new Block("booleanliteral", term.value.toUpperCase())
    }
    private typedLiteral(term: SparqlJS.LiteralTerm): Block {
        const block = new Block("typedliteral", this.string(term.value))

        block.addValue("datatype", this.namedNode(term.datatype))

        return block
    }
    private variable(term: SparqlJS.VariableTerm): Block {
        return new Block("var1", term.value);
    }
    // #endregion

    // #region Collection items
    private dataBlockValueItem(item: Value): Block {
        if (item)
            return new Block("datablockvalueitem", this.term(item))
        else
            return new Block("datablockvalueitem", new Block("undef"))
    }
    private dataBlockValuesItem(values: Value[]): Block {
        const block = new Block("datablockvaluesitem")

        block.addItems("items", values, this.dataBlockValueItem, this)

        return block
    }
    private prologueItem(item: string | [string, string]): Block {
        if (item instanceof Array)
            return new Block("prologueitem", this.prefix(item))
        else
            return new Block("prologueitem", this.base(item))
    }
    private varOrExpressionAsVarItem(variable: SparqlJS.Variable): Block {
        if ("expression" in variable)
            return new Block("varorexpressionasvaritem", this.expressionAsVar(variable.expression, variable.variable))
        else
            return new Block("varorexpressionasvaritem", this.variable(variable))
    }
    private groupItem(pattern: SparqlJS.Pattern): Block {
        if (pattern.type === "group")
            return new Block("groupgraphpatternitem", this.pattern(pattern))
        else
            return new Block("groupgraphpatternitem", this.group([pattern]))
    }
    private variableItem(variable: SparqlJS.VariableTerm): Block {
        return new Block("varitem", this.variable(variable))
    }
    private groupSubItem(pattern: Pattern): Block {
        return new Block("groupgraphpatternsubitem", this.pattern(pattern))
    }
    private propertyList([property, objects]: [Verb, ObjectList]): Block {
        const block = new Block("propertylistnotempty")

        block.addValue("predicate", this.verb(property))
        block.addItems("objects", [...objects], this.objectListItem, this)

        return block
    }
    private objectListItem(object: SparqlJS.Term): Block {
        return new Block("objectlistitem", this.term(object))
    }
    private expressionListItem(expression: SparqlJS.Expression): Block {
        return new Block("expressionlistitem", this.expression(expression))
    }
    private pathAlternativeItem(verb: Verb): Block {
        return new Block("pathalternativeitem", this.verb(verb))
    }
    private pathSequenceItem(verb: Verb): Block {
        if ("pathType" in verb && verb.pathType === "|")
            return new Block("pathsequencitem", this.brackettedPath(verb))
        else
            return new Block("pathsequencitem", this.verb(verb))
    }
    private pathOneInPropertySetAlternativeItem(verb: Verb): Block {
        if ("pathType" in verb && verb.pathType === "^")
            return new Block("pathoneinpropertysetalternativeitem", this.inversePathOneInPropertySet(verb))
        else
            return new Block("pathoneinpropertysetalternativeitem", this.verb(verb))
    }
    private varOrIriItem(term: SparqlJS.Term): Block {
        return new Block("varoririitem", this.term(term))
    }
    private triplesSameSubjectItem(pattern: TriplesSameSubjectPattern): Block {
        return new Block("triplessamesubjectitem", this.triplesSameSubject(pattern))
    }
    private groupingItem(item: SparqlJS.Grouping): Block {
        if ("variable" in item)
            return new Block("groupconditionitem", this.expressionAsVar(item.expression, item.variable))
        else
            return new Block("groupconditionitem", this.expression(item.expression))
    }
    private havingItem(item: SparqlJS.Expression): Block {
        if ("termType" in item)
            return new Block("havingconditionitem", this.bracketted(item))
        else
            return new Block("havingconditionitem", this.bracketArgument(item))
    }
    private orderItem(item: SparqlJS.Ordering): Block {
        if (item.descending)
            return this.descending(item.expression)
        else if ("termType" in item.expression)
            if (item.expression.termType === "Variable")
                return new Block("orderconditionitem", this.term(item.expression as SparqlJS.Term))
            else
                return new Block("orderconditionitem", this.bracketted(item.expression))
        else
            return new Block("orderconditionitem", this.bracketArgument(item.expression))
    }
    private graphNodeItem(object: SparqlJS.Term): Block {
        return new Block("graphnodeitem", this.term(object))
    }
    // #endregion

    private static isSimpleConstruct(query: SparqlJS.ConstructQuery): boolean {
        if (isSingle(query.where)) {
            const pattern = first(query.where)

            if (pattern.type === "bgp") {
                return JSON.stringify(query.template) === JSON.stringify(pattern.triples)
            }
        }
    }
    private static getPrologueItems(query: SparqlJS.SparqlQuery): (string | [string, string])[] {
        const items = []

        if (query.base) {
            items.push(query.base)
        }

        if (query.prefixes) {
            Object.entries(query.prefixes).forEach(entry => items.push(entry))
        }

        return items
    }
    private static isWildcard(variables: SparqlJS.Variable[] | [SparqlJS.Wildcard]): variables is [SparqlJS.Wildcard] {
        return variables[0] instanceof SparqlJS.Wildcard
    }
    private static toTriplesSameSubject(triples: SparqlJS.Triple[]): TriplesSameSubject {
        const process = (subjects: TriplesSameSubject, triple: SparqlJS.Triple) => {
            if (!subjects.has(triple.subject)) {
                subjects.set(triple.subject, new StringifiedMap)
            }

            const subject = subjects.get(triple.subject)
            if (!subject.has(triple.predicate)) {
                subject.set(triple.predicate, new TermSet)
            }

            const predicate = subject.get(triple.predicate)
            predicate.add(triple.object)

            return subjects
        }

        return triples.reduce(process, new TermMap)
    }
    private static normalisePatterns(patterns: SparqlJS.Pattern[]): Set<Pattern> {
        const process = (results: Set<Pattern>, pattern: SparqlJS.Pattern) => {
            if (pattern.type === "bgp") {
                //Visitor.y(pattern.triples)
                const triplesSameSubject = this.toTriplesSameSubject(pattern.triples ?? [])

                for (const [subject, predicates] of triplesSameSubject) {
                    results.add({ type: "triplesSameSubject", subject, predicates })
                }
            }
            else {
                results.add(pattern)
            }

            return results
        }

        return Array.from(patterns).reduce(process, new Set)
    }
    private static normaliseQuads(quads: SparqlJS.Quads[]): Set<Quads> {
        const process = (results: Set<Quads>, pattern: SparqlJS.Quads) => {
            if (pattern.type === "bgp") {
                const triplesSameSubject = this.toTriplesSameSubject(pattern.triples)

                for (const [subject, predicates] of triplesSameSubject) {
                    results.add({ type: "triplesSameSubject", subject, predicates })
                }
            }
            else {
                results.add(pattern)
            }

            return results
        }

        return quads.reduce(process, new Set)
    }
}

function toCamel(value: string): string {
    return value.charAt(0).toLowerCase() + value.substr(1)
}
function stringToVariable(s: string): SparqlJS.VariableTerm {
    return {
        value: s.replace("?", ""),
        termType: null,
        equals: null
    }
}
function isSingle<T>(collection: T[] | Set<T>): collection is [T] {
    return collection instanceof Array ?
        collection.length === 1 :
        collection.size === 1
}
function first<T>(collection: T[] | Set<T>): T {
    return collection instanceof Array ?
        collection[0] :
        collection.values().next().value
}
function deconstruct<T>(hierarchy: { [key: string]: T }): [string, T] {
    return first(Object.entries(hierarchy))
}
