
// Crea elemento div cred box secondo template
function addCredToCredBox(credBoxId, credName) {

    // Aggiungi credenziale nella credBox
    var template = document.getElementById('cred-box-template');
    var clone = document.importNode(template.content, true);

    // Metti attributo id nel div main
    clone.firstElementChild.id = credBoxId;

    // Aggiungi attributo onclick nel div main
    clone.firstElementChild.setAttribute('onclick', "showModalPopup('" + credBoxId + "')");

    // Aggiungi cred name nel titolo della credenziale
    clone.querySelector('h3').textContent = credName;

    // Aggiungi la nuova credenziale nel cred box prima di add button ed export button
    const addButton = document.getElementById("add-cred-box");
    addButton.parentNode.insertBefore(clone, addButton);

}



// Viene chiamata ad ogni accesso alla pagina per la persistenza dei dati 
function fillDefaultCred() {

    // Controlla se è già stato fatto il preset delle credenziali di default
    if (localStorage.getItem("defaultFilled") === null) {

        localStorage.setItem("default-Facebook", "{\"credentialName\":\"Facebook\",\"email\":\"\",\"password\":\"\",\"description\":\"\"}");
        localStorage.setItem("default-Instagram", "{\"credentialName\":\"Instagram\",\"email\":\"\",\"password\":\"\",\"description\":\"\"}");
        localStorage.setItem("default-Linkedin", "{\"credentialName\":\"Linkedin\",\"email\":\"\",\"password\":\"\",\"description\":\"\"}");
        localStorage.setItem("default-Twitter", "{\"credentialName\":\"Twitter\",\"email\":\"\",\"password\":\"\",\"description\":\"\"}");
        localStorage.setItem("default-Gmail", "{\"credentialName\":\"Gmail\",\"email\":\"\",\"password\":\"\",\"description\":\"\"}");
        localStorage.setItem("default-Pinterest", "{\"credentialName\":\"Pinterest\",\"email\":\"\",\"password\":\"\",\"description\":\"\"}");
        localStorage.setItem("default-Github", "{\"credentialName\":\"Github\",\"email\":\"\",\"password\":\"\",\"description\":\"\"}");
        localStorage.setItem("default-Reddit", "{\"credentialName\":\"Reddit\",\"email\":\"\",\"password\":\"\",\"description\":\"\"}");
        localStorage.setItem("default-Tiktok", "{\"credentialName\":\"Tiktok\",\"email\":\"\",\"password\":\"\",\"description\":\"\"}");
        localStorage.setItem("default-Snapchat", "{\"credentialName\":\"Snapchat\",\"email\":\"\",\"password\":\"\",\"description\":\"\"}");

        localStorage.setItem("defaultFilled", "true");

    }

    // Cicla chiavi non default
    for (var i = 0; i < localStorage.length; i++) {

        var key = localStorage.key(i);

        if (!key.includes("default")) {

            // Ottieni oggetto credenziale
            var credential = JSON.parse(localStorage.getItem(key));

            // Aggiungi div cred box della credenziale non-default
            addCredToCredBox(key, credential.credentialName);


        }
    }

}


