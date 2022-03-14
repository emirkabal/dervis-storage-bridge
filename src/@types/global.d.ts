declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    B2_ID: string;
    B2_KEY: string;
    B2_BUCKET_ID: string;
    B2_BUCKET_NAME: string;
    PORT: string;
    BASE_URL: string;
    UPLOAD_KEY: string;
    REDIRECT_URL: string;
    ENABLE_LOCAL_STORAGE: string;
  }
}

interface UploadedFile {
  accountId: string;
  action: string;
  bucketId: string;
  contentLength: number;
  contentMd5: string;
  contentSha1: string;
  contentType: string;
  fileId: string;
  fileName: string;
  uploadTimestamp: number;
}

interface UploadInfo {
  uploadUrl: string;
  bucketId: string;
  authorizationToken: string;
}
