from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from .email_processor import process_email

app = FastAPI(title="Email Classifier")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process-email")
async def process_email_endpoint(
    file: UploadFile = File(None),  # arquivo opcional
    text: str = Form(None)          # texto opcional
):
    try:
        if file:
            content = await file.read()
            result = process_email(content, file.filename)
            return result
        elif text:
            result = process_email(text=text)
            return result
        else:
            return {"error": "Envie um arquivo ou texto"}
    except Exception as e:
        return {"error": str(e)}
