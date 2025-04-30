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
    
    // Encrypt the credentials JSON using CryptoJS
    const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(credentials, null, 2),
        password
    ).toString();
    
    // Add the encrypted data to the zip
    zip.file("encrypted_credentials.json", encryptedData);
    
    // Add a README file with instructions
    zip.file("README.txt", "This ZIP file contains encrypted credentials.\n" +
        "To decrypt the credentials:\n" +
        "1. Extract the encrypted_credentials.json file\n" +
        "2. Use the password shown in the popup to decrypt the file\n" +
        "3. The decrypted file will contain your credentials");
    
    // Generate the zip file
    zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
            level: 9
        }
    }).then(function(content) {
        // Create download link
        const a = document.createElement("a");
        a.href = URL.createObjectURL(content);
        a.download = "encrypted_credentials.zip";
        
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