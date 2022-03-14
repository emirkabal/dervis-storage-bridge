import { Application } from "express";
import { UploadedFile } from "express-fileupload";
import {
  existsSync,
  fstatSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} from "fs";
import mime from "mime-types";
import options from "../../utils/options";

export default class Local {
  app: Application;
  constructor(app) {
    this.app = app;
    this.init();
  }

  init() {
    existsSync("./uploads") || mkdirSync("./uploads");

    this.app.post("/upload", async (req, res) => {
      if (req.headers.authorization !== process.env.UPLOAD_KEY)
        return res.status(401).send({
          error: "Unauthorized"
        });
      if (!req.files)
        return res.status(400).send({
          error: "No files were uploaded."
        });
      try {
        const { file } = req.files as { file: UploadedFile };
        writeFileSync(`./uploads/${file.name}`, file.data);
        res.status(200).json({
          url: `${options.url}${file.name}`
        });
      } catch (error) {
        res.status(500).json({
          error: error?.message || "Couldn't upload file"
        });
      }
    });

    this.app.get("/:fileName", async (req, res) => {
      try {
        const { fileName } = req.params;
        const file = readFileSync(`./uploads/${fileName}`);
        if (mime.lookup(fileName)) {
          res.contentType(mime.lookup(fileName).toString());
          if (
            [
              "video/quicktime",
              "video/mp4",
              "video/x-msvideo",
              "video/x-ms-wmv",
              "application/ogg",
              "video/webm",
              "audio/ogg",
              "audio/wave",
              "audio/webm",
              "audio/wav",
              "audio/mpeg",
              "audio/mp4",
              "audio/x-wav",
              "audio/x-pn-wav"
            ].includes(mime.lookup(fileName).toString())
          ) {
            res.writeHead(206, {
              "Accept-Ranges": "bytes",
              "Content-Range": `bytes 0-${file.byteLength - 1}/${
                file.byteLength + 1
              }`,
              "Content-Length": file.byteLength + 1,
              "Content-Type": mime.lookup(fileName).toString()
            });
          }
        }
        res.end(file);
      } catch (error) {
        res.status(404).send();
      }
    });
  }
}
