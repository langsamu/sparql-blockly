import {
    workspace,
    property,
    collection,
    terms,
    expressions,
    vars,
    unaryExpressions,
    multiplicativeExpressions,
    additiveExpressions,
    relationalExpressions,
    andExpressions,
    primaryExpressions,
    iris,
    separator,
    paths,
    primaryPaths,
    eltPaths,
    eltOrInversePaths,
    sequencePaths,
    functionExpressions,
    constraints,
    triplesNodes,
    verbs,
    graphNodes,
    groupGraphPatternSubs,
    varsOrIris,
    groupGraphPattern,
    iriRefs,
    sameSubjectTriples,
    updateGraphRefAll,
    updateGraphOrDefault,
} from "./contextMenuUtils"

// #region Prologue
property("sparql11_prologueitem", "sparql11_base", "value", "Base")
property("sparql11_prologueitem", "sparql11_prefixdecl", "value", "Prefix")
property("sparql11_prologueitem", "sparql11_prefixdecldefault", "value", "Default prefix")

iriRefs("sparql11_base", "value")

iriRefs("sparql11_prefixdecl", "value")

iriRefs("sparql11_prefixdecldefault", "value")
// #endregion

// #region Query
workspace("Query", "sparql11_query")
collection("sparql11_query", "sparql11_prologueitem", "prologue", "Prologue")
separator("sparql11_query")
property("sparql11_query", "sparql11_selectquery", "value", "Select")
property("sparql11_query", "sparql11_describequery", "value", "Describe")
property("sparql11_query", "sparql11_askquery", "value", "Ask")
property("sparql11_query", "sparql11_simpleconstructquery", "value", "Simple construct")
property("sparql11_query", "sparql11_constructquery", "value", "Construct")
separator("sparql11_query")
property("sparql11_query", "sparql11_inlinedata", "values", "Values")

property("sparql11_selectquery", "sparql11_selectclause", "select", "Select clause")
property("sparql11_selectquery", "sparql11_querycommon", "where", "Where & modifiers")

collection("sparql11_simpleconstructquery", "sparql11_datasetclause", "datasets", "From")
collection("sparql11_simpleconstructquery", "sparql11_triplessamesubjectitem", "where", "Triples same subject")
property("sparql11_simpleconstructquery", "sparql11_solutionmodifier", "modifiers", "Modifiers")

collection("sparql11_constructquery", "sparql11_triplessamesubjectitem", "template", "Template item")
property("sparql11_constructquery", "sparql11_querycommon", "where", "Where & modifiers")

collection("sparql11_describequery", "sparql11_varoririitem", "subject", "Subject")
property("sparql11_describequery", "sparql11_querycommon", "where", "Where & modifiers")

property("sparql11_askquery", "sparql11_querycommon", "value", "Where & modifiers")

varsOrIris("sparql11_varoririitem", "value")

sameSubjectTriples("sparql11_triplessamesubjectitem", "value")
// #endregion

// #region Update
workspace("Update", "sparql11_update")

collection("sparql11_update", "sparql11_prologueitem", "prologue", "Prologue")
separator("sparql11_update")
collection("sparql11_update", "sparql11_updateitem", "items", "Update")

property("sparql11_updateitem", "sparql11_insertdeletewhere", "value", "Insert/delete (data) where")
property("sparql11_updateitem", "sparql11_modify", "value", "Modify")
property("sparql11_updateitem", "sparql11_load", "value", "Load")
property("sparql11_updateitem", "sparql11_create", "value", "Create")
property("sparql11_updateitem", "sparql11_addmovecopy", "value", "Add/move/copy")
property("sparql11_updateitem", "sparql11_cleardrop", "value", "Clear/drop")

property("sparql11_insertdeletewhere", "sparql11_quadpattern", "pattern", "{}")

collection("sparql11_quadpattern", "sparql11_quadpatternitem", "items", "Item")

sameSubjectTriples("sparql11_quadpatternitem", "value")
property("sparql11_quadpatternitem", "sparql11_quadsnottriples", "value", "Graph")

