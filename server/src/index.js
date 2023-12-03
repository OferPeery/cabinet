import "dotenv/config";

import app from "./app.js";

app.listen(process.env.SERVER_PORT, () => {
  console.log(
    `Application's server is listening on port ${process.env.SERVER_PORT}`
  );
});
