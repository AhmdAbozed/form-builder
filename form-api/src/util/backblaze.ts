
/*
To upload or download from BB:
    1. get unique BB api url, using BB account key and keyID
    2. send request to the unique BB api url to get upload/download URL
    3. send request to the upload/download URL, with the approperiate headers.
*/
import dotenv from 'dotenv'
import fs from "fs"
import https from 'https'

dotenv.config()

const { adminTokenSecret, blazeKeyId, blazeKey, HOST_PORT_URL } = process.env

class blazeApi {

    private async geturl(options: object) {

        return new Promise((resolve, reject) => {

            let urls: any;

            const getBlaze = https.request(options, (res) => {

                res.on('data', (chunk) => {
                    urls = JSON.parse(chunk);
                })

                res.on('end', () => { resolve(urls); });
            })

            getBlaze.on('error', (err) => {
                reject(err);
            });

            getBlaze.end()

        })
    }

    private async getUploadUrl(options: object) {

        return new Promise((resolve, reject) => {
            console.log("INSIDE UPLOAD URL")

            let urls: any;
            const getBlaze = https.request(options, (res) => {

                console.log("about to get blaze urls")
                res.on('data', (chunk) => {

                    urls = JSON.parse(chunk);

                })
                res.on('end', () => { resolve(urls); });


            })
            getBlaze.on('error', (err) => {
                reject(err);
            });
            getBlaze.write(JSON.stringify({ bucketId: "de0b8bd07eccef988f960a18" }))
            getBlaze.end()

        })
    }

    private async returnUploadUrl(): Promise<any> {
        const encodedkey = btoa(blazeKeyId + ":" + blazeKey)
        console.log("encoded key: " + encodedkey)
        const options = {
            hostname: 'api.backblazeb2.com',
            path: '/b2api/v2/b2_authorize_account',
            method: 'GET',
            headers: {
                Authorization: `Basic ${encodedkey}`
            }
        }



        const blazeUrls: any = await this.geturl(options)

        console.log("blaze Urls: " + JSON.stringify(blazeUrls))


        console.log("blaze Urls: " + (blazeUrls.apiUrl))
        const blazeUrlOptions = {
            hostname: blazeUrls.apiUrl.substr(8),
            path: '/b2api/v2/b2_get_upload_url',
            method: 'POST',
            headers: {
                Authorization: blazeUrls.authorizationToken
            }
        }

        const blazeUploadUrl: any = await this.getUploadUrl(blazeUrlOptions)
        console.log("blaze Upload Url: " + blazeUploadUrl)

        return blazeUploadUrl;
    }
    public async uploadImg(filepath: string, size: number, fileId:string) {
        console.log("inside uploadImg")
        const url_token = await this.returnUploadUrl();
        const url = new URL(url_token.uploadUrl)
        console.log("Got url token: "+url_token+" and got url: "+url)
        const options = {
            hostname: url.hostname,
            path: url.pathname,
            method: 'POST',
            headers: {
                Authorization: url_token.authorizationToken,
                "X-Bz-File-Name": fileId+".png",
                "Content-Type": "image/png",
                "Content-Length": fs.readFileSync(filepath).byteLength,
                "X-Bz-Content-Sha1": "do_not_verify"
                
            }
        }
    
        return new Promise((resolve, reject) => {
            let uploadresult:any;
            const blazeUploading = https.request(options, (res) => {
    
                console.log("about to get blaze urls")
                res.on('data', (chunk) => {
    
                    uploadresult = JSON.parse(chunk);
    
                })
                res.on('end', () => {console.log("img upload result: "+JSON.stringify(uploadresult)), resolve(uploadresult); });
    
    
            })
            blazeUploading.on('error', (err) => {
                reject(err);
            });
            blazeUploading.write(fs.readFileSync(filepath))
            //blazeUploading.write("hello")
            console.log(filepath)
            blazeUploading.end()
        })
    }
}

export default blazeApi;