import * as Blockly from "blockly";

let separatorCounter = 0;

export function vars(parentBlockType: string, inputName: string, prefix?: string): void {
    property(parentBlockType, "sparql11_var1", inputName, "?s", prefix)
    property(parentBlockType, "sparql11_var2", inputName, "$s", prefix)
}
export function varsOrIris(parentBlockType: string, inputName: string, prefix?: string): void {
    vars(parentBlockType, inputName, prefix)
    iris(parentBlockType, inputName, prefix)
}
export function graphTerms(parentBlockType: string, inputName: string, prefix?: string): void {
    terms(parentBlockType, inputName, prefix)

    property(parentBlockType, "sparql11_anon", inputName, "[]", prefix)
    property(parentBlockType, "sparql11_blanknodelabel", inputName, "_:label", prefix)
    property(parentBlockType, "sparql11_nil", inputName, "()", prefix)
}
export function graphNodes(parentBlockType: string, inputName: string, prefix?: string): void {
    vars(parentBlockType, inputName, prefix)
    graphTerms(parentBlockType, inputName, prefix)
    triplesNodes(parentBlockType, inputName, prefix)

    property(parentBlockType, "sparql11_embtp", inputName, "<< >>", prefix)
}
export function terms(parentBlockType: string, inputName: string, prefix?: string): void {
    iris(parentBlockType, inputName, prefix)

    property(parentBlockType, "sparql11_typedliteral", inputName, "''^^<>", prefix)
    property(parentBlockType, "sparql11_langstring", inputName, "''@en", prefix)
    property(parentBlockType, "sparql11_numericliteral", inputName, "42", prefix)
    property(parentBlockType, "sparql11_booleanliteral", inputName, "✓", prefix)
    property(parentBlockType, "sparql11_string", inputName, "''", prefix)
}
export function sameSubjectTriples(parentBlockType: string, inputName: string, prefix?: string): void {
    property(parentBlockType, "sparql11_triplessamesubject", inputName, "Triples same subject", prefix)

    triplesNodes(parentBlockType, inputName, prefix)
}
export function triplesNodes(parentBlockType: string, inputName: string, prefix?: string): void {
    property(parentBlockType, "sparql11_blanknodepropertylist", inputName, "Blank node property list", prefix)
    property(parentBlockType, "sparql11_collection", inputName, "Collection", prefix)
}
export function iris(parentBlockType: string, inputName: string, prefix?: string): void {
    iriRefs(parentBlockType, inputName, prefix)

    property(parentBlockType, "sparql11_prefixedname", inputName, ":", prefix)
    property(parentBlockType, "sparql11_prefixednameprefix", inputName, "prefix:", prefix)
    property(parentBlockType, "sparql11_prefixednamelocalname", inputName, ":name", prefix)
    property(parentBlockType, "sparql11_prefixednameprefixlocalname", inputName, "prefix:name", prefix)
}
export function iriRefs(parentBlockType: string, inputName: string, prefix?: string): void {
    property(parentBlockType, "sparql11_iriref", inputName, "<iri>", prefix)
    property(parentBlockType, "sparql11_irirefdefault", inputName, "<>", prefix)
}

export function groupGraphPatternSubs(parentBlockType: string, inputName: string, prefix?: string): void {
    sameSubjectTriples(parentBlockType, inputName, prefix)

    property(parentBlockType, "sparql11_graphgraphpattern", inputName, "Graph", prefix)
    property(parentBlockType, "sparql11_servicegraphpattern", inputName, "Service", prefix)
    property(parentBlockType, "sparql11_bind", inputName, "Bind", prefix)
    property(parentBlockType, "sparql11_minusgraphpattern", inputName, "Minus", prefix)
    property(parentBlockType, "sparql11_grouporuniongraphpattern", inputName, "Union", prefix)
    property(parentBlockType, "sparql11_filter", inputName, "Filter", prefix)
    property(parentBlockType, "sparql11_optionalgraphpattern", inputName, "Optional", prefix)

    groupGraphPattern(parentBlockType, inputName, prefix)
}
export function groupGraphPattern(parentBlockType: string, inputName: string, prefix?: string): void {
    property(parentBlockType, "sparql11_groupgraphpattern", inputName, "{}", prefix)
}

