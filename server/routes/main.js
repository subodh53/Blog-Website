const express = require('express');
const router = express.Router();
const Post = require('../modules/Post');
const { get } = require('mongoose');


// Routes

// GET Home
router.get('',async(req,res)=>{
    try {
        const locals = {
            title: "NodeJS Blog",
            description: "Simple blog created with NodeJS"
        }
        // const data = await Post.find();
        let perPage = 10;
        let page = req.query.page || 1;
        const data = await Post.aggregate([{$sort:{createdAt: -1}}])
        .skip(perPage*page-perPage)
        .limit(perPage)
        .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page)+1;
        const hasNextPage = nextPage <= Math.ceil(count/perPage);


        res.render('index',{locals,data,current:page,nextPage: hasNextPage? nextPage : null});
    } catch (error) {
        console.log(error);
    }
});


// GET 
// Post :id
router.get('/post/:id',async(req,res)=>{
    let slug = req.params.id;
    const data = await Post.findById({_id:slug});
    try {
        const locals = {
            title: data.title,
            description: "Simple blog created with NodeJS"
        }
        res.render('post',{locals,data});
    } catch (error) {
        console.log(error);
    }
})



// POST
// Search term
router.post('/search',async(req,res)=>{
    try {
        const locals = {
            title:"Search"
        }
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g,"");
        const data = await Post.find({
            $or: [
                {title: {$regex: new RegExp(searchNoSpecialChar,'i')}},
                {body: {$regex: new RegExp(searchNoSpecialChar,'i')}}
            ]
        })
        console.log(searchTerm);
        res.render("search",{
            data,
            locals
        });
    } catch (error) {
        console.log(error);
    }
})


// function insertPostData(){
//     Post.insertMany([
//         {
//             title:"Building a blog",
//             body:"This is the body text"
//         },
//         {
//             title:"Learning the basics of Node",
//             body:"Building a blog website"
//         },
//         {
//             title:"Learing WebDev",
//             body:"Learning from net ninja"
//         }
//     ])
// }   

// function insertPostData(){
//     Post.insertMany([
//         {
//             title:"Which mobile to buy?",
//             body:"Buying mobiles"
//         },
//         {
//             title:"Best cars of 2024",
//             body:"Cars!!!"
//         },
//         {
//             title:"Tech news",
//             body:"Bset of the tech world"
//         },
//         {
//             title:"The olympics",
//             body:"Whats happening at the olympics!!"
//         },
//         {
//             title:"Fintech",
//             body:"The future of Fintech"
//         },
//         {
//             title:"Internet",
//             body:"History of the internet"
//         }
//     ])
// } 

// insertPostData();

// GET About
router.get('/about',(req,res)=>{
    res.render('about');
});



// GET Contact
router.get('/contact',(req,res)=>{
    res.render('contact');
})

module.exports = router