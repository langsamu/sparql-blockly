import * as path from "path"
import * as webpack from "webpack"

const config: webpack.Configuration = {
    output: {
        path: path.resolve(__dirname, "../docs"),
        filename: "app.js",
    },
    externals: {
        "blockly": "Blockly"
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