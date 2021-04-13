import { Blocks, FieldDropdown, FieldTextInput, FieldCheckbox, FieldMultilineInput } from "blockly"

// #region Prologue
Blocks["sparql11_prologueitem"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck(["BaseDecl", "PrefixDecl"])
        this.setInputsInline(false)
        this.setPreviousStatement(true, "PrologueItem")
        this.setNextStatement(true, "PrologueItem")
        this.setColour(196)
    }
}
Blocks["sparql11_base"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck("IRIREF")
            .appendField("BASE")
        this.setInputsInline(false)
        this.setOutput(true, "BaseDecl")
        this.setColour(196)
    }
}
Blocks["sparql11_prefixdecl"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck("IRIREF")
            .appendField("PREFIX")
            .appendField(new FieldTextInput(""), "prefix")
            .appendField(":")
        this.setOutput(true, "PrefixDecl")
        this.setColour(196)
    }
}
Blocks["sparql11_prefixdecldefault"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck("IRIREF")
            .appendField("PREFIX :")
        this.setOutput(true, "PrefixDecl")
        this.setColour(196)
    }
}
// #endregion

// #region Query
Blocks["sparql11_query"] = {
    init: function () {
        this.appendStatementInput("prologue")
            .setCheck("PrologueItem")
        this.appendValueInput("value")
            .setCheck(["SelectQuery", "ConstructQuery", "DescribeQuery", "AskQuery"])
        this.appendValueInput("values")
            .setCheck("ValuesClause")
        this.setColour(196)
    }
}
Blocks["sparql11_selectquery"] = {
    init: function () {
        this.appendValueInput("select")
            .setCheck("SelectClause")
            .appendField("SELECT")
        this.appendValueInput("where")
            .setCheck("QueryCommon")
        this.setInputsInline(false)
        this.setOutput(true, "SelectQuery")
        this.setColour(196)
    }
}
Blocks["sparql11_simpleconstructquery"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("CONSTRUCT")
        this.appendStatementInput("datasets")
            .setCheck("DatasetClause")
        this.appendStatementInput("where")
            .setCheck("TriplesSameSubjectItem")
            .appendField("WHERE {")
        this.appendValueInput("modifiers")
            .setCheck("SolutionModifier")
            .appendField("}")
        this.setOutput(true, "ConstructQuery")
        this.setColour(196)
    }
}
Blocks["sparql11_constructquery"] = {
    init: function () {
        this.appendStatementInput("template")
            .setCheck("TriplesSameSubjectItem")
            .appendField("CONSTRUCT {")
        this.appendValueInput("where")
            .setCheck("QueryCommon")
            .appendField("}")
        this.setOutput(true, "ConstructQuery")
        this.setColour(196)
    }
}
Blocks["sparql11_describequery"] = {
    init: function () {
        this.appendStatementInput("subject")
            .setCheck("VarOrIriItem")
            .appendField("DESCRIBE")
            .appendField(new FieldDropdown([["", ""], ["*", "*"]]), "star")
        this.appendValueInput("where")
            .setCheck("QueryCommon")
        this.setOutput(true, "DescribeQuery")
        this.setColour(196)
    }
}
Blocks["sparql11_askquery"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck("QueryCommon")
            .appendField("ASK")
        this.setOutput(true, "AskQuery")
        this.setColour(196)
    }
}
Blocks["sparql11_varoririitem"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck("VarOrIri")
        this.setPreviousStatement(true, "VarOrIriItem")
        this.setNextStatement(true, "VarOrIriItem")
        this.setColour(196)
    }
}
Blocks["sparql11_triplessamesubjectitem"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck("TriplesSameSubject")
        this.setPreviousStatement(true, "TriplesSameSubjectItem")
        this.setNextStatement(true, "TriplesSameSubjectItem")
        this.setColour(196)
    }
}
// #endregion

