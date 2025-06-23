const express=require("express");
const app=express();
const Router=express.Router();
const upload=require("../middleware/upload")


const{showPdf,viewPdf,uiPage,generatePdf,downloadPdf,uploadData,postData}=require("../controllers/user");

Router.route("/").get(showPdf);


Router.route("/view").get(viewPdf);

Router.route("/uipage").get(uiPage);

Router.route('/generate-pdf').get(generatePdf);



Router.route("/upload").post(upload.single("jsonFile"), uploadData);



Router.route('/download-pdf').get(downloadPdf);

Router.route("/postdata").post(postData);


module.exports=Router;