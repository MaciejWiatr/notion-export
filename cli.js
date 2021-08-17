const figlet = require("figlet");
const prompts = require("prompts");
const logUpdate = require("log-update");
const chalk = require("chalk");

const displayHeader = () =>
	new Promise((resolve, reject) => {
		figlet("Notion export", function (err, data) {
			if (err) {
				console.log("Something went wrong...");
				console.dir(err);
				reject();
			}
			console.log(data);
			resolve();
		});
	});

const collectUserData = async () => {
	const { token, pageURL, outputDir } = await prompts([
		{
			type: "text",
			name: "token",
			message: "Your Notion v2 token",
		},
		{
			type: "text",
			name: "pageURL",
			message: "Page URL",
		},
		{
			type: "text",
			name: "outputDir",
			message: "Output directory",
		},
	]);
	LogManager.loggingEnabled = true;

	return { token, pageURL, outputDir };
};

class LogManager {
	static loggingEnabled = false;

	static logExportProgress(status, progress) {
		if (!this.loggingEnabled) return;

		logUpdate(
			`${chalk.greenBright.bold(
				"Export status"
			)}: ${status} \n${chalk.greenBright.bold(
				"Pages exported"
			)}: ${progress}`
		);
	}

	static logDownloadSuccess(resp) {
		if (!this.loggingEnabled) return;
		console.log(`${chalk.yellow.bold("Zip url")}:\n ${resp}\n`);
	}
}

module.exports = { collectUserData, displayHeader, LogManager };
