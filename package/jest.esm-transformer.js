const ts = require("typescript")

module.exports = {
    process(sourceText, sourcePath) {
        const { outputText } = ts.transpileModule(sourceText, {
            fileName: sourcePath,
            compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019, allowJs: true }
        })
        return { code: outputText }
    }
}