// #region Update
Blocks["sparql11_update"] = {
    init: function () {
        this.appendStatementInput("prologue")
            .setCheck("PrologueItem")
        this.appendStatementInput("items")
            .setCheck("UpdateItem")
        this.setColour(196)
    }
}
Blocks["sparql11_updateitem"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck(["Update1"])
        this.setPreviousStatement(true, "UpdateItem")
        this.setNextStatement(true, "UpdateItem")
        this.setColour(196)
    }
}
Blocks["sparql11_insertdeletewhere"] = {
    init: function () {
        this.appendValueInput("pattern")
            .setCheck("QuadPattern")
            .appendField(new FieldDropdown([["INSERT DATA", "INSERT DATA"], ["DELETE DATA", "DELETE DATA"], ["DELETE WHERE", "DELETE WHERE"]]), "operator")
        this.setOutput(true, "Update1")
        this.setColour(196)
    }
}
Blocks["sparql11_quadpattern"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("{")
        this.appendStatementInput("items")
            .setCheck("QuadPatternItem")
        this.appendDummyInput()
            .appendField("}")
        this.setInputsInline(false)
        this.setOutput(true, "QuadPattern")
        this.setColour(196)
    }
}
Blocks["sparql11_quadpatternitem"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck(["TriplesSameSubject", "QuadsNotTriples"])
        this.setInputsInline(false)
        this.setPreviousStatement(true, "QuadPatternItem")
        this.setNextStatement(true, "QuadPatternItem")
        this.setColour(196)
    }
}
Blocks["sparql11_quadsnottriples"] = {
    init: function () {
        this.appendValueInput("name")
            .setCheck("VarOrIri")
            .appendField("GRAPH {")
        this.appendStatementInput("triples")
            .setCheck("TriplesSameSubjectItem")
        this.appendDummyInput()
            .appendField("}")
        this.setInputsInline(false)
        this.setOutput(true, "QuadsNotTriples")
        this.setColour(196)
    }
}
Blocks["sparql11_modify"] = {
    init: function () {
        this.appendValueInput("iri")
            .setCheck("iri")
            .appendField("WITH")
        this.appendValueInput("delete")
            .setCheck("QuadPattern")
            .appendField("DELETE")
        this.appendValueInput("insert")
            .setCheck("QuadPattern")
            .appendField("INSERT")
        this.appendStatementInput("using")
            .setCheck("UsingClause")
        this.appendValueInput("where")
            .setCheck("GroupGraphPattern")
            .appendField("WHERE")
        this.setInputsInline(false)
        this.setOutput(true, "Update1")
        this.setColour(196)
    }
}
Blocks["sparql11_usingclause"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck(["iri", "NamedGraphClause"])
            .appendField("USING")
        this.setInputsInline(false)
        this.setPreviousStatement(true, "UsingClause")
        this.setNextStatement(true, "UsingClause")
        this.setColour(196)
    }
}
Blocks["sparql11_load"] = {
    init: function () {
        this.appendValueInput("source")
            .setCheck("iri")
            .appendField("LOAD")
            .appendField(new FieldDropdown([["", ""], ["SILENT", "SILENT"]]), "silent")
        this.appendValueInput("destination")
            .setCheck("GraphRef")
            .appendField("INTO")
        this.setOutput(true, "Update1")
        this.setColour(196)
    }
}
Blocks["sparql11_create"] = {
    init: function () {
        this.appendValueInput("graph")
            .setCheck("GraphRef")
            .appendField("CREATE")
            .appendField(new FieldDropdown([["", ""], ["SILENT", "SILENT"]]), "silent")
        this.setOutput(true, "Update1")
        this.setColour(196)
    }
}
Blocks["sparql11_addmovecopy"] = {
    init: function () {
        this.appendValueInput("source")
            .setCheck("GraphOrDefault")
            .appendField(new FieldDropdown([["ADD", "ADD"], ["MOVE", "MOVE"], ["COPY", "COPY"]]), "operator")
            .appendField(new FieldDropdown([["", ""], ["SILENT", "SILENT"]]), "silent")
        this.appendValueInput("destination")
            .setCheck("GraphOrDefault")
            .appendField("TO")
        this.setOutput(true, "Update1")
        this.setColour(196)
    }
}
Blocks["sparql11_cleardrop"] = {
    init: function () {
        this.appendValueInput("graph")
            .setCheck("GraphRefAll")
            .appendField(new FieldDropdown([["CLEAR", "CLEAR"], ["DROP", "DROP"]]), "operator")
            .appendField(new FieldDropdown([["", ""], ["SILENT", "SILENT"]]), "silent")
        this.setOutput(true, "Update1")
        this.setColour(196)
    }
}
Blocks["sparql11_graphref"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck("iri")
            .appendField("GRAPH")
        this.setOutput(true, ["GraphRef", "GraphRefAll", "GraphOrDefault"])
        this.setColour(196)
    }
}
Blocks["sparql11_graphrefallnamed"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("NAMED")
        this.setOutput(true, "GraphRefAll")
        this.setColour(196)
    }
}
Blocks["sparql11_graphrefallall"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("ALL")
        this.setOutput(true, "GraphRefAll")
        this.setColour(196)
    }
}
Blocks["sparql11_graphordefault"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("DEFAULT")
        this.setOutput(true, ["GraphRefAll", "GraphOrDefault"])
        this.setColour(196)
    }
}
// #endregion

// #region Patterns
Blocks["sparql11_triplessamesubject"] = {
    init: function () {
        this.appendValueInput("subject")
            .setCheck(["VarOrTermOrEmbTP", "TriplesNode"])
        this.appendStatementInput("predicates")
            .setCheck("PropertyListNotEmpty")
        this.setOutput(true, "TriplesSameSubject")
        this.setColour(0)
    }
}
Blocks["sparql11_propertylistnotempty"] = {
    init: function () {
        this.appendValueInput("predicate")
            .setCheck(["Verb", "Path"])
        this.appendStatementInput("objects")
            .setCheck("ObjectListItem")
        this.setPreviousStatement(true, "PropertyListNotEmpty")
        this.setNextStatement(true, "PropertyListNotEmpty")
        this.setColour(131)
    }
}
Blocks["sparql11_objectlistitem"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck("GraphNode")
        this.setPreviousStatement(true, "ObjectListItem")
        this.setNextStatement(true, "ObjectListItem")
        this.setColour(294)
    }
}
Blocks["sparql11_objectlistitemannotationpattern"] = {
    init: function () {
        this.appendValueInput("value")
            .appendField("{|")
            .setCheck("GraphNode")
        this.appendStatementInput("annotations")
            .setCheck("PropertyListNotEmpty")
        this.appendDummyInput()
            .appendField("|}")
        this.setPreviousStatement(true, "ObjectListItem")
        this.setNextStatement(true, "ObjectListItem")
        this.setColour(294)
    }
}
Blocks["sparql11_groupgraphpattern"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("{")
        this.appendValueInput("value")
            .setCheck(["SubSelect", "GroupGraphPatternSub", "TriplesNode", "TriplesSameSubject", "GraphPatternNotTriples", "GroupGraphPattern"])
        this.appendDummyInput()
            .appendField("}")
        this.setInputsInline(false)
        this.setOutput(true, "GroupGraphPattern")
        this.setColour(65)
    }
}
Blocks["sparql11_subselect"] = {
    init: function () {
        this.appendValueInput("select")
            .setCheck("SelectClause")
            .appendField("SELECT")
        this.appendValueInput("pattern")
            .setCheck("GroupGraphPattern")
            .appendField("WHERE")
        this.appendValueInput("modifiers")
            .setCheck("SolutionModifier")
        this.appendValueInput("values")
            .setCheck("ValuesClause")
        this.setOutput(true, "SubSelect")
        this.setColour(65)
    }
}
Blocks["sparql11_groupgraphpatternsub"] = {
    init: function () {
        this.appendStatementInput("items")
            .setCheck("GroupGraphPatternSubItem")
        this.setOutput(true, "GroupGraphPatternSub")
        this.setColour(65)
    }
}
Blocks["sparql11_groupgraphpatternsubitem"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck(["GroupGraphPattern", "TriplesNode", "TriplesSameSubject", "GraphPatternNotTriples"])
        this.setPreviousStatement(true, "GroupGraphPatternSubItem")
        this.setNextStatement(true, "GroupGraphPatternSubItem")
        this.setColour(65)
    }
}
Blocks["sparql11_graphgraphpattern"] = {
    init: function () {
        this.appendValueInput("iri")
            .setCheck("VarOrIri")
            .appendField("GRAPH")
        this.appendValueInput("patterns")
            .setCheck("GroupGraphPattern")
        this.setInputsInline(false)
        this.setOutput(true, ["GraphGraphPattern", "GraphPatternNotTriples"])
        this.setColour(65)
    }
}
Blocks["sparql11_servicegraphpattern"] = {
    init: function () {
        this.appendValueInput("iri")
            .setCheck("VarOrIri")
            .appendField("SERVICE")
            .appendField(new FieldDropdown([["", ""], ["SILENT", "SILENT"]]), "silent")
        this.appendValueInput("patterns")
            .setCheck("GroupGraphPattern")
        this.setOutput(true, ["ServiceGraphPattern", "GraphPatternNotTriples"])
        this.setColour(65)
    }
}
Blocks["sparql11_bind"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck("ExpressionAsVar")
            .appendField("BIND")
        this.setOutput(true, ["Bind", "GraphPatternNotTriples"])
        this.setColour(65)
    }
}
Blocks["sparql11_minusgraphpattern"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck("GroupGraphPattern")
            .appendField("MINUS")
        this.setOutput(true, ["MinusGraphPattern", "GraphPatternNotTriples"])
        this.setColour(65)
    }
}
Blocks["sparql11_grouporuniongraphpattern"] = {
    init: function () {
        this.appendStatementInput("items")
            .setCheck("GroupGraphPatternItem")
            .appendField("UNION")
        this.setInputsInline(false)
        this.setOutput(true, ["GroupOrUnionGraphPattern", "GraphPatternNotTriples"])
        this.setColour(65)
    }
}
Blocks["sparql11_groupgraphpatternitem"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck("GroupGraphPattern")
        this.setPreviousStatement(true, "GroupGraphPatternItem")
        this.setNextStatement(true, "GroupGraphPatternItem")
        this.setColour(65)
    }
}
Blocks["sparql11_filter"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck("Constraint")
            .appendField("FILTER")
        this.setOutput(true, ["Filter", "GraphPatternNotTriples"])
        this.setColour(65)
    }
}
Blocks["sparql11_optionalgraphpattern"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck("GroupGraphPattern")
            .appendField("OPTIONAL")
        this.setOutput(true, "GraphPatternNotTriples")
        this.setColour(65)
    }
}
Blocks["sparql11_inlinedata"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck("DataBlock")
            .appendField("VALUES")
        this.setOutput(true, ["InlineData", "GraphPatternNotTriples", "ValuesClause"])
        this.setColour(65)
    }
}
Blocks["sparql11_inlinedataonevar"] = {
    init: function () {
        this.appendValueInput("variable")
            .setCheck("Var")
        this.appendDummyInput()
            .appendField("{")
        this.appendStatementInput("values")
            .setCheck("DataBlockValueItem")
        this.appendDummyInput()
            .appendField("}")
        this.setOutput(true, "DataBlock")
        this.setColour(65)
    }
}
Blocks["sparql11_inlinedatafull"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("(")
        this.appendStatementInput("variables")
            .setCheck("VarItem")
        this.appendDummyInput()
            .appendField(")")
        this.appendDummyInput()
            .appendField("{")
        this.appendStatementInput("values")
            .setCheck("DataBlockValuesItem")
        this.appendDummyInput()
            .appendField("}")
        this.setOutput(true, ["InlineDataFull", "DataBlock"])
        this.setColour(65)
    }
}
Blocks["sparql11_datablockvaluesitem"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("(")
        this.appendStatementInput("items")
            .setCheck("DataBlockValueItem")
        this.appendDummyInput()
            .appendField(")")
        this.setPreviousStatement(true, "DataBlockValuesItem")
        this.setNextStatement(true, "DataBlockValuesItem")
        this.setColour(65)
    }
}
Blocks["sparql11_datablockvalueitem"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck("DataBlockValue")
        this.setPreviousStatement(true, "DataBlockValueItem")
        this.setNextStatement(true, "DataBlockValueItem")
        this.setColour(65)
    }
}
// #endregion

