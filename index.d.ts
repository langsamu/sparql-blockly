import * as SparqlJS from "sparqljs";
import * as Blockly from "blockly";

export declare function sparqlToBlockly(sparql: SparqlJS.SparqlQuery): Element;
export declare function blocklyToSparql(block: Blockly.Block): string | any[];
