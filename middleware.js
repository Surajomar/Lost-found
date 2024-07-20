const {itemschema} =  require('./Schema');
const Item =  require('./models/Item')




const isLoggedin = (req,res,next) =>{
    if(!req.isAuthenticated()){
        res.redirect('/login');
    }
    else{
        next();
    }
}



const isItemAuthor = async(req,res,next)=>{
    let {id} = req.params; //product id
    let item = await Item.findById(id); //entire blog
    // console.log(typeof(blog.author));
    if(!item.author.equals(req.user._id)){
        console.log('you have not access');
        return res.redirect('/home');
    }
    next();
}



module.exports = {isLoggedin, isItemAuthor };