// #region Paths
Blocks["sparql11_a"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("a")
        this.setOutput(true, ["a", "PathPrimary", "PathElt", "PathEltOrInverse", "PathSequence", "Path", "VerbPath", "PathOneInPropertySet", "PathNegatedPropertySet", "Verb"])
        this.setColour(228)
    }
}
Blocks["sparql11_negatedpath"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck("PathNegatedPropertySet")
            .appendField("!")
        this.setInputsInline(true)
        this.setOutput(true, ["PathPrimary", "PathElt", "PathEltOrInverse", "PathSequence", "Path", "VerbPath"])
        this.setColour(228)
    }
}
Blocks["sparql11_bracketedpath"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck("Path")
            .appendField("(")
        this.appendDummyInput()
            .appendField(")")
        this.setOutput(true, ["PathPrimary", "PathElt", "PathEltOrInverse", "PathSequence", "Path", "VerbPath"])
        this.setColour(228)
    }
}
Blocks["sparql11_pathwithmodifier"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck("PathPrimary")
            .appendField("")
        this.appendDummyInput()
            .appendField(new FieldDropdown([["", ""], ["?", "?"], ["*", "*"], ["+", "+"]]), "modifier")
        this.setInputsInline(true)
        this.setOutput(true, ["PathElt", "PathEltOrInverse", "PathSequence", "Path", "VerbPath"])
        this.setColour(228)
    }
}
Blocks["sparql11_inversepath"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck("PathElt")
            .appendField("^")
        this.setInputsInline(false)
        this.setInputsInline(true)
        this.setOutput(true, ["PathEltOrInverse", "PathSequence", "Path", "VerbPath"])
        this.setColour(228)
    }
}
Blocks["sparql11_pathalternative"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("|")
        this.appendStatementInput("items")
            .setCheck("PathAlternativeItem")
        this.setInputsInline(true)
        this.setOutput(true, ["Path", "VerbPath"])
        this.setColour(228)
    }
}
Blocks["sparql11_pathsequence"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("/")
        this.appendStatementInput("items")
            .setCheck("PathSequenceItem")
        this.setInputsInline(true)
        this.setOutput(true, ["PathSequence", "Path", "VerbPath"])
        this.setColour(228)
    }
}
Blocks["sparql11_inversepathoneinpropertyset"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck(["iri", "a"])
            .appendField("^")
        this.setInputsInline(true)
        this.setOutput(true, ["PathOneInPropertySet", "PathNegatedPropertySet"])
        this.setColour(228)
    }
}
Blocks["sparql11_pathoneinpropertysetalternative"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("(|)")
        this.appendStatementInput("items")
            .setCheck("PathOneInPropertySetAlternativeItem")
        this.setInputsInline(true)
        this.setOutput(true, "PathNegatedPropertySet")
        this.setColour(228)
    }
}
Blocks["sparql11_pathsequencitem"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck("PathEltOrInverse")
        this.setInputsInline(false)
        this.setPreviousStatement(true, "PathSequenceItem")
        this.setNextStatement(true, "PathSequenceItem")
        this.setColour(228)
    }
}
Blocks["sparql11_pathalternativeitem"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck("PathSequence")
        this.setInputsInline(false)
        this.setPreviousStatement(true, "PathAlternativeItem")
        this.setNextStatement(true, "PathAlternativeItem")
        this.setColour(228)
    }
}
Blocks["sparql11_pathoneinpropertysetalternativeitem"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck("PathOneInPropertySet")
        this.setPreviousStatement(true, "PathOneInPropertySetAlternativeItem")
        this.setNextStatement(true, "PathOneInPropertySetAlternativeItem")
        this.setColour(228)
    }
}
// #endregion

