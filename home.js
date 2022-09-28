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

    // Aggiungi la nuova credenziale nel cred box
    document.getElementById("credBox").appendChild(clone);

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


    // Se gli passo l'id e la credbox è una default allora ...
    // && credBoxId.includes("default-")
    if (credBoxId !== undefined) {

        // Recupero dati credBox
        var credentialObject = JSON.parse(localStorage.getItem(credBoxId));

        // Fill campi del modal popup
        document.getElementById("modal-heading").innerHTML = "EDIT CREDENTIAL";
        document.getElementById("modal-cred-name").value = credentialObject.credentialName;
        document.getElementById("modal-email").value = credentialObject.email;
        document.getElementById("modal-password").value = credentialObject.password;
        document.getElementById("modal-description").value = credentialObject.description;

        // Rendo il credential Name delle password create in sola lettura
        //if(credBoxId.includes("default-")){
        document.getElementById("modal-cred-name").readOnly = "true";
        //}

        // Gestire save e remove buttons
        document.getElementById("modal-save-button").onclick = function () { saveCred(credBoxId) };
        document.getElementById("modal-remove-button").onclick = function () { deleteCred(credBoxId) };

    } else {

        // Modal Popup per creare nuova credenziale
        document.getElementById("modal-cred-name").removeAttribute("readonly");
        document.getElementById("modal-heading").innerHTML = "ADD CREDENTIAL";
        document.getElementById("modal-save-button").onclick = function () { saveCred() };
        document.getElementById("modal-remove-button").onclick = function () { deleteCred() };

    }

    document.getElementById('modal-popup').style.display = 'block';

}


// Funzione per chiudere il modal Popup
function closeModalPopup() {

    // Nascondi modal popup
    document.getElementById('modal-popup').style.display = 'none';

    // Nascondi password se visibile
    hidePassword();

    // Nascondi messaggi di errore validazione input
    hideError();

    // Svuota campi modal popup
    document.getElementById("modal-cred-name").value = "";
    document.getElementById("modal-email").value = "";
    document.getElementById("modal-password").value = "";
    document.getElementById("modal-description").value = "";

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
    // fa il check se si tratta di una credenziale di default oppure no
    if (credBoxId.includes("default-")) {
        document.getElementById("modal-email").value = "";
        document.getElementById("modal-password").value = "";
        document.getElementById("modal-description").value = "";
        localStorage.setItem("default-" + document.getElementById("modal-cred-name").value, "{\"credentialName\":\"" + document.getElementById("modal-cred-name").value + "\",\"email\":\"\",\"password\":\"\",\"description\":\"\"}");
    
    } else {
        // Rimuovi dal documento
        document.getElementById(credBoxId).remove();
        // Rimuovi da Local Storage
        localStorage.removeItem(credBoxId);

        closeModalPopup();
    }
}


// Funzione per pulire i dati di una credenziale
function clearCred(credBoxId) {
    // Se credenziale di default non deve pulire anche il nome della credenziale stessa
    if(credBoxId.includes("default-")) {
        document.getElementById("modal-email").value = "";
        document.getElementById("modal-password").value = "";
        document.getElementById("modal-description").value = "";
        localStorage.setItem("default-" + document.getElementById("modal-cred-name").value, "{\"credentialName\":\"" + document.getElementById("modal-cred-name").value + "\",\"email\":\"\",\"password\":\"\",\"description\":\"\"}");
    // Se credenziale creata dall'utente deve pulire tutto (nome credenziale, email or username, password e description)
    } else {
        document.getElementById("modal-cred-name").value = "";
        document.getElementById("modal-email").value = "";
        document.getElementById("modal-password").value = "";
        document.getElementById("modal-description").value = "";
        localStorage.setItem("" + document.getElementById("modal-cred-name").value, "{\"credentialName\":\"" + document.getElementById("modal-cred-name").value + "\",\"email\":\"\",\"password\":\"\",\"description\":\"\"}");
    }
}


// Funzione validazione input utente inserimento dati della credenziale
function validateUserInput(modalCredName, modalEmail, modalPassword) {
    
    // Se c'è un errore tra questi, fai vedere di quale errore si tratta
    if(!modalCredName.checkValidity() || !modalEmail.checkValidity() || !modalPassword.checkValidity()) {
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
    


    //if(!modalCredName.checkValidity() || !modalEmail.checkValidity() || !modalPassword.checkValidity()) {
    //    console.log("there is an error");
    //    if (modalCredName.checkValidity()) {}
    //}

    
}


// Funzione per nascondere i messaggi di errore (serve per la closeModalPopup function)
function hideError() {
    document.getElementById("error-cred-name").classList.remove("displayError");
    document.getElementById("error-email-or-username").classList.remove("displayError");
    document.getElementById("error-password").classList.remove("displayError");
}


// funzione per far vedere la password in chiaro all'utente
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


// Funzione per esportare tutte le credenziali
function exportCred() {
}




// Esegui sempre all'inizio
fillDefaultCred();
