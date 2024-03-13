
"use client";

import { useState } from "react";
import { ExerciseSet, Records, ExerciseSetInProgress, ExerciseWithHistory } from "../classes"
import { recordsByTotalReps, stringToNumberOrUndefined } from "../utils"

export function ExerciseSetTracker({ exerciseSetsInProgress, setIndex, exerciseWithHistory, handleSetChange, handleSetRemoval }:
  { exerciseSetsInProgress: ExerciseSetInProgress[], setIndex: number, exerciseWithHistory: ExerciseWithHistory, handleSetChange: any, handleSetRemoval: any }) {
  const set = exerciseSetsInProgress[setIndex];
  const [isMarkedComplete, setIsMarkedComplete] = useState(set.markedComplete)
  let isFullyPopulated = set.weight !== undefined && set.reps !== undefined && set.rir !== undefined;

  function toggleSetComplete() {
    set.markedComplete = !set.markedComplete;
    setIsMarkedComplete(set.markedComplete);
  }

  return (
    <>
      <div className="flex items-center justify-between space-x-2 w-full">
        <div className="flex items-center space-x-2 flex-grow">
          <span className="text-lg my-2">{setIndex + 1}.</span>
          <input
            type="number"
            step="0.05"
            min="0"
            className={`p-1 border rounded-md text-gray-100 w-1/6 ${isMarkedComplete ? 'bg-gray-600' : 'bg-gray-800'}`}
            value={set.weight === undefined ? "" : set.weight}
            onChange={(e) => handleSetChange(setIndex, 'weight', stringToNumberOrUndefined(e.target.value))}
            placeholder="Weight"
            required
            readOnly={isMarkedComplete}
          />
          <input
            type="number"
            min="1"
            className={`p-1 border rounded-md text-gray-100 w-1/6 ${isMarkedComplete ? 'bg-gray-600' : 'bg-gray-800'}`}
            value={set.reps === undefined ? "" : set.reps}
            onChange={(e) => handleSetChange(setIndex, 'reps', stringToNumberOrUndefined(e.target.value))}
            placeholder="Reps"
            required
            readOnly={isMarkedComplete}
          />
          <input
            type="number"
            min="0"
            className={`p-1 border rounded-md w-1/6 ${isMarkedComplete ? 'bg-gray-600' : 'bg-gray-800'}`}
            value={set.rir === undefined ? "" : set.rir}
            onChange={(e) => handleSetChange(setIndex, 'rir', stringToNumberOrUndefined(e.target.value))}
            placeholder="RiR"
            required
            readOnly={isMarkedComplete}
          />
          <button
            type="button"
            className={`py-1 px-2 rounded-lg border border-black 
          ${isMarkedComplete ? 'bg-green-600' : 'bg-gray-400'}
          ${isFullyPopulated ? 'text-white' : 'text-gray-400'}
          `}
            onClick={toggleSetComplete}
            disabled={!isFullyPopulated}
          >
            ✓
          </button>
        </div>
        {exerciseSetsInProgress.length > 1 && (
          <button type="button" onClick={() => handleSetRemoval(setIndex)} className="py-1 px-3 bg-red-950 border border-gray-950 text-white rounded-md shadow-black shadow-lg">
            <span className="font-black">-</span>
          </button>
        )}
      </div>
      <div>
        <PercentageOfRecord setInProgress={set} exerciseHistory={exerciseWithHistory} />
      </div>
    </>
  );
}



// Todo: put in tab of workoutracker 
function PercentageOfRecord({ setInProgress, exerciseHistory }: { setInProgress: ExerciseSetInProgress, exerciseHistory: ExerciseWithHistory }) {
  const enoughData =
    setInProgress.weight != undefined &&
    setInProgress.reps != undefined &&
    setInProgress.rir != undefined &&
    exerciseHistory.sets.length > 0 &&
    recordsByTotalReps(exerciseHistory.sets).get(Number(setInProgress.reps) + Number(setInProgress.rir)) != undefined

  return (
    <>
      {enoughData && (
        <span className="ml-5">
          {parseFloat((Number(setInProgress.weight) / recordsByTotalReps(exerciseHistory.sets).get(Number(setInProgress.reps) + Number(setInProgress.rir))!.weight.valueOf() * 100).toPrecision(3))}% of PR for nb reps+RiR
        </span>
      )}
    </>
  )
}