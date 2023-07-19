
// Aggiungi una nuova credenziale nella cred box
function addCredToCredBox(credBoxId, credName) {

    var template = document.getElementById('cred-box-template');

    // Clonazione contenuto template
    var clone = document.importNode(template.content, true);

    // Imposta attributo id della credenziale
    clone.firstElementChild.id = credBoxId;

    // Imposta attributo onclick
    clone.firstElementChild.setAttribute('onclick', "showModalPopup('" + credBoxId + "')");

    // Imposta nome della credenziale
    clone.querySelector('h3').textContent = credName;

    // Aggiungi la nuova credenziale nella cred box prima di add button ed export button
    const addButton = document.getElementById("add-cred-box");
    addButton.parentNode.insertBefore(clone, addButton);

}

// Inizializza la cred box con le credenziali di default
// Viene chiamata ad ogni accesso alla pagina per la persistenza dei dati 
function fillDefaultCred() {

    // Controlla se è già stata effettuata l'inizializzazione delle credenziali di default
    if (localStorage.getItem("defaultFilled") === null) {

        // Inserimento credenziali di default nel LocalStorage
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

        // Impostazione flag per indicare che le credenziali di default sono state inserite nella cred box
        localStorage.setItem("defaultFilled", "true");

    }

    // Controlla la presenza di credenziali create dall'utente nel LocalStorage
    for (var i = 0; i < localStorage.length; i++) {

        var key = localStorage.key(i);

        if (!key.includes("default")) {

            // Ottieni oggetto JSON della credenziale
            var credential = JSON.parse(localStorage.getItem(key));

            // Aggiungi credenziale utente nella cred box
            addCredToCredBox(key, credential.credentialName);

        }
    }

}


// Funzione per aprire il modal Popup
function showModalPopup(credBoxId) {

    // Controlla se la credenziale è di default o creata dall'utente
    if (credBoxId !== undefined) {

        // Imposta titolo popup
        document.getElementById("modal-heading").innerHTML = "EDIT CREDENTIAL";

        // Riempie il modal popup con i dati della credenziale (in base al credBoxId)
        fillModalPopup(credBoxId);

        // Imposta il campo Credential Name in sola lettura
        document.getElementById("modal-cred-name").readOnly = "true";

        // Imposta attributo onclick a save button e clear button
        document.getElementById("modal-save-button").onclick = function () { saveCred(credBoxId) };
        document.getElementById("modal-clear-button").onclick = function () { clearCred(credBoxId) };

        if (!credBoxId.includes("default-")) {

            // Switch classe CSS per mostrare il remove button
            document.getElementById("modal-remove-button").classList.remove("hideRemoveButton");
            document.getElementById("modal-remove-button").classList.add("removeButton");

            // Imposta attributo onclick a remove button
            document.getElementById("modal-remove-button").onclick = function () { deleteCred(credBoxId) };

        }

    } else {

        // Mostra Modal Popup per aggiungere una nuova credenziale

        // Rimuovi attributo readonly al campo Credential Name
        document.getElementById("modal-cred-name").removeAttribute("readonly");
        
        // Imposta titolo popup
        document.getElementById("modal-heading").innerHTML = "ADD CREDENTIAL";

        // Imposta attributo onclick a save button e clear button
        document.getElementById("modal-save-button").onclick = function () { saveCred() };
        document.getElementById("modal-clear-button").onclick = function () { clearCred() };

    }

    // Mostra a schermo il modal popup
    document.getElementById('modal-popup').style.display = 'block';

}

// Funzione per mostrare la password del file ZIP cifrato
function showPasswordModalPopup(password) {

    // Mostra a schermo il modal popup della password
    document.getElementById("modal-popup-password").style.display = "block";

    // Display password per il file ZIP
    document.getElementById("password-generated").textContent = password;

}


