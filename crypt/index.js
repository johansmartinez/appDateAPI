const bcrypt = require('bcrypt');
const {round} = require('../keys/cryptkey');

async function crypt(text) {
    return bcrypt.hash(text, round)
    .then((hash)=>{
        return hash
    })
}

async function compare(text, hash) {
    return await bcrypt.compareSync(text, hash);
}

module.exports={
    crypt,
    compare
};