// Funzione per aprire il modal Popup
function showModalPopup(credBoxId) {

    // controllo se si tratta di una credenziale di default 
    if (credBoxId !== undefined && credBoxId.includes("default-")) {
        document.getElementById("modal-heading").innerHTML = "EDIT CREDENTIAL";
        // riempie il modal popup con i dati (in base al credBoxId)
        fillModalPopup(credBoxId);

        // Rendo il credential Name delle password create in sola lettura
        document.getElementById("modal-cred-name").readOnly = "true";

        // Gestire save e clear buttons
        document.getElementById("modal-save-button").onclick = function () { saveCred(credBoxId) };
        document.getElementById("modal-clear-button").onclick = function () { clearCred(credBoxId) };
    }
    // controllo se NON è undefined (quindi una già creata dall'utente in precedenza)
    else if (credBoxId !== undefined) {
        document.getElementById("modal-heading").innerHTML = "EDIT CREDENTIAL";
        // riempie il modal popup con i dati (in base al credBoxId)
        fillModalPopup(credBoxId);

        // Rendo il credential Name delle password create in sola lettura
        document.getElementById("modal-cred-name").readOnly = "true";

        // show remove button
        document.getElementById("modal-remove-button").classList.remove("hideRemoveButton");
        document.getElementById("modal-remove-button").classList.add("removeButton");

        // Gestire save, clear e remove buttons
        document.getElementById("modal-save-button").onclick = function () { saveCred(credBoxId) };
        document.getElementById("modal-clear-button").onclick = function () { clearCred(credBoxId) };
        document.getElementById("modal-remove-button").onclick = function () { deleteCred(credBoxId) };

        // qui nel caso in cui sto creando una nuova credenziale
    } else {
        // Modal Popup per creare nuova credenziale
        document.getElementById("modal-cred-name").removeAttribute("readonly");
        document.getElementById("modal-heading").innerHTML = "ADD CREDENTIAL";

        // Gestire save e clear buttons
        document.getElementById("modal-save-button").onclick = function () { saveCred() };
        document.getElementById("modal-clear-button").onclick = function () { clearCred() };
    }

    document.getElementById('modal-popup').style.display = 'block';

}



function showPasswordModalPopup(password) {

    document.getElementById("modal-popup-password").style.display = "block";

    // Display password generata per file zip
    document.getElementById("password-generated").textContent = password;
}


// Funzione per chiudere il modal Popup delle credenziali
function closeModalPopup() {

    // Nascondi modal popup
    document.getElementById('modal-popup').style.display = 'none';

    // Nascondi password se visibile
    hidePassword();

    // Nascondi messaggi di errore validazione input
    hideError();

    // Nascondi remove button
    document.getElementById("modal-remove-button").classList.add("hideRemoveButton");
    document.getElementById("modal-remove-button").classList.remove("removeButton");

    // Svuota campi modal popup
    document.getElementById("modal-cred-name").value = "";
    document.getElementById("modal-email").value = "";
    document.getElementById("modal-password").value = "";
    document.getElementById("modal-description").value = "";

}


// Funzione per chiudere il modal popup della password generata per il file zip
function closePasswordModalPopup() {

    // Nascondi modal Popup
    document.getElementById("modal-popup-password").style.display = "none";

    document.getElementById("password-generated").textContent = "";

}


// Funzione per aggiungere una credenziale
function saveCred(credBoxId) {

    // prendo i campi che mi serviranno per metterli nell'oggetto credData
    const modalCredName = document.getElementById("modal-cred-name");
    const modalEmail = document.getElementById("modal-email");
    const modalPassword = document.getElementById("modal-password");
    const modalDescription = document.getElementById("modal-description");

    // Controlla se ci sono tutti i campi required
    if (validateUserInput(modalCredName, modalEmail, modalPassword)) {

        // Compongo l'oggetto credData
        var credData = {};
        credData.credentialName = modalCredName.value;
        credData.email = modalEmail.value;
        credData.password = modalPassword.value;
        credData.description = modalDescription.value;

        // Se si tratta di una nuova credenziale aggiunta dall'utente
        if (credBoxId === undefined) {

            // Creazione di un random ID per la nuova credenziale
            credBoxId = self.crypto.randomUUID();

            // Aggiungi credenziale nella credBox
            addCredToCredBox(credBoxId, modalCredName.value);
        }

        // Salva dati credenziale in localstorage
        localStorage.setItem(credBoxId, JSON.stringify(credData));

        // Chiudo il modal popup
        closeModalPopup();

        // Salvo tutto
        return true;

    } else {
        // Non va avanti (non ti permette di salvare la credenziale)
        return false;

    }
}


// Funzione per rimuovere una credenziale
function deleteCred(credBoxId) {
    // Rimuovi dal documento
    document.getElementById(credBoxId).remove();
    // Rimuovi da Local Storage
    localStorage.removeItem(credBoxId);
    // Chiudi il modal Popup
    closeModalPopup();

}


// Funzione per pulire i dati di una credenziale
function clearCred(credBoxId) {
    if (credBoxId === undefined) {
        document.getElementById("modal-cred-name").value = "";
        document.getElementById("modal-email").value = "";
        document.getElementById("modal-password").value = "";
        document.getElementById("modal-description").value = "";
    } else {
        document.getElementById("modal-email").value = "";
        document.getElementById("modal-password").value = "";
        document.getElementById("modal-description").value = "";
    }
}


