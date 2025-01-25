let files = [];
let results = [];

document.getElementById("fileInput").addEventListener("change", handleFileSelect);

function handleFileSelect(event) {
    files = event.target.files;
    document.getElementById("formContainer").innerHTML = ""; // Reset formContainer

    // Clear previous results when new files are selected
    document.getElementById("resultsContainer").innerHTML = "";

    if (files.length > 0) {
        document.getElementById("vcfName").value = ""; // Reset VCF name field
    }
}

function convertFiles() {
    const vcfNamePrefix = document.getElementById("vcfName").value.trim();
    if (!vcfNamePrefix) {
        alert("Harap masukkan nama untuk file VCF!");
        return;
    }

    results = [];
    Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const txtContent = event.target.result;
            const lines = txtContent.split("\n").map(line => line.trim()).filter(line => line);
            const adminNumber = lines[0].replace(/Admin[\s=]+/, "").trim();
            const userNumbers = lines.slice(1);

            // Format VCF contacts
            let adminContact = formatVCF(adminNumber, "ADMIN 1");
            let userContacts = userNumbers.map((number, i) => formatVCF(number, `USER ${i + 1}`));

            results.push({
                vcfName: vcfNamePrefix || file.name.split(".")[0],
                adminContact: adminContact,
                userContacts: userContacts
            });

            if (index === files.length - 1) {
                displayResults();
            }
        };
        reader.readAsText(file);
    });
}

function formatVCF(number, name) {
    if (!number.startsWith("+")) {
        number = "+" + number.trim();
    }

    return `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL:${number}
END:VCARD`;
}

function displayResults() {
    const container = document.getElementById("resultsContainer");
    container.innerHTML = ""; // Reset results container

    results.forEach((result, index) => {
        let resultContainer = document.createElement("div");
        resultContainer.classList.add("result");

        let vcfFileNameAdmin = `${result.vcfName}_ADMIN.vcf`;
        let vcfFileNameUser = `${result.vcfName}.vcf`;

        resultContainer.innerHTML = `
            <h3>Nama File: ${result.vcfName}</h3>
            <p><strong>VCF Admin:</strong> <a href="data:text/vcard;base64,${btoa(result.adminContact)}" download="${vcfFileNameAdmin}">Download</a></p>
            <p><strong>VCF User:</strong> <a href="data:text/vcard;base64,${btoa(result.userContacts.join("\n"))}" download="${vcfFileNameUser}">Download</a></p>
        `;

        container.appendChild(resultContainer);
    });
}