varsOrIris("sparql11_quadsnottriples", "name")
separator("sparql11_quadsnottriples")
collection("sparql11_quadsnottriples", "sparql11_triplessamesubjectitem", "triples", "Item")

iris("sparql11_modify", "iri", "With")
separator("sparql11_modify")
property("sparql11_modify", "sparql11_quadpattern", "delete", "{}", "Delete")
separator("sparql11_modify")
property("sparql11_modify", "sparql11_quadpattern", "insert", "{}", "Insert")
separator("sparql11_modify")
collection("sparql11_modify", "sparql11_usingclause", "using", "Using")
separator("sparql11_modify")
groupGraphPattern("sparql11_modify", "where", "Where")

property("sparql11_usingclause", "sparql11_namedgraphclause", "value", "Named")
separator("sparql11_usingclause")
iris("sparql11_usingclause", "value")

iris("sparql11_load", "source", "Source")
separator("sparql11_load")
property("sparql11_load", "sparql11_graphref", "destination", "Graph")

property("sparql11_create", "sparql11_graphref", "graph", "Graph")

updateGraphOrDefault("sparql11_addmovecopy", "source", "Source")
separator("sparql11_addmovecopy")
updateGraphOrDefault("sparql11_addmovecopy", "destination", "Destination")

updateGraphRefAll("sparql11_cleardrop", "graph")

iris("sparql11_graphref", "value")
// #endregion

// #region Patterns
graphNodes("sparql11_triplessamesubject", "subject", "Subject")
separator("sparql11_triplessamesubject")
collection("sparql11_triplessamesubject", "sparql11_propertylistnotempty", "predicates", "Predicate")

verbs("sparql11_propertylistnotempty", "predicate", "Predicate")
separator("sparql11_propertylistnotempty")
collection("sparql11_propertylistnotempty", "sparql11_objectlistitem", "objects", "Node", "Object")
collection("sparql11_propertylistnotempty", "sparql11_objectlistitemannotationpattern", "objects", "Annotation", "Object")

graphNodes("sparql11_objectlistitem", "value")

graphNodes("sparql11_objectlistitemannotationpattern", "value")
separator("sparql11_objectlistitemannotationpattern")
collection("sparql11_objectlistitemannotationpattern", "sparql11_propertylistnotempty", "annotations", "Predicate")

groupGraphPatternSubs("sparql11_groupgraphpattern", "value")
property("sparql11_groupgraphpattern", "sparql11_groupgraphpatternsub", "value", "Multiple patterns")
property("sparql11_groupgraphpattern", "sparql11_subselect", "value", "Select")


property("sparql11_subselect", "sparql11_selectclause", "select", "Select clause")
groupGraphPattern("sparql11_subselect", "pattern")
property("sparql11_subselect", "sparql11_solutionmodifier", "modifiers", "Modifiers")
property("sparql11_subselect", "sparql11_inlinedata", "values", "Values")

collection("sparql11_groupgraphpatternsub", "sparql11_groupgraphpatternsubitem", "items", "Item")

groupGraphPatternSubs("sparql11_groupgraphpatternsubitem", "value")

varsOrIris("sparql11_graphgraphpattern", "iri")
separator("sparql11_graphgraphpattern")
groupGraphPattern("sparql11_graphgraphpattern", "patterns")

varsOrIris("sparql11_servicegraphpattern", "iri")
separator("sparql11_servicegraphpattern")
groupGraphPattern("sparql11_servicegraphpattern", "patterns")

property("sparql11_bind", "sparql11_expressionasvar", "value", "Projection")

groupGraphPattern("sparql11_minusgraphpattern", "value")

collection("sparql11_grouporuniongraphpattern", "sparql11_groupgraphpatternitem", "items", "Item")

groupGraphPattern("sparql11_groupgraphpatternitem", "value")

constraints("sparql11_filter", "value")

groupGraphPattern("sparql11_optionalgraphpattern", "value")

property("sparql11_inlinedata", "sparql11_inlinedataonevar", "value", "One var")
property("sparql11_inlinedata", "sparql11_inlinedatafull", "value", "Full")

