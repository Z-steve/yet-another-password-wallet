// Import Moduli Node JS
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const archiver = require('archiver');
const generator = require('generate-password');

const app = express();
const port = process.env.PORT || 3000;

// Impostazioni Express JS
app.use(bodyParser.text({ type: "*/json" }));
app.use(express.static(__dirname));

// Imposta oggetto archiver per abilitare la cifratura AES 
archiver.registerFormat('zip-encrypted', require("archiver-zip-encrypted"));

// Endpoint home.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + "/home.html");
});

// Endpoint Export Credentials
app.post('/export', (req, res) => {

  // Genera password random per l'archivio ZIP
  const password = generator.generate({ length: 10, numbers: true });

  // Crea oggetto archivio ZIP cifrato
  let archive = archiver.create('zip-encrypted', { zlib: { level: 8 }, encryptionMethod: 'aes256', password: password });

  // Catch eventuali warnings
  archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
      console.log(err);
    } else {
      throw err;
    }
  });

  // Catch eventuali errori
  archive.on('error', function (err) {
    throw err;
  });

  // Aggiunge file credentials.json con le credenziali nell'archivio
  archive.append(req.body, { name: 'credentials.json' });

  // Aggiunge header Content-Disposition nella risposta
  res.attachment('credentials.zip');

  // Aggiunge header con password dell'archivio nella risposta
  res.setHeader("archive-password", password);

  // Imposta stream di scrittura dell'archivio
  archive.pipe(res);

  // Flush oggetto archivio per poter restituire la response al frontend
  archive.finalize();

});

app.listen(port, () => {
  console.log(`Yet Another Password Wallet Backend - porta: ${port}`)
});