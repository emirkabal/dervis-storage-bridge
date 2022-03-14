import express from "express";
import Bucket from "./Bucket";
import fileUpload from "express-fileupload";
import Backblaze from "./structures/Backblaze";
import options from "../utils/options";
import Local from "./structures/Local";

export default class Server {
  app: express.Application;
  port: number | string;

  constructor() {
    this.app = express();
    this.init();
  }

  init() {
    this.app.disable("x-powered-by");
    this.app.use(fileUpload());
    this.app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      next();
    });

    this.app.get("/", (req, res) => {
      if (process.env.REDIRECT_URL) res.redirect(process.env.REDIRECT_URL);
      else res.end();
    });

    if (process.env.ENABLE_LOCAL_STORAGE === "true") {
      console.log("dervis-storage-bridge: Local storage enabled");
      new Local(this.app);
    } else {
      new Backblaze(this.app, new Bucket());
    }

    this.listen();
  }

  listen() {
    this.app.listen(options.port, () => {
      console.log(`dervis-storage-bridge: Listening on port ${options.port}`);
    });
  }
}
