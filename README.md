# AI-Powered Document Assistant

An AI-powered document question-answering system that allows users to upload a PDF and ask questions based on its content.

The system uses a Retrieval-Augmented Generation (RAG) pipeline to retrieve relevant passages from the uploaded document and generate answers grounded in the document.

## Features

- Upload and process PDF documents
- Extract text from PDFs
- Split text into overlapping chunks
- Generate text embeddings
- Store embeddings in ChromaDB
- Semantic search for relevant passages
- Generate answers using retrieved context
- Display source page and passage
- Avoid answering questions not supported by the document

## Tech Stack

- Python
- FastAPI
- PyMuPDF
- Sentence Transformers
- ChromaDB
- OpenAI API
- python-dotenv
- Uvicorn

## Project Structure

```text
AI-Document-Assistant/
│
├── backend/
│   ├── main.py
│   ├── pdf_processor.py
│   ├── chunking.py
│   ├── embeddings.py
│   ├── vector_store.py
│   └── rag.py
│
├── .env
├── .gitignore
└── README.md
```

## RAG Pipeline

```text
PDF
 ↓
Text Extraction
 ↓
Text Chunking
 ↓
Embeddings
 ↓
ChromaDB
 ↓
User Question
 ↓
Semantic Search
 ↓
Relevant Document Chunks
 ↓
LLM
 ↓
Answer + Sources
```

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd AI-Document-Assistant
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install the required packages:

```bash
pip install fastapi uvicorn pymupdf sentence-transformers chromadb openai python-dotenv python-multipart
```

## Environment Variables

Create a `.env` file in the project root:

```text
OPENAI_API_KEY=your_openai_api_key
```

Do not upload the `.env` file to GitHub.

## Running the Application

Start the FastAPI server:

```bash
uvicorn backend.main:app --reload
```

Open the API documentation:

```text
http://127.0.0.1:8000/docs
```

## API Endpoints

### `/upload`

Uploads a PDF, extracts its text, creates chunks, generates embeddings, and stores them in ChromaDB.

### `/search`

Searches the vector database and returns the most relevant document passages.

### `/ask`

Retrieves relevant passages and uses them as context to generate a document-grounded answer.

## Chunking Strategy

The current configuration uses:

- Chunk size: 150 words
- Overlap: 30 words

Overlapping chunks help preserve context between neighboring sections of the document.

## Example

Question:

```text
What is Artificial Intelligence?
```

The system retrieves relevant passages from the uploaded PDF and generates an answer based only on those passages.

For a question whose answer is not available in the document, the assistant is instructed to respond that the information could not be found in the provided document.

## Future Improvements

- Support multiple documents
- Add conversation history
- Add document summarization
- Build a frontend interface
- Improve retrieval and ranking
- Add support for more file formats