// Funzione per chiudere il modal popup delle credenziali
function closeModalPopup() {

    // Nasconde il modal popup
    document.getElementById('modal-popup').style.display = 'none';

    // Nasconde password se visibile
    hidePassword();

    // Nasconde messaggi di errore validazione input
    hideError();

    // Nasconde remove button
    document.getElementById("modal-remove-button").classList.add("hideRemoveButton");
    document.getElementById("modal-remove-button").classList.remove("removeButton");

    // Svuota campi modal popup
    document.getElementById("modal-cred-name").value = "";
    document.getElementById("modal-email").value = "";
    document.getElementById("modal-password").value = "";
    document.getElementById("modal-description").value = "";

}


// Funzione per chiudere il popup della password del file ZIP cifrato
function closePasswordModalPopup() {

    // Nasconde il modal popup
    document.getElementById("modal-popup-password").style.display = "none";

    // Svuota campo password
    document.getElementById("password-generated").textContent = "";

}


// Funzione per aggiungere o aggiornare una credenziale
function saveCred(credBoxId) {

    // Legge i campi della credenziale compilati dall'utente
    const modalCredName = document.getElementById("modal-cred-name");
    const modalEmail = document.getElementById("modal-email");
    const modalPassword = document.getElementById("modal-password");
    const modalDescription = document.getElementById("modal-description");

    // Validazione Input - Controllo campi mandatori
    if (validateUserInput(modalCredName, modalEmail, modalPassword)) {

        // Crea oggetto JSON della nuova credenziale
        var credData = {};
        credData.credentialName = modalCredName.value;
        credData.email = modalEmail.value;
        credData.password = modalPassword.value;
        credData.description = modalDescription.value;

        // Controlla se si tratta di una nuova credenziale aggiunta dall'utente
        if (credBoxId === undefined) {

            // Genera ID random per la nuova credenziale
            credBoxId = self.crypto.randomUUID();

            // Aggiunge credenziale alla cred box
            addCredToCredBox(credBoxId, modalCredName.value);
        
        }

        // Salva credenziale nel LocalStorage
        localStorage.setItem(credBoxId, JSON.stringify(credData));

        // Chiudo il modal popup
        closeModalPopup();

        return true;

    } 
        
    // Input utente non valido
    return false;
    
}

// Funzione per rimuovere una credenziale
function deleteCred(credBoxId) {
    
    // Rimuovi dalla cred box
    document.getElementById(credBoxId).remove();
    
    // Rimuovi da LocalStorage
    localStorage.removeItem(credBoxId);
    
    // Chiudi il modal popup
    closeModalPopup();

}

// Funzione per pulire i campi del modal popup di una credenziale
function clearCred(credBoxId) {

    // Svuota campi modal popup
    document.getElementById("modal-email").value = "";
    document.getElementById("modal-password").value = "";
    document.getElementById("modal-description").value = "";

    // Qui se si tratta di una credenziale nuova
    if (credBoxId === undefined) {
        document.getElementById("modal-cred-name").value = "";
    }

}

// Funzione di validazione input utente modal popup
function validateUserInput(modalCredName, modalEmail, modalPassword) {

    var isValid = true;

    // Nome credenziale non inserita
    if (!modalCredName.checkValidity()) {
        document.getElementById("error-cred-name").classList.add("displayError");
        isValid = false;
    } else {
        document.getElementById("error-cred-name").classList.remove("displayError");
    }

    // Email o Username non inseriti
    if (!modalEmail.checkValidity()) {
        document.getElementById("error-email-or-username").classList.add("displayError");
        isValid = false;
    } else {
        document.getElementById("error-email-or-username").classList.remove("displayError");
    }

    // Password non inserita
    if (!modalPassword.checkValidity()) {
        document.getElementById("error-password").classList.add("displayError");
        isValid = false;
    } else {
        document.getElementById("error-password").classList.remove("displayError");
    }

    return isValid;

}


