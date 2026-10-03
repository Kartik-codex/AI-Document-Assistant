# Testing

The AI Document Assistant was tested using questions related to the uploaded Artificial Intelligence document.

## Test 1 - Basic Definition

**Question:**

```text
What is Artificial Intelligence?
```

**Expected Result:**

The system should retrieve passages explaining the meaning of Artificial Intelligence and generate an answer using those passages.

**Result:**

Relevant AI passages were successfully retrieved from the document.

**Status:** PASS

---

## Test 2 - Comparison

**Question:**

```text
What is the difference between AI and traditional programming?
```

**Expected Result:**

The system should retrieve the section comparing AI with traditional programming.

**Result:**

Relevant passages about AI and traditional programming were retrieved.

**Status:** PASS

---

## Test 3 - Benefits and Limitations

**Question:**

```text
What are the benefits and limitations of AI?
```

**Expected Result:**

The system should retrieve passages discussing the advantages and limitations of Artificial Intelligence.

**Result:**

The smaller chunking configuration produced more focused passages related to benefits and limitations.

**Status:** PASS

---

## Test 4 - AI Applications

**Question:**

```text
What are some applications of Artificial Intelligence?
```

**Expected Result:**

The system should retrieve information about applications of AI mentioned in the document.

**Result:**

Relevant passages were retrieved from the document and used as context for the answer.

**Status:** PASS

---

## Test 5 - Unanswerable Question

**Question:**

```text
Who won the FIFA World Cup in 2018?
```

**Expected Result:**

Since this information is unrelated to the uploaded AI document, the assistant should not answer using outside knowledge.

The expected response is:

```text
I could not find this information in the provided document.
```

**Result:**

The system correctly identified that the answer was not available in the provided document.

**Status:** PASS

---

# Chunking Test

Two chunking configurations were tested.

| Configuration | Chunk Size | Overlap | Observation |
|---|---:|---:|---|
| Configuration 1 | 500 words | 50 words | Chunks were large and sometimes contained several different topics. |
| Configuration 2 | 150 words | 30 words | Retrieval was more focused on the specific question. |

Configuration 2 was selected for the final implementation.

# Conclusion

The testing demonstrates the complete RAG pipeline:

```text
PDF
↓
Text Extraction
↓
Chunking
↓
Embedding Generation
↓
Vector Storage
↓
Semantic Retrieval
↓
Context Selection
↓
LLM Answer Generation
↓
Answer + Source
```

The system can retrieve relevant document information, generate grounded answers, provide source information, and handle questions whose answers are not available in the uploaded document.