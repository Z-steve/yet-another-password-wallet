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
    
    // Convert credentials to string
    const credentialsStr = JSON.stringify(credentials, null, 2);
    
    // Create a ZIP file with password protection
    const zip = new fflate.Zip();
    
    // Add the file with password protection
    zip.addFile("credentials.json", fflate.strToU8(credentialsStr), {
        password: password,
        encryption: true
    });
    
    // Generate the ZIP file
    const zipData = zip.zip();
    
    // Create download link
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([zipData], { type: 'application/zip' }));
    a.download = "credentials.zip";
    
    // Trigger download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Show password to user
    showPasswordModalPopup(password);
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