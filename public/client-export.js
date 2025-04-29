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
    
    // Create a new JSZip instance
    const zip = new JSZip();
    
    // Add credentials.json to the zip
    zip.file("credentials.json", JSON.stringify(credentials, null, 2));
    
    // Generate the zip file with password protection
    zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
            level: 9
        },
        // Use CryptoJS to encrypt the content before adding to ZIP
        encryption: {
            password: password,
            algorithm: "AES-256"
        }
    }).then(function(content) {
        // Create download link
        const a = document.createElement("a");
        a.href = URL.createObjectURL(content);
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