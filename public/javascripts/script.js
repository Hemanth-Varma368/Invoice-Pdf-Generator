     const fileInput = document.getElementById("file");
     const generateBtn=document.getElementById("generate-btn");
    const downloadBtn=document.getElementById("download-btn");


    fileInput.addEventListener("change", async function () {
    const formData = new FormData();
    formData.append("jsonFile", fileInput.files[0]);

    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      const message = await response.text();
      notificationBar.innerText = `${value} file "${fileInput.files[0].name}" uploaded successfully!`;
      notificationBar.style.display = "block";
   
      generateBtn.disabled=false;
      downloadBtn.disabled=false;
      localStorage.setItem("invoiceUploaded", "true");


    } catch (err) {
      alert("Upload failed. Please try again.");
      console.error("Upload error:", err);
    }
  });

  const dropdown = document.getElementById("actionDropdown");
  const uploadForm = document.getElementById("actionForm");
  const notificationBar=document.getElementById("notificationBar");
  

   let value=null;
  dropdown.addEventListener("change", function () {
    value = dropdown.value;
    if (value === "invoice") {
      fileInput.accept = ".json";
      fileInput.click();
    } else if (["scan", "Scanned","OCR-Enabled","Performance","Security Audit", "others"].includes(value)) {
      fileInput.accept = ".json,.txt";
      fileInput.click();
    }
  });
  
  
  
  dropdown.selectedIndex=0;

  window.addEventListener("load", function () {
  const uploaded = localStorage.getItem("invoiceUploaded");
  if (uploaded === "true") {
    generateBtn.disabled = false;
    downloadBtn.disabled = false;
  } else {
    generateBtn.disabled = true;
    downloadBtn.disabled = true;
  }
});
document.querySelector('form[action="./download-pdf"]').addEventListener("submit", function (e) {
  if (downloadBtn.disabled) {
    e.preventDefault();
    return false;
  }

  // Clear the uploaded flag
  localStorage.removeItem("invoiceUploaded");

  // ⏳ Add a short delay before refreshing to allow the download to start
  setTimeout(() => {
    window.location.reload();
  }, 5000); 
});
