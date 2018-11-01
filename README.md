# node-log-memory-usage
Library which uses console.log to dump current memory usage if it grows or decreases by about 25%. 

Runs global.gc() when a large memory increase is detected.

Calls process.exit(1) when memory usage exceeds the set threshold.

`npm i node-log-memory-usage`

See source code for usage.
