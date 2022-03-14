import { Application } from "express"
import { UploadedFile } from "express-fileupload"
import { existsSync, mkdirSync, writeFileSync } from "fs"
import express from "express"
import options from "../../utils/options"

export default class Local {
  app: Application
  constructor(app) {
    this.app = app
    this.init()
  }

  init() {
    existsSync("./uploads") || mkdirSync("./uploads")

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
        writeFileSync(`./uploads/${file.name}`, file.data)
        res.status(200).json({
          url: `${options.url()}${file.name}`
        })
      } catch (error) {
        res.status(500).json({
          error: error?.message || "Couldn't upload file"
        })
      }
    })

    this.app.use(express.static("./uploads"))
    this.app.use("*", (req, res) => {
      res.status(404).end()
    })
  }
}
