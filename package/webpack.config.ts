import * as path from "path"
import * as webpack from "webpack"

const config: webpack.Configuration = {
    entry:"./dist/index.js",
    output: {
        path: path.resolve(__dirname, "."),
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

export default config
