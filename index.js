const express=require("express");
const app=express();
const path=require("path");

const ejs=require("ejs");
const router=require("./routes/user");


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));



app.set("view engine","ejs");





app.use("/", router);
port=8000;
app.listen(port,()=>console.log(`server started at ${port}`));
