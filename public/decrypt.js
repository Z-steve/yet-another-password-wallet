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

// Add a decrypt button that matches the export button's style
document.addEventListener('DOMContentLoaded', function() {
    // Create decrypt button container
    const decryptContainer = document.createElement('div');
    decryptContainer.className = 'w3-third w3-row-padding cred-box';
    decryptContainer.onclick = decryptCredentials;
    
    // Create the card
    const card = document.createElement('div');
    card.className = 'w3-card w3-white w3-container w3-hover-shadow w3-center zoom';
    card.style.minHeight = '200px';
    
    // Add the icon
    const icon = document.createElement('img');
    icon.className = 'cred-icon w3-center';
    icon.src = 'images/decrypt.png';
    icon.alt = 'decrypt-icon';
    
    // Add the text
    const text = document.createElement('h3');
    text.className = 'cred-text w3-center';
    text.textContent = 'DECRYPT';
    
    // Append elements
    card.appendChild(icon);
    card.appendChild(text);
    decryptContainer.appendChild(card);
    
    // Find the export button's container and insert decrypt button next to it
    const exportContainer = document.querySelector('#export-creds');
    exportContainer.parentNode.insertBefore(decryptContainer, exportContainer.nextSibling);
});
