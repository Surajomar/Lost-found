const express = require('express');
const router =  express.Router();
const Item = require('../models/Item');
const User = require('../models/User')
const { isLoggedin,isItemAuthor } = require('../middleware')

router.get('/' ,(req,res)=>{
    res.render('items/basic');
})

//  to show all items
router.get('/home' , async(req,res) =>{
    try{
        let {category} = req.query;
        if( category == "All" || category == undefined){
            let items = await Item.find({});
            res.render('items/index' , {items});
        }
        else{
            let items = await Item.find({category : category});
            res.render('items/index' ,{items});
        }
        // res.status(200).json(items);
    }
    catch(e){
        res.render('items/error' ,{err :e.message});
    }

})


// to render new page for add items
router.get('/item/new' ,isLoggedin , (req,res)=>{
    try{
        res.render('items/new');
    }
    catch(e){
        res.render('items/error' ,{err :e.message});
    }    
})

// to actually add recipes in database
router.post('/item/new' ,isLoggedin , async(req,res)=>{
    try{
        let {title , img ,category, desc, contact} = req.body;

            let count = req.user.post_count + 1;
            await User.findByIdAndUpdate(req.user._id , {post_count : count});
            let author = req.user._id;
            await Item.create({title , img ,category, desc, contact , author});
            res.redirect('/home');
               
      
        // res.status(200).json("haa bhai");
        
    }
    catch(e){
        res.render('items/error' ,{err :e.message});
    }
})


// to show perticular product isLoggedin
router.get('/item/:id', isLoggedin, async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Item.findById(id)
        
        // Check the role of the logged-in user
        const userRole = req.user.role; // Assuming user role is stored in req.user.role
        // console.log(userRole);

        let user = await User.findById(item.author);
        const authorName = user.username;
        let category = item.category;
        let relatedItem  =   await Item.find({category : category});
        
            res.render('items/show', { item , authorName , relatedItem });
        
    } catch (e) {
        res.render('items/error', { err: e.message });
    }
});



//  for edit render edit page
router.get('/item/:id/edit' , isLoggedin  , isItemAuthor , async(req,res)=>{
    try {
        let{id} = req.params;
        let item = await Item.findById(id);
        res.render('items/edit' , {item});
    }
    catch(e){
        res.render('items/error' ,{err :e.message});
    }

})

// to actually edited product
router.post('/item/:id/edit' , isLoggedin , isItemAuthor ,async (req,res)=>{
    try{
        let {id} = req.params;
        let {title , img , desc, contact} = req.body;
        await Item.findByIdAndUpdate(id , {title , img , desc , contact});
        res.redirect(`/item/${id}`);
    }
    catch(e){
        res.render('items/error' ,{err :e.message});
    }

})


router.post('/item/:id/delete' , isLoggedin,  isItemAuthor , async(req,res)=>{
    try {  
        let {id} = req.params;
        let item = await Item.findById(id);

      
        // Update the post_count
        await User.findByIdAndUpdate(item.author, { $inc: { post_count: -1 } });
 
       
        await Item.findByIdAndDelete(id);
        res.redirect('/home');

    }
    catch(e){
        res.render('items/error' ,{err :e.message});
    }

})





module.exports = router;