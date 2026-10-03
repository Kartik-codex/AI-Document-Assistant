from fastapi import FastAPI, UploadFile, File
from backend.pdf_processor import extract_text_from_pdf
from backend.chunking import create_chunks
from backend.vector_store import store_chunks, search_chunks
from backend.rag import ask_document
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():

    return {
        "message": "AI Document Assistant is running"
    }


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    contents = await file.read()

    pages = extract_text_from_pdf(contents)

    chunks = create_chunks(pages)
    store_chunks(chunks)

    return {
        "filename": file.filename,
        "number_of_chunks": len(chunks),
        "chunks": chunks
    }

@app.post("/search")
def search(question: str):
    results = search_chunks(question)
    return results

@app.post("/ask")
def ask(question: str):
    result = ask_document(question)
    return result