import app from "../../src/app.js";

export const createMockServer = () => {
  let server;

  return Object.freeze({
    start: () =>
      new Promise((res) => {
        server = app.listen(process.env.SERVER_PORT, () => {
          console.log(
            `Application's server is listening on port ${process.env.SERVER_PORT}`
          );
          res();
        });
      }),

    end: () => new Promise((res) => server?.close(res)),
  });
};
