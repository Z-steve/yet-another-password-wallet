// Bisogna chiamarla una sola volta per 
function fillDefaultCred() {

    // Controlla se è già stato fatto il preset delle credenziali di default
    if (localStorage.getItem("defaultFilled") === null) {

        localStorage.setItem("default-facebook", "{\"credentialName\":\"Facebook\",\"email\":\"\",\"password\":\"\",\"description\":\"\"}");
        localStorage.setItem("default-instagram", "{\"credentialName\":\"Instagram\",\"email\":\"\",\"password\":\"\",\"description\":\"\"}");
        localStorage.setItem("default-linkedin", "{\"credentialName\":\"LinkedIn\",\"email\":\"\",\"password\":\"\",\"description\":\"\"}");
        localStorage.setItem("default-twitter", "{\"credentialName\":\"Twitter\",\"email\":\"\",\"password\":\"\",\"description\":\"\"}");
        localStorage.setItem("default-gmail", "{\"credentialName\":\"Gmail\",\"email\":\"\",\"password\":\"\",\"description\":\"\"}");
        localStorage.setItem("default-pinterest", "{\"credentialName\":\"Pinterest\",\"email\":\"\",\"password\":\"\",\"description\":\"\"}");
        localStorage.setItem("default-github", "{\"credentialName\":\"Github\",\"email\":\"\",\"password\":\"\",\"description\":\"\"}");
        localStorage.setItem("default-reddit", "{\"credentialName\":\"Reddit\",\"email\":\"\",\"password\":\"\",\"description\":\"\"}");
        localStorage.setItem("default-tiktok", "{\"credentialName\":\"TikTok\",\"email\":\"\",\"password\":\"\",\"description\":\"\"}");
        localStorage.setItem("default-snapchat", "{\"credentialName\":\"Snapchat\",\"email\":\"\",\"password\":\"\",\"description\":\"\"}");

        localStorage.setItem("defaultFilled", "true");

    }

}

function showModalPopup(credBoxId) {

    // Se gli passo l'id
    if (credBoxId !== undefined) {

        // Recupero dati credBox
        var credentialObject = JSON.parse(localStorage.getItem(credBoxId));

        // Fill campi del modal popup
        document.getElementById("modal-heading").innerHTML = "EDIT CREDENTIAL";
        document.getElementById("modal-cred-name").value = credentialObject.credentialName;
        document.getElementById("modal-email").value = credentialObject.email;
        document.getElementById("modal-password").value = credentialObject.password;
        document.getElementById("modal-description").value = credentialObject.description;

        document.getElementById("modal-save-button").onclick = function(){saveCred(credBoxId)};
        document.getElementById("modal-remove-button").onclick = function(){deleteCred(credBoxId)};

    } else {

        document.getElementById("modal-heading").innerHTML = "ADD CREDENTIAL";
        document.getElementById("modal-save-button").onclick = function(){saveCred()};
        document.getElementById("modal-remove-button").onclick = function(){deleteCred()};
    
    }

    document.getElementById('modal-popup').style.display = 'block';

}

function closeModalPopup() {

    // Nascondi modal popup
    document.getElementById('modal-popup').style.display = 'none';

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

        credBoxId = self.crypto.randomUUID();

        // Salva credenziale nel documento
        var cred = document.getElementById('cred-box-template').content.cloneNode(true);

        cred.id = credBoxId;
        // Aggiungi onclick
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

    // Rimuovi dal documento
    document.getElementById(credBoxId).remove();

    // Rimuovi da Local Storage
    localStorage.removeItem(credBoxId);

    closeModalPopup();

}

// Funzione per esportare tutte le credenziali
function exportCred() {
}

fillDefaultCred();

