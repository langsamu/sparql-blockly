import type * as T12 from "@traqula/rules-sparql-1-2"
import type { serialization } from "blockly"
import { AstFactory } from "@traqula/rules-sparql-1-2"
import { CommonIRIs } from "@traqula/rules-sparql-1-1"
import type { OperatorDefinition, OperatorHierarchy } from "./aliases.ts"
import { block, chain, wrap } from "./blocks.ts"

const F = new AstFactory()

type State = serialization.blocks.State

type DataValue = T12.TermIri | T12.TermLiteral | undefined

const shortForms: Record<string, RegExp> = {
    [CommonIRIs.INTEGER]: /^[+-]?[0-9]+$/,
    [CommonIRIs.DECIMAL]: /^[+-]?[0-9]*\.[0-9]+$/,
    [CommonIRIs.DOUBLE]: /^[+-]?([0-9]+\.[0-9]*|\.?[0-9]+)[eE][+-]?[0-9]+$/,
    [CommonIRIs.BOOLEAN]: /^(true|false)$/,
}

const unsupportedOperators = ["langdir", "strlangdir", "haslang", "haslangdir", "istriple", "triple", "subject", "predicate", "object"]

export default class BlockGenerator {
    private static dataOperators = {
        insertdata: "INSERT DATA",
        deletedata: "DELETE DATA",
        deletewhere: "DELETE WHERE"
    }
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
                                    operators: ["=", "!=", "<", ">", "<=", ">=", "in", "notin"],
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

    public visit(node: T12.SparqlQuery): State {
        switch (node.type) {
            case "query":
                return this.query(node)

            case "update":
                return this.update(node)
        }
    }

    // #region Queries
    private query(query: T12.Query): State {
        return block("sparql11_query", {
            inputs: {
                prologue: { block: chain(query.context.map(i => this.prologueItem(i))) },
                value: { block: this.queryType(query) },
                values: { block: query.values && this.values(query.values) }
            }
        })
    }
    private queryType(query: T12.Query): State {
        switch (query.subType) {
            case "select":
                return this.select(query)

            case "construct":
                return this.construct(query)

            case "describe":
                return this.describe(query)

            case "ask":
                return this.ask(query)
        }
    }
    private select(query: T12.QuerySelect): State {
        return block("sparql11_selectquery", {
            inputs: {
                select: { block: this.selectClause(query) },
                where: { block: this.queryCommon(query) }
            }
        })
    }
    private construct(query: T12.QueryConstruct): State {
        const template = BlockGenerator.splitBgp(query.template).map(slice => slice.triples)

        if (F.isSourceLocationNoMaterialize(query.where.loc)) {
            return block("sparql11_simpleconstructquery", {
                inputs: {
                    modifiers: { block: this.solutionModifiers(query.solutionModifiers) },
                    where: { block: chain(template.map(i => this.triplesSameSubjectItem(i))) },
                    datasets: { block: chain(query.datasets.clauses.map(i => this.from(i))) }
                }
            })
        }
        else {
            return block("sparql11_constructquery", {
                inputs: {
                    where: { block: this.queryCommon(query) },
                    template: { block: chain(template.map(i => this.triplesSameSubjectItem(i))) }
                }
            })
        }
    }
    private describe(query: T12.QueryDescribe): State {
        const variables = query.variables

        return block("sparql11_describequery", {
            fields: {
                star: variables[0].type === "wildcard" ? "*" : undefined
            },
            inputs: {
                where: { block: query.where ? this.queryCommon(query) : undefined },
                subject: {
                    block: variables[0].type === "wildcard"
                        ? undefined
                        : chain((variables as (T12.TermVariable | T12.TermIri)[]).map(i => this.varOrIriItem(i)))
                }
            }
        })
    }
    private ask(query: T12.QueryAsk): State {
        return wrap("sparql11_askquery", this.queryCommon(query))
    }
    private subSelect(query: T12.SubSelect): State {
        return block("sparql11_subselect", {
            inputs: {
                select: { block: this.selectClause(query) },
                pattern: { block: this.group(query.where.patterns) },
                values: { block: query.values && this.values(query.values) },
                modifiers: { block: this.solutionModifiers(query.solutionModifiers) }
            }
        })
    }
    private queryCommon(query: T12.Query): State {
        return block("sparql11_querycommon", {
            inputs: {
                pattern: { block: this.group(query.where.patterns) },
                modifiers: { block: this.solutionModifiers(query.solutionModifiers) },
                datasets: { block: chain(query.datasets.clauses.map(i => this.from(i))) }
            }
        })
    }
    // #endregion

