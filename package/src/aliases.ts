import type { Block } from "./Block"

export interface Processor<T> {
    (item: T): Block;
}
export type OperatorDefinition = {
    operators: string[];
    higher?: OperatorHierarchy;
}
export type OperatorHierarchy = {
    [key: string]: OperatorDefinition;
}
export type CodeTuple = [string, Order]

export const Order = {
    None: 0,
    Atomic: 1,
} as const
export type Order = typeof Order[keyof typeof Order]
