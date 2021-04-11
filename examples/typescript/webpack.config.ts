import * as webpack from "webpack"

const config: webpack.Configuration = {
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