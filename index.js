var express =require("express");
var app=express();
var bodyParser = require('body-parser');
var multer  = require('multer');
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views','./views')
app.use(express.static("public"));
//mongoose
const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://minhnha120:0379572434@cluster0.dfcdo.mongodb.net/film?retryWrites=true&w=majority",
{useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
},function(error){
    if(error){
        console.log(error);
    }else{
        console.log('thanh cong')
    }
}
)
app.listen(3000);
//goi model
var film = require("./models/filmModel")
//uploadimage
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()  + "-" + file.originalname)
    }
});  
var upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if(file.mimetype=="image/bmp" || file.mimetype=="image/png"|| file.mimetype=="image/jpg"|| file.mimetype=="image/gif"){
            cb(null, true)
        }else{
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single("imageactor");
//function add
app.get("/add",function(req,res){
   res.render("add");
})
app.post("/add",function(req,res){
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          res.json("A Multer error occurred when uploading."); 
        } else if (err) {
          res.json("An unknown error occurred when uploading." + err);
        }else{
           var actor=new film({ 
            Name:req.body.nameactor, 
            Image:req.file.filename, 
            Level:req.body.levelactor,
            Description:req.body.descriptionactor,
           })
           actor.save(function(err){
               if(err){
                   res.json('upload faild');
               }else{
                   res.redirect("list")
               }
           })
        }

    });
 })
 app.get("/list",function(req,res){
    film.find(function(err,film){
        if(err){
            res.json('loi');
        }else{
         
           res.render('list',{danhsach:film});
        }
    })
 })
 app.get("/delete/:id",function(req,res){
    film.findById(req.params.id, function(err, data){
		data.remove(function(){
            if(err){
                res.json('xoa faild');
            }else{
                res.redirect('/list');
            }
		})
	});
 })

 app.get("/edit/:id",function(req,res){
    film.findById({_id: req.params.id}, function(err, data){
        if(data){
            res.render('edit',{errors: null, actor: data});
        }else{
            res.json('loi');
        }
			
	});
 })
 app.post("/edit/:id",function(req,res){
    film.findOne({_id: req.params.id}, function(err, data){
                data.Name=req.body.nameactor, 
                data.Image='dd', 
                data.Level=req.body.levelactore,
                data.Description="dsds",
                data.save(function(err){
                    if(err){
                        res.json('upload faild');
                    }else{
                        res.redirect("/list")
                    }
                })
               })
        
			
	
    
 });
