const express = require('express');
const Route = express.Router();
const {crypt,compare} = require('../crypt');
const multer = require('multer');
const path = require('path');
const {upload} = require('../image/imagBB');

const User = require('../schemas/User');
const Chats = require('../schemas/Chats');

const storage = multer.diskStorage({
    destination: path.join(path.join(__dirname, '../'),'/uploads'),
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        let a=file.originalname.split('.');
        cb(null, file.fieldname + '-' + uniqueSuffix+ `.${a[a.length-1]}`)
    }
});

const img=multer({storage});

//singup
Route.post('/singup', async (req,res)=>{
    const {name, lastname, email, password,description, interests} =req.body;
    const u1=new User({name, lastname, email,description, password:await crypt(password), interests});
    if (await validateUser(email)) {
        u1.save((err,user)=>{
            if (err) {
                res.status(400).send('No se ha podido crear el usuario');
            }else {
                generateChats(user._id);
                res.json({id:user._id, name:user.name, lastname:user.lastname, images:user.images});
            }
        })
    }else{
        res.status(400).send(`El correo ya se encuenta registrado!`);
    }
});

//login
Route.post('/login', async (req,res)=>{
    let {email, password}=req.body;
    User.findOne({email})
    .then(async (user)=>{
        if(await compare(password,user.password)) {
            res.send({id:user._id, name:user.name, lastname:user.lastname, images:user.images});
        }else{
            res.status(400).send('El usuario y contraseña no coinciden');
        }
    })
    .catch(()=>{
        res.status(400).send('Ha ocurrido un error al Iniciar sesión');
    })
});

//images
Route.post('/image',img.single('image'),async (req,res)=>{
    let {url}=await upload(req.file.path);
    User.findByIdAndUpdate({_id:req.body.id},{
        $push: {images:url}
    },(err,data)=>{
        if (err) res.status(400).send('Error al subir la imagen');
        else res.send({url:url});
    });
});

/*
Route.post('/images',img.array('images'),async (req,res)=>{
    let urls=req.files.map(file=>(file.path))
    let a= await uploads(urls)
    console.log(a)
    res.sendStatus(200)
    let {url}=await upload(req.file.path);
    User.findByIdAndUpdate({_id:req.body.id},{
        $push: {images:url}
    },(err,data)=>{
        if (err) res.status(400).send('Error al subir la imagen');
        else res.send({url:url});
    });
});
*/

//update
Route.put('/data', (req,res)=>{
    const {id, name , lastname, description, interests }=req.body;
    User.findByIdAndUpdate(id, {name , lastname, description, interests}, (err,data)=>{
        if (err || !data) res.status(400).send('No se ha podido editar el usuario');
        else res.send(true);
    });
});

//delete
Route.delete('/image', (req,res)=>{
    const { id, url }=req.body;
    User.findByIdAndUpdate(id, {$pull:{images:url}},(err,data)=>{
        if (err || !data) res.status(400).send('No se ha podido eliminar la foto');
        else res.send(true);
    });
});

Route.delete('/account', (req,res)=>{
    const {id}=req.body;
    User.findByIdAndDelete(id, (err,data)=>{
        if (err || !data) res.status(400).send('No se ha podido eliminar la cuenta');
        else {
            Chats.deleteMany({$or:[{'chat.destination':id}, {user:id}]}).remove((err,data)=>{
                if (err ) res.status(400).send('No se ha podido eliminar los chats')
                else res.send(true)
            });
        }
    });
});

//get
Route.get('/id/:id',(req,res)=>{
    User.findById(req.params.id,(err , data)=>{
        if (err || !data) res.status(400).send('No se ha podido encontrar el usuario');
        else {
            const {_id:id, name, lastname, description, interests, images}=data;
            res.send({id, name, lastname, description, interests, images});
        }
    });
});

async function validateUser(email) {
    return await User.find({email})
    .then((data)=>{
        if (data.length>0) return false;
        else return true;
    });
}

async function generateChats(id) {
    let c1=new Chats({user:id});
    return c1.save((err,data)=>{
        if (err) return null;
        else return data
    });
}
module.exports=Route