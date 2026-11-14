import { utils } from "blockly"
import type { Processor } from "./aliases"
import type BlockGenerator from "./BlockGenerator"

export class Block {
    private type: string
    private values = new Map<string, Block>()
    private fields = new Map<string, string>()
    private statements = new Map<string, Block>()
    private next: Block

    constructor(type: string)
    constructor(type: string, value: string)
    constructor(type: string, value: Block)
    constructor(type: string, value?: string | Block) {
        this.type = type

        if (value)
            if (value instanceof Block)
                this.addValue("value", value)
            else
                this.addField("value", value)
    }

    public get xml(): Element {
        const xml = utils.xml.createElement("xml")
        xml.appendChild(this.asDom())
        return xml
    }

    public addValue(name: string, value: Block): void {
        if (value)
            this.values.set(name, value)
    }

    public addField(name: string, value: string): void {
        this.fields.set(name, value)
    }

    public addItems<T>(name: string, items: T[], itemProcessor: Processor<T>, thisArg: BlockGenerator): void {
        const linearise = (acc: Block, i: T) => {
            const block = itemProcessor.call(thisArg, i)
            block.next = acc

            return block
        }

        const firstItem = items.reduceRight(linearise, null)

        if (firstItem)
            this.statements.set(name, firstItem)
    }

    private asDom(): Element {
        const blockElement = utils.xml.createElement("block")
        blockElement.setAttribute("type", `sparql11_${this.type}`)

        for (const [name, value] of this.values) {
            const valueElement = utils.xml.createElement("value")
            valueElement.setAttribute("name", name)
            const valueDom = value.asDom()
            valueElement.appendChild(valueDom)
            blockElement.appendChild(valueElement)
        }

        for (const [name, value] of this.fields) {
            const valueElement = utils.xml.createElement("field")
            valueElement.setAttribute("name", name)
            valueElement.textContent = value
            blockElement.appendChild(valueElement)
        }

        for (const [name, value] of this.statements) {
            const statementElement = utils.xml.createElement("statement")
            statementElement.setAttribute("name", name)
            const statementDom = value.asDom()
            statementElement.appendChild(statementDom)
            blockElement.appendChild(statementElement)
        }

        if (this.next) {
            const nextElement = utils.xml.createElement("next")
            const nextDom = this.next.asDom()
            nextElement.appendChild(nextDom)
            blockElement.appendChild(nextElement)
        }

        return blockElement
    }
}
