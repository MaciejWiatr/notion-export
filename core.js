const axios = require("axios");
const stream = require("stream");
const { promisify } = require("util");
const fs = require("fs");
const AdmZip = require("adm-zip");
const { LogManager } = require("./cli");
const finished = promisify(stream.finished);
const path = require("path");

const tmpExportDir = `${process.cwd()}/notion-export-tmp`;

const cleanupTmp = () => {
	if (fs.existsSync(tmpExportDir))
		fs.rmdirSync(tmpExportDir, { recursive: true });
};

const unzipOutput = (destination) => {
	const zip = new AdmZip(`${tmpExportDir}/out.zip`);
	if (!fs.existsSync(destination)) fs.mkdirSync(destination);
	zip.extractAllTo(destination, true);
};

async function downloadFile(fileUrl, outputLocationPath) {
	if (!fs.existsSync(path.dirname(outputLocationPath))) {
		fs.mkdirSync(path.dirname(outputLocationPath));
	}
	const writer = fs.createWriteStream(outputLocationPath);
	return axios({
		method: "get",
		url: fileUrl,
		responseType: "stream",
	}).then(async (response) => {
		response.data.pipe(writer);
		return finished(writer); //this is a Promise
	});
}

const parseBlockIdFromURL = (pageUrl) => {
	const blockId = pageUrl.split("-").pop();

	const blockList = blockId.split("");
	const firstSection = blockList.slice(0, 8);
	const secondSection = blockList.slice(8, 12);
	const thirdSection = blockList.slice(12, 16);
	const fourthSection = blockList.slice(16, 20);
	const lastSection = blockList.slice(20, 32);
	const result = [
		...firstSection,
		"-",
		...secondSection,
		"-",
		...thirdSection,
		"-",
		...fourthSection,
		"-",
		...lastSection,
	].join("");
	return result;
};

const getExportStatus = async (taskId, token) => {
	const { data } = await axios.post(
		"https://www.notion.so/api/v3/getTasks",
		{
			taskIds: [taskId],
		},
		{
			headers: {
				"notion-client-version": "23.9.2.0",
				cookie: `token_v2=${token}`,
			},
		}
	);

	return data.results[0];
};

const waitUntilExportDone = (taskId, token) =>
	new Promise((resolve) => {
		let interval = setInterval(async () => {
			const exportResponse = await getExportStatus(taskId, token);
			try {
				LogManager.logExportProgress(
					exportResponse.status.type,
					exportResponse.status.pagesExported
				);
			} catch {
				console.log(
					"Something went wrong while logging download progress"
				);
			}
			if (exportResponse.status.type == "complete") {
				clearInterval(interval);
				return resolve(exportResponse.status.exportURL);
			}
		}, 1500);
	});

const enqueueExport = async (pageId, token, exportType) =>
	axios.post(
		"https://www.notion.so/api/v3/enqueueTask",
		{
			task: {
				eventName: "exportBlock",
				request: {
					blockId: pageId,
					recursive: true,
					exportOptions: {
						exportType: exportType,
						timeZone: "Europe/Warsaw",
						pdfFormat: "Letter",
						locale: "en",
					},
				},
			},
		},
		{
			headers: {
				"notion-client-version": "23.9.2.0",
				cookie: `token_v2=${token}`,
			},
		}
	);

const exportPage = async (pageId, destination, token, exportType) => {
	pageId = parseBlockIdFromURL(pageId);
	const { data } = await enqueueExport(pageId, token, exportType);
	const resp = await waitUntilExportDone(data.taskId, token);
	LogManager.logDownloadSuccess(resp);
	await downloadFile(resp, `${tmpExportDir}/out.zip`);
	unzipOutput(destination);
	cleanupTmp();
};

module.exports = {
	exportPage,
};
