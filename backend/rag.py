import os

from dotenv import load_dotenv
from openai import OpenAI

from backend.vector_store import search_chunks

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


def ask_document(question):
    results = search_chunks(question)

    documents = results["documents"][0]
    metadatas = results["metadatas"][0]

    context_parts = []

    for document, metadata in zip(documents, metadatas):
        page = metadata["page"]
        context_parts.append(
            f"Page {page}:\n{document}"
        )

    context = "\n\n".join(context_parts)

    prompt = f"""
You are a document question-answering assistant.

Answer the question using ONLY the context provided below.

If the answer cannot be found in the context, say:
"I could not find this information in the provided document."

Do not use outside knowledge.

CONTEXT:
{context}

QUESTION:
{question}
"""

    response = client.responses.create(
        model="gpt-6-luna",
        input=prompt
    )

    sources = []

    for document, metadata in zip(documents, metadatas):
        sources.append({
            "page": metadata["page"],
            "passage": document
        })

    return {
        "answer": response.output_text,
        "sources": sources
    }