import fs from "fs";

export function logReqBody(body: any) {
	const logStream = fs.createWriteStream("log.txt", { flags: "a" });
	var currentdate = new Date();
	var datetime =
		currentdate.getDate() +
		"/" +
		(currentdate.getMonth() + 1) +
		"/" +
		currentdate.getFullYear() +
		" " +
		currentdate.getHours() +
		":" +
		currentdate.getMinutes() +
		":" +
		currentdate.getSeconds();
	logStream.write(datetime + ": " + JSON.stringify(body) + "\n");
	logStream.end();
}
