import { X, AlertTriangle } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      id="delete-modal-overlay"
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-aboitiz-primary/10 shadow-xl overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
        id="delete-modal-card"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-aboitiz-primary/10 bg-aboitiz-bgLight/20">
          <div className="flex items-center gap-2.5 text-aboitiz-danger">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-base font-semibold text-aboitiz-textDark">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-aboitiz-primary/60 hover:bg-aboitiz-primary/10 hover:text-aboitiz-textDark transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-5">
          <p className="text-sm text-aboitiz-textDark/80 leading-relaxed">{message}</p>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-aboitiz-primary/10 bg-aboitiz-bgLight/10">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-aboitiz-textDark/80 bg-white border border-aboitiz-primary/20 rounded-xl hover:bg-aboitiz-bgLight/30 hover:text-aboitiz-textDark active:scale-95 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-semibold text-white bg-aboitiz-danger hover:bg-aboitiz-danger/90 active:scale-95 transition-all rounded-xl shadow-sm cursor-pointer"
            id="delete-modal-confirm-btn"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
