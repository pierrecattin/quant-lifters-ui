
"use client";


import { ExerciseSet, Records, ExerciseSetInProgress, ExerciseWithHistory } from "../classes"
import { recordsByTotalReps, stringToNumberOrUndefined } from "../utils"

export function ExerciseSetTracker({exerciseSetsInProgress, setIndex, exerciseWithHistory, handleSetChange, handleSetRemoval}: 
  {exerciseSetsInProgress: ExerciseSetInProgress[], setIndex: number, exerciseWithHistory:ExerciseWithHistory, handleSetChange:any, handleSetRemoval: any}){
  return(
    <div className="flex items-center space-x-2">
          <span className="text-lg my-2">{setIndex + 1}.</span>
          <input
            type="number"
            step="0.25"
            min="0"
            className="w-20 p-1 border rounded-md text-gray-100 bg-gray-800"
            value={exerciseSetsInProgress[setIndex].weight || ""}
            onChange={(e) => handleSetChange(setIndex, 'weight', stringToNumberOrUndefined(e.target.value))}
            placeholder="Weight"
            required
          />
          <input
            type="number"
            min="1"
            className="w-20 p-1 border rounded-md text-gray-100 bg-gray-800 "
            value={exerciseSetsInProgress[setIndex].reps || ""}
            onChange={(e) => handleSetChange(setIndex, 'reps', stringToNumberOrUndefined(e.target.value))}
            placeholder="Reps"
            required
          />
          <input
            type="number"
            min="0"
            className="w-20 p-1 border rounded-md  bg-gray-800"
            value={exerciseSetsInProgress[setIndex].rir || ""}
            onChange={(e) => handleSetChange(setIndex, 'rir', stringToNumberOrUndefined(e.target.value))}
            placeholder="RiR"
            required
          />
          {exerciseSetsInProgress.length > 1 && (
            <button type="button" onClick={() => handleSetRemoval(setIndex)} className="py-1 px-3 bg-red-950 border border-gray-950 text-white rounded-md shadow-black shadow-lg">
              <span className="font-black">-</span>
            </button>
          )}
          <PercentageOfRecord setInProgress={exerciseSetsInProgress[setIndex]} exerciseHistory={exerciseWithHistory}/>
          
    </div>
  )
}

function PercentageOfRecord({setInProgress, exerciseHistory}: {setInProgress:ExerciseSetInProgress, exerciseHistory: ExerciseWithHistory}){
  const enoughData = 
    setInProgress.weight != undefined && 
    setInProgress.reps != undefined && 
    setInProgress.rir != undefined && 
    exerciseHistory.sets.length>0 &&
    recordsByTotalReps(exerciseHistory.sets).get(Number(setInProgress.reps) + Number(setInProgress.rir)) != undefined

  return(
    <>
    { enoughData && (
      <span>
        {parseFloat((Number(setInProgress.weight) / recordsByTotalReps(exerciseHistory.sets).get(Number(setInProgress.reps) + Number(setInProgress.rir))!.weight.valueOf() * 100).toPrecision(3))}% of PR
      </span>
    )}
    </>
  )
}