const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const archiver = require('archiver');
const generator = require('generate-password');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.text({ type: "*/json" }));
app.use(express.static(__dirname));

// Usa plugin zip-encrypted
// register format for archiver
// note: only do it once per Node.js process/application, as duplicate registration will throw an error
archiver.registerFormat('zip-encrypted', require("archiver-zip-encrypted"));

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/Home.html");
});

app.post('/export', (req, res) => {

  // Genera password random per l'archivio zip
  const password = generator.generate({ length: 10, numbers: true });

  console.log(password);

  // Crea archivio zip cifrato
  let archive = archiver.create('zip-encrypted', { zlib: { level: 8 }, encryptionMethod: 'aes256', password: password });

  // Catch warnings
  archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
      console.log(err);
    } else {
      throw err;
    }
  });

  // Catch errors
  archive.on('error', function (err) {
    throw err;
  });

  // Append file credentials.json con le credenziali
  archive.append(req.body, { name: 'credentials.json' });

  // Aggiungi header Content-Disposition nella risposta
  res.attachment('credentials.zip');

  // Aggiungi header con password dell'archivio nella risposta
  res.setHeader("archive-password", password);

  // Imposta stream di scrittura dell'archivio
  archive.pipe(res);

  archive.finalize();

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});