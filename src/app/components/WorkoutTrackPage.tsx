"use client";
import { WorkoutTemplate, ExerciseSet, ExerciseSetInProgress, ExerciseWithHistory } from "../classes"
import { ExerciseSetTracker } from "./ExerciseSetTracker"

import { useState } from "react";

export function WorkoutTrackPage({ workoutTemplate, exercises, discard }:
  { workoutTemplate: WorkoutTemplate, exercises: ExerciseWithHistory[], discard: any }) {

  const [setsInProgressPerExercise, setSetsInProgressPerExercise] = useState<ExerciseSetInProgress[][]>(
    workoutTemplate.plannedExercises.map((plannedExercise) =>
      plannedExercise.plannedExerciseSets.map((plannedExerciseSet) => plannedExerciseSet.toExerciseSetInProgress()))
  )
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);

  function nextExercise() {
    setCurrentExerciseIdx(Math.min(currentExerciseIdx + 1, workoutTemplate.plannedExercises.length - 1))
  }
  function previousExercise() {
    setCurrentExerciseIdx(Math.max(currentExerciseIdx - 1, 0))
  }

  const handleSetChange = (index: number, field: string, value: number | undefined) => {
    const newSets = [...setsInProgressPerExercise];
    newSets[currentExerciseIdx][index] = newSets[currentExerciseIdx][index].cloneAndUpdate(field, value);
    setSetsInProgressPerExercise(newSets);
  };

  const handleSetAdd = () => {
    const newSets = [...setsInProgressPerExercise];
    newSets[currentExerciseIdx] = [...newSets[currentExerciseIdx], new ExerciseSetInProgress()]
    setSetsInProgressPerExercise(newSets);
  };

  const handleSetRemoval = (index: number) => {
    const newSets = [...setsInProgressPerExercise];
    newSets[currentExerciseIdx].splice(index, 1);
    setSetsInProgressPerExercise(newSets);
  };


  return (
    <>
      <div className="flex justify-between items-center shadow-black shadow-lg px-4 py-2 rounded-lg">
        <button
          onClick={previousExercise}
          className={`transition-opacity duration-300 text-xs text-gray-100 ${currentExerciseIdx > 0 ? 'opacity-100' : 'opacity-0 cursor-default'}`}
          disabled={currentExerciseIdx <= 0}
        >
          Previous
        </button>
        <span className="text-lg">{workoutTemplate.plannedExercises[currentExerciseIdx].name}</span>
        <button
          onClick={nextExercise}
          className={`transition-opacity duration-300 text-xs text-gray-100 ${currentExerciseIdx < workoutTemplate.plannedExercises.length - 1 ? 'opacity-100' : 'opacity-0 cursor-default'}`}
          disabled={currentExerciseIdx >= workoutTemplate.plannedExercises.length - 1}
        >
          Next
        </button>
      </div>
      <div className="mt-3">
        {setsInProgressPerExercise[currentExerciseIdx].map((_, index) => (
          <ExerciseSetTracker key={index} exerciseSetsInProgress={setsInProgressPerExercise[currentExerciseIdx]}
            setIndex={index} exerciseWithHistory={exercises[currentExerciseIdx]} handleSetChange={handleSetChange} handleSetRemoval={handleSetRemoval} />
        ))}
        <button type="button" onClick={handleSetAdd} className="py-1 px-3 mx-3 my-4 bg-green-800 text-white rounded-md border border-gray-950 shadow-black shadow-lg">
          <span className="font-black">+</span>
        </button>
      </div>

      <div className="flex pt-10 justify-center items-end">
        <button
          className="rounded-lg my-4 mx-2 px-2 py-1 bg-blue-950 border border-gray-950 shadow-black shadow-lg  text-white">
          Add exercise
        </button>
        <button className="rounded-lg my-4 mx-2 px-2 py-1 bg-red-950 border border-gray-950 shadow-black shadow-lg  text-white"
          onClick={discard}>
          Discard workout
        </button>
      </div>
    </>
  )
}
