class Main
{
	/**
	 * Use a setInterval() to call this function periodically.
	 * 
	 * @param {number} nIgnoreAnythingBelowBytes 
	 * @param {number} nExitProcessIfTotalMemoryExceedsBytes 
	 */
	check(nIgnoreAnythingBelowBytes = /*256MB*/ 268435456, nExitProcessIfTotalMemoryExceedsBytes = /*1 GB*/ 1073741824)
	{
		const objMemoryUsage = process.memoryUsage();

		if(!this._objMemoryUsage)
		{
			this._objMemoryUsage = objMemoryUsage;
		}

		if(objMemoryUsage.heapTotal < nIgnoreAnythingBelowBytes && objMemoryUsage.external < nIgnoreAnythingBelowBytes)
		{
			// Too small variations to matter.
			return;
		}

		if(objMemoryUsage.heapTotal + objMemoryUsage.external > nExitProcessIfTotalMemoryExceedsBytes)
		{
			console.error(`PID ${process.PID}. Total allocated memory ${parseInt((objMemoryUsage.heapTotal + objMemoryUsage.external) / 1024 / 1024)} MB exceeded the self imposed threshold of ${parseInt(nExitProcessIfTotalMemoryExceedsBytes / 1024 / 1024)} MB. Exiting process.`);
			process.exit(1);
		}

		if(objMemoryUsage.heapTotal < this._objMemoryUsage.heapTotal * 0.76 || objMemoryUsage.external < this._objMemoryUsage.external * 0.76)
		{
			this.log("Memory usage has decreased.", objMemoryUsage);
			Object.assign(this._objMemoryUsage, objMemoryUsage);
		}
		else if(objMemoryUsage.heapTotal > this._objMemoryUsage.heapTotal * 1.24 || objMemoryUsage.external > this._objMemoryUsage.external * 1.24)
		{
			if(global.gc)
			{
				global.gc();
			}
			else
			{
				console.error("global.gc() is not available. Did you start the node process using --expose-gc?");
			}

			if(objMemoryUsage.heapTotal > this._objMemoryUsage.heapTotal * 1.24 || objMemoryUsage.external > this._objMemoryUsage.external * 1.24)
			{
				this.log("Memory usage has increased.", objMemoryUsage);
				Object.assign(this._objMemoryUsage, objMemoryUsage);
			}
		}
	}

	log(strMessage, objMemoryUsage)
	{
		console.log("\n\n", `
			PID: ${process.pid}
			${new Date().toISOString()}
			${strMessage}
			heapTotal: ${parseInt(objMemoryUsage.heapTotal / 1024 / 1024)} MB
			heapUsed: ${parseInt(objMemoryUsage.heapUsed / 1024 / 1024)} MB
			external: ${parseInt(objMemoryUsage.external / 1024 / 1024)} MB
		`.replace(/^\s+/g, ""), "\n\n");
	}
};

module.exports = new Main();
