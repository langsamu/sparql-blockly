module.exports = (path, options) => options.defaultResolver(path, {
    ...options,
    conditions: options.conditions?.filter(condition => condition !== "node")
});
