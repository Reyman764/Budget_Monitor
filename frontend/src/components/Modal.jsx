export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto dark:bg-slate-800">
        <div className="flex justify-between items-center p-4 border-b dark:border-slate-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none dark:text-slate-500 dark:hover:text-slate-300"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
