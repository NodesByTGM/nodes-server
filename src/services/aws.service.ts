import { S3 } from 'aws-sdk';
// import { Error, ManagedUpload } from 'aws-sdk/clients/s3';
import { generateFileName } from '../utilities/common';
import { FileModel } from '../mongodb/models';

const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});


export const uploadFile = async (file: any, path = 'assets') => {
    const filePath = generateFileName(file, path);
    const decodedFile = Buffer.from(file.replace(/^data:\w+\/\w+;base64,/, ''), 'base64');
    const match = file.match(/^data:([a-z]+\/[a-z0-9-+.]+);base64,/i);
    const fileType = match[1];

    console.log("fileType", fileType)
    const params = {
        Bucket: `${process.env.AWS_BUCKET_NAME}`,
        Key: filePath,
        Body: decodedFile,
        ContentEncoding: fileType || 'application/octet-stream',
        // ACL: "public-read",
    };

    // s3.upload(params, (err: any | Error, data: ManagedUpload.SendData) => {
    //     if (err) { } else { }
    // });
    try {
        const result = await s3.upload(params).promise()

        const _file = await FileModel.create({
            id: result.Key,
            url: result.Location
        })
        return _file
    } catch (error: any) {
        console.log(error)
    }
};

export const deleteFile = async (Key: string) => {
    const params = {
        Bucket: `${process.env.AWS_BUCKET_NAME}`,
        Key
    };
    // s3.deleteObject(params, function (err, data) {
    //     if (err) {};  // error
    //     else {};                 // deleted
    // });
    try {
        const result = await s3.deleteObject(params).promise()
        return result
    } catch (error: any) {
        // console.log(error)
    }
}


export default {
    uploadFile,
    deleteFile
}