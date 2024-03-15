import React, { useEffect } from 'react';

export function InfoModal({ message, onClose }: { message: string; onClose: any }) {
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if ((event.target as Element).classList.contains('modal-backdrop')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    // Clean up by removing the event listener when the component unmounts
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [onClose]); // Ensures that this effect is only rerun if onClose changes

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center modal-backdrop"
      onClick={onClose} // This handles the outside click
    >
      <div
        className="bg-gray-800 p-4 rounded-lg mx-5"
        onClick={(e) => e.stopPropagation()} // Prevents click from propagating to the parent
      >
        <p>{message}</p>
        <button
          className="mt-4 py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
}
