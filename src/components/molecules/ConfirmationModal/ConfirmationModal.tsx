import CustomModal from "../CustomModal";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  isLoading?: boolean;
}
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false,
}: ConfirmationModalProps) => {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div className="p-4">
        <p className="text-gray-700 mb-4 dark:text-white">{message}</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="disabled:opacity-50 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-gray-800 dark:text-white"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="disabled:opacity-50 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 dark:bg-red-600 dark:text-white"
            disabled={isLoading}
          >
            Confirm
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default ConfirmationModal;
