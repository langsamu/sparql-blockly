import * as SparqlBlockly from "sparql-blockly"
import * as Blockly from "blockly"

async function getToolboxData(): Promise<string> {
    const response = await fetch("../../toolbox.xml")
    return await response.text()
}

function populateSparql(sparql: string): void {
    document.querySelector("code").innerText = sparql
}

function generateCode(): void {
    const workspace = Blockly.getMainWorkspace()

    populateSparql("")

    for (const block of workspace.getTopBlocks(false)) {
        switch (block.type) {
            case "sparql11_query":
            case "sparql11_update":
                populateSparql(SparqlBlockly.blocklyToSparql(block) as string)
        }
    }
}

function blocklyChanged(e: Blockly.Events.Ui): void {
    switch (e.type) {
        case Blockly.Events.BLOCK_CHANGE:
        case Blockly.Events.BLOCK_DELETE:
        case Blockly.Events.BLOCK_MOVE:
            generateCode()
    }
}

async function initialiseBlockly(): Promise<void> {
    const toolbox = await getToolboxData()
    const options = { toolbox, sounds: false }
    const container = document.querySelector("section")

    const workspace = Blockly.inject(container, options)

    workspace.addChangeListener(blocklyChanged)
}

function textareaInput(e: InputEvent): void {
    const parseError = document.querySelector("span")
    parseError.innerText = ""

    const sparql = (e.target as HTMLTextAreaElement).value

    if (sparql) {
        try {
            const blocklyDom = SparqlBlockly.sparqlToBlockly(sparql)
            const workspace = Blockly.getMainWorkspace()

            workspace.clear()

            Blockly.Xml.domToWorkspace(blocklyDom, workspace)
        }
        catch (ex) {
            parseError.innerText = ex.message
        }
    }
}

function initialise() {
    initialiseBlockly()

    const textarea = document.querySelector("textarea")
    textarea.addEventListener("input", textareaInput)
}

window.addEventListener("load", initialise)