    // #region Update
    private update(update: T12.Update): State {
        return block("sparql11_update", {
            inputs: {
                prologue: { block: chain(update.updates.flatMap(item => item.context).map(i => this.prologueItem(i))) },
                items: { block: chain(update.updates.flatMap(item => item.operation ?? []).map(i => this.updateItem(i))) }
            }
        })
    }
    private updateItem(operation: T12.UpdateOperation): State {
        return wrap("sparql11_updateitem", this.updateOperation(operation))
    }
    private updateOperation(operation: T12.UpdateOperation): State {
        switch (operation.subType) {
            case "clear":
            case "drop":
                return this.clearDrop(operation)

            case "add":
            case "move":
            case "copy":
                return this.addMoveCopy(operation)

            case "load":
                return this.load(operation)

            case "create":
                return this.create(operation)

            case "insertdata":
            case "deletedata":
            case "deletewhere":
                return this.insertDeleteWhere(operation)

            case "modify":
                return this.modify(operation)
        }
    }
    private clearDrop(operation: T12.UpdateOperationClear | T12.UpdateOperationDrop): State {
        return block("sparql11_cleardrop", {
            fields: {
                operator: operation.subType.toUpperCase(),
                silent: operation.silent ? "SILENT" : undefined
            },
            inputs: {
                graph: { block: this.graphRefAll(operation.destination) }
            }
        })
    }
    private addMoveCopy(operation: T12.UpdateOperationAdd | T12.UpdateOperationMove | T12.UpdateOperationCopy): State {
        return block("sparql11_addmovecopy", {
            fields: {
                operator: operation.subType.toUpperCase(),
                silent: operation.silent ? "SILENT" : undefined
            },
            inputs: {
                source: { block: this.graphRefAll(operation.source) },
                destination: { block: this.graphRefAll(operation.destination) }
            }
        })
    }
    private load(operation: T12.UpdateOperationLoad): State {
        return block("sparql11_load", {
            fields: {
                silent: operation.silent ? "SILENT" : undefined
            },
            inputs: {
                source: { block: this.namedNode(operation.source) },
                destination: { block: operation.destination && this.graphRef(operation.destination) }
            }
        })
    }
    private create(operation: T12.UpdateOperationCreate): State {
        return block("sparql11_create", {
            fields: {
                silent: operation.silent ? "SILENT" : undefined
            },
            inputs: {
                graph: { block: this.graphRef(operation.destination) }
            }
        })
    }
    private insertDeleteWhere(operation: T12.UpdateOperationInsertData | T12.UpdateOperationDeleteData | T12.UpdateOperationDeleteWhere): State {
        return block("sparql11_insertdeletewhere", {
            fields: {
                operator: BlockGenerator.dataOperators[operation.subType]
            },
            inputs: {
                pattern: { block: this.quadPattern(operation.data) }
            }
        })
    }
    private quadPattern(items: T12.Quads[]): State {
        return block("sparql11_quadpattern", {
            inputs: {
                items: { block: chain(BlockGenerator.normaliseQuads(items).map(i => this.quadPatternItem(i))) }
            }
        })
    }
    private quadPatternItem(item: T12.Quads): State {
        if (item.type === "graph")
            return wrap("sparql11_quadpatternitem", this.quadsNotTriples(item))
        else
            return wrap("sparql11_quadpatternitem", this.triplesSameSubject(item.triples))
    }
    private quadsNotTriples(item: T12.GraphQuads): State {
        return block("sparql11_quadsnottriples", {
            inputs: {
                name: { block: this.term(item.graph) },
                triples: { block: chain(BlockGenerator.splitBgp(item.triples).map(slice => slice.triples).map(i => this.triplesSameSubjectItem(i))) }
            }
        })
    }
    private modify(operation: T12.UpdateOperationModify): State {
        return block("sparql11_modify", {
            inputs: {
                iri: { block: operation.graph && this.namedNode(operation.graph) },
                delete: { block: operation.delete.length ? this.quadPattern(operation.delete) : undefined },
                insert: { block: operation.insert.length ? this.quadPattern(operation.insert) : undefined },
                where: { block: this.group(operation.where.patterns) },
                using: { block: chain(operation.from.clauses.map(i => this.using(i))) }
            }
        })
    }
    private graphRefAll(graph: T12.GraphRef): State {
        switch (graph.subType) {
            case "specific":
                return this.graphRef(graph)

            case "all":
                return block("sparql11_graphrefallall")

            case "default":
                return block("sparql11_graphordefault")

            case "named":
                return block("sparql11_graphrefallnamed")
        }
    }
    private graphRef(graph: T12.GraphRefSpecific): State {
        return wrap("sparql11_graphref", this.namedNode(graph.graph))
    }
    private using(clause: T12.DatasetClauses["clauses"][number]): State {
        return wrap("sparql11_usingclause", this.graphClauseValue(clause))
    }
    // #endregion

