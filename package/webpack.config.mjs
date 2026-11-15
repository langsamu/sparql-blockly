/** @type {import("webpack").Configuration} */
export default {
    entry: "./dist/index.js",
    output: {
        path: import.meta.dirname,
        filename: "sparql-blockly.min.js",
        library: {
            name: "SparqlBlockly",
            type: "window"
        }
    },
    externals: {
        "blockly": "Blockly"
    }
}
