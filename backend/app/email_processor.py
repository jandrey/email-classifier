import io
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from openai import OpenAI
from PyPDF2 import PdfReader
from .config import OPENAI_API_KEY
from .utils import preprocess_text
import re
import unicodedata

client = OpenAI(api_key=OPENAI_API_KEY)

emails_treino = [
    "Ola Carlos, poderíamos marcar uma reunião para discutir o fechamento das aquisições de balanço hoje às 15 horas?",
    "Gostaria de agendar uma reunião para discutir o andamento do projeto X. Você tem disponibilidade para segunda-feira de manhã?",
    "Prezado, confirmamos o prazo para entrega do relatório financeiro até a próxima sexta-feira. Caso haja algum problema com o cronograma, por favor, nos avise até amanhã.",
    "Olá, conforme nossa conversa anterior, estou encaminhando o contrato para sua assinatura. Por favor, revise e nos envie o documento assinado até o final desta semana.",
    "Bom dia, gostaria de saber o status atual do projeto. Poderia me enviar uma atualização sobre os últimos marcos e prazos de entrega?",
    
    # Exemplos improdutivos
    "Ganhe um iPhone de graça! Basta clicar aqui e preencher seus dados.",
    "Você foi selecionado para uma entrevista! Clique aqui para confirmar.",
    "Assine agora e ganhe 3 meses grátis do nosso serviço de streaming! Não perca essa oportunidade!",
    "Sua conta foi comprometida! Clique aqui para verificar e corrigir seus dados bancários.",
    "Temos uma lista exclusiva de contatos para sua campanha. Adquira agora e tenha acesso ao melhor banco de dados."
]

# Certifique-se de que o número de rótulos seja igual ao número de e-mails
labels_treino = [
    "Produtivo", "Produtivo", "Produtivo", "Produtivo", "Produtivo",
    "Improdutivo", "Improdutivo", "Improdutivo", "Improdutivo", "Improdutivo"
]



model_nb = Pipeline([
    ('tfidf', TfidfVectorizer(max_features=1000, ngram_range=(1, 2))), 
    ('clf', MultinomialNB())
])

model_nb.fit(emails_treino, labels_treino)


def is_rule_based_improductive(text: str) -> bool:
    # Normalizar e remover acentos
    text = unicodedata.normalize('NFKD', text)
    text = text.encode('ASCII', 'ignore').decode('utf-8')  # remove acentos
    text_lower = text.lower()
    
    # Padrões que indicam e-mail automático ou não relevante
    patterns = [
        r"nao\s+responda\s+a\s+esse\s+e-?mail",  # "não responda a esse e-mail" normalizado
        r"mensagem automatica",
        r"nao\s+e\s+necessario\s+responder",
        r"nao\s+responder",
        r"nao\s+enviar\s+resposta",
        r"nao\s+responda"
    ]
    
    return any(re.search(pat, text_lower, re.IGNORECASE) for pat in patterns)



# GPT para casos ambíguos
def gpt_classify_and_reply(text: str) -> dict:
    
    prompt = f"""
        1. Classificação:  
        Leia atentamente o conteúdo do e-mail fornecido.  
        Classifique-o como:
        - "Produtivo" se contiver assuntos como urgência, solicitação de documentos, agendamento de reunião, prazos, follow-up, ou qualquer tema relacionado ao trabalho.
        - "Improdutivo" se for propaganda, mensagem de felicitação, convites para eventos pessoais, ou qualquer coisa não relacionada ao trabalho.

        2. Resposta:  
        - Se for "Produtivo", gere uma resposta formal, educada e profissional com base no conteúdo do e-mail, confirmando recebimento, fornecendo informações ou pedindo mais detalhes se necessário.  
        - Se for "Improdutivo", responda de forma neutra e curta (por exemplo: “Obrigado pela mensagem”) ou indique que não é relevante ao trabalho.

        **Regras importantes:**
        - Sempre responda em primeira pessoa do destinatário real (quem vai enviar a resposta), **não repita o nome que aparece no corpo do email** (como “Prezado André”), pois pode ser confuso.  
        - Use o **nome do remetente real** (quem enviou o email) se estiver disponível; caso contrário, use uma saudação genérica como “Olá,” ou “Prezado(a),”.  
        - A assinatura deve refletir quem está respondendo (ex.: “[Seu Nome]”) e não o remetente do email.  
        - Mantenha o tom profissional, educado e objetivo.  
        - Confirme informações importantes do email e, se necessário, peça detalhes ou confirme ação.

        **Formato de saída:**  
        Produtivo ||| [Resposta sugerida]  
        Improdutivo ||| [Resposta sugerida curta]

        A resposta deve ser clara e objetiva.

        Email:
        {text}

    """
    response = client.chat.completions.create(
        model="gpt-4-turbo",
        messages=[
            {"role": "system", "content": "Você é um assistente que classifica emails."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=300
    )

    # Extrair a resposta sugerida
    output = response.choices[0].message.content.strip()  # Remover espaços extras
    print(output)  # Para depuração, caso você precise ver a resposta

    # Dividir a resposta em ||| para separar a classificação e a resposta
    if '|||' in output:
        categoria, resposta = output.split('|||', 1)  # Divide categoria de resposta
        categoria = categoria.strip()  # Remover espaços extras
        resposta = resposta.strip()  # Remover espaços extras
    else:
        categoria = output.strip()  # Caso não haja ||| , o output é a classificação
        resposta = "Sem resposta sugerida"  # Caso não haja resposta após a classificação

    # Retornar o resultado com a classificação e resposta separadas
    return {"classification": categoria, "suggested_reply": resposta}

# Pipeline híbrido
def classify_email_hybrid(text: str, threshold: float = 0.5) -> dict:

    processed_text = preprocess_text(text)
    probs = model_nb.predict_proba([processed_text])[0]
    max_prob = max(probs)
    categoria_nb = model_nb.classes_[probs.argmax()]

    
    
    # Se a classificação for "Improdutivo", e a probabilidade não for alta, chamar o GPT
    if categoria_nb == "Improdutivo" and max_prob < threshold:
        print("Classificação improdutiva com baixa confiança. Chamando o GPT para sugestão de resposta.")
        return gpt_classify_and_reply(processed_text)
    
    # Se a classificação for "Produtivo" e a probabilidade for maior que o threshold, responder com uma resposta padrão
    if max_prob >= threshold or is_rule_based_improductive(text):
        if categoria_nb == "Improdutivo":
            response = "Mensagem registrada, sem ação necessária."        
            return {"classification": categoria_nb, "suggested_reply": response}
    
    # Caso contrário, chama o GPT se a probabilidade for baixa
    return gpt_classify_and_reply(processed_text)



def extract_text(file_content: bytes, filename: str) -> str:
    if filename.endswith('.pdf'):
        reader = PdfReader(io.BytesIO(file_content))
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    else:  # txt
        return file_content.decode('utf-8')

def process_email(file_content: bytes = None, filename: str = None, text: str = None) -> dict:
    if text:
        raw_text = text
    elif file_content and filename:
        raw_text = extract_text(file_content, filename)
    else:
        raise ValueError("É necessário fornecer arquivo ou texto direto.")

    result = classify_email_hybrid(raw_text)
    return result
