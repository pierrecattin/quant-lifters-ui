export function YesNoModal({message, warning, yesVerb, noVerb, yesColor,  onYes, onNo }: 
    {message: string, warning:string, yesVerb:string , noVerb: string, yesColor:string, onYes: () => void, onNo: () => void }) {  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
        <div className="bg-gray-800 p-4 rounded-lg mx-5">
          <p>{message}</p>
          {warning !== "" && <p className="font-black my-3">{warning}</p>}
          <button className={`${yesColor}  p-2 rounded-lg m-4 shadow-black shadow-lg`} onClick={onYes}>Yes, {yesVerb}</button>
          <button className="bg-gray-950 p-2 rounded-lg m-4 shadow-black shadow-lg" onClick={onNo}>No, {noVerb}</button>
        </div>
      </div>
    );
  }