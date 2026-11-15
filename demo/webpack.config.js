/** @type {import("webpack").Configuration} */
export default {
    entry: "./src/index.ts",
    output: {
        path: import.meta.dirname + "/public",
        filename: "app.js",
    },
    externals: {
        "blockly": "Blockly",
        "sparql-blockly": "SparqlBlockly"
    },
    resolve: {
        extensions: [".ts", ".js"],
        extensionAlias: {
            ".js": [".ts", ".js"]
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/, loader: "ts-loader"
            }
        ]
    }
}
