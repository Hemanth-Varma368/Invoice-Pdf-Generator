const express=require("express");

const multer=require("multer");

const Router=express.Router();



const storage=multer.diskStorage({
    destination:function(req,file,cb){
      cb(null,"uploads/");
    },
    filename:function(req,file,cb){
      cb(null,"sample-invoice.json");
    },
  });
  const upload=multer({storage:storage});

   const { uploadData } = require("../controllers/user");

  Router.route('/upload').post(upload.single("jsonFile"), uploadData);

 

module.exports=upload;