// #region Clauses
Blocks["sparql11_querycommon"] = {
    init: function () {
        this.appendStatementInput("datasets")
            .setCheck("DatasetClause")
        this.appendValueInput("pattern")
            .setCheck("GroupGraphPattern")
            .appendField("WHERE")
        this.appendValueInput("modifiers")
            .setCheck("SolutionModifier")
        this.setOutput(true, "QueryCommon")
        this.setColour(196)
    }
}
Blocks["sparql11_selectclause"] = {
    init: function () {
        this.appendStatementInput("vars")
            .setCheck("VarOrExpressionAsVarItem")
            .appendField(new FieldDropdown([["", ""], ["DISTINCT", "DISTINCT"], ["REDUCED", "REDUCED"]]), "distinctOrReduced")
            .appendField(new FieldDropdown([["", ""], ["*", "*"]]), "star")
        this.setOutput(true, "SelectClause")
        this.setColour(196)
    }
}
Blocks["sparql11_expressionasvar"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck(["Expression", "EmbTP"])
            .appendField("(")
        this.appendDummyInput()
            .appendField("AS")
        this.appendValueInput("name")
            .setCheck("Var")
        this.appendDummyInput()
            .appendField(")")
        this.setInputsInline(true)
        this.setOutput(true, ["ExpressionAsVar", "GroupCondition"])
        this.setColour(98)
    }
}
Blocks["sparql11_undef"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("UNDEF")
        this.setOutput(true, "DataBlockValue")
        this.setColour(65)
    }
}
Blocks["sparql11_datasetclause"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck(["iri", "NamedGraphClause"])
            .appendField("FROM")
        this.setInputsInline(false)
        this.setPreviousStatement(true, "DatasetClause")
        this.setNextStatement(true, "DatasetClause")
        this.setColour(196)
    }
}
Blocks["sparql11_namedgraphclause"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck("iri")
            .appendField("NAMED")
        this.setOutput(true, "NamedGraphClause")
        this.setColour(196)
    }
}
Blocks["sparql11_solutionmodifier"] = {
    init: function () {
        this.appendStatementInput("group")
            .setCheck("GroupConditionItem")
            .appendField("GROUP BY")
        this.appendStatementInput("having")
            .setCheck("HavingConditionItem")
            .appendField("HAVING")
        this.appendStatementInput("order")
            .setCheck("OrderConditionItem")
            .appendField("ORDER BY")
        this.appendValueInput("limit")
            .setCheck("NumericLiteral")
            .appendField("LIMIT")
        this.appendValueInput("offset")
            .setCheck("NumericLiteral")
            .appendField("OFFSET")
        this.setOutput(true, "SolutionModifier")
        this.setColour(196)
    }
}
Blocks["sparql11_ordercondition"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck("BrackettedExpression")
            .appendField(new FieldDropdown([["ASC", "ASC"], ["DESC", "DESC"]]), "operator")
        this.setOutput(true, "OrderCondition")
        this.setColour(196)
    }
}
Blocks["sparql11_groupconditionitem"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck("GroupCondition")
        this.setPreviousStatement(true, "GroupConditionItem")
        this.setNextStatement(true, "GroupConditionItem")
        this.setColour(196)
    }
}
Blocks["sparql11_havingconditionitem"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck("Constraint")
        this.setPreviousStatement(true, "HavingConditionItem")
        this.setNextStatement(true, "HavingConditionItem")
        this.setColour(196)
    }
}
Blocks["sparql11_orderconditionitem"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck(["OrderCondition", "Constraint", "Var"])
        this.setPreviousStatement(true, "OrderConditionItem")
        this.setNextStatement(true, "OrderConditionItem")
        this.setColour(196)
    }
}
Blocks["sparql11_varorexpressionasvaritem"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck(["Var", "ExpressionAsVar"])
        this.setInputsInline(false)
        this.setPreviousStatement(true, "VarOrExpressionAsVarItem")
        this.setNextStatement(true, "VarOrExpressionAsVarItem")
        this.setColour(196)
    }
}
// #endregion