export function updateGraphRefAll(parentBlockType: string, inputName: string, prefix?: string): void {
    updateGraphOrDefault(parentBlockType, inputName, prefix)

    property(parentBlockType, "sparql11_graphrefallnamed", inputName, "Named", prefix)
    property(parentBlockType, "sparql11_graphrefallall", inputName, "All", prefix)
}
export function updateGraphOrDefault(parentBlockType: string, inputName: string, prefix?: string): void {
    updateGraph(parentBlockType, inputName, prefix)

    property(parentBlockType, "sparql11_graphordefault", inputName, "Default", prefix)
}
export function updateGraph(parentBlockType: string, inputName: string, prefix?: string): void {
    property(parentBlockType, "sparql11_graphref", inputName, "Graph",prefix)
}

export function expressions(parentBlockType: string, inputName: string, prefix?: string): void {
    andExpressions(parentBlockType, inputName, prefix)

    property(parentBlockType, "sparql11_conditionalorexpression", inputName, "∨", prefix)
}
export function andExpressions(parentBlockType: string, inputName: string, prefix?: string): void {
    relationalExpressions(parentBlockType, inputName, prefix)

    property(parentBlockType, "sparql11_conditionalandexpression", inputName, "∧", prefix)
}
export function relationalExpressions(parentBlockType: string, inputName: string, prefix?: string): void {
    additiveExpressions(parentBlockType, inputName, prefix)

    property(parentBlockType, "sparql11_relationalexpression", inputName, "=≠<>≤≥", prefix)
    property(parentBlockType, "sparql11_relationalexpressionin", inputName, "in/not in", prefix)
}
export function additiveExpressions(parentBlockType: string, inputName: string, prefix?: string): void {
    multiplicativeExpressions(parentBlockType, inputName, prefix)

    property(parentBlockType, "sparql11_additiveexpression", inputName, "+−", prefix)
}
export function multiplicativeExpressions(parentBlockType: string, inputName: string, prefix?: string): void {
    unaryExpressions(parentBlockType, inputName, prefix)

    property(parentBlockType, "sparql11_multiplicativeexpression", inputName, "×÷", prefix)
}
export function unaryExpressions(parentBlockType: string, inputName: string, prefix?: string): void {
    primaryExpressions(parentBlockType, inputName, prefix)

    property(parentBlockType, "sparql11_unaryexpression", inputName, "¬+−", prefix)
}
export function primaryExpressions(parentBlockType: string, inputName: string, prefix?: string): void {
    vars(parentBlockType, inputName, prefix)
    terms(parentBlockType, inputName, prefix)
    constraints(parentBlockType, inputName, prefix)
}
export function constraints(parentBlockType: string, inputName: string, prefix?: string): void {
    functionExpressions(parentBlockType, inputName, prefix)

    property(parentBlockType, "sparql11_brackettedexpression", inputName, "()", prefix)
}
export function functionExpressions(parentBlockType: string, inputName: string, prefix?: string): void {
    property(parentBlockType, "sparql11_builtincall0", inputName, "𝛌0", prefix)
    property(parentBlockType, "sparql11_builtincall1", inputName, "𝛌1", prefix)
    property(parentBlockType, "sparql11_builtincall2", inputName, "𝛌2", prefix)
    property(parentBlockType, "sparql11_builtincall3", inputName, "𝛌3", prefix)
    property(parentBlockType, "sparql11_builtincall4", inputName, "𝛌4", prefix)
    property(parentBlockType, "sparql11_builtincalln", inputName, "𝛌𝐧", prefix)
    property(parentBlockType, "sparql11_iriorfunction", inputName, "<>𝐧", prefix)
    property(parentBlockType, "sparql11_exists", inputName, "Exists", prefix)
    property(parentBlockType, "sparql11_bound", inputName, "Bound", prefix)
    property(parentBlockType, "sparql11_aggregate", inputName, "Aggregate", prefix)
    property(parentBlockType, "sparql11_count", inputName, "Count", prefix)
    property(parentBlockType, "sparql11_group_concat", inputName, "Group concatenation", prefix)
}

