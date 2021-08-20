#! /usr/bin/env node
const { exportPage } = require("./core");
const { displayHeader, collectUserData } = require("./cli");

const main = async () => {
	await displayHeader();
	const { token, pageURL, outputDir, exportType } = await collectUserData();
	exportPage(pageURL, outputDir, token, exportType);
};

main();
