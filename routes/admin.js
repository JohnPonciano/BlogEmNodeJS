const express = require('express')
const router = express.Router()
const mongoose= require('mongoose')

require("../models/Categoria")
const Categoria = mongoose.model("categorias")

require("../models/Post")
const Post = mongoose.model('posts')


router.get('/',(req,res)=>{
    res.render('admin/index')
})

router.get('/categorias',(req,res)=>{
    Categoria.find().sort({date:'desc'}).then((categorias)=>{
        res.render('admin/categorias',{categorias:categorias})
    }).catch((err)=>{
        req.flash("error_msg","HOUVE ALGUM ERRO")
        res.redirect("/admin")
    })
    
})

router.get('/categorias/add',(req,res)=>{
    res.render('admin/addcategorias')
})

router.post('/categorias/nova',(req,res)=>{
        //validação
        var erros = []

            if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
                erros.push({texto:'NOME INVALIDO (vazio)'})
            }
            
            if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
                erros.push({texto:'slug INVALIDO'})
            }

            if(req.body.nome.length < 2){
                erros.push({texto: "nome muito pequeno"})
            }
            if(erros.length > 0){
            res.render("admin/addcategorias",{erros : erros})
        }
    
    const novaCategoria ={
        nome: req.body.nome,
        slug : req.body.slug
    }

    new Categoria(novaCategoria).save().then(()=>{
        req.flash("success_msg","Categoria Criada com Sucesso")
        res.redirect("/admin/categorias")

    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao salvar a categoria, tente novamente"+err)
        res.redirect("/admin")
    })
})


router.get("/categorias/edit/:id",(req,res)=>{
    Categoria.findOne({_id:req.params.id}).then((categorias)=>{
        res.render("admin/editcategorias",{categorias: categorias})
    }).catch((err)=>{
        req.flash("error_msg","Esta categoria nao existe")
        res.redirect("/admin/categorias")
    })
})

router.post("/categorias/edit",(req,res)=>{

    Categoria.findOne({_id: req.body.id}).then((categorias)=>{
        categorias.nome = req.body.nome
        categorias.slug = req.body.slug

        categorias.save().then(()=>{
            req.flash("success_msg","Editada com sucesso")
            res.redirect("/admin/categorias")
        }).catch((err)=>{
            req.flash("error_msg","Erro interno ao salvar")
            res.redirect("/admin/categorias")
        })

    }).catch((err)=>{
        req.flash("error_msg" , "Erro ao editar a categoria ")
        res.redirect("/admin/categorias")
    })
})


router.post("/categorias/delete",(req,res)=>{
    Categoria.remove({_id: req.body.id}).then(()=>{
        req.flash("success_msg",'Categoria deletada com sucesso')
        res.redirect("/admin/categorias")
    }).catch((err)=>{
        req.flash("error_msg","Erro interno ou Deletar"+err)
        res.redirect("/admin/categorias")
    })
})


// rodas d o post

router.get("/posts",(req,res)=>{

    Post.find().populate('categorias').sort({data:'desc'}).then((posts)=>{
        res.render('admin/posts', {posts:posts})
    }).catch((err)=>{
        req.flash('error_msg' , "Houve um imprevisto : "+err)
        res.redirect("/admin/posts")
    })
   

})

router.get("/posts/add",(req,res)=>{
    Categoria.find().then((categorias)=>{

        res.render("admin/addposts",{categorias: categorias})

    }).catch((err)=>{
        req.flash("error_msg","Erro"+err)
        res.redirect("/admin")
    })
})

router.post("/posts/nova",(req,res)=>{
        var erros = []
        
        if(req.body.categorias == '0'){
            erros.push({texto:"Categoria invalida, ou inexistente, registre uma categoria " })
        }
        if(erros.length > 0){
            res.render("admin/addposts",{erros : erros})
        }else{
            const novoPost ={

                titulo : req.body.titulo,
                descricao:req.body.descricao,
                conteudo:req.body.conteudo,
                categorias:req.body.categorias,
                slug:req.body.slug
            }

            new Post(novoPost).save().then(()=>{
                req.flash('success_msg', "Post Criado!")
                res.redirect("/admin/posts")
            }).catch((err)=>{
                req.flash('error_msg','houve um problema'+err)
                res.redirect('/admin/posts')
            })
        }
        
})

    router.get('/posts/edit/:id',(req,res)=>{
        Post.findOne({_id: req.params.id}).then((posts)=>{
        
                
            Categoria.find().then((categorias)=>{
                res.render("admin/editposts",{categorias:categorias, posts:posts })
                }).catch((err)=>{
                    req.flash("error_msg", "houve erro ao editar categorias"+err)
                    res.redirect("/admin/editposts")
                })

        }).catch((err)=>{
            req.flash("error_msg", 'houve um erro ao editar'+err)
            res.redirect("/admin/editposts")

        })


        
    })

    router.post("/posts/edit" , (req,res) => {
        
        Post.findOne({_id:req.body.id}).then((posts)=>{
            
            posts.titulo = req.body.titulo
            posts.slug = req.body.slug
            posts.descricao = req.body.descricao
            posts.conteudo = req.body.conteudo
            posts.categorias = req.body.categorias

            posts.save().then(()=>{
                req.flash("success_msg", "Editado com sucesso")
                res.redirect("/admin/posts")
            }).catch((err)=>{
                req.flash("error_msg", "erro interno")
                res.redirect("/admin/posts")
            })
            
        }).catch((err)=>{
            req.flash("error_msg","houve um erro na ediçao"+err)
            res.redirect("/admin/posts")
        })
    })



    router.get("/posts/delete/:id",(req,res)=>{
        Post.remove({_id: req.params.id}).then(()=>{
            req.flash("success_msg",'Post deletado')
            res.redirect("/admin/posts")
        }).catch((err)=>{
            req.flash("error_msg","erro ao deletar"+err)
            res.redirect("/admin/posts")
        })

    })
   
    


module.exports = router