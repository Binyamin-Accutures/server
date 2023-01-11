const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')
const { log } = require('console')


const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
})

// uploads a files to s3
const uploadFiles = async (files, path)=> { // array of files to upload and path to location of the files in S3
  
    const params = files.map(file => {
        return {
            Bucket: bucketName,
            Key: "/"+file.path,
            Body: fs.createReadStream(file.path) // ?????
        }
    })
    return await Promise.all(params.map(param => s3.upload(param).promise()))
}
exports.uploadFiles=uploadFiles
// #################################################################

async function showInFolder(path){
    const params = {
        Bucket:bucketName,
    }
    s3.listObjectsV2(params,(err, data) => {
        log(err)
        log(`
            ${bucketName},
            ${region},`
        )
        console.log(data);
        return data;
    })
}
exports.showInFolder=showInFolder
// downloads a file from s3
function getFileStream(path) {
    console.log(path);
    const downloadParams = {
        Bucket: bucketName,
        Key: path
    };
    

  return s3.getObject(downloadParams).createReadStream()
}
exports.getFileStream=getFileStream