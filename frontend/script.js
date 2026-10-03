const pdfFile = document.getElementById("pdfFile");
const fileInfo = document.getElementById("fileInfo");
const fileName = document.getElementById("fileName");
const fileStatus = document.getElementById("fileStatus");
const uploadButton = document.getElementById("uploadButton");

const questionInput = document.getElementById("questionInput");
const askButton = document.getElementById("askButton");

const loading = document.getElementById("loading");
const answerContainer = document.getElementById("answerContainer");
const answerText = document.getElementById("answerText");
const sourcesContainer = document.getElementById("sourcesContainer");

const API_URL = "http://127.0.0.1:8000";

let documentUploaded = false;


pdfFile.addEventListener("change", () => {
    const file = pdfFile.files[0];

    if (!file) {
        return;
    }

    fileInfo.style.display = "flex";
    fileName.textContent = file.name;
    fileStatus.textContent = "Ready to upload";

    documentUploaded = false;
});


uploadButton.addEventListener("click", async () => {
    const file = pdfFile.files[0];

    if (!file) {
        alert("Please select a PDF first.");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    uploadButton.disabled = true;
    uploadButton.textContent = "Uploading...";
    fileStatus.textContent = "Processing document...";

    try {
        const response = await fetch(`${API_URL}/upload`, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Upload failed");
        }

        await response.json();

        documentUploaded = true;

        fileStatus.textContent = "Document uploaded successfully";
        uploadButton.textContent = "Uploaded ✓";

    } catch (error) {
        console.error(error);

        documentUploaded = false;
        fileStatus.textContent = "Upload failed";
        uploadButton.textContent = "Upload Document";

        alert("Could not upload the document.");

    } finally {
        uploadButton.disabled = false;
    }
});


askButton.addEventListener("click", askQuestion);

questionInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        askQuestion();
    }
});


async function askQuestion() {
    const question = questionInput.value.trim();

    if (!documentUploaded) {
        alert("Please upload a PDF first.");
        return;
    }

    if (!question) {
        alert("Please enter a question.");
        return;
    }

    loading.style.display = "block";
    answerContainer.style.display = "none";

    askButton.disabled = true;
    askButton.textContent = "Thinking...";

    try {
        const response = await fetch(
            `${API_URL}/ask?question=${encodeURIComponent(question)}`,
            {
                method: "POST"
            }
        );

        if (!response.ok) {
            throw new Error("Failed to get answer");
        }

        const data = await response.json();

        answerText.textContent = data.answer;

        sourcesContainer.innerHTML = "";

        if (data.sources && data.sources.length > 0) {
            data.sources.forEach((source) => {
                const sourceCard = document.createElement("div");
                sourceCard.className = "source-card";

                const pageNumber = document.createElement("span");
                pageNumber.className = "page-number";
                pageNumber.textContent = `Page ${source.page}`;

                const passage = document.createElement("p");
                passage.textContent = source.passage;

                sourceCard.appendChild(pageNumber);
                sourceCard.appendChild(passage);

                sourcesContainer.appendChild(sourceCard);
            });
        } else {
            sourcesContainer.innerHTML =
                "<p>No source passages were returned.</p>";
        }

        answerContainer.style.display = "block";

    } catch (error) {
        console.error(error);

        answerText.textContent =
            "Something went wrong while generating the answer.";

        sourcesContainer.innerHTML = "";
        answerContainer.style.display = "block";

    } finally {
        loading.style.display = "none";
        askButton.disabled = false;
        askButton.textContent = "Ask";
    }
}