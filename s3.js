// const aws = require('aws-sdk');
// const fs = require('fs');


// const s3 = new aws.S3 ({
//     region: "us-east-1",
//     secretAccessKey: "AYuI8LSSauVgf1Xst2kTivF2BPclDdI9DpXFeLZm",
//     accessKeyId: "AKIA5XTV4KA7E4X34646"
    
// })

// function uploadFile(file){
//    const fileStream = fs.createReadStream(file.path);

//     const uploadParams = {
//         Bucket : "my-unique-bucket-62cb7f9a6334759e",
//         Body: fileStream,
//         Key: file.filename+Date.now().toString()
        
//     }
//     return s3.upload(uploadParams).promise();
// }
// exports.uploadFile = uploadFile;




function getFileStream (fileKey) {
    
const downloadParams = {
    Key: fileKey,
    Bucket: "my-unique-bucket-62cb7f9a6334759e"
}
return s3.getObject(downloadParams).createReadStream();


}
exports.getFileStream = getFileStream