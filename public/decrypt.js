// Decryption functionality
function decryptCredentials() {
    // Create file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Read the file
        const reader = new FileReader();
        reader.onload = function(e) {
            const encryptedData = e.target.result;
            
            // Show password prompt
            const password = prompt("Enter the decryption password:");
            if (!password) return;

            try {
                // Decrypt the data
                const bytes = CryptoJS.AES.decrypt(encryptedData, password);
                const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                
                // Create a new Blob with the decrypted data
                const blob = new Blob([JSON.stringify(decryptedData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                
                // Create download link
                const a = document.createElement('a');
                a.href = url;
                a.download = 'decrypted_credentials.json';
                
                // Trigger download
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                alert('Credentials successfully decrypted and downloaded!');
            } catch (error) {
                alert('Decryption failed. Please check if the password is correct.');
                console.error('Decryption error:', error);
            }
        };
        reader.readAsText(file);
    };
    fileInput.click();
}

// Add a button to decrypt the file
document.addEventListener('DOMContentLoaded', function() {
    const decryptButton = document.createElement('button');
    decryptButton.innerHTML = 'Decrypt Credentials';
    decryptButton.className = 'w3-button w3-large w3-center';
    decryptButton.onclick = decryptCredentials;
    
    // Add the button to the page (you might want to adjust the placement)
    document.body.appendChild(decryptButton);
});
