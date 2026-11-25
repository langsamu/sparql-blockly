/** @type {import("webpack").Configuration} */
export default {
    entry: "./dist/index.js",
    output: {
        path: import.meta.dirname + "/public",
        filename: "app.js",
    },
    externals: {
        "blockly": "Blockly",
        "sparql-blockly": "SparqlBlockly"
    }
}
