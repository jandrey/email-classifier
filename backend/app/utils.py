import re
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

def preprocess_text(text: str) -> str:
    # Manter letras, números, espaços e caracteres de datas/horários (/, :, h)
    text = re.sub(r'[^a-zA-Z0-9\s/:h]', '', text)
    text = text.lower()
    
    # Tokenizar
    words = text.split()

    # Remover stopwords
    stop_words = set(stopwords.words('portuguese'))
    words = [word for word in words if word not in stop_words]

    # Lematização
    lemmatizer = WordNetLemmatizer()
    words = [lemmatizer.lemmatize(word) for word in words]

    return ' '.join(words)
