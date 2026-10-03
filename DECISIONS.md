# Design Decisions

## 1. Project Approach

The project uses a Retrieval-Augmented Generation (RAG) approach.

Instead of sending the complete PDF to the language model, the document is divided into smaller chunks. Relevant chunks are retrieved based on the user's question and only those chunks are provided to the language model.

The pipeline is:

```text
PDF
↓
Text Extraction
↓
Chunking
↓
Embeddings
↓
ChromaDB
↓
User Question
↓
Semantic Search
↓
Relevant Chunks
↓
LLM
↓
Answer + Sources
```

## 2. PDF Processing

PyMuPDF is used to extract text from the uploaded PDF.

The page number is stored along with the extracted text so that the final answer can show where the retrieved information came from.

## 3. Embedding Model

The project uses the `all-MiniLM-L6-v2` Sentence Transformer model.

It converts both document chunks and user questions into vector embeddings.

Using the same embedding model for the document and the question allows semantic similarity search to be performed.

## 4. Vector Database

ChromaDB is used as the vector database.

Each document chunk is stored with:

- Chunk text
- Vector embedding
- Page number

When a question is asked, its embedding is compared with the stored embeddings to retrieve relevant passages.

The current version of the project handles one document at a time. When a new document is uploaded, the previous document data is cleared.

## 5. Chunking Experiments

Two chunking configurations were considered.

### Configuration 1

```text
Chunk size: 500 words
Overlap: 50 words
```

During testing, the retrieved chunks were very large. A single result sometimes contained information about several different topics.

For example, a search for benefits and limitations of AI could return a large passage containing AI definitions, machine learning, deep learning, NLP, computer vision, benefits, and limitations.

This reduced the precision of retrieval.

### Configuration 2

```text
Chunk size: 150 words
Overlap: 30 words
```

Smaller chunks produced more focused passages.

The retrieved results were more closely related to the user's specific question because each chunk contained fewer unrelated topics.

The 30-word overlap was retained so that information near chunk boundaries would not lose important context.

### Decision

The project currently uses:

```text
Chunk size: 150 words
Overlap: 30 words
```

This configuration was selected because it provided more focused retrieval for the test document while still preserving context between neighboring chunks.

## 6. Retrieval Strategy

For each user question:

1. The question is converted into an embedding.
2. ChromaDB compares it with the stored document embeddings.
3. The most relevant chunks are retrieved.
4. The retrieved chunks are passed to the language model as context.

The system currently retrieves the top 3 relevant chunks.

## 7. Grounding

The language model is instructed to answer using only the retrieved document context.

The prompt also instructs the model to respond:

```text
I could not find this information in the provided document.
```

when the answer cannot be found in the retrieved context.

This reduces the possibility of the model answering from outside knowledge.

## 8. Source Handling

Each chunk retains the page number of the original PDF.

The `/ask` endpoint returns both:

- The generated answer
- Retrieved source passages and their page numbers

This allows the user to check where the information came from.

## 9. Limitations

The current implementation has several limitations:

- Supports one document at a time
- Retrieval quality depends on chunk size
- Semantic search may occasionally retrieve partially related passages
- PDF extraction works best with text-based PDFs
- Scanned PDFs would require OCR
- The system does not currently have a graphical frontend

## 10. Future Improvements

Possible future improvements include:

- Multiple-document support
- Conversation history
- Document summarization
- Frontend interface
- Improved chunking strategies
- Retrieval reranking
- Support for DOCX and TXT files
- Better handling of scanned PDFs