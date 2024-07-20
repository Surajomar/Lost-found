const mongoose =  require('mongoose');

item_Schema =  new mongoose.Schema({
    title:{
        type: String,
        trim :true,
        required :true
    },
    img:{
        type : String,
        trim : true,
        required :true
    },
    category:{
        type: String,
        trim :true,
        required :true
    },
    desc :{
        type: String,
        trim :true,
        required :true
    },
    contact :{
        type: Number,
        required :true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }

},{timestamps : true})

let  Item = mongoose.model('Item' , item_Schema);

module.exports = Item;