import axios from 'axios';

const API_URL = "http://localhost:8000"; // Troque pelo URL do backend no deploy

/**
 * Envia email para classificação e recebe resultado
 * @param file Arquivo enviado (.txt ou .pdf)
 * @param text Texto direto do email
 * @returns { classification: string, suggested_reply: string }
 */
export const processEmail = async (file?: File, text?: string) => {
  const formData = new FormData();
  
  if (file) formData.append('file', file);
  else if (text) formData.append('text', text);

  const response = await axios.post(`${API_URL}/process-email`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return response.data;
};
