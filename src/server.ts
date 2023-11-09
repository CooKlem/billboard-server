import app from "./app";
import client from "./service/redisClient";

const PORT = process.env.PORT || 3000;

client
	.connect()
	.then(() => {
		app.listen(PORT, () =>
			console.log("Listening on http://localhost:" + PORT)
		);
	})
	.catch((error) => console.log(error));
