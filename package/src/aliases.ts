import { Block } from "./Block"

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

export enum Order {
    None = 0,
    Atomic = 1,
}
