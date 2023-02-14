const moduleFiles = require.context('./', false, /\.vue$/);
const components = moduleFiles.keys().reduce((modules, modulePath) => {
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
    const moduleValue = moduleFiles(modulePath).default;
    modules[moduleName] = moduleValue;
    return modules;
}, {});

export default components;