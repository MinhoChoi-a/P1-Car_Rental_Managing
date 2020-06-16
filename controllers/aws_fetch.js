var Car = require('../models/car');

//const multer = require('multer');
const fs = require('fs');
const AWS = require('aws-sdk');
var async = require('async');

const s3 = new AWS.S3({
    accessKeyId: "AKIA5DWR6HFBO4UKBPE3",
    secretAccessKey: "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"
});

exports.image_fetch = (filename) => {    
  
    var params = {"Bucket": 'test-s3-may', 
                    "Key": filename};
    
    s3.getObject(params, function(err, file) {
        if(!err) {
        let url = "data:image/jpeg;base64,"+ encode(file.Body)
        }
    });
    
    return url;    
};



function encode(data)
{
    var res = (Buffer.from(data).toString('base64'));
    return res;
}

 //var str = data.reduce(function(a,b){ return a+String.fromCharCode(b) },'');
    //var res = (Buffer.from(str, 'base64').toString()).replace(/.{76}(?=.)/g,'$&\n');
    
 //return     console.log(res);
//Buffer.from(b64Encoded, 'base64').toString()); content is utf8 string

    /** 
    s3.getObject(params, function(err, data){
        if(err) {return "we got a error";}
        else{
            let response = {
                "statusCode": 200,
                "headers": {
                    "my_header": "my_value"
                },
                "body": JSON.stringify(data),
                "isBase64Encoded": false
            }
            
            let oData = response.body.toString('utf-8');
            console.log(response);
            console.log(oData);
            return oData;
        }
    });
    */



