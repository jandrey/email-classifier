import { ClipboardIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface ResultCardProps {
  classification: string;
  suggested_reply: string;
}

const ResultCard = ({ classification, suggested_reply }: ResultCardProps) => {
  const isProductive = classification.toLowerCase() === "produtivo";
  
  const [tooltipVisible, setTooltipVisible] = useState(false);

  // Função para copiar a resposta sugerida para a área de transferência
  const copyToClipboard = () => {
    navigator.clipboard.writeText(suggested_reply).catch(() => {
      alert("Falha ao copiar a resposta.");
    });

    // Mostrar o tooltip
    setTooltipVisible(true);

    // Ocultar o tooltip após 2 segundos
    setTimeout(() => {
      setTooltipVisible(false);
    }, 2000);
  };

  return (
    <div className="mt-4 rounded-lg bg-gray-800 text-white p-6">
      {/* Categoria */}
      <div className="flex items-center mb-4">
        <div
          className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${isProductive ? 'bg-green-600' : 'bg-red-600'}`}
        />
        <p className="ml-3 text-md font-semibold">
          <strong>Categoria:</strong> {classification}
        </p>
      </div>

      <div className="flex items-center mb-2 justify-between">
        <p className="font-semibold mr-2">Resposta sugerida:</p>
        
        <button
          onClick={copyToClipboard}
          className="p-1 text-white rounded-lg hover:bg-blue-900 focus:outline-none relative"
          title="Copiar resposta"
        >
          <ClipboardIcon className="w-4 h-4" />

          {tooltipVisible && (
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xxs rounded px-2 py-1 opacity-100 transition-opacity duration-300">
              Texto copiado
            </div>
          )}
        </button>
      </div>

      {/* Caixa de resposta */}
      <div className="flex-1 bg-gray-700 text-gray-200 p-3 border-white rounded-md h-min-[260px]">
        <p className="overflow-hidden text-ellipsis">{suggested_reply}</p>
      </div>
    </div>
  );
};

export default ResultCard;
