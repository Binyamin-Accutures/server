const express = require('express')
const app = express() 
const AdmZip = require('adm-zip');
const fs = require('fs')
const uploadDir = fs.readdirSync(__dirname+"/uploads");
const port = 6700 
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.all('/api/createZIP', (req, res) => {
    const zip = new AdmZip();
 
    for(var i = 0; i < uploadDir.length;i++){
        zip.addLocalFile(__dirname+"/uploads/"+uploadDir[i]);
    }
 
    // Define zip file name
    const downloadName = `${Date.now()}.zip`;
 
    const data = zip.toBuffer();
 
    // save file zip in root directory
    zip.writeZip(__dirname+"/"+downloadName);
    res.set('Content-Type','application/octet-stream');
    res.set('Content-Disposition',`attachment; filename=${downloadName}`);
    res.set('Content-Length',data.length);
    res.send({data, downloadName});
})
 
app.listen(port, () => console.log(`Server started on port ${port}`))