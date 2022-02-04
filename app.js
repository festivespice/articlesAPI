const express = require("express");
const bodyParser = require("body-parser");
const lodash = require("lodash");
const mongoose = require("mongoose");

const app = express();
mongoose.connect("mongodb://localhost:27017/wikiDB");

app.use(bodyParser.json());
app.use(express.static("public"));

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "no title used"],
        unique: [true, "no unique title given"]
    },
    content: {
        type: String, 
        required: [true, "no article content given"]
    }
});
const Article = new mongoose.model("article", articleSchema);

app.route("/articles")

    .get(function(req, res){
        Article.find(function(err, foundArticles){
            if(err){
                res.send(err);
            }else{
                res.send(foundArticles);
            }
        });
    })

    .post(function(req, res){
        const foundTitle = req.body.title;
        const foundContent = req.body.content; 
        const newArticle = new Article({
            title: foundTitle,
            content: foundContent
        });
        console.log(newArticle);
        newArticle.save(function(err){
            if(err){
                res.send(err);
            }else{
                res.send("successfully saved document");
            }
        });
    })

    .delete(function(req, res){
        const deleteTitle = req.body.title;
        Article.deleteMany(function(err){ //delete everything
            if(err){
                res.send(err);
            }else{
                res.send("successfully deleted all articles");
            }
        });
    }); //the last one gets a semicolon


app.route("/articles/:specificArticle")
    .get(function(req, res){
        const article = req.params.specificArticle;
        Article.find({title: article}, function(err, result){
            if(!err){
                res.send(result);
            }else{
                res.send(err);
            }
        });
    })
    .put(function(req, res){
        const article = req.params.specificArticle;
        const contentGiven = req.body.content;
        
        Article.updateOne({title: article}, 
            {title: req.body.title, content: contentGiven},
            function(err){ //the overwrite lets mongoDB know that we want to rewrite the entire document
            if(err){
                res.send(err);
            }else{
                res.send("successfully updated");
            }
        });
    })
    .patch(function(req, res){
        const article = req.params.specificArticle; //should be from the body
        Article.updateOne({title: article},
            {$set: req.body}, //we can set the update to the req.body with the $set tag. MongoDB will validate it. 
             function(err){
                if(err){
                    res.send(err);
                }else{
                    res.send("successfully updated");
                }
        });
    })
    .delete(function(req, res){
        const article = req.params.specificArticle;
        Article.deleteOne({title: article}, function(err){
            if(err){
                res.send(err);
            }else{
                res.send("successfully deleted article: " + article);
            }
        })
    });


app.listen(3000, function(){
    console.log("server started on port 3000");
});

