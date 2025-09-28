const TextArea = ({ text, setText, files }: { text: string; setText: React.Dispatch<React.SetStateAction<string>>; files: File[] }) => (
  <textarea
    placeholder="Cole o o conteúdo do email para análise..."
    value={text}
    onChange={(e) => setText(e.target.value)}
    disabled={!!files.length}
    className={` text-gray-400 mb-4 text-sm border border-gray-600 rounded p-2 mb-4 h-32 resize-none bg-gray-900 text-white w-full ${
      files.length ? "opacity-50 cursor-not-allowed" : "hover:border-blue-500"
    }`}
  />
);

export default TextArea;