// #region Expressions
Blocks["sparql11_brackettedexpression"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck("Expression")
            .appendField("(")
        this.appendDummyInput()
            .appendField(")")
        this.setOutput(true, ["BrackettedExpression", "PrimaryExpression", "UnaryExpression", "MultiplicativeExpression", "AdditiveExpression", "RelationalExpression", "ConditionalAndExpression", "ConditionalOrExpression", "Expression", "Constraint"])
        this.setColour(261)
    }
}
Blocks["sparql11_multiplicativeexpression"] = {
    init: function () {
        this.appendValueInput("left")
            .setCheck("UnaryExpression")
        this.appendValueInput("right")
            .setCheck("UnaryExpression")
            .appendField(new FieldDropdown([["*", "*"], ["/", "/"]]), "operator")
        this.setInputsInline(true)
        this.setOutput(true, ["MultiplicativeExpression", "AdditiveExpression", "RelationalExpression", "ConditionalAndExpression", "ConditionalOrExpression", "Expression"])
        this.setColour(261)
    }
}
Blocks["sparql11_additiveexpression"] = {
    init: function () {
        this.appendValueInput("left")
            .setCheck("MultiplicativeExpression")
        this.appendValueInput("right")
            .setCheck("MultiplicativeExpression")
            .appendField(new FieldDropdown([["+", "+"], ["-", "-"]]), "operator")
        this.setInputsInline(true)
        this.setOutput(true, ["AdditiveExpression", "RelationalExpression", "ConditionalAndExpression", "ConditionalOrExpression", "Expression"])
        this.setColour(261)
    }
}
Blocks["sparql11_relationalexpression"] = {
    init: function () {
        this.appendValueInput("left")
            .setCheck("AdditiveExpression")
        this.appendValueInput("right")
            .setCheck("AdditiveExpression")
            .appendField(new FieldDropdown([["=", "="], ["!=", "!="], ["<", "<"], [">", ">"], ["<=", "<="], [">=", ">="]]), "operator")
        this.setInputsInline(true)
        this.setOutput(true, ["RelationalExpression", "ConditionalAndExpression", "ConditionalOrExpression", "Expression"])
        this.setColour(261)
    }
}
Blocks["sparql11_relationalexpressionin"] = {
    init: function () {
        this.appendValueInput("left")
            .setCheck("AdditiveExpression")
        this.appendStatementInput("right")
            .setCheck("ExpressionListItem")
            .appendField(new FieldDropdown([["IN", "IN"], ["NOT IN", "NOT IN"]]), "operator")
        this.setInputsInline(true)
        this.setOutput(true, ["RelationalExpression", "ConditionalAndExpression", "ConditionalOrExpression", "Expression"])
        this.setColour(261)
    }
}
Blocks["sparql11_conditionalandexpression"] = {
    init: function () {
        this.appendValueInput("left")
            .setCheck("RelationalExpression")
        this.appendValueInput("right")
            .setCheck("RelationalExpression")
            .appendField("&&")
        this.setInputsInline(true)
        this.setOutput(true, ["ConditionalAndExpression", "ConditionalOrExpression", "Expression"])
        this.setColour(261)
    }
}
Blocks["sparql11_conditionalorexpression"] = {
    init: function () {
        this.appendValueInput("left")
            .setCheck("ConditionalAndExpression")
        this.appendValueInput("right")
            .setCheck("ConditionalAndExpression")
            .appendField("||")
        this.setInputsInline(true)
        this.setOutput(true, ["ConditionalOrExpression", "Expression"])
        this.setColour(261)
    }
}
Blocks["sparql11_builtincall0"] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new FieldDropdown([["BNODE", "BNODE"], ["RAND", "RAND"], ["NOW", "NOW"], ["UUID", "UUID"], ["STRUUID", "STRUUID"]]), "operator")
            .appendField("()")
        this.setInputsInline(true)
        this.setOutput(true, ["BuiltInCall", "PrimaryExpression", "UnaryExpression", "MultiplicativeExpression", "AdditiveExpression", "RelationalExpression", "ConditionalAndExpression", "ConditionalOrExpression", "Expression", "GroupCondition", "Constraint"])
        this.setColour(261)
    }
}
Blocks["sparql11_builtincall1"] = {
    init: function () {
        this.appendValueInput("arg1")
            .setCheck("Expression")
            .appendField(new FieldDropdown([["STR", "STR"], ["LANG", "LANG"], ["DATATYPE", "DATATYPE"], ["IRI", "IRI"], ["URI", "URI"], ["BNODE", "BNODE"], ["ABS", "ABS"], ["CEIL", "CEIL"], ["FLOOR", "FLOOR"], ["ROUND", "ROUND"], ["STRLEN", "STRLEN"], ["UCASE", "UCASE"], ["LCASE", "LCASE"], ["ENCODE_FOR_URI", "ENCODE_FOR_URI"], ["YEAR", "YEAR"], ["MONTH", "MONTH"], ["DAY", "DAY"], ["HOURS", "HOURS"], ["MINUTES", "MINUTES"], ["SECONDS", "SECONDS"], ["TIMEZONE", "TIMEZONE"], ["TZ", "TZ"], ["MD5", "MD5"], ["SHA1", "SHA1"], ["SHA256", "SHA256"], ["SHA384", "SHA384"], ["SHA512", "SHA512"], ["ISIRI", "ISIRI"], ["ISURI", "ISURI"], ["ISBLANK", "ISBLANK"], ["ISLITERAL", "ISLITERAL"], ["ISNUMERIC", "ISNUMERIC"], ["SUBJECT", "SUBJECT"], ["PREDICATE", "PREDICATE"], ["OBJECT", "OBJECT"], ["ISTRIPLE", "ISTRIPLE"]]), "operator")
            .appendField("(")
        this.appendDummyInput()
            .appendField(")")
        this.setInputsInline(true)
        this.setOutput(true, ["BuiltInCall", "PrimaryExpression", "UnaryExpression", "MultiplicativeExpression", "AdditiveExpression", "RelationalExpression", "ConditionalAndExpression", "ConditionalOrExpression", "Expression", "GroupCondition", "Constraint"])
        this.setColour(261)
    }
}
Blocks["sparql11_builtincall2"] = {
    init: function () {
        this.appendValueInput("arg1")
            .setCheck("Expression")
            .appendField(new FieldDropdown([["LANGMATCHES", "LANGMATCHES"], ["SUBSTR", "SUBSTR"], ["CONTAINS", "CONTAINS"], ["STRSTARTS", "STRSTARTS"], ["STRENDS", "STRENDS"], ["STRBEFORE", "STRBEFORE"], ["STRAFTER", "STRAFTER"], ["STRLANG", "STRLANG"], ["STRDT", "STRDT"], ["SAMETERM", "SAMETERM"], ["REGEX", "REGEX"]]), "operator")
            .appendField("(")
        this.appendValueInput("arg2")
            .setCheck("Expression")
            .appendField(",")
        this.appendDummyInput()
            .appendField(")")
        this.setInputsInline(true)
        this.setOutput(true, ["BuiltInCall", "PrimaryExpression", "UnaryExpression", "MultiplicativeExpression", "AdditiveExpression", "RelationalExpression", "ConditionalAndExpression", "ConditionalOrExpression", "Expression", "GroupCondition", "Constraint"])
        this.setColour(261)
    }
}
Blocks["sparql11_builtincall3"] = {
    init: function () {
        this.appendValueInput("arg1")
            .setCheck("Expression")
            .appendField(new FieldDropdown([["REGEX", "REGEX"], ["SUBSTR", "SUBSTR"], ["REPLACE", "REPLACE"], ["IF", "IF"], ["TRIPLE", "TRIPLE"]]), "operator")
            .appendField("(")
        this.appendValueInput("arg2")
            .setCheck("Expression")
            .appendField(",")
        this.appendValueInput("arg3")
            .setCheck("Expression")
            .appendField(",")
        this.appendDummyInput()
            .appendField(")")
        this.setInputsInline(true)
        this.setOutput(true, ["BuiltInCall", "PrimaryExpression", "UnaryExpression", "MultiplicativeExpression", "AdditiveExpression", "RelationalExpression", "ConditionalAndExpression", "ConditionalOrExpression", "Expression", "GroupCondition", "Constraint"])
        this.setColour(261)
    }
}
Blocks["sparql11_builtincall4"] = {
    init: function () {
        this.appendValueInput("arg1")
            .setCheck("Expression")
            .appendField(new FieldDropdown([["REPLACE", "REPLACE"]]), "operator")
            .appendField("(")
        this.appendValueInput("arg2")
            .setCheck("Expression")
            .appendField(",")
        this.appendValueInput("arg3")
            .setCheck("Expression")
            .appendField(",")
        this.appendValueInput("arg4")
            .setCheck("Expression")
            .appendField(",")
        this.appendDummyInput()
            .appendField(")")
        this.setInputsInline(true)
        this.setOutput(true, ["BuiltInCall", "PrimaryExpression", "UnaryExpression", "MultiplicativeExpression", "AdditiveExpression", "RelationalExpression", "ConditionalAndExpression", "ConditionalOrExpression", "Expression", "GroupCondition", "Constraint"])
        this.setColour(261)
    }
}
Blocks["sparql11_builtincalln"] = {
    init: function () {
        this.appendStatementInput("args")
            .setCheck("ExpressionListItem")
            .appendField(new FieldDropdown([["CONCAT", "CONCAT"], ["COALESCE", "COALESCE"]]), "operator")
            .appendField("(")
        this.appendDummyInput()
            .appendField(")")
        this.setInputsInline(true)
        this.setOutput(true, ["BuiltInCall", "PrimaryExpression", "UnaryExpression", "MultiplicativeExpression", "AdditiveExpression", "RelationalExpression", "ConditionalAndExpression", "ConditionalOrExpression", "Expression", "GroupCondition", "Constraint"])
        this.setColour(261)
    }
}
Blocks["sparql11_iriorfunction"] = {
    init: function () {
        this.appendValueInput("iri")
            .setCheck("iri")
        this.appendDummyInput()
            .appendField("(")
            .appendField(new FieldDropdown([["", ""], ["DISTINCT", "DISTINCT"]]), "distinct")
        this.appendStatementInput("args")
            .setCheck("ExpressionListItem")
        this.appendDummyInput()
            .appendField(")")
        this.setInputsInline(true)
        this.setOutput(true, ["BuiltInCall", "PrimaryExpression", "UnaryExpression", "MultiplicativeExpression", "AdditiveExpression", "RelationalExpression", "ConditionalAndExpression", "ConditionalOrExpression", "Expression", "Constraint", "GroupCondition"])
        this.setColour(261)
    }
}
Blocks["sparql11_exists"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck("GroupGraphPattern")
            .appendField(new FieldDropdown([["EXISTS", "EXISTS"], ["NOT EXISTS", "NOT EXISTS"]]), "operator")
        this.setOutput(true, ["BuiltInCall", "PrimaryExpression", "UnaryExpression", "MultiplicativeExpression", "AdditiveExpression", "RelationalExpression", "ConditionalAndExpression", "ConditionalOrExpression", "Expression", "GroupCondition", "Constraint"])
        this.setColour(261)
    }
}
Blocks["sparql11_bound"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck("Var")
            .appendField("BOUND (")
        this.appendDummyInput()
            .appendField(")")
        this.setInputsInline(true)
        this.setOutput(true, ["BuiltInCall", "PrimaryExpression", "UnaryExpression", "MultiplicativeExpression", "AdditiveExpression", "RelationalExpression", "ConditionalAndExpression", "ConditionalOrExpression", "Expression", "GroupCondition", "Constraint"])
        this.setColour(261)
    }
}
Blocks["sparql11_unaryexpression"] = {
    init: function () {
        this.appendValueInput("left")
            .setCheck("PrimaryExpression")
            .appendField(new FieldDropdown([["!", "!"], ["+", "+"], ["-", "UMINUS"]]), "operator")
        this.setInputsInline(true)
        this.setOutput(true, ["UnaryExpression", "MultiplicativeExpression", "AdditiveExpression", "RelationalExpression", "ConditionalAndExpression", "ConditionalOrExpression", "Expression"])
        this.setColour(261)
    }
}
Blocks["sparql11_aggregate"] = {
    init: function () {
        this.appendValueInput("arg1")
            .setCheck("Expression")
            .appendField(new FieldDropdown([["SUM", "SUM"], ["MIN", "MIN"], ["MAX", "MAX"], ["AVG", "AVG"], ["SAMPLE", "SAMPLE"]]), "operator")
            .appendField("(")
            .appendField(new FieldDropdown([["", ""], ["DISTINCT", "DISTINCT"]]), "distinct")
        this.appendDummyInput()
            .appendField(")")
        this.setInputsInline(true)
        this.setOutput(true, ["BuiltInCall", "PrimaryExpression", "UnaryExpression", "MultiplicativeExpression", "AdditiveExpression", "RelationalExpression", "ConditionalAndExpression", "ConditionalOrExpression", "Expression", "GroupCondition", "Constraint"])
        this.setColour(261)
    }
}
Blocks["sparql11_count"] = {
    init: function () {
        this.appendValueInput("arg1")
            .setCheck("Expression")
            .appendField("COUNT(")
            .appendField(new FieldDropdown([["", ""], ["DISTINCT", "DISTINCT"]]), "distinct")
            .appendField(new FieldDropdown([["", ""], ["*", "*"]]), "star")
        this.appendDummyInput()
            .appendField(")")
        this.setInputsInline(true)
        this.setOutput(true, ["BuiltInCall", "PrimaryExpression", "UnaryExpression", "MultiplicativeExpression", "AdditiveExpression", "RelationalExpression", "ConditionalAndExpression", "ConditionalOrExpression", "Expression", "GroupCondition", "Constraint"])
        this.setColour(261)
    }
}
Blocks["sparql11_group_concat"] = {
    init: function () {
        this.appendValueInput("arg1")
            .setCheck("Expression")
            .appendField("GROUP_CONCAT(")
            .appendField(new FieldDropdown([["", ""], ["DISTINCT", "DISTINCT"]]), "distinct")
        this.appendValueInput("separator")
            .appendField("; SEPARATOR =")
            .setCheck("string")
        this.appendDummyInput()
            .appendField(")")
        this.setInputsInline(true)
        this.setOutput(true, ["BuiltInCall", "PrimaryExpression", "UnaryExpression", "MultiplicativeExpression", "AdditiveExpression", "RelationalExpression", "ConditionalAndExpression", "ConditionalOrExpression", "Expression", "GroupCondition", "Constraint"])
        this.setColour(261)
    }
}
Blocks["sparql11_expressionlistitem"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck("Expression")
        this.setPreviousStatement(true, "ExpressionListItem")
        this.setNextStatement(true, "ExpressionListItem")
        this.setColour(261)
    }
}
// #endregion

