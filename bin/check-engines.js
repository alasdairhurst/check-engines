#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const mingine = require('mingine')
const semver = require('semver');

function getRange() {
	try {
		const pkg = require(path.join(process.cwd(), 'package.json'));
		return pkg.engines && pkg.engines.node;
	} catch (err) {
		throw new Error('No package.json found in cwd');
	}
}

function getMin(range) {
	if (process.argv[2]) {
		return semver.coerce(process.argv[2]);
	}
	
	if (range) {
		console.log('Target range:', range);
		return semver.minVersion(range);
	}
	throw new Error('no minimum specified. Ensure your module has a node engine range a or provide a version as an argument');
}

async function getNodeMinimumEngine () {
	const range = getRange();
	const min = getMin(range);
	console.log('Target minimum:', min.version);
  const engines = await mingine() // mingine returns a promise
	console.log('Minimum required:', engines.node.minimum);

	const unsatisfies = [];
	const versions = Object.keys(engines.node.versions).sort((a, b) => {
		if (!semver.valid(a)) {
			return 1;
		}
		if (!semver.valid(b)) {
			return -1;
		}
		if (semver.gt(a, b)) {
			return -1;
		} else if (semver.lt(a, b)) {
			return 1;
		}
		return 0;
	});

	const modules = new Set();
	for (const version of versions) {
		if (version !== '*' && semver.gt(version, min)) {
			engines.node.versions[version].forEach(modules.add, modules);
			unsatisfies.push(`${version}:\n\t${engines.node.versions[version].join('\n\t')}`)
		}
	}

	if (unsatisfies.length) {
		console.log('')
		console.log('The following dependencies do not satsify the target:');
		console.log(unsatisfies.join('\n'));
		console.log('');
		console.log('npm ls', [...modules].join(' '));
		process.exit(1);
	}
}

getNodeMinimumEngine().catch((err) => {
	console.error(err);
	process.exit(1);
});