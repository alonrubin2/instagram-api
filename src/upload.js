const fs = require('fs');
const AWS = require('aws-sdk');
import { S3 } from 'aws-sdk';
import {keys} from './keys/keys';

const s3 = new AWS.S3({
    accessKeyId: keys.ID,
    secretAccessKey: keys.secret
});

function uploadFile(fileName) {
    const fileContent = fs.readFileSync(fileName);

    const params = {
        bucket: top-bucket,
        key: fileName,
        body: fileContent
    };

    S3.upload(params, function(err, data) {
        if(err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};


