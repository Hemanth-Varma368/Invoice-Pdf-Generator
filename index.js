const express=require("express");
const app=express();
const path=require("path");
const data=require("./sample-invoice.json")
const puppeteer=require("puppeteer");
const fs=require("fs");
const multer=require("multer");
const ejs=require("ejs");


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));



app.set("view engine","ejs");



app.get("/view",(req,res)=>{
    res.render("index",{data:data});
});

app.get("/uipage",(req,res)=>{
    res.render("UI_Page");
});

app.get('/generate-pdf', async (req, res) => {
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
});
const storage=multer.diskStorage({
    destination:function(req,file,cb){
      cb(null,"uploads/");
    },
    filename:function(req,file,cb){
      cb(null,"sample-invoice.json");
    },
  });
  const upload=multer({storage:storage});

app.post('/upload', upload.single('jsonFile'), async (req, res) => {
  try {
    const uploadedFilePath = req.file.path; // like uploads/myfile.json

    // 3️⃣ Read JSON File
    const jsonData = JSON.parse(fs.readFileSync(uploadedFilePath, 'utf-8'));

    // 4️⃣ Render EJS HTML using uploaded JSON
    const templatePath = path.join(__dirname, 'views', 'index.ejs');
    const htmlContent = await ejs.renderFile(templatePath, { data: jsonData });

    // 5️⃣ Generate PDF from HTML using Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=invoice.pdf',
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error('Error generating PDF:', err);
    res.status(500).send('Something went wrong');
  }
});
  


app.get('/download-pdf',async(req,res)=>{
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
    });

  app.post("/postdata", (req, res) => {
  const newAccount = req.body;
  fs.readFile(data, "utf-8", (err, fileContent) => {
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

    //  Ensure 'accounts' exists and is an array
    if (!Array.isArray(invoiceObj.accounts)) {
      invoiceObj.accounts = [];
    }

    // Push new account to accounts array
    invoiceObj.accounts.push(newAccount);

    // Save the updated object back to the file
    fs.writeFile(data, JSON.stringify(invoiceObj, null, 2), (err) => {
      if (err) {
        console.error("Failed to write updated data");
        return res.status(500).send("Unable to save updated data");
      }

      alert("uploaded successfully");
    });
  });
});




port=8000;
app.listen(port,()=>console.log(`server started at ${port}`));