export function verbs(parentBlockType: string, inputName: string, prefix?: string): void {
    vars(parentBlockType, inputName, prefix)
    paths(parentBlockType, inputName, prefix)
}
export function paths(parentBlockType: string, inputName: string, prefix?: string): void {
    sequencePaths(parentBlockType, inputName, prefix)

    property(parentBlockType, "sparql11_pathalternative", inputName, "|", prefix)
}
export function sequencePaths(parentBlockType: string, inputName: string, prefix?: string): void {
    eltOrInversePaths(parentBlockType, inputName, prefix)

    property(parentBlockType, "sparql11_pathsequence", inputName, "/", prefix)
}
export function eltOrInversePaths(parentBlockType: string, inputName: string, prefix?: string): void {
    eltPaths(parentBlockType, inputName, prefix)

    property(parentBlockType, "sparql11_inversepath", inputName, "^", prefix)
}
export function eltPaths(parentBlockType: string, inputName: string, prefix?: string): void {
    primaryPaths(parentBlockType, inputName, prefix)

    property(parentBlockType, "sparql11_pathwithmodifier", inputName, "?*+", prefix)
}
export function primaryPaths(parentBlockType: string, inputName: string, prefix?: string): void {
    iris(parentBlockType, inputName, prefix)

    property(parentBlockType, "sparql11_a", inputName, "a", prefix)
    property(parentBlockType, "sparql11_negatedpath", inputName, "!", prefix)
    property(parentBlockType, "sparql11_bracketedpath", inputName, "()", prefix)
}

export function separator(parentBlockType: string): void {
    const menuItem = {
        displayText: () => "==========",
        preconditionFn: (scope: Blockly.ContextMenuRegistry.Scope) => scope.block.type === parentBlockType ? "disabled" : "hidden",
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        callback: () => { },
        scopeType: Blockly.ContextMenuRegistry.ScopeType.BLOCK,
        id: `separator${++separatorCounter}`,
        weight: 0,
    }

    Blockly.ContextMenuRegistry.registry.register(menuItem)
}
export function workspace(displayText: string, newBlockType: string): void {
    Blockly.ContextMenuRegistry.registry.register({
        displayText: () => displayText,
        preconditionFn: () => "enabled",
        callback: (scope: Blockly.ContextMenuRegistry.Scope) => {
            const block = scope.workspace.newBlock(newBlockType);
            block.initSvg();
            block.render();
        },
        scopeType: Blockly.ContextMenuRegistry.ScopeType.WORKSPACE,
        id: newBlockType,
        weight: 0,
    });
}
export function property(parentBlockType: string, newBlockType: string, inputName: string, displayText: string, prefix?: string): void {
    const callback = (scope: Blockly.ContextMenuRegistry.Scope) => {
        const block = scope.block.workspace.newBlock(newBlockType);
        block.initSvg();
        block.render();

        const sb = scope.block as Blockly.BlockSvg;
        block.outputConnection.connect(sb.getInput(inputName).connection);
    }

    block(parentBlockType, newBlockType, inputName, displayText, callback, prefix)
}
export function collection(parentBlockType: string, newBlockType: string, inputName: string, displayText: string, prefix?: string): void {
    const callback = (scope: Blockly.ContextMenuRegistry.Scope) => {
        const block = scope.block.workspace.newBlock(newBlockType);
        block.initSvg();
        block.render();

        const sb = scope.block as Blockly.BlockSvg;
        const x = sb.getInput(inputName).connection;
        const xtb = x.targetBlock();
        if (xtb)
            block.previousConnection.connect(xtb.lastConnectionInStack());

        else
            block.previousConnection.connect(x);
    }

    block(parentBlockType, newBlockType, inputName, displayText, callback, prefix)
}

function block(parentBlockType: string, newBlockType: string, inputName: string, displayText: string, callback: (scope: Blockly.ContextMenuRegistry.Scope) => void, prefix?: string): void {
    if (prefix) {
        displayText = `${prefix}: ${displayText}`
    }

    const menuItem = {
        displayText: () => displayText,
        preconditionFn: (scope: Blockly.ContextMenuRegistry.Scope) => scope.block.type === parentBlockType ? "enabled" : "hidden",
        callback,
        scopeType: Blockly.ContextMenuRegistry.ScopeType.BLOCK,
        id: parentBlockType + newBlockType + inputName,
        weight: 0,
    }

    Blockly.ContextMenuRegistry.registry.register(menuItem)
}
