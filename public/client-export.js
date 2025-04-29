// Client-side export functionality
function clientExportCredentials() {
    // Get all credentials from localStorage
    const credentials = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key !== "defaultFilled") {
            credentials[key] = JSON.parse(localStorage.getItem(key));
        }
    }
    
    // Generate a random password for the ZIP file
    const password = generateRandomPassword();
    
    // Create a new ZIP writer
    const zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"), {
        password: password,
        encryptionStrength: 3, // Maximum encryption strength
        level: 9 // Maximum compression
    });
    
    // Add credentials.json to the zip
    zipWriter.add("credentials.json", new zip.TextReader(JSON.stringify(credentials, null, 2)));
    
    // Close the ZIP writer and get the blob
    zipWriter.close().then(function(blob) {
        // Create download link
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "credentials.zip";
        
        // Trigger download
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Show password to user
        showPasswordModalPopup(password);
    });
}

function generateRandomPassword() {
    const length = 10;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
} 