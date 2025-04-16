const CustomModal = ({
  isOpen,
  closeModal,
  title,
  children,
  onSubmit,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
}) => {
  if (!isOpen) return null;

  return (
    <dialog
      className="fixed inset-0 p-10 w-full mt-24 h-[90vh] bg-transparent bg-opacity-30 backdrop-blur-sm flex flex-col justify-center items-center"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full h-auto max-w-md text-white relative overflow-y-auto">
        <h2 className="text-2xl sm:text-4xl font-bold mb-4 text-center">
          {title}
          <button
            onClick={closeModal}
            className="absolute top-2 right-2 text-lg sm:text-xl font-bold text-red-500"
          >
            &times;
          </button>
        </h2>

        {children}

        <div className="flex justify-end mt-4 space-x-3">
          <button
            onClick={closeModal}
            className="bg-gray-500 px-4 py-2 rounded text-white text-sm"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onSubmit}
            className="bg-orange-500 px-4 py-2 rounded text-white text-sm"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default CustomModal;
