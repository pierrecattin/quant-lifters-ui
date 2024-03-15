export function LoadingModal({message}: { message: string }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
        <div className="bg-gray-800 p-4 rounded-lg mx-5">
          <p>{message}</p>
        </div>
      </div>
    );
  }