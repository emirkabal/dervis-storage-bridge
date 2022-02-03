import B2 from "backblaze-b2";
import { Readable } from "stream";
const cache = new Map();

export default class extends B2 {
  lastAuthorization: Date;
  constructor() {
    super({
      applicationKeyId: process.env.B2_ID,
      applicationKey: process.env.B2_KEY
    });
  }

  async auth() {
    if (this.lastAuthorization) {
      const diff = new Date().getTime() - this.lastAuthorization.getTime();
      if (diff < 1000 * 60 * 60 * 3) return;
    }
    await this.authorize().catch(() => null);
    this.lastAuthorization = new Date();
  }

  async getUploadInfo(): Promise<UploadInfo> {
    await this.auth();
    if (cache.has("uploadInfo")) return cache.get("uploadInfo");
    const { data } = await this.getUploadUrl({
      bucketId: process.env.B2_BUCKET_ID
    });
    cache.set("uploadInfo", data);
    return data;
  }

  async upload(fileName: string, file: Buffer): Promise<UploadedFile> {
    await this.auth();
    const { uploadUrl, authorizationToken } = await this.getUploadInfo();
    const { data } = await this.uploadFile({
      fileName,
      data: file,
      uploadUrl,
      uploadAuthToken: authorizationToken
    });
    return data;
  }

  async readStream(
    fileName: string,
    bucket: string = process.env.B2_BUCKET_NAME
  ): Promise<Readable> {
    await this.auth();
    const { data } = await this.downloadFileByName({
      fileName: fileName,
      bucketName: bucket,
      responseType: "stream"
    });
    return data;
  }
}