// Funzione per nascondere i messaggi di errore (serve per la funzione closeModalPopup)
function hideError() {
    document.getElementById("error-cred-name").classList.remove("displayError");
    document.getElementById("error-email-or-username").classList.remove("displayError");
    document.getElementById("error-password").classList.remove("displayError");
}

// Funzione per mostrare la password in chiaro all'utente
function showPassword() {
    
    var password = document.getElementById("modal-password");
    if (password.type === "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }
    
    var eye = document.getElementById("togglePassword");
    eye.classList.toggle('bi-eye');

}


// Funzione per copiare la password nella clipboard
function copyText(id) {

    // Legge testo da copiare
    var copyText = document.getElementById(id);

    // Cambia testo tooltip quando premuto
    document.getElementById("copySpan").textContent = "copied";
    setTimeout(function () {
        document.getElementById("copySpan").textContent = "copy";
    }, 3000);

    // Copia il testo nella clipboard
    navigator.clipboard.writeText(copyText.textContent);

}


// Funzione per nascondere la password quando viene chiuso il modal popup
function hidePassword() {
    
    var password = document.getElementById("modal-password");
    
    if (password.type === "text") {
        password.type = "password";
    }

    var eye = document.getElementById("togglePassword");
    
    if (eye.classList.contains('bi-eye')) {
        eye.classList.remove('bi-eye');
    }

}

// Funzione per inserire i dati di una credenziale nel modal popup
function fillModalPopup(credBoxId) {
    
    // Recupero dati della credenziali dal LocalStorage
    var credentialObject = JSON.parse(localStorage.getItem(credBoxId));
    
    // Riempi campi del modal popup
    document.getElementById("modal-cred-name").value = credentialObject.credentialName;
    document.getElementById("modal-email").value = credentialObject.email;
    document.getElementById("modal-password").value = credentialObject.password;
    document.getElementById("modal-description").value = credentialObject.description;

}

// Funzione per esportare tutte le credenziali in uno ZIP cifrato
function exportCred() {

    // Oggetto JSON con tutte le credenziali da esportare
    var requestBodyJson = {};
    var password;

    // Leggi credenziali dal LocalStorage
    for (var i = 0; i < localStorage.length; i++) {

        var key = localStorage.key(i);

        if (key !== "defaultFilled") {
            requestBodyJson[key] = JSON.parse(localStorage.getItem(key));
        }

    }
    
    // Controlla se il client è online
    if (navigator.onLine) {

        try {

            // Chiamata AJAX
            fetch('/public/export', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBodyJson),
            })
            .then(function (response) {
                
                // Leggi header archive-password -> password per aprire il file ZIP cifrato
                password = response.headers.get('archive-password');
                
                return response.blob();
            })
            .then(function (blob) {
                
                // Crea bottone temporaneo per trigger download
                var a = document.createElement("a");
                a.href = window.URL.createObjectURL(blob);
                a.download = "credentials";
    
                // Click bottone per far partire il download
                a.click();
                
                // Rimuovi bottone
                a.remove();
            
            })
            .then(function (response) {
                
                // Mostra password file ZIP in un modal popup
                showPasswordModalPopup(password);
            
            })
            .catch(function(error) {
                
                console.log(error);
    
                // Mostra modal popup per segnalare all'utente
                // l'impossibilità di effettuare l'export delle credenziali offline
                document.getElementById('modal-popup-password-offline').style.display = 'block';
    
            });
    
        } catch(error){
            console.log(error);
        }

    } else {

        // Mostra modal popup per segnalare all'utente
        // l'impossibilità di effettuare l'export delle credenziali offline
        document.getElementById('modal-popup-password-offline').style.display = 'block';

    }

}

// Init credenziali all'avvio dell'applicazione
fillDefaultCred();

// Registra Service Worker
if('serviceWorker' in navigator) {
    
    let registration;
  
    const registerServiceWorker = async () => {
      registration = await navigator.serviceWorker.register('./offline-worker.js');
    };
  
    registerServiceWorker();
}



