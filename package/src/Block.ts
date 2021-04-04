interface Processor<T> {
    (item: T): Block;
}

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
        const doc = document.implementation.createDocument(null, "xml")
        doc.documentElement.appendChild(this.asDom(doc))
        return doc.documentElement
    }

    public addValue(name, value: Block) {
        if (value)
            this.values.set(name, value)
    }

    public addField(name: string, value: string) {
        this.fields.set(name, value)
    }

    public addItems<T>(name: string, items: T[], itemProcessor: Processor<T>, thisArg) {
        const linearise = (acc: Block, i: T) => {
            const block = itemProcessor.call(thisArg, i)
            block.next = acc

            return block
        }

        const firstItem = items.reduceRight(linearise, null)

        if (firstItem)
            this.statements.set(name, items.reduceRight(linearise, null))
    }

    private asDom(document: XMLDocument): Element {
        const blockElement = document.createElement("block")
        blockElement.setAttribute("type", `sparql11_${this.type}`)

        for (const [name, value] of this.values) {
            const valueElement = document.createElement("value")
            valueElement.setAttribute("name", name)
            const valueDom = value.asDom(document)
            valueElement.appendChild(valueDom)
            blockElement.appendChild(valueElement)
        }

        for (const [name, value] of this.fields) {
            const valueElement = document.createElement("field")
            valueElement.setAttribute("name", name)
            valueElement.textContent = value
            blockElement.appendChild(valueElement)
        }

        for (const [name, value] of this.statements) {
            const statementElement = document.createElement("statement")
            statementElement.setAttribute("name", name)
            const statementDom = value.asDom(document)
            statementElement.appendChild(statementDom)
            blockElement.appendChild(statementElement)
        }

        if (this.next) {
            const nextElement = document.createElement("next")
            const nextDom = this.next.asDom(document)
            nextElement.appendChild(nextDom)
            blockElement.appendChild(nextElement)
        }

        return blockElement
    }
}
