import type { serialization } from "blockly"

type State = serialization.blocks.State

interface Parts {
    fields?: Record<string, string | boolean | undefined>
    inputs?: Record<string, { block?: State | undefined }>
}

export function block(type: string, { fields = {}, inputs = {} }: Parts = {}): State {
    const definedFields = Object.entries(fields).flatMap(([name, value]) => value !== undefined && value !== "" ? [[name, value] as const] : [])
    const definedInputs = Object.entries(inputs).flatMap(([name, input]) => input.block ? [[name, { block: input.block }] as const] : [])

    return {
        type,
        ...(definedFields.length && { fields: Object.fromEntries(definedFields) }),
        ...(definedInputs.length && { inputs: Object.fromEntries(definedInputs) })
    }
}

export function wrap(type: string, child: State | undefined): State {
    return block(type, { inputs: { value: { block: child } } })
}

export function chain(states: State[]): State | undefined {
    return states.reduceRight<State | undefined>((next, state) => next ? { ...state, next: { block: next } } : state, undefined)
}
