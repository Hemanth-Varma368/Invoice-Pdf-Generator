const express=require("express");
const app=express();
const data=require("../uploads/sample-invoice.json");
const puppeteer=require("puppeteer");
const fs=require("fs");
const path=require("path");
const ejs=require("ejs");

app.use(express.json());
app.use(express.urlencoded({extended:true}));

function showPdf(req,res){
     res.render("index",{data:data});
}; 

function viewPdf(req,res){
     res.render("index",{data:data});
}; 

async function uiPage(req,res){
     res.render("UI_Page");
}; 

async function generatePdf(req,res){
     const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:8000/', {
        waitUntil: 'networkidle0'
    });

    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true
    });

    await browser.close();

    res.contentType("application/pdf");
    res.send(pdfBuffer);
}; 

async function downloadPdf(req,res){
    const browser = await puppeteer.launch();
    
      const page = await browser.newPage();
    
      try {
        await page.goto('http://localhost:8000/', {
          waitUntil: 'networkidle0'
        });
    
        const selectorExists = await page.$('.pdf');
    
        if (selectorExists) {
          await page.waitForSelector('.pdf');
        } else {
          console.warn(`Warning: Selector ".pdf" not found. Skipping wait.`);
        }
        await page.pdf({
          path: 'invoice.pdf',
          format: 'A4',
          printBackground: true
        });
    
        console.log('PDF Generated: invoice.pdf');
      } catch (error) {
        console.error('Error generating PDF:', error);
      } finally {
        await browser.close();
      }
      res.download('invoice.pdf');
    };


async function uploadData(req, res) {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    console.log("File uploaded to:", req.file.path);

    res.status(200).send(`File "${req.file.originalname}" uploaded successfully`);
  } catch (err) {
    console.error("Error during upload:", err);
    res.status(500).send(`Something went wrong: ${err.message}<br><pre>${err.stack}</pre>`);
  }
}

     

  function postData(req,res){
     const newAccount = req.body;
     const filePath = path.join(__dirname, "../uploads/sample-invoice.json");
    fs.readFile(filePath, "utf-8", (err, fileContent) => {
    if (err) {
      console.error("Failed to read file");
      return res.status(500).send("Unable to read data file");
    }

    let invoiceObj;

    try {
      invoiceObj = JSON.parse(fileContent);
    } catch (e) {
      return res.status(500).send("Invalid JSON format in sample-invoice.json");
    }

    
    if (!Array.isArray(invoiceObj.accounts)) {
      invoiceObj.accounts = [];
    }

 
    invoiceObj.accounts.push(newAccount);

   
    fs.writeFile(filePath, JSON.stringify(invoiceObj, null, 2), (err) => {
      if (err) {
        console.error("Failed to write updated data");
        return res.status(500).send("Unable to save updated data");
      }

      res.end("posted successfully");
    });
  });
};

module.exports={
  showPdf,
  viewPdf,
  uiPage,
  generatePdf,
  downloadPdf,
  uploadData, 
  postData
};