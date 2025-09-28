import FileItem from "./FileItem";
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline'

const FileUpload = ({ files, setFiles, text }: { files: File[]; setFiles: React.Dispatch<React.SetStateAction<File[]>>; text: string }) => {
  const isValidFile = (file: File) => {
    const validExtensions = ['.txt', '.pdf'];
    const fileExtension = file.name.toLowerCase().split('.').pop();
    return validExtensions.includes(`.${fileExtension}`);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (isValidFile(file)) {
        // Verificar se o arquivo já está na lista antes de adicionar
        if (!files.find(f => f.name === file.name)) {
          setFiles([...files, file]);
        } else {
          alert("Este arquivo já foi carregado.");
        }
      } else {
        alert("Apenas arquivos .txt ou .pdf são permitidos.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (isValidFile(file)) {
        // Verificar se o arquivo já está na lista antes de adicionar
        if (!files.find(f => f.name === file.name)) {
          setFiles([...files, file]);
        } else {
          alert("Este arquivo já foi carregado.");
        }
      } else {
        alert("Apenas arquivos .txt ou .pdf são permitidos.");
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index)); // Remover o arquivo da lista
    // Resetar o input de arquivo para permitir o upload do mesmo arquivo
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ""; // Resetar o valor do input
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !text && document.getElementById("fileInput")?.click()}
        className={`text-gray-400 border-2 border-dashed border-gray-600 p-6 mb-4 text-center cursor-pointer rounded-lg transition-colors ${text ? "opacity-50 cursor-not-allowed" : "hover:border-blue-500"} flex flex-col justify-center items-center w-full`}
      >
        <input
          type="file"
          id="fileInput"
          className="hidden"
          onChange={handleFileChange}
          disabled={!!text}
          multiple={false}
          accept=".txt, .pdf"
        />
        <DocumentArrowUpIcon className="flex justify-center items-center mb-2 w-10" />
        <p className="text-sm">Clique para fazer upload ou arraste um arquivo</p>
        <p className="text-xs">Suporta arquivos .txt e .pdf</p>
      </div>

      {files.length > 0 && (
        <div className="flex gap-2 mb-4 w-full">
          {files.map((file, index) => (
            <FileItem key={index} file={file} onRemove={() => removeFile(index)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
