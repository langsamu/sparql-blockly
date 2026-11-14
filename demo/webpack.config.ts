import * as path from "path"
import * as webpack from "webpack"

const config: webpack.Configuration = {
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "app.js",
    },
    externals: {
        "blockly": "Blockly",
        "sparql-blockly": "SparqlBlockly"
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/, loader: "ts-loader"
            }
        ]
    }
};

export default config;