import * as Blockly from "blockly"
import * as SparqlBlockly from "sparql-blockly"

export class BlocklyCanvas extends HTMLElement {
    private typing = false

    private async connectedCallback() {
        const options: Blockly.BlocklyOptions = {
            sounds: false,
            toolbox: await this.getToolboxData(),
            horizontalLayout: true,
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

        window.setInterval(() => Blockly.svgResize(workspace), 1000)

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

    private workspaceChanged(e) {
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
}