    // #region Patterns
    private pattern(pattern: T12.Pattern): State {
        if (pattern.type === "query")
            return this.subSelect(pattern)

        switch (pattern.subType) {
            case "bgp":
                return this.triplesSameSubject(pattern.triples)

            case "group":
                return this.group(pattern.patterns)

            case "values":
                return this.values(pattern)

            case "bind":
                return this.bind(pattern)

            case "service":
                return this.service(pattern)

            case "optional":
                return this.optional(pattern)

            case "graph":
                return this.graph(pattern)

            case "filter":
                return this.filter(pattern)

            case "minus":
                return this.minus(pattern)

            case "union":
                return this.union(pattern)
        }
    }
    private group(patterns: T12.Pattern[]): State {
        const normalisedPatterns = BlockGenerator.normalisePatterns(patterns)

        if (normalisedPatterns.length === 0)
            return block("sparql11_groupgraphpattern")
        else if (normalisedPatterns.length === 1)
            return wrap("sparql11_groupgraphpattern", this.pattern(normalisedPatterns[0]))
        else
            return wrap("sparql11_groupgraphpattern", this.groupGraphPatternSub(normalisedPatterns))
    }
    private groupGraphPatternSub(patterns: T12.Pattern[]): State {
        return block("sparql11_groupgraphpatternsub", {
            inputs: {
                items: { block: chain(patterns.map(i => this.groupSubItem(i))) }
            }
        })
    }
    private bind(pattern: T12.PatternBind): State {
        return wrap("sparql11_bind", this.expressionAsVar(pattern.expression, pattern.variable))
    }
    private service(pattern: T12.PatternService): State {
        return block("sparql11_servicegraphpattern", {
            fields: {
                silent: pattern.silent ? "SILENT" : undefined
            },
            inputs: {
                iri: { block: this.term(pattern.name) },
                patterns: { block: this.group(pattern.patterns) }
            }
        })
    }
    private optional(pattern: T12.PatternOptional): State {
        return wrap("sparql11_optionalgraphpattern", this.group(pattern.patterns))
    }
    private graph(pattern: T12.PatternGraph): State {
        return block("sparql11_graphgraphpattern", {
            inputs: {
                iri: { block: this.term(pattern.name) },
                patterns: { block: this.group(pattern.patterns) }
            }
        })
    }
    private filter(pattern: T12.PatternFilter): State {
        const expression = pattern.expression

        if (
            expression.type === "term"
            || expression.subType === "operation" && ["||", "&&", "=", "!=", "<", ">", "<=", ">=", "in", "notin", "!", "+", "-", "uminus", "uplus", "*", "/"].includes(expression.operator)) {
            return wrap("sparql11_filter", this.bracketted(expression))
        }
        else {
            return wrap("sparql11_filter", this.expression(expression))
        }
    }
    private minus(pattern: T12.PatternMinus): State {
        return wrap("sparql11_minusgraphpattern", this.group(pattern.patterns))
    }
    private union(pattern: T12.PatternUnion): State {
        return block("sparql11_grouporuniongraphpattern", {
            inputs: {
                items: { block: chain(pattern.patterns.map(i => this.groupItem(i))) }
            }
        })
    }
    private triplesSameSubject(triples: T12.BasicGraphPattern): State {
        const [head, ...tail] = triples

        if (head.type === "tripleCollection") {
            return block("sparql11_triplessamesubject", {
                inputs: {
                    subject: { block: this.graphNode(head) },
                    predicates: { block: chain(BlockGenerator.groupByPredicate(tail as T12.TripleNesting[]).map(i => this.propertyList(i))) }
                }
            })
        }
        else {
            return block("sparql11_triplessamesubject", {
                inputs: {
                    subject: { block: this.graphNode(head.subject) },
                    predicates: { block: chain(BlockGenerator.groupByPredicate(triples as T12.TripleNesting[]).map(i => this.propertyList(i))) }
                }
            })
        }
    }
    private tripleCollection(collection: T12.TripleCollection): State {
        switch (collection.subType) {
            case "list":
                return this.collection(collection)

            case "blankNodeProperties":
                return this.blankNodePropertyList(collection)

            case "reifiedTriple":
                return this.reifiedTriple(collection)
        }
    }
    private collection(collection: T12.TripleCollectionList): State {
        const items = collection.triples.filter(triple => this.isIri(triple.predicate, CommonIRIs.FIRST)).map(triple => triple.object)

        return block("sparql11_collection", {
            inputs: {
                items: { block: chain(items.map(i => this.graphNodeItem(i))) }
            }
        })
    }
    private blankNodePropertyList(collection: T12.TripleCollectionBlankNodeProperties): State {
        return block("sparql11_blanknodepropertylist", {
            inputs: {
                predicates: { block: chain(BlockGenerator.groupByPredicate(collection.triples).map(i => this.propertyList(i))) }
            }
        })
    }
    private reifiedTriple(collection: T12.TripleCollectionReifiedTriple): State {
        if (!F.isSourceLocationNoMaterialize(collection.identifier.loc))
            throw new Error("Unsupported syntax: explicit reifier")

        const triple = collection.triples[0]

        return block("sparql11_embtp", {
            inputs: {
                subject: { block: this.graphNode(triple.subject) },
                predicate: { block: this.verb(triple.predicate) },
                object: { block: this.graphNode(triple.object) }
            }
        })
    }
    // #endregion

