
const root = require("apiconnect-cli-plugins");

root.init.getPluginDirs
root.init.getContextDirs
root.init.loadPlugins

root.pluginTopics.listPlugins()
root.pluginTopics.name
root.pluginTopics.version

root.pluginLoader.getPluginDirs("./")
root.pluginLoader.getContextDirs("./")
root.pluginLoader.loadPluginsFromDir
root.pluginLoader.installPlugin(payload, "").catch(() => {
});


root.buildCli()
