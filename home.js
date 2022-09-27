// Bisogna chiamarla una sola volta per 
function fillDefaultCred() {

    // Controlla se è già stato fatto il preset delle credenziali di default
    if (localStorage.getItem("defaultFilled") === null) {

        localStorage.setItem("default-Facebook", "{\"credentialName\":\"Facebook\",\"email\":\"\",\"password\":\"\",\"description\":\"\"}");
        localStorage.setItem("default-Instagram", "{\"credentialName\":\"Instagram\",\"email\":\"\",\"password\":\"\",\"description\":\"\"}");
        localStorage.setItem("default-Linkedin", "{\"credentialName\":\"LinkedIn\",\"email\":\"\",\"password\":\"\",\"description\":\"\"}");
        localStorage.setItem("default-Twitter", "{\"credentialName\":\"Twitter\",\"email\":\"\",\"password\":\"\",\"description\":\"\"}");
        localStorage.setItem("default-Gmail", "{\"credentialName\":\"Gmail\",\"email\":\"\",\"password\":\"\",\"description\":\"\"}");
        localStorage.setItem("default-Pinterest", "{\"credentialName\":\"Pinterest\",\"email\":\"\",\"password\":\"\",\"description\":\"\"}");
        localStorage.setItem("default-Github", "{\"credentialName\":\"Github\",\"email\":\"\",\"password\":\"\",\"description\":\"\"}");
        localStorage.setItem("default-Reddit", "{\"credentialName\":\"Reddit\",\"email\":\"\",\"password\":\"\",\"description\":\"\"}");
        localStorage.setItem("default-Tiktok", "{\"credentialName\":\"Tiktok\",\"email\":\"\",\"password\":\"\",\"description\":\"\"}");
        localStorage.setItem("default-Snapchat", "{\"credentialName\":\"Snapchat\",\"email\":\"\",\"password\":\"\",\"description\":\"\"}");

        localStorage.setItem("defaultFilled", "true");

    }

}

function showModalPopup(credBoxId) {


    // Se gli passo l'id e la credbox è una default allora ...
    if (credBoxId !== undefined && credBoxId.includes("default-")) {

        console.log("qui");
        // Recupero dati credBox
        var credentialObject = JSON.parse(localStorage.getItem(credBoxId));

        // Fill campi del modal popup
        document.getElementById("modal-heading").innerHTML = "EDIT CREDENTIAL";
        document.getElementById("modal-cred-name").value = credentialObject.credentialName;
        document.getElementById("modal-email").value = credentialObject.email;
        document.getElementById("modal-password").value = credentialObject.password;
        document.getElementById("modal-description").value = credentialObject.description;

        // Rendo il credential Name delle password create in sola lettura
        document.getElementById("modal-cred-name").readOnly = "true";

        // Gestire save e remove buttons
        document.getElementById("modal-save-button").onclick = function(){saveCred(credBoxId)};
        document.getElementById("modal-remove-button").onclick = function(){deleteCred(credBoxId)};

    } else {
        // console.log("qua");
        // Modal Popup per creare nuova credenziale
        document.getElementById("modal-cred-name").removeAttribute("readonly");
        document.getElementById("modal-heading").innerHTML = "ADD CREDENTIAL";
        document.getElementById("modal-save-button").onclick = function(){saveCred()};
        document.getElementById("modal-remove-button").onclick = function(){deleteCred()};
    
    }

    document.getElementById('modal-popup').style.display = 'block';

}

function closeModalPopup() {

    // Nascondi modal popup
    document.getElementById('modal-popup').style.display = 'none';

    // Nascondi password se visibile
    hidePassword();

    // Svuota campi modal popup
    document.getElementById("modal-cred-name").value = "";
    document.getElementById("modal-email").value = "";
    document.getElementById("modal-password").value = "";
    document.getElementById("modal-description").value = "";

}

// Funzione per aggiungere una credenziale
function saveCred(credBoxId) {

    // Controlla se ci sono tutti i campi required
    const modalCredName = document.getElementById("modal-cred-name");
    if (!modalCredName.checkValidity()) {
        return false;
    }

    const modalEmail = document.getElementById("modal-email");
    if (!modalEmail.checkValidity()) {
        return false;
    }

    const modalPassword = document.getElementById("modal-password");
    if (!modalPassword.checkValidity()) {
        return false;
    }

    const modalDescription = document.getElementById("modal-description");

    var credData = {};
    credData.credentialName = modalCredName.value;
    credData.email = modalEmail.value;
    credData.password = modalPassword.value;
    credData.description = modalDescription.value;


    if (credBoxId === undefined) {

        // Creazione di un random ID per la nuova credBox
        credBoxId = self.crypto.randomUUID();

        var cred = document.getElementById('cred-box-template');

        // Salva credenziale nel documento
        document.getElementById('cred-box-template').content.cloneNode(true);
        // Aggiungo l'id alla nuova credBox
        cred.id = credBoxId;
        // Aggiungi onclick
        cred.addEventListener('click', showModalPopup(credBoxId));
        cred.querySelector('h3').textContent = modalCredName.value;

        // Aggiungi Credential Box
        document.getElementById('credBox').appendChild(cred);

    }
    

    // Salva dati credenziale in localstorage
    localStorage.setItem(credBoxId, JSON.stringify(credData));

    closeModalPopup();

    return true;

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
    }
    
    closeModalPopup();

}




// Funzione per esportare tutte le credenziali
function exportCred() {
}

fillDefaultCred();



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
