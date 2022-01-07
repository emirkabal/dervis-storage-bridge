import dotenv from "dotenv";
dotenv.config();
import express from "express";
import Bucket from "./classes/Bucket";
import fileUpload, { UploadedFile } from "express-fileupload";
const app = express();
const port = process.env.PORT || 3000;

app.use(fileUpload());

const bucket = new Bucket();

app.get("/", async (req, res) => {
  res.redirect("https://emirkabal.com");
});

app.post("/upload", async (req, res) => {
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
    const data = await bucket.upload(file.name, Buffer.from(file.data));
    res.status(200).json({
      url: `${
        process.env.NODE_ENV === "development"
          ? `http://localhost:${port}/`
          : process.env.BASE_URL
      }${data.fileName}`
    });
  } catch (error) {
    res.status(400).json({
      error: error?.message || "Couldn't upload file"
    });
  }
});

app.get("/:fileName", async (req, res) => {
  try {
    const { fileName } = req.params;
    const stream = await bucket.readStream(fileName);
    stream.pipe(res);
    stream.on("end", () => {
      res.end();
    });
  } catch (error) {
    res.status(404).send();
  }
});

app.listen(port, () => {
  console.log(`storage: Listening on port ${port}`);
});