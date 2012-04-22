define([
	'./lib/env',
	'./lib/File',
	'./lib/Module',
	'./lib/node!fs',
	'./lib/node!util',
	'./lib/console',
	'./lib/esprimaParser'
], function (env, File, Module, fs, util, console) {
	require.rawConfig.commandLineArgs.slice(2).forEach(function processPath(parent, path) {
		path = (parent + (path ? '/' + path : '')).replace(/\/{2,}/g, '/');
		var stats;

		try {
			stats = fs.statSync(path);
		}
		catch (error) {
			console.error(error);
			return;
		}

		if (stats.isDirectory()) {
			fs.readdirSync(path).forEach(processPath.bind(this, path));
		}
		else if (stats.isFile() && /\.js$/.test(path)) {
			Module.getByFile(new File(path));
		}
	});

	console.log(util.inspect(env.globalScope, null, null));

	env.exporters.forEach(function (exporter) {
		exporter.run(exporter.config);
	});
});