// #region Terms
Blocks["sparql11_blanknodepropertylist"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("[")
        this.appendStatementInput("predicates")
            .setCheck("PropertyListNotEmpty")
        this.appendDummyInput()
            .appendField("]")
        this.setOutput(true, ["BlankNodePropertyList", "TriplesNode", "TriplesSameSubject", "GraphNode", "Object", "TriplesBlock"])
        this.setColour(0)
    }
}
Blocks["sparql11_prefixedname"] = {
    init: function () {
        this.appendDummyInput()
            .appendField(":")
        this.setInputsInline(true)
        this.setOutput(true, ["EmbSubjectOrObject", "DataValueTerm", "VarOrTermOrEmbTP", "iri", "VarOrIri", "GraphNode", "VarOrTerm", "GraphTerm", "Verb", "DataBlockValue", "PathPrimary", "PathElt", "PathEltOrInverse", "PathSequence", "Path", "VerbPath", "PathOneInPropertySet", "PathNegatedPropertySet", "Expression", "ConditionalOrExpression", "ConditionalAndExpression", "RelationalExpression", "AdditiveExpression", "MultiplicativeExpression", "UnaryExpression", "PrimaryExpression", "iriOrFunction", "GraphOrDefault"])
        this.setColour(326)
    }
}
Blocks["sparql11_prefixednameprefix"] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new FieldTextInput(""), "prefix")
            .appendField(":")
        this.setInputsInline(true)
        this.setOutput(true, ["EmbSubjectOrObject", "DataValueTerm", "VarOrTermOrEmbTP", "iri", "VarOrIri", "GraphNode", "VarOrTerm", "GraphTerm", "Verb", "DataBlockValue", "PathPrimary", "PathElt", "PathEltOrInverse", "PathSequence", "Path", "VerbPath", "PathOneInPropertySet", "PathNegatedPropertySet", "Expression", "ConditionalOrExpression", "ConditionalAndExpression", "RelationalExpression", "AdditiveExpression", "MultiplicativeExpression", "UnaryExpression", "PrimaryExpression", "iriOrFunction", "GraphOrDefault"])
        this.setColour(326)
    }
}
Blocks["sparql11_prefixednamelocalname"] = {
    init: function () {
        this.appendDummyInput()
            .appendField(":")
            .appendField(new FieldTextInput(""), "localName")
        this.setInputsInline(true)
        this.setOutput(true, ["EmbSubjectOrObject", "DataValueTerm", "VarOrTermOrEmbTP", "iri", "VarOrIri", "GraphNode", "VarOrTerm", "GraphTerm", "Verb", "DataBlockValue", "PathPrimary", "PathElt", "PathEltOrInverse", "PathSequence", "Path", "VerbPath", "PathOneInPropertySet", "PathNegatedPropertySet", "Expression", "ConditionalOrExpression", "ConditionalAndExpression", "RelationalExpression", "AdditiveExpression", "MultiplicativeExpression", "UnaryExpression", "PrimaryExpression", "iriOrFunction", "GraphOrDefault"])
        this.setColour(326)
    }
}
Blocks["sparql11_prefixednameprefixlocalname"] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new FieldTextInput(""), "prefix")
            .appendField(":")
            .appendField(new FieldTextInput(""), "localName")
        this.setInputsInline(true)
        this.setOutput(true, ["EmbSubjectOrObject", "DataValueTerm", "VarOrTermOrEmbTP", "iri", "VarOrIri", "GraphNode", "VarOrTerm", "GraphTerm", "Verb", "DataBlockValue", "PathPrimary", "PathElt", "PathEltOrInverse", "PathSequence", "Path", "VerbPath", "PathOneInPropertySet", "PathNegatedPropertySet", "Expression", "ConditionalOrExpression", "ConditionalAndExpression", "RelationalExpression", "AdditiveExpression", "MultiplicativeExpression", "UnaryExpression", "PrimaryExpression", "iriOrFunction", "GraphOrDefault"])
        this.setColour(326)
    }
}
Blocks["sparql11_embtp"] = {
    init: function () {
        this.appendValueInput("subject")
            .appendField("<<")
            .setCheck("EmbSubjectOrObject")
        this.appendValueInput("predicate")
            .setCheck("Verb")
        this.appendValueInput("object")
            .setCheck("EmbSubjectOrObject")
        this.appendDummyInput()
            .appendField(">>")
        this.setOutput(true, ["GraphNode", "GraphNodePath", "VarOrTermOrEmbTP", "EmbSubjectOrObject", "EmbTP", "DataBlockValue"])
        this.setColour(0)
    }
}
Blocks["sparql11_iriref"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("<")
            .appendField(new FieldTextInput(""), "value")
            .appendField(">")
        this.setInputsInline(true)
        this.setOutput(true, ["EmbSubjectOrObject", "DataValueTerm", "VarOrTermOrEmbTP", "IRIREF", "iri", "VarOrIri", "GraphNode", "VarOrTerm", "GraphTerm", "Verb", "DataBlockValue", "PathPrimary", "PathElt", "PathEltOrInverse", "PathSequence", "Path", "VerbPath", "PathOneInPropertySet", "PathNegatedPropertySet", "Expression", "ConditionalOrExpression", "ConditionalAndExpression", "RelationalExpression", "AdditiveExpression", "MultiplicativeExpression", "UnaryExpression", "PrimaryExpression", "iriOrFunction", "GraphOrDefault"])
        this.setColour(326)
    }
}
Blocks["sparql11_irirefdefault"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("<>")
        this.setInputsInline(true)
        this.setOutput(true, ["EmbSubjectOrObject", "DataValueTerm", "VarOrTermOrEmbTP", "IRIREF", "iri", "VarOrIri", "GraphNode", "VarOrTerm", "GraphTerm", "Verb", "DataBlockValue", "PathPrimary", "PathElt", "PathEltOrInverse", "PathSequence", "Path", "VerbPath", "PathOneInPropertySet", "PathNegatedPropertySet", "Expression", "ConditionalOrExpression", "ConditionalAndExpression", "RelationalExpression", "AdditiveExpression", "MultiplicativeExpression", "UnaryExpression", "PrimaryExpression", "iriOrFunction", "GraphOrDefault"])
        this.setColour(326)
    }
}
Blocks["sparql11_typedliteral"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck("string")
        this.appendValueInput("datatype")
            .appendField("^^")
            .setCheck("iri")
        this.setInputsInline(true)
        this.setOutput(true, ["EmbSubjectOrObject", "DataValueTerm", "VarOrTermOrEmbTP", "RDFLiteral", "GraphNode", "VarOrTerm", "GraphTerm", "DataBlockValue", "Expression", "ConditionalOrExpression", "ConditionalAndExpression", "RelationalExpression", "AdditiveExpression", "MultiplicativeExpression", "UnaryExpression", "PrimaryExpression"])
        this.setColour(163)
    }
}
Blocks["sparql11_langstring"] = {
    init: function () {
        const language = new FieldTextInput("")
        language.setValidator(value => /^[a-zA-Z]+(-[a-zA-Z0-9]+)*$/.test(value) ? value : null)
        this.appendValueInput("value")
            .setCheck("string")
        this.appendDummyInput()
            .appendField("@")
            .appendField(language, "language")
        this.setInputsInline(true)
        this.setOutput(true, ["EmbSubjectOrObject", "DataValueTerm", "VarOrTermOrEmbTP", "RDFLiteral", "GraphNode", "VarOrTerm", "GraphTerm", "DataBlockValue", "Expression", "ConditionalOrExpression", "ConditionalAndExpression", "RelationalExpression", "AdditiveExpression", "MultiplicativeExpression", "UnaryExpression", "PrimaryExpression"])
        this.setColour(163)
    }
}
Blocks["sparql11_collection"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("(")
        this.appendStatementInput("items")
            .setCheck("GraphNodeItem")
        this.appendDummyInput()
            .appendField(")")
        this.setOutput(true, ["Collection", "TriplesNode", "TriplesSameSubject", "GraphNode", "Object", "TriplesBlock"])
        this.setColour(0)
    }
}
Blocks["sparql11_graphnodeitem"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck("GraphNode")
        this.setPreviousStatement(true, "GraphNodeItem")
        this.setNextStatement(true, "GraphNodeItem")
        this.setColour(294)
    }
}
Blocks["sparql11_anon"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("[]")
        this.setOutput(true, ["EmbSubjectOrObject", "VarOrTermOrEmbTP", "BlankNode", "GraphTerm", "VarOrTerm", "GraphNode", "Object"])
        this.setColour(98)
    }
}
Blocks["sparql11_blanknodelabel"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("_:")
            .appendField(new FieldTextInput(""), "value")
        this.setInputsInline(true)
        this.setOutput(true, ["EmbSubjectOrObject", "VarOrTermOrEmbTP", "BlankNode", "GraphTerm", "VarOrTerm", "GraphNode"])
        this.setColour(98)
    }
}
Blocks["sparql11_nil"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("()")
        this.setOutput(true, ["VarOrTermOrEmbTP", "NIL", "GraphTerm", "VarOrTerm", "GraphNode", "Object"])
        this.setColour(98)
    }
}
Blocks["sparql11_var1"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("?")
            .appendField(new FieldTextInput("s"), "value")
        this.setInputsInline(false)
        this.setOutput(true, ["EmbSubjectOrObject", "VarOrTermOrEmbTP", "Var", "VarOrIri", "Verb", "VarOrTerm", "GraphNode", "Object", "GroupCondition", "Expression", "ConditionalOrExpression", "ConditionalAndExpression", "RelationalExpression", "AdditiveExpression", "MultiplicativeExpression", "UnaryExpression", "PrimaryExpression"])
        this.setColour(33)
    }
}
Blocks["sparql11_var2"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("$")
            .appendField(new FieldTextInput("s"), "value")
        this.setInputsInline(false)
        this.setOutput(true, ["EmbSubjectOrObject", "VarOrTermOrEmbTP", "Var", "VarOrIri", "Verb", "VarOrTerm", "GraphNode", "Object", "GroupCondition", "Expression", "ConditionalOrExpression", "ConditionalAndExpression", "RelationalExpression", "AdditiveExpression", "MultiplicativeExpression", "UnaryExpression", "PrimaryExpression"])
        this.setColour(33)
    }
}
Blocks["sparql11_numericliteral"] = {
    init: function () {
        const valueField = new FieldTextInput("")
        valueField.setValidator(value => (isNaN(parseFloat(value)) || !isFinite(value)) ? null : value)
        this.appendDummyInput()
            .appendField(valueField, "value")
        this.setInputsInline(true)
        this.setOutput(true, ["EmbSubjectOrObject", "DataValueTerm", "VarOrTermOrEmbTP", "NumericLiteral", "RDFLiteral", "GraphNode", "VarOrTerm", "GraphTerm", "DataBlockValue", "Expression", "ConditionalOrExpression", "ConditionalAndExpression", "RelationalExpression", "AdditiveExpression", "MultiplicativeExpression", "UnaryExpression", "PrimaryExpression"])
        this.setColour(163)
    }
}
Blocks["sparql11_booleanliteral"] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new FieldCheckbox("TRUE"), "value")
        this.setInputsInline(true)
        this.setOutput(true, ["EmbSubjectOrObject", "DataValueTerm", "VarOrTermOrEmbTP", "RDFLiteral", "GraphNode", "VarOrTerm", "GraphTerm", "DataBlockValue", "Expression", "ConditionalOrExpression", "ConditionalAndExpression", "RelationalExpression", "AdditiveExpression", "MultiplicativeExpression", "UnaryExpression", "PrimaryExpression"])
        this.setColour(163)
    }
}
Blocks["sparql11_string"] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new FieldMultilineInput(""), "value")
        this.setInputsInline(true)
        this.setOutput(true, ["EmbSubjectOrObject", "DataValueTerm", "VarOrTermOrEmbTP", "string", "RDFLiteral", "GraphNode", "VarOrTerm", "GraphTerm", "DataBlockValue", "Expression", "ConditionalOrExpression", "ConditionalAndExpression", "RelationalExpression", "AdditiveExpression", "MultiplicativeExpression", "UnaryExpression", "PrimaryExpression"])
        this.setColour(163)
    }
}
// #endregion

// #region Collection items
Blocks["sparql11_varitem"] = {
    init: function () {
        this.appendValueInput("value")
            .setCheck("Var")
        this.setInputsInline(false)
        this.setPreviousStatement(true, "VarItem")
        this.setNextStatement(true, "VarItem")
        this.setColour(65)
    }
}
// #endregion
