import type { serialization } from "blockly"

type State = serialization.blocks.State

interface Parts {
    fields?: Record<string, string | boolean | undefined>
    inputs?: Record<string, { block?: State }>
}

export function block(type: string, { fields = {}, inputs = {} }: Parts = {}): State {
    const definedFields = Object.entries(fields).filter(([, value]) => value !== undefined && value !== "")
    const definedInputs = Object.entries(inputs).filter(([, input]) => input.block !== undefined)

    return {
        type,
        ...(definedFields.length && { fields: Object.fromEntries(definedFields) }),
        ...(definedInputs.length && { inputs: Object.fromEntries(definedInputs.map(([name, { block }]) => [name, { block }])) })
    }
}

export function wrap(type: string, child: State | undefined): State {
    return block(type, { inputs: { value: { block: child } } })
}

export function chain(states: State[]): State | undefined {
    return states.reduceRight<State | undefined>((next, state) => next ? { ...state, next: { block: next } } : state, undefined)
}
