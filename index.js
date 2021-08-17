const { exportPage } = require("./core");
const { displayHeader, collectUserData } = require("./cli");

const main = async () => {
	await displayHeader();
	const { token, pageURL, outputDir } = await collectUserData();
	exportPage(pageURL, outputDir, token);
};

main();
