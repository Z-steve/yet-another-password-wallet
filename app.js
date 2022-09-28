const express = require('express');
const fs = require('fs');
const archiver = require('archiver');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile("home.html");
});

app.post('/export', (req, res) => {

  // Leggere request 

  // Creare file json
  fs.appendFile('credentials.json', JSON.stringify(req.body), function (err) {
    if (err) throw err;
    console.log('Saved!');
  });

  // Cifrare il file json oppure metterlo in uno zip cifrato

  // register format for archiver
  // note: only do it once per Node.js process/application, as duplicate registration will throw an error
  archiver.registerFormat('zip-encrypted', require("archiver-zip-encrypted"));

  // create archive and specify method of encryption and password
  let archive = archiver.create('zip-encrypted', { zlib: { level: 8 }, encryptionMethod: 'aes256', password: '123' });
  
  archive.append(fs.createReadStream('credentials.json'), { name: 'credentials.zip' })
  // ... add contents to archive as usual using archiver

  // Restituisce il file delle credenziali al chiamante
  res.download(file, "filename");

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});