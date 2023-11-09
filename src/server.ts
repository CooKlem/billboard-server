import app from "./app";
import dbClient from "./service/redisClientFactory";

const PORT = process.env.PORT || 3000;

dbClient
	.connect()
	.then(() => {
		app.listen(PORT, () =>
			console.log("Listening on http://localhost:" + PORT)
		);
	})
	.catch((error) => console.log(error));
