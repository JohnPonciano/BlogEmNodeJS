const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Post = new Schema({

    titulo:{
        type: String,
        required : true
    },
    slug:{
        type:String,
        required:true
    },
    descricao:{
        type:String,
       // default:conteudo
    },
    conteudo:{
        type: String,
        required: true
    },
    categorias:{
        type: Schema.Types.ObjectId,
        ref: 'categorias',
        required: true
    },
    data:{
        type: Date,
        default: Date.now()
    }

})

mongoose.model("posts",Post)