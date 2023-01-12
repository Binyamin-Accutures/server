const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')
const { errMessage } = require('./errController')


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
        console.log(file);
        return {
            Bucket: bucketName,
            Key: `${path}/${file.filename}.png`,
            Body: fs.createReadStream(file.path)
        }
    })
    return await Promise.all(params.map(param => s3.upload(param).promise()))
}

async function showInFolder(path){
    console.log(path);
    const params = {
        Bucket:bucketName,
        Prefix:path,
    }
    const results = await s3.listObjectsV2(params,(err, data) => {
        if(err) throw errMessage.CAN_NOT_GET_URL
        return data.Contents;
    }).promise();
    return results
}


function getFileStream(path) {
    const downloadParams = {
        Bucket: bucketName,
        Key: path
    };
    

  return s3.getObject(downloadParams).createReadStream()
}


async function uploadSavegFiles(files,path){
    const params = files.map(file => {
        console.log(file);
        return {
            Bucket: bucketName,
            Key: `${path}/${file.filedname}/${file.filename}`,
            Body: fs.createReadStream(file.path)
        }
    })
    return await Promise.all(params.map(param => s3.upload(param).promise()))
}

const downloadsfile = async (res,key,func)=>{
    
    const readStream = func(key)
    
    readStream.on('data', (data) => {
      console.log(`Received ${data.length} bytes of data.`);
      console.log(data)
      res.send(data);
    });
    
    readStream.on('error', (err) => {
      sendError(res,errMessage.CAN_NOT_GET_URL)
    });
}

module.exports ={downloadsfile,uploadSavegFiles,getFileStream,showInFolder,uploadFiles}