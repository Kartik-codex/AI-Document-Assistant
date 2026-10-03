import fitz


def extract_text_from_pdf(contents):
    document = fitz.open(
        stream=contents,
        filetype="pdf"
    )

    pages = []

    for page_number in range(len(document)):
        page = document[page_number]
        text = str(page.get_text())

        pages.append({
            "page": page_number + 1,
            "text": text
        })

    return pages