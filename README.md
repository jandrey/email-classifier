# AutoU Email Classifier 🚀

## Descrição do Projeto

Este projeto é uma **aplicação web para classificação automática de emails** em categorias **Produtivo** ou **Improdutivo**, com geração de **respostas automáticas** usando **inteligência artificial**.

O sistema é dividido em **backend em Python 3.13+** (FastAPI, NLP, OpenAI API) e **frontend em React + TypeScript + TailwindCSS**.

---

## Funcionalidades

- Upload de arquivos `.txt` e `.pdf` ou inserção direta de texto.
- Classificação automática do email como **Produtivo** ou **Improdutivo**.
- Sugestão de resposta automática baseada na categoria.
- Interface web intuitiva e responsiva.
- Conexão frontend-backend via API REST.

---

## Estrutura do Projeto

```
root/
│
├── backend/           # Backend em Python
│   ├── main.py        # Entrada do servidor FastAPI
│   ├── requirements.txt
│   └── ...            # Outras dependências e scripts
│
└── frontend/          # Frontend React + Tailwind
    ├── package.json
    ├── src/
    │   ├── App.tsx
    │   ├── index.tsx
    │   └── components/
    └── ...
```

---

## Pré-requisitos

- **Python 3.13+** e **pip**
- **Node.js 18+** e **npm**
- Conta de API para **OpenAI** ou outro serviço de NLP
- (Opcional) Navegador moderno para testes

---

## Configuração do Backend

1. Navegue até a pasta do backend:
```bash
cd backend
```

2. Crie e ative um **ambiente virtual**:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

3. Instale as dependências:
```bash
pip install -r requirements.txt
```

4. Configure a variável de ambiente da API (OpenAI):
```bash
export OPENAI_API_KEY="SUA_CHAVE_AQUI"   # Linux/Mac
setx OPENAI_API_KEY "SUA_CHAVE_AQUI"     # Windows
```

5. Rode o servidor FastAPI:
```bash
uvicorn main:app --reload
```

O backend estará disponível em `http://127.0.0.1:8000`.

---

## Configuração do Frontend

1. Navegue até a pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Rode o servidor de desenvolvimento:
```bash
npm start
```

O frontend estará disponível em `http://localhost:3000`.

---

## Testando a Aplicação

1. Abra o navegador em `http://localhost:3000`.
2. Faça upload de um arquivo de email ou insira o texto diretamente.
3. Clique em **Enviar**.
4. O backend processará o email, classificará e retornará a resposta sugerida.
5. Confira o resultado na interface.

---

## Deploy

Você pode hospedar a aplicação em serviços gratuitos como:

- **Frontend:** Vercel, Netlify
- **Backend:** Render, Heroku, Hugging Face Spaces

### Passo rápido para deploy:

1. **Backend:** Configure `uvicorn main:app --host 0.0.0.0 --port $PORT`.
2. **Frontend:** Configure `npm run build` e publique a pasta `build/`.
3. Atualize a URL da API no frontend (`axios`) para apontar para o backend hospedado.

---

## Tecnologias Utilizadas

- **Backend:** Python, FastAPI, SpaCy, OpenAI, PyPDF2, NLTK, scikit-learn
- **Frontend:** React, TypeScript, TailwindCSS, Axios
- **Hospedagem:** Opcional (Heroku, Vercel, Render, etc.)

---

## Observações

- Certifique-se de que o backend está rodando antes de usar o frontend.
- Para novos modelos de AI, atualize o script de classificação.
- Caso queira treinar um modelo local de NLP, use os scripts em `backend/`.

---

