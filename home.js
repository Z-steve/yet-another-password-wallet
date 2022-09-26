
// Funzione per aggiungere una credenziale
function addCred(){



}

// Bisogna chiamarla una sola volta per 
function fillDefaultCred(){

    // Controlla se è già stato fatto il preset delle credenziali di default
    if(localStorage.getItem("defaultFilled") === undefined){
        
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
    
    if(credBox !== undefined){

        // Recupero dati credBox
        var credentialObject = JSON.parse(localStorage.getItem(credBoxId));

        // Fill campi del modal popup
        document.getElementById("modal-cred-name").textContent = credentialObject.credentialName;
        document.getElementById("modal-email").textContent = credentialObject.email;
        document.getElementById("modal-password").textContent = credentialObject.password;
        document.getElementById("modal-description").textContent = credentialObject.description;

    }

    document.getElementById('modal-popup').style.display='block';

}

function closeModalPopup(){

    // Nascondi modal popup
    document.getElementById('modal-popup').style.display='none';

    // Svuota campi modal popup
    document.getElementById("modal-cred-name").textContent = "";
    document.getElementById("modal-email").textContent = "";
    document.getElementById("modal-password").textContent = "";
    document.getElementById("modal-description").textContent = "";

}

// Funzione per modificare una credenziale
function editCred(id){
 
}

// Funzione per rimuovere una credenziale
function deleteCred(credBoxId){

}

// Funzione per esportare tutte le credenziali
function exportCred(){
}