vars("sparql11_inlinedataonevar", "variable")
collection("sparql11_inlinedataonevar", "sparql11_datablockvalueitem", "values", "Value")

collection("sparql11_inlinedatafull", "sparql11_varitem", "variables", "Var")
collection("sparql11_inlinedatafull", "sparql11_datablockvaluesitem", "values", "Row")

vars("sparql11_varitem", "value")

property("sparql11_datablockvalueitem", "sparql11_undef", "value", "Undefined")
terms("sparql11_datablockvalueitem", "value")
property("sparql11_datablockvalueitem", "sparql11_embtp", "value", "<< >>")

collection("sparql11_datablockvaluesitem", "sparql11_datablockvalueitem", "items", "Cell")
// #endregion

// #region Paths
property("sparql11_negatedpath", "sparql11_a", "value", "a")
property("sparql11_negatedpath", "sparql11_inversepathoneinpropertyset", "value", "^")
property("sparql11_negatedpath", "sparql11_pathoneinpropertysetalternative", "value", "|")

iris("sparql11_negatedpath", "value")

paths("sparql11_bracketedpath", "value")

primaryPaths("sparql11_pathwithmodifier", "value")

eltPaths("sparql11_inversepath", "value")

collection("sparql11_pathalternative", "sparql11_pathalternativeitem", "items", "Item")

collection("sparql11_pathsequence", "sparql11_pathsequencitem", "items", "Item")

property("sparql11_inversepathoneinpropertyset", "sparql11_a", "value", "a")
iris("sparql11_inversepathoneinpropertyset", "value")

collection("sparql11_pathoneinpropertysetalternative", "sparql11_pathoneinpropertysetalternativeitem", "items", "Item")

eltOrInversePaths("sparql11_pathsequencitem", "value")

sequencePaths("sparql11_pathalternativeitem", "value")

property("sparql11_pathoneinpropertysetalternativeitem", "sparql11_a", "value", "a")
property("sparql11_pathoneinpropertysetalternativeitem", "sparql11_inversepathoneinpropertyset", "value", "^")
iris("sparql11_pathoneinpropertysetalternativeitem", "value")
// #endregion

// #region Clauses
collection("sparql11_querycommon", "sparql11_datasetclause", "datasets", "From")
groupGraphPattern("sparql11_querycommon", "pattern")
property("sparql11_querycommon", "sparql11_solutionmodifier", "modifiers", "Modifiers")

collection("sparql11_selectclause", "sparql11_varorexpressionasvaritem", "vars", "Var or projection")

vars("sparql11_expressionasvar", "name", "Name")
separator("sparql11_expressionasvar")
expressions("sparql11_expressionasvar", "value")
property("sparql11_expressionasvar", "sparql11_embtp", "value", "<< >>")

property("sparql11_datasetclause", "sparql11_namedgraphclause", "value", "Named")
separator("sparql11_datasetclause")
iris("sparql11_datasetclause", "value")

iris("sparql11_namedgraphclause", "value")

collection("sparql11_solutionmodifier", "sparql11_groupconditionitem", "group", "Group item")
collection("sparql11_solutionmodifier", "sparql11_havingconditionitem", "having", "Having item")
collection("sparql11_solutionmodifier", "sparql11_orderconditionitem", "order", "Order item")
property("sparql11_solutionmodifier", "sparql11_numericliteral", "limit", "Limit")
property("sparql11_solutionmodifier", "sparql11_numericliteral", "offset", "Offset")

property("sparql11_ordercondition", "sparql11_brackettedexpression", "value", "()")

vars("sparql11_groupconditionitem", "value")
separator("sparql11_groupconditionitem")
property("sparql11_groupconditionitem", "sparql11_expressionasvar", "value", "Projection")
separator("sparql11_groupconditionitem")
functionExpressions("sparql11_groupconditionitem", "value")

constraints("sparql11_havingconditionitem", "value")

