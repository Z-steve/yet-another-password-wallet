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
    
    // Create a new JSZip instance with encryption support
    const zip = new JSZip();
    
    // Add credentials.json to the zip
    zip.file("credentials.json", JSON.stringify(credentials, null, 2));
    
    // Generate the zip file with password protection
    zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
            level: 9
        }
    }).then(function(content) {
        // Create a temporary file input to encrypt the zip
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.zip';
        
        // Create a temporary file
        const blob = new Blob([content], { type: 'application/zip' });
        const url = URL.createObjectURL(blob);
        
        // Create a temporary download link
        const a = document.createElement('a');
        a.href = url;
        a.download = 'temp.zip';
        
        // Add to body and trigger download
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
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