import Bucket from "../Bucket"
import { Application } from "express"
import { UploadedFile } from "express-fileupload"
import mime from "mime-types"
import options from "../../utils/options"

export default class Backblaze {
  app: Application
  bucket: Bucket
  constructor(app, bucket) {
    this.app = app
    this.bucket = bucket
    this.init()
  }

  init() {
    this.app.post("/upload", async (req, res) => {
      if (req.headers.authorization !== process.env.UPLOAD_KEY)
        return res.status(401).send({
          error: "Unauthorized"
        })
      if (!req.files)
        return res.status(400).send({
          error: "No files were uploaded."
        })
      try {
        const { file } = req.files as { file: UploadedFile }
        const data = await this.bucket.upload(file.name, Buffer.from(file.data))
        res.status(200).json({
          url: `${options.url()}${data.fileName}`
        })
      } catch (error) {
        res.status(500).json({
          error: error?.message || "Couldn't upload file"
        })
      }
    })

    this.app.get("/:fileName", async (req, res) => {
      try {
        const { fileName } = req.params
        const stream = await this.bucket.readStream(fileName)
        if (mime.lookup(fileName))
          res.contentType(mime.lookup(fileName) as string)
        stream.pipe(res)
        stream.on("end", () => {
          res.end()
        })
      } catch (error) {
        res.status(404).send()
      }
    })
  }
}
