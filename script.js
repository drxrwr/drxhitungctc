document.getElementById("fileForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fileInput = document.getElementById("fileInput");
  const loading = document.getElementById("loading");
  const results = document.getElementById("results");

  // Clear previous results
  results.innerHTML = "";

  if (fileInput.files.length === 0) {
    alert("Please upload at least one file.");
    return;
  }

  loading.classList.remove("hidden");

  const files = fileInput.files;
  for (const file of files) {
    const result = document.createElement("div");
    result.className = "file-result";

    try {
      const content = await file.text();

      let count = 0;
      if (file.name.endsWith(".txt")) {
        const lines = content.split("\n");
        count = lines.filter(line => line.trim().match(/^\+?\d+$/)).length;
      } else if (file.name.endsWith(".vcf")) {
        const matches = content.match(/TEL:\+?\d+/g);
        count = matches ? matches.length : 0;
      }

      result.innerHTML = `<strong>${file.name}:</strong> ${count} phone numbers found.`;
    } catch (error) {
      result.innerHTML = `<strong>${file.name}:</strong> Error processing file.`;
    }

    results.appendChild(result);
  }

  loading.classList.add("hidden");
});