    // #region Paths
    private verb(verb: T12.Path | T12.TermVariable): State {
        if (verb.type === "path")
            return this.path(verb)
        else if (this.isIri(verb, CommonIRIs.TYPE))
            return block("sparql11_a")
        else
            return this.term(verb)
    }
    private isIri(node: T12.Path | T12.Term, iri: string): boolean {
        return F.isTermNamed(node) && !F.isTermNamedPrefixed(node) && node.value === iri
    }
    private path(path: T12.PathPure): State {
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
    private pathAlternative(path: T12.PropertyPathChain): State {
        return block("sparql11_pathalternative", {
            inputs: {
                items: { block: chain(path.items.map(i => this.pathAlternativeItem(i))) }
            }
        })
    }
    private pathSequence(path: T12.PropertyPathChain): State {
        return block("sparql11_pathsequence", {
            inputs: {
                items: { block: chain(path.items.map(i => this.pathSequenceItem(i))) }
            }
        })
    }
    private pathModifier(path: T12.PathModified): State {
        const verb = path.items[0]

        return block("sparql11_pathwithmodifier", {
            fields: {
                modifier: path.subType
            },
            inputs: {
                value: {
                    block: verb.type === "path" && ["/", "|", "^"].includes(verb.subType)
                        ? this.brackettedPath(verb)
                        : this.verb(verb)
                }
            }
        })
    }
    private pathInverse(path: T12.PathModified): State {
        const verb = path.items[0]

        return wrap(
            "sparql11_inversepath",
            verb.type === "path" && ["/", "|"].includes(verb.subType)
                ? this.brackettedPath(verb)
                : this.verb(verb))
    }
    private pathNegated(path: T12.PathNegated): State {
        const verb = path.items[0]

        if (verb.type === "path")
            switch (verb.subType) {
                case "|":
                    return wrap("sparql11_negatedpath", this.pathOneInPropertySetAlternative(verb))

                case "^":
                    return wrap("sparql11_negatedpath", this.inversePathOneInPropertySet(verb))
            }
        else
            return wrap("sparql11_negatedpath", this.verb(verb))
    }
    private inversePathOneInPropertySet(verb: T12.PathNegatedElt): State {
        return wrap("sparql11_inversepathoneinpropertyset", this.verb(verb.items[0]))
    }
    private pathOneInPropertySetAlternative(verb: T12.PathAlternativeLimited): State {
        return block("sparql11_pathoneinpropertysetalternative", {
            inputs: {
                items: { block: chain(verb.items.map(i => this.pathOneInPropertySetAlternativeItem(i))) }
            }
        })
    }
    private brackettedPath(verb: T12.Path): State {
        return wrap("sparql11_bracketedpath", this.verb(verb))
    }
    // #endregion

    // #region Expressions
    private expression(expression: T12.Expression): State {
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
                return this.exists(expression)
        }
    }
    private operation(expression: T12.ExpressionOperation): State {
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

        if (expression.args.length > 4)
            throw new Error(`Unsupported number of arguments for ${expression.operator.toUpperCase()}: ${expression.args.length}`)

        return this.builtInCallFixed(expression)
    }
    private functionCall(expression: T12.ExpressionFunctionCall): State {
        return block("sparql11_iriorfunction", {
            fields: {
                distinct: expression.distinct ? "DISTINCT" : undefined
            },
            inputs: {
                iri: { block: this.namedNode(expression.function) },
                args: { block: chain(expression.args.map(i => this.expressionListItem(i))) }
            }
        })
    }
    private aggregate(expression: T12.ExpressionAggregate): State {
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
    private exists(expression: T12.ExpressionPatternOperation): State {
        return block("sparql11_exists", {
            fields: {
                operator: expression.operator.toUpperCase().replace("NOTEXISTS", "NOT EXISTS")
            },
            inputs: {
                value: { block: this.group(expression.args.patterns) }
            }
        })
    }
    private builtInCallFixed(expression: T12.ExpressionOperation): State {
        return block(`sparql11_builtincall${expression.args.length}`, {
            fields: {
                operator: expression.operator.toUpperCase()
            },
            inputs: Object.fromEntries(expression.args.map((arg, i) => [`arg${i + 1}`, { block: this.expression(arg) }]))
        })
    }
    private builtInCallN(expression: T12.ExpressionOperation): State {
        return block("sparql11_builtincalln", {
            fields: {
                operator: expression.operator.toUpperCase()
            },
            inputs: {
                args: { block: chain(expression.args.map(i => this.expressionListItem(i))) }
            }
        })
    }
    private bound(expression: T12.ExpressionOperation): State {
        return wrap("sparql11_bound", this.expression(expression.args[0]))
    }
    private bracketted(expression: T12.Expression): State {
        return wrap("sparql11_brackettedexpression", this.expression(expression))
    }
    private unibinary(expression: T12.ExpressionOperation, hierarchy: OperatorHierarchy = BlockGenerator.hierarchy): State {
        const [name, definition] = Object.entries(hierarchy)[0]

        if (definition.operators.includes(expression.operator)) {
            return block(`sparql11_${name}`, {
                fields: {
                    operator: ["&&", "||"].includes(expression.operator) ? undefined : BlockGenerator.operatorField(expression.operator)
                },
                inputs: {
                    left: { block: this.bracketArgument(expression.args[0], definition) },
                    right: { block: expression.args.length > 1 ? this.bracketArgument(expression.args[1], definition) : undefined }
                }
            })
        }
        else {
            return this.unibinary(expression, definition.higher)
        }
    }
    private bracketArgument(argument: T12.Expression, definition: OperatorDefinition = BlockGenerator.hierarchy.unaryexpression): State {
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
    private in(expression: T12.ExpressionOperation): State {
        const [left, ...right] = expression.args

        return block("sparql11_relationalexpressionin", {
            fields: {
                operator: expression.operator.toUpperCase().replace("NOTIN", "NOT IN")
            },
            inputs: {
                left: { block: this.expression(left) },
                right: { block: chain(right.map(i => this.expressionListItem(i))) }
            }
        })
    }
    private group_concat(aggregate: T12.ExpressionAggregate): State {
        return block("sparql11_group_concat", {
            fields: {
                distinct: aggregate.distinct ? "DISTINCT" : undefined
            },
            inputs: {
                arg1: { block: this.expression(aggregate.expression[0] as T12.Expression) },
                separator: { block: this.string("separator" in aggregate ? aggregate.separator : " ") }
            }
        })
    }
    private count(aggregate: T12.ExpressionAggregate): State {
        const argument = aggregate.expression[0]

        return block("sparql11_count", {
            fields: {
                distinct: aggregate.distinct ? "DISTINCT" : undefined,
                star: argument.type === "wildcard" ? "*" : undefined
            },
            inputs: {
                arg1: { block: argument.type === "wildcard" ? undefined : this.expression(argument) }
            }
        })
    }
    private aggregateCommon(aggregate: T12.ExpressionAggregate): State {
        return block("sparql11_aggregate", {
            fields: {
                operator: aggregate.aggregation.toUpperCase(),
                distinct: aggregate.distinct ? "DISTINCT" : undefined
            },
            inputs: {
                arg1: { block: this.expression(aggregate.expression[0] as T12.Expression) }
            }
        })
    }
    // #endregion

    // #region Clauses
    private prefix(definition: T12.ContextDefinitionPrefix): State {
        if (definition.key)
            return this.prefixDecl(definition.key, definition.value)
        else
            return this.prefixDeclDefault(definition.value)
    }
    private prefixDecl(prefix: string, value: T12.TermIri): State {
        return block("sparql11_prefixdecl", {
            fields: {
                prefix
            },
            inputs: {
                value: { block: this.namedNode(value) }
            }
        })
    }
    private prefixDeclDefault(value: T12.TermIri): State {
        return wrap("sparql11_prefixdecldefault", this.namedNode(value))
    }
    private base(definition: T12.ContextDefinitionBase): State {
        return wrap("sparql11_base", this.namedNode(definition.value))
    }
    private from(clause: T12.DatasetClauses["clauses"][number]): State {
        return wrap("sparql11_datasetclause", this.graphClauseValue(clause))
    }
    private graphClauseValue(clause: T12.DatasetClauses["clauses"][number]): State {
        if (clause.clauseType === "named")
            return this.named(clause.value)
        else
            return this.namedNode(clause.value)
    }
    private named(iri: T12.TermIri): State {
        return wrap("sparql11_namedgraphclause", this.namedNode(iri))
    }
    private selectClause(query: T12.QuerySelect): State {
        const variables = query.variables

        return block("sparql11_selectclause", {
            fields: {
                distinctOrReduced: query.reduced ? "REDUCED" : query.distinct ? "DISTINCT" : undefined,
                star: variables[0].type === "wildcard" ? "*" : undefined
            },
            inputs: {
                vars: {
                    block: variables[0].type === "wildcard"
                        ? undefined
                        : chain((variables as (T12.TermVariable | T12.PatternBind)[]).map(i => this.varOrExpressionAsVarItem(i)))
                }
            }
        })
    }
    private solutionModifiers(modifiers: T12.SolutionModifiers): State | undefined {
        const { group, having, order, limitOffset } = modifiers

        if (group || having || order || limitOffset) {
            return block("sparql11_solutionmodifier", {
                inputs: {
                    limit: { block: limitOffset?.limit !== undefined ? this.numeric(limitOffset.limit.toString()) : undefined },
                    offset: { block: limitOffset?.offset !== undefined ? this.numeric(limitOffset.offset.toString()) : undefined },
                    group: { block: group && chain(group.groupings.map(i => this.groupingItem(i))) },
                    having: { block: having && chain(having.having.map(i => this.havingItem(i))) },
                    order: { block: order && chain(order.orderDefs.map(i => this.orderItem(i))) }
                }
            })
        }
    }
    private descending(expression: T12.Expression): State {
        return block("sparql11_ordercondition", {
            fields: {
                operator: "DESC"
            },
            inputs: {
                value: { block: this.bracketted(expression) }
            }
        })
    }
    private values(pattern: T12.PatternValues): State {
        const { variables: vars, values: rows } = pattern as T12.PatternValues & { variables: T12.TermVariable[] }
        const variables = vars.map(variable => variable.value)
        const values = rows.map(row => variables.map(variable => row[variable]))

        if (variables.length === 1)
            return wrap("sparql11_inlinedata", this.inlineDataOneVar(variables[0], values.flat()))
        else
            return wrap("sparql11_inlinedata", this.inlineDataFull(variables, values))
    }
    private inlineDataOneVar(variable: string, values: DataValue[]): State {
        return block("sparql11_inlinedataonevar", {
            inputs: {
                variable: { block: block("sparql11_var1", { fields: { value: variable } }) },
                values: { block: chain(values.map(i => this.dataBlockValueItem(i))) }
            }
        })
    }
    private inlineDataFull(variables: string[], values: DataValue[][]): State {
        return block("sparql11_inlinedatafull", {
            inputs: {
                variables: { block: chain(variables.map(i => this.variableItem(i))) },
                values: { block: chain(values.map(i => this.dataBlockValuesItem(i))) }
            }
        })
    }
    private expressionAsVar(expression: T12.Expression, variable: T12.TermVariable): State {
        return block("sparql11_expressionasvar", {
            inputs: {
                value: { block: this.expression(expression) },
                name: { block: this.variable(variable) }
            }
        })
    }
    // #endregion

    // #region Terms
    private term(term: T12.Term): State {
        switch (term.subType) {
            case "variable":
                return this.variable(term)

            case "namedNode":
                if (this.isIri(term, CommonIRIs.NIL))
                    return block("sparql11_nil")
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
    private graphNode(node: T12.GraphNode): State {
        if (node.type === "tripleCollection")
            return this.tripleCollection(node)
        else
            return this.term(node)
    }
    private namedNode(term: T12.TermIri): State {
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
            return block("sparql11_irirefdefault")
    }
    private triple(term: T12.TermTriple): State {
        return block("sparql11_embtp", {
            inputs: {
                subject: { block: this.term(term.subject) },
                predicate: { block: this.verb(term.predicate) },
                object: { block: this.term(term.object) }
            }
        })
    }
    private prefixedName(): State {
        return block("sparql11_prefixedname")
    }
    private prefixedNameLocalName(localName: string): State {
        return block("sparql11_prefixednamelocalname", { fields: { localName } })
    }
    private prefixedNamePrefix(prefix: string): State {
        return block("sparql11_prefixednameprefix", { fields: { prefix } })
    }
    private prefixedNamePrefixLocalName(prefix: string, localName: string): State {
        return block("sparql11_prefixednameprefixlocalname", { fields: { localName, prefix } })
    }
    private iriref(iri: string): State {
        return block("sparql11_iriref", { fields: { value: iri } })
    }
    private blankNode(term: T12.TermBlank): State {
        return block("sparql11_blanknodelabel", { fields: { value: term.label } })
    }
    private literal(term: T12.TermLiteral): State {
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
                    return shortForms[datatype.value].test(term.value)
                        ? this.numeric(term.value)
                        : this.typedLiteral(term, datatype)

                case CommonIRIs.BOOLEAN:
                    return shortForms[datatype.value].test(term.value)
                        ? this.boolean(term.value)
                        : this.typedLiteral(term, datatype)

                default:
                    return this.typedLiteral(term, datatype)
            }
    }
    private string(value: string): State {
        return block("sparql11_string", { fields: { value } })
    }
    private langString(term: T12.TermLiteral, language: string): State {
        return block("sparql11_langstring", {
            fields: {
                language
            },
            inputs: {
                value: { block: this.string(term.value) }
            }
        })
    }
    private numeric(value: string): State {
        return block("sparql11_numericliteral", { fields: { value } })
    }
    private boolean(value: string): State {
        return block("sparql11_booleanliteral", { fields: { value: value.toUpperCase() === "TRUE" } })
    }
    private typedLiteral(term: T12.TermLiteral, datatype: T12.TermIri): State {
        return block("sparql11_typedliteral", {
            inputs: {
                value: { block: this.string(term.value) },
                datatype: { block: this.namedNode(datatype) }
            }
        })
    }
    private variable(term: T12.TermVariable): State {
        return block("sparql11_var1", { fields: { value: term.value } })
    }
    // #endregion

    // #region Collection items
    private prologueItem(definition: T12.ContextDefinition): State {
        switch (definition.subType) {
            case "prefix":
                return wrap("sparql11_prologueitem", this.prefix(definition))

            case "base":
                return wrap("sparql11_prologueitem", this.base(definition))

            case "version":
                throw new Error("Unsupported SPARQL 1.2 construct: VERSION")
        }
    }
    private varOrExpressionAsVarItem(variable: T12.TermVariable | T12.PatternBind): State {
        if (variable.type === "pattern")
            return wrap("sparql11_varorexpressionasvaritem", this.expressionAsVar(variable.expression, variable.variable))
        else
            return wrap("sparql11_varorexpressionasvaritem", this.variable(variable))
    }
    private groupingItem(item: T12.SolutionModifierGroup["groupings"][number]): State {
        if ("variable" in item)
            return wrap("sparql11_groupconditionitem", this.expressionAsVar(item.value, item.variable))
        else
            return wrap("sparql11_groupconditionitem", this.expression(item))
    }
    private havingItem(item: T12.Expression): State {
        if (item.type === "term")
            return wrap("sparql11_havingconditionitem", this.bracketted(item))
        else
            return wrap("sparql11_havingconditionitem", this.bracketArgument(item))
    }
    private orderItem(item: T12.Ordering): State {
        const [expression, descending] = "descending" in item ? [item.expression, item.descending] : [item, false]

        if (descending)
            return wrap("sparql11_orderconditionitem", this.descending(expression))
        else if (expression.type === "term")
            if (expression.subType === "variable")
                return wrap("sparql11_orderconditionitem", this.term(expression))
            else
                return wrap("sparql11_orderconditionitem", this.bracketted(expression))
        else
            return wrap("sparql11_orderconditionitem", this.bracketArgument(expression))
    }
    private dataBlockValueItem(item: DataValue): State {
        if (item)
            return wrap("sparql11_datablockvalueitem", this.term(item))
        else
            return wrap("sparql11_datablockvalueitem", block("sparql11_undef"))
    }
    private dataBlockValuesItem(values: DataValue[]): State {
        return block("sparql11_datablockvaluesitem", {
            inputs: {
                items: { block: chain(values.map(i => this.dataBlockValueItem(i))) }
            }
        })
    }
    private triplesSameSubjectItem(triples: T12.BasicGraphPattern): State {
        return wrap("sparql11_triplessamesubjectitem", this.triplesSameSubject(triples))
    }
    private varOrIriItem(term: T12.TermVariable | T12.TermIri): State {
        return wrap("sparql11_varoririitem", this.term(term))
    }
    private groupItem(pattern: T12.PatternGroup): State {
        return wrap("sparql11_groupgraphpatternitem", this.pattern(pattern))
    }
    private variableItem(variable: string): State {
        return wrap("sparql11_varitem", block("sparql11_var1", { fields: { value: variable } }))
    }
    private groupSubItem(pattern: T12.Pattern): State {
        return wrap("sparql11_groupgraphpatternsubitem", this.pattern(pattern))
    }
    private propertyList([property, objects]: [T12.Path | T12.TermVariable, T12.GraphNode[]]): State {
        return block("sparql11_propertylistnotempty", {
            inputs: {
                predicate: { block: this.verb(property) },
                objects: { block: chain(objects.map(i => this.objectListItem(i))) }
            }
        })
    }
    private objectListItem(object: T12.GraphNode): State {
        return wrap("sparql11_objectlistitem", this.graphNode(object))
    }
    private graphNodeItem(object: T12.GraphNode): State {
        return wrap("sparql11_graphnodeitem", this.graphNode(object))
    }
    private expressionListItem(expression: T12.Expression): State {
        return wrap("sparql11_expressionlistitem", this.expression(expression))
    }
    private pathAlternativeItem(verb: T12.Path): State {
        return wrap("sparql11_pathalternativeitem", this.verb(verb))
    }
    private pathSequenceItem(verb: T12.Path): State {
        if (verb.type === "path" && verb.subType === "|")
            return wrap("sparql11_pathsequencitem", this.brackettedPath(verb))
        else
            return wrap("sparql11_pathsequencitem", this.verb(verb))
    }
    private pathOneInPropertySetAlternativeItem(verb: T12.TermIri | T12.PathNegatedElt): State {
        if (verb.type === "path")
            return wrap("sparql11_pathoneinpropertysetalternativeitem", this.inversePathOneInPropertySet(verb))
        else
            return wrap("sparql11_pathoneinpropertysetalternativeitem", this.verb(verb))
    }
    // #endregion

    private static groupByPredicate(triples: T12.TripleNesting[]): [T12.Path | T12.TermVariable, T12.GraphNode[]][] {
        const groups: [T12.Path | T12.TermVariable, T12.GraphNode[]][] = []

        for (const triple of triples) {
            if (triple.annotations?.length)
                throw new Error("Unsupported syntax: annotation")

            const last = groups[groups.length - 1]
            if (last && last[0] === triple.predicate)
                last[1].push(triple.object)
            else
                groups.push([triple.predicate, [triple.object]])
        }

        return groups
    }
    private static splitBgp(bgp: T12.PatternBgp): T12.PatternBgp[] {
        const slices: T12.BasicGraphPattern[] = []

        for (const item of bgp.triples) {
            const current = slices[slices.length - 1]

            if (current && item.type === "triple" && item.subject.loc && F.isSourceLocationNoMaterialize(item.subject.loc))
                current.push(item)
            else
                slices.push([item])
        }

        return slices.map(triples => ({ ...bgp, triples }))
    }
    private static normaliseQuads(quads: T12.Quads[]): T12.Quads[] {
        return quads.flatMap((quad): T12.Quads[] => quad.type === "pattern" ? BlockGenerator.splitBgp(quad) : [quad])
    }
    private static normalisePatterns(patterns: T12.Pattern[]): T12.Pattern[] {
        return patterns.flatMap((pattern): T12.Pattern[] => pattern.subType === "bgp" ? BlockGenerator.splitBgp(pattern) : [pattern])
    }
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
