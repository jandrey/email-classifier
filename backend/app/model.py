from pydantic import BaseModel

class EmailInput(BaseModel):
    text: str = None   # Texto direto do email
    filename: str = None  # Nome do arquivo (caso faça upload)
    
class EmailOutput(BaseModel):
    classification: str  # 'Produtivo' ou 'Improdutivo'
    suggested_reply: str  # Resposta sugerida pela AI
