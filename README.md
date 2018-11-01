# node-log-memory-usage
Library which uses `console.log()` to dump current memory usage if it grows or decreases by about 25%. 

Runs global.gc() when a large memory increase is detected.

Calls process.exit(1) when memory usage exceeds the set threshold.

## Usage

`npm i node-log-memory-usage`

```JavaScript
const LogMemoryUsage = require("log-memory-usage");

setInterval(
	() => {
		LogMemoryUsage.check();
	},

	30 * 1000
);
```

You need to start the node process using `--expose-gc` to enable this library to call `global.gc()` when memory increases are detected.

That's it.
