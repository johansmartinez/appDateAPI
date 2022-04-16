const fs = require('fs');
const imgbbUploader = require('imgbb-uploader');
const {key} = require('../keys/imageKey');


async function upload(url) {
    return await imgbbUploader(key, url)
    .then((response)=>{
        return response;
    }).catch(()=>{
        return null;
    }).finally(()=>{
        fs.unlinkSync(url);
    })
}

async function uploads(urls) {
    return await urls.map(async (u)=>{
        let {url}= await upload(u);
        return url;
    });
}
module.exports={
    upload,
    uploads
};