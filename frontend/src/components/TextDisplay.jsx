export const TextDisplay = ({ text, onTextChange }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-lg font-semibold text-gray-700">
          Extracted Text
        </label>
        <button
          onClick={() => {
            navigator.clipboard.writeText(text);
            alert('Text copied to clipboard!');
          }}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Copy
        </button>
      </div>
      <textarea
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        placeholder="Extracted text will appear here..."
      />
    </div>
  );
};
