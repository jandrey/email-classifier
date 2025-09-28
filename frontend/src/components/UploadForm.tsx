import { useState, useEffect } from "react";
import { processEmail } from "../services/api";
import ResultCard from "./ResultCard";
import FileUpload from "./FileUpload";
import TextArea from "./TextArea";
import BrainIcon from "./icons/BrainIcon";

import { DocumentTextIcon } from "@heroicons/react/24/outline";
import FileTextIcon from "./icons/FileTextIcon";
import UploadIcon from "./icons/UploadIcon";
import { toast, ToastContainer } from "react-toastify"; // Importando o Toast
import "react-toastify/dist/ReactToastify.css"; // Importando o CSS do Toastify
import CircleCheckIcon from "./icons/CicleCheckIcon";

const UploadForm = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingText, setLoadingText] = useState("Aguardando análise do email");

  // Função para mostrar os pontos dinamicamente
  useEffect(() => {
    let dotCount = 0;
    let interval: NodeJS.Timeout | null = null;

    if (loading) {
      interval = setInterval(() => {
        dotCount = (dotCount + 1) % 4;
        setLoadingText("Aguardando análise do email" + ".".repeat(dotCount));
      }, 300);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.length && !text) {
      toast.error("Informe um arquivo ou texto!");
      return;
    }
    setResult(null)
    setLoading(true);
    setError("");
    try {
      const res = await processEmail(files[0] || undefined, text || undefined);
      setResult(res);
    } catch (err) {
      console.error(err);
      toast.error("Erro no upload: Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-center flex items-center justify-center">
         <BrainIcon className={`w-12 h-12 mr-2 p-2 bg-gray-800 rounded-lg animate ${loading ? 'animate-pulse' : ''}`} />
        Classificador de Emails <span className="ml-2 text-blue-500">IA</span>
      </h1>

      <p className="mb-6 text-center text-gray-300 max-w-2xl">
        Sistema inteligente para classificação automática de emails corporativos e sugestão de respostas
      </p>

      <div className="flex flex-col md:flex-row w-full max-w-6xl gap-6">
        {/* Lado esquerdo - Upload / Text */}
        <form onSubmit={handleSubmit} className="flex-1 bg-gray-800 p-6 rounded-lg flex flex-col">
          <div className="flex items-center text-left w-full mb-1">
            <UploadIcon className="text-blue-500 w-5 h-5 mr-2 mx-0" />
            <h2 className="font-semibold text-white text-sm">Entrada de Email</h2>
          </div>
          <p className="text-gray-400 text-sm mb-4 text-left">
            Faça upload de arquivos ou cole o texto do email diretamente
          </p>

          <FileUpload files={files} setFiles={setFiles} text={text} />
          <span className=" text-sm">Ou cole o texto do email:</span>
          <TextArea text={text} setText={setText} files={files} />

          {error && <p className="text-red-500 mb-2">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
          >
            {loading ? (
              "Processando..."
            ) : (
              <>
                <div className="flex items-center justify-center w-full h-full mb-1">
                  <BrainIcon className="w-5 h-5 mr-2" />
                  <h2 className="font-semibold text-white text-sm">Analisar Email</h2>
                </div>
              </>
            )}
          </button>
        </form>

        <div className="flex-1 bg-gray-800 p-6 rounded-lg min-h-[300px] flex flex-col text-sm">
          <div className="flex items-center text-left w-full mb-1">
            <CircleCheckIcon className="text-blue-500 w-5 h-5 mr-2 mx-0" />
            <h2 className="font-semibold text-white text-sm">Resultado da Análise</h2>
          </div>

          {/* Descrição */}
          <p className="text-gray-400 text-sm mb-4 text-left">
            Classificação automática e sugestão de resposta
          </p>

          {/* Condição para exibir ícone de carregamento ou resultado */}
          {!result ? (
            <div className="flex flex-col items-center justify-center gap-4 text-gray-400 mt-8">
              <span className="text-5xl">
                <BrainIcon className="w-16 h-16 text-gray-300" />
              </span>
              <span className="text-lg">{loadingText}</span>
            </div>
          ) : (
            <ResultCard classification={result.classification} suggested_reply={result.suggested_reply} />
          )}
        </div>
      </div>

      {/* Rodapé / Destaques */}
      <div className="flex flex-col md:flex-row gap-4 mt-8 w-full max-w-6xl justify-between">
        <div className="flex-1 bg-gray-800 p-6 rounded-xl text-center">
          <span className="text-2xl block mb-2">
            <BrainIcon className="text-blue-500 w-10 h-10 mx-auto" />
          </span>
          <h3 className="font-semibold my-6">IA Avançada</h3>
          <p className="text-gray-400 text-sm">Classificação inteligente baseada em processamento de linguagem natural</p>
        </div>
        <div className="flex-1 bg-gray-800 p-6 rounded-xl text-center">
          <span className="text-2xl block mb-2">
            <CircleCheckIcon className="text-blue-500 w-10 h-10 mx-auto" />
          </span>
          <h3 className="font-semibold my-6">Alta Precisão</h3>
          <p className="text-gray-400 text-sm">Algoritmos treinados para identificar emails produtivos e improdutivos</p>
        </div>
        <div className="flex-1 bg-gray-800 p-6 rounded-xl text-center">
          <span className="text-2xl block mb-2">
            <FileTextIcon className="text-blue-500 w-10 h-10 mx-auto" />
          </span>
          <h3 className="font-semibold my-6">Múltiplos Formatos</h3>
          <p className="text-gray-400 text-sm">Suporte para arquivos de texto e PDF, além de entrada direta</p>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeButton={true}
        pauseOnHover={true}
      />
    </div>
  );
};

export default UploadForm;
