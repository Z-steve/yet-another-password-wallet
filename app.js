const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const archiver = require('archiver');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.text({type:"*/json"}));
app.use(express.static(__dirname));


app.get('/', (req, res) => {
  res.sendFile(__dirname + "/Home.html");
});

app.post('/export', (req, res) => {

  // Creare file json con il contenuto del request body
  // req.body è una stringa in quanto è stato impostato il body parser
  fs.writeFile('credentials.json', req.body, function (err) {
    if (err) throw err;
    console.log('Saved credentials.json');
  });

  // Inserire credentials.json in uno zip cifrato
  // Generare password random per lo zip

  // register format for archiver
  // note: only do it once per Node.js process/application, as duplicate registration will throw an error
  archiver.registerFormat('zip-encrypted', require("archiver-zip-encrypted"));

  // create archive and specify method of encryption and password
  let archive = archiver.create('zip-encrypted', { zlib: { level: 8 }, encryptionMethod: 'aes256', password: '123' });
  
  archive.append(fs.createReadStream('credentials.json'), { name: 'credentials.zip' })
  // ... add contents to archive as usual using archiver

  // Restituisce lo zip cifrato con il file credentials.json al chiamante
  res.download(__dirname + "/credentials.zip", 'credentials.zip', function (err) {
    if (err) {
      console.log(err);

    } else {
      console.log("Ok");
    }
  });

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});