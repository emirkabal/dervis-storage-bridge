# dervis-storage-bridge
Dervis is a private file host for yourself, dervis is uses Backblaze B2 Cloud Storage like a Amazon S3 and lets upload your files immediately.

## Pre-Installation

1. Sign up for [Backblaze.com](https://www.backblaze.com/b2/sign-up.html?referrer=emirkabal)
2. Then enter **Buckets** page.
3. Create a new bucket with this options:
```
Bucket Name: <entername>
Files in Bucket are: Private
Default Encryption: Enable
```
4. Copy BucketID and BucketName then fill the `.env`  file.
5. Go to App Keys and click `Generate New Master Application Key` 
6. Then copy given information to `.env` file. 
7. `UPLOAD_KEY` is your authorzation header scope for security.

# Installation
```bash
# install dependencies
yarn
```

3. Fill the `BASE_URL` and `PORT` scopes in `.env`
4. The `BASE_URL` env scope must be url like `https://dervis.emirkabal.com/` or `http://127.0.0.1:3000/`

```bash
# linux based systems
yarn start

# for windows
yarn start:win
```

```bash
# console output should be like this
storage: Listening on port 3000 # or your port
```
