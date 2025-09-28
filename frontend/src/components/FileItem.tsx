import { DocumentTextIcon } from '@heroicons/react/24/outline'
import FileTextIcon from './icons/FileTextIcon';

const FileItem = ({ file, onRemove }: { file: File; onRemove: () => void }) => (
  <div className="flex items-center justify-between bg-gray-900 text-white p-3 rounded-lg w-full mb-2">
    <div className="flex items-center">
      <span className="text-blue-500 text-lg">
        <i className="fas fa-file-alt"></i>
      </span>
      <span className="text-sm truncate flex items-center space-x-2">
        <FileTextIcon className='w-5 h-5 text-blue-500' />
        <span>{file.name}</span>
      </span>
    </div>
    <button
      onClick={onRemove}
      className="font-bold text-xl"
    >
      ×
    </button>
  </div>
);

export default FileItem;
