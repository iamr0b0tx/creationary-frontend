import React, { useRef, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  hasCloseBtn?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

const Modal = ({
  isOpen,
  onClose,
  hasCloseBtn = true,
  children,
}: ModalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const handleCloseModal = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "Escape") {
      handleCloseModal();
    }
  };

  useEffect(() => {
    const modalElement = modalRef.current;
    if (!modalElement) return;

    // Open modal when 'isOpen' changes to true
    if (isOpen) {
      modalElement.showModal();
    } else {
      modalElement.close();
    }
  }, [isOpen]);

  return (
    <dialog ref={modalRef} className="max-w-[30rem] mx-auto my-auto p-8 rounded-lg relative backdrop:bg-[hsl(0_0%_0%/50%)]" onKeyDown={handleKeyDown}>
      {hasCloseBtn && (
        <button
          className="text-sm absolute top-3 right-1"
          onClick={handleCloseModal}
          aria-label="Close modal"
        >
          Close
        </button>
      )}
      {children}
    </dialog>
  );
};

export default Modal;