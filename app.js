const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require("./routes/admin")
const path = require('path')
const mongoose = require('mongoose')
const session = require("express-session")
const flash = require('connect-flash')
require("./models/Post")
const Post = mongoose.model('posts')
require("./models/Categoria")
const Categoria = mongoose.model('categorias')



//Config
    //session config
        app.use(session({
            secret:'cursonode',
            resave: true,
            saveUninitialized:true

        }))
        app.use(flash())
        //middleware
        app.use((req,res,next)=>{
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            next()
        })
    //body-parse config
        app.use(bodyParser.urlencoded({extended:true}))
        app.use(bodyParser.json())

    //Handlebars config
        app.engine('handlebars',handlebars({defaultLayout:'main'}))
        app.set('view engine', 'handlebars');
    //Mongoose
    mongoose.Promise = global.Promise
    mongoose.connect("mongodb+srv://adminjohn:pokemon201@cluster0-9kv1j.mongodb.net/CategoriaDB?retryWrites=true&w=majority",{ useUnifiedTopology: true }).then(()=>{
        console.log("Mongo DB Atlas, conectado! :D")
    }).catch((err)=>{
        console.log("Erro no Mongo DB ATLAS D:"+err)
    })
    //Ṕasta Public
    app.use(express.static(path.join(__dirname,'public')))
//Routes
app.use('/admin',admin)


app.get("/",(req,res)=>{
    Post.find().populate("categorias").sort({data:"desc"}).then((posts)=>{
        res.render("index", {posts : posts})

    }).catch((err)=>{
        req.flash("error_msg", 'Estamos em manutenção'+err)
        res.redirect("/404")
    })
   
})

app.get("/postagem/:slug",(req,res)=>{
    Post.findOne({slug: req.params.slug}).then((posts)=>{
        if(posts){
            res.render("postagem/index",{ posts: posts })
        }else{
            req.flash("error_msg","Este Post nao existe ou foi apagado")
            res.redirect("/")
        }
    }).catch((err)=>{
        req.flash("error_msg", "erro interno"+err)
        res.redirect("/")
    })
})


app.get("/posts",(req,res)=>{
    res.send("lista de posts")
})


app.get("/404",(req,res)=>{
    res.send("404!")
})


app.get("/categorias",(req,res)=>{
    Categoria.find().then((categorias) =>{
        res.render("categorias/index",{categorias:categorias})

    }).catch((err)=>{  
        req.flash("error_msg","erro nas cateroias")
        res.redirect("/")

    })
})


app.get("/categorias/:slug",(req,res)=>{
    Categoria.findOne({slug : req.params.slug}).then((categorias)=>{
        if(categorias){

            Post.find({categorias: categorias._id}).then((posts)=>{
                res.render("categorias/posts",{posts:posts , categorias:categorias})
            }).catch((err)=>{
                req.flash("error_msg","erro nos posts")
                res.redirect("/")
            })

        }else{
            req.flash("error_msg","categoria nao existe")
            res.redirect("/")
        }


    }).catch((err)=>{
        req.flash("error_msg","erro ao carregar as categorias")
        res.redirect("/")

    })
})



//Others
const PORT = 4042
app.listen(PORT,()=>{
    console.log("Server ON :D")
    console.log("http://localhost:4042")
})
