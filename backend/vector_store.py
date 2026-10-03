import chromadb
from backend.embeddings import create_embedding

client = chromadb.PersistentClient(path="./chroma_db")

COLLECTION_NAME = "documents"


def get_collection():
    return client.get_or_create_collection(
        name=COLLECTION_NAME
    )


def clear_collection():
    try:
        client.delete_collection(name=COLLECTION_NAME)
    except Exception:
        pass


def store_chunks(chunks):

    clear_collection()

    collection = get_collection()

    for i, chunk in enumerate(chunks):

        embedding = create_embedding(chunk["text"])

        collection.add(
            ids=[str(i)],
            documents=[chunk["text"]],
            embeddings=[embedding],
            metadatas=[
                {
                    "page": chunk["page"]
                }
            ]
        )


def search_chunks(question, top_k=3):

    collection = get_collection()
    question_embedding = create_embedding(question)
    results = collection.query(
        query_embeddings=[question_embedding],
        n_results=top_k
    )
    return results