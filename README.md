# @alasdair/check-engines

## Description
CLI application to check which dependencies require a newer Node.js version than the configured minimum in the package.json engines.node range.

Any dependencies which require a greater Node.js version will be printed out, alongside their respective requirement.

## Requirements
Node.js 13 minimum.

## Installation
### Globally
```bash
npm install -g @alasdair/check-engines
```

### As a dev-dependency
```bash
$ npm i @alasdair/check-engines --save-dev
```

In your `package.json` add `check-engines` to your build script.
```json
"scripts": {
	"build": "check-engines && npm test"
}
```

## Usage
The `check-engines` command can be used on it's own to print out the offending modules.
```
$ check-engines
Target range: >=13.0.0
Target minimum: 13.0.0
Minimum required: 13.0.0
```

```
$ check-engines
Target range: >=8.0.0
Target minimum: 8.0.0
Minimum required: 10.0.0

The following dependencies do not satsify the target:
10.0.0:
        semver

npm ls semver
```

An extra argument can be provided to specify a different target minimum:

```
$ check-engines 4.3.0
Target minimum: 4.3.0
Minimum required: 10.0.0

The following dependencies do not satsify the target:
10.0.0:
        semver
8.0.0:
        which
6.0.0:
        debug

npm ls semver which debug
```
