import * as Blockly from "blockly"
import * as SparqlBlockly from "sparql-blockly"

const RESIZE_BLOCKLY_EVERY = 1000
const HORIZONTAL_LAYOUT_THRESHOLD = 768

export class BlocklyCanvas extends HTMLElement {
    private typing = false

    private async connectedCallback() {
        registerTallBlock()

        const options: Blockly.BlocklyOptions = {
            sounds: false,
            toolbox: await this.getToolboxData(),
            horizontalLayout: window.innerWidth < HORIZONTAL_LAYOUT_THRESHOLD,
            zoom:
            {
                controls: true,
                wheel: true,
                startScale: 1.0,
                maxScale: 3,
                minScale: 0.01,
                scaleSpeed: 1.2,
                pinch: true
            },
        }

        const workspace = Blockly.inject(this, options)
        workspace.addChangeListener(this.workspaceChanged.bind(this))

        // Periodically resize Blockly workspace to accommodate parse error display and window resizing
        window.setInterval(() => Blockly.svgResize(workspace), RESIZE_BLOCKLY_EVERY)

        workspace.registerButtonCallback("example", BlocklyCanvas.exampleButtonClicked)

        this.dispatchEvent(new Event("load"))
    }

    public set dom(value: Element) {
        if (value) {
            const workspace = Blockly.getMainWorkspace() as Blockly.WorkspaceSvg
            workspace.clear()

            this.typing = true
            Blockly.Xml.domToWorkspace(value, workspace)
        }
    }

    private async getToolboxData(): Promise<string> {
        const url = this.getAttribute("toolbox-data")
        const response = await fetch(url)
        return await response.text()
    }

    private workspaceChanged(e: Blockly.Events.Ui) {
        switch (e.type) {
            case Blockly.Events.CHANGE:
            case Blockly.Events.DELETE:
            case Blockly.Events.MOVE:
                if (!this.typing) this.generateCode()
                break

            case Blockly.Events.FINISHED_LOADING:
                this.typing = false
                break
        }
    }

    private generateCode() {
        const workspace = Blockly.getMainWorkspace()

        for (const block of workspace.getTopBlocks(false)) {
            switch (block.type) {
                case "sparql11_query":
                case "sparql11_update":
                    this.dispatchEvent(new CustomEvent<string>("blocks", { detail: SparqlBlockly.blocklyToSparql(block) as string }))
            }
        }
    }

    private static exampleButtonClicked(button: Blockly.FlyoutButton) {
        window.location.hash = encodeURIComponent(button.info["query"])
        button.getTargetWorkspace().getFlyout().hide()
    }
}

/** Used in example category of toolbox to make flyout tall enough in horizontal layout. */
function registerTallBlock() {
    Blockly.Blocks['sparql11_faketallblock'] = {
        init: function() {
            this.appendDummyInput()
            this.appendDummyInput()
        }
    }
}
