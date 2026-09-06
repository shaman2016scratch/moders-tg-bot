import fsPromises from "fs/promises";
import path from "path";

const readJson = async (filePath) => {
	const content = await fsPromises.readFile(filePath, "utf8");
	return JSON.parse(content);
};

const writeJson = async (filePath, data) =>
	fsPromises.writeFile(filePath, JSON.stringify(data), "utf8");

async function getIndex() {
	return await readJson("./data.json");
}

async function updateIndex(indexData) {
	await writeJson("./data.json", indexData);
	return true;
}

export {
    readJson,
    writeJson,
    getIndex,
    updateIndex
}