property("sparql11_orderconditionitem", "sparql11_ordercondition", "value", "Descending")
separator("sparql11_orderconditionitem")
vars("sparql11_orderconditionitem", "value")
separator("sparql11_orderconditionitem")
constraints("sparql11_orderconditionitem", "value")

property("sparql11_varorexpressionasvaritem", "sparql11_var1", "value", "Var")
property("sparql11_varorexpressionasvaritem", "sparql11_expressionasvar", "value", "Projection")

// #endregion

// #region Expressions
expressions("sparql11_brackettedexpression", "value")

unaryExpressions("sparql11_multiplicativeexpression", "left", "Left")
separator("sparql11_multiplicativeexpression")
unaryExpressions("sparql11_multiplicativeexpression", "right", "Right")

multiplicativeExpressions("sparql11_additiveexpression", "left", "Left")
separator("sparql11_additiveexpression")
multiplicativeExpressions("sparql11_additiveexpression", "right", "Right")

additiveExpressions("sparql11_relationalexpression", "left", "Left")
separator("sparql11_relationalexpression")
additiveExpressions("sparql11_relationalexpression", "right", "Right")

collection("sparql11_relationalexpressionin", "sparql11_expressionlistitem", "right", "Item")
separator("sparql11_relationalexpressionin")
additiveExpressions("sparql11_relationalexpressionin", "left")

relationalExpressions("sparql11_conditionalandexpression", "left", "Left")
separator("sparql11_conditionalandexpression")
relationalExpressions("sparql11_conditionalandexpression", "right", "Right")

andExpressions("sparql11_conditionalorexpression", "left", "Left")
separator("sparql11_conditionalorexpression")
andExpressions("sparql11_conditionalorexpression", "right", "Right")

expressions("sparql11_builtincall1", "arg1", "1")

expressions("sparql11_builtincall2", "arg1", "1")
separator("sparql11_builtincall2")
expressions("sparql11_builtincall2", "arg2", "2")

expressions("sparql11_builtincall3", "arg1", "1")
separator("sparql11_builtincall3")
expressions("sparql11_builtincall3", "arg2", "2")
separator("sparql11_builtincall3")
expressions("sparql11_builtincall3", "arg3", "3")

expressions("sparql11_builtincall4", "arg1", "1")
separator("sparql11_builtincall4")
expressions("sparql11_builtincall4", "arg2", "2")
separator("sparql11_builtincall4")
expressions("sparql11_builtincall4", "arg3", "3")
separator("sparql11_builtincall4")
expressions("sparql11_builtincall4", "arg4", "4")

collection("sparql11_builtincalln", "sparql11_expressionlistitem", "args", "Item")

collection("sparql11_iriorfunction", "sparql11_expressionlistitem", "args", "Item")
separator("sparql11_iriorfunction")
iris("sparql11_iriorfunction", "iri")

groupGraphPattern("sparql11_exists", "value")

vars("sparql11_bound", "value")

primaryExpressions("sparql11_unaryexpression", "left")

expressions("sparql11_aggregate", "arg1")

expressions("sparql11_count", "arg1")

property("sparql11_group_concat", "sparql11_string", "separator", "''", "Separator")
separator("sparql11_group_concat")
expressions("sparql11_group_concat", "arg1")

expressions("sparql11_expressionlistitem", "value")
// #endregion

// #region Terms
collection("sparql11_blanknodepropertylist", "sparql11_propertylistnotempty", "predicates", "Predicate")

graphNodes("sparql11_embtp", "subject", "Subject")
separator("sparql11_embtp")
verbs("sparql11_embtp", "predicate", "Predicate")
separator("sparql11_embtp")
graphNodes("sparql11_embtp", "object", "Object")

property("sparql11_typedliteral", "sparql11_string", "value", "''", "Value")
separator("sparql11_typedliteral")
iris("sparql11_typedliteral", "datatype", "Datatype")

property("sparql11_langstring", "sparql11_string", "value", "''")

collection("sparql11_collection", "sparql11_graphnodeitem", "items", "Item")

graphNodes("sparql11_graphnodeitem", "value")
// #endregion