// Funzione validazione input utente inserimento dati della credenziale
function validateUserInput(modalCredName, modalEmail, modalPassword) {

    // Se c'è un errore tra questi, fai vedere di quale errore si tratta
    if (!modalCredName.checkValidity() || !modalEmail.checkValidity() || !modalPassword.checkValidity()) {
        // Nome credenziale non inserita
        if (!modalCredName.checkValidity()) {
            document.getElementById("error-cred-name").classList.add("displayError");
        } else {
            document.getElementById("error-cred-name").classList.remove("displayError");
        }
        // Email o Username non inseriti
        if (!modalEmail.checkValidity()) {
            document.getElementById("error-email-or-username").classList.add("displayError");
        } else {
            document.getElementById("error-email-or-username").classList.remove("displayError");
        }
        // Password non inserita
        if (!modalPassword.checkValidity()) {
            document.getElementById("error-password").classList.add("displayError");
        } else {
            document.getElementById("error-password").classList.remove("displayError");
        }
    } else {
        // Qui se tutto è andato a buon fine, quindi l'input dell'utente è valido
        return true;
    }

}


// Funzione per nascondere i messaggi di errore (serve per la closeModalPopup function)
function hideError() {
    document.getElementById("error-cred-name").classList.remove("displayError");
    document.getElementById("error-email-or-username").classList.remove("displayError");
    document.getElementById("error-password").classList.remove("displayError");
}


// Funzione per far vedere la password in chiaro all'utente
function showPassword() {
    var passwd = document.getElementById("modal-password");
    if (passwd.type === "password") {
        passwd.type = "text";
    } else {
        passwd.type = "password";
    }
    var eye = document.getElementById("togglePassword");
    eye.classList.toggle('bi-eye');
}


// Funzione per copiare la password nella clipboard
function copyPassword(id) {

    // Get the text field
    var copyText = document.getElementById(id);

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.textContent);

}


// funzione per nascondere la password quando viene chiuso modal-popup
function hidePassword() {
    var passwd = document.getElementById("modal-password");
    if (passwd.type === "text") {
        passwd.type = "password";
    }
    var eye = document.getElementById("togglePassword");
    if (eye.classList.contains('bi-eye')) {
        eye.classList.remove('bi-eye');
    }

}


function fillModalPopup(credBoxId) {
    // Recupero dati credBox
    var credentialObject = JSON.parse(localStorage.getItem(credBoxId));
    // Fill campi del modal popup
    document.getElementById("modal-cred-name").value = credentialObject.credentialName;
    document.getElementById("modal-email").value = credentialObject.email;
    document.getElementById("modal-password").value = credentialObject.password;
    document.getElementById("modal-description").value = credentialObject.description;
}


// Funzione per esportare tutte le credenziali
function exportCred() {

    // Oggetto JSON con tutte le credenziali da esportare
    var requestBodyJson = {};
    var password;

    // Cicla tutte le chiavi delle credenziali, tranne defaultFilled
    for (var i = 0; i < localStorage.length; i++) {

        // Ottieni chiave 
        var key = localStorage.key(i);

        // Se la chiave è diversa da defaultFilled
        if (key !== "defaultFilled") {
            requestBodyJson[key] = JSON.parse(localStorage.getItem(key));
        }

    }

    // console.log(requestBodyJson);

    // Chiamata AJAX

    fetch('/export', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBodyJson),
    })
    .then(function(response) { 
        password = response.headers.get('archive-password'); 
        return response.blob(); 
    })
    .then(function (blob) {

        // console.log('blob received');

        // console.log(blob);

        // Trigger download dello zip
        //download(blob, "credentials.zip", "application/zip");
        var a = document.createElement("a");

        a.href = window.URL.createObjectURL(blob);

        a.download = "credentials";

        a.click();

        a.remove();
  
    })
    .then(function(response) {
        // leggere header e printare modalpopup con password generata
        showPasswordModalPopup(password);
    });
    

}

// Esegui sempre all'inizio
fillDefaultCred();
