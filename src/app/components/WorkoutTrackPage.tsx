"use client";
import { WorkoutTemplate, ExerciseSet, ExerciseSetInProgress, ExerciseWithHistory } from "../classes"
import { ExerciseSetTracker } from "./ExerciseSetTracker"

import { useState, useEffect } from "react";

export function WorkoutTrackPage({ workoutTemplate, exercises, showHome }:
  { workoutTemplate: WorkoutTemplate, exercises: ExerciseWithHistory[], showHome: any }) {
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [setsInProgressPerExercise, setSetsInProgressPerExercise] = useState<ExerciseSetInProgress[][]>(() => {
    // get from localstorage if a workout is in progress
    if (typeof window !== 'undefined') {
      const workoutInProgress = localStorage.getItem("workoutInProgress")
      if (workoutInProgress != null) {
        const parsedWorkout: any[][] = JSON.parse(workoutInProgress)
        const setsInProgress = parsedWorkout.map(setsOfExercise =>
          setsOfExercise.map(set =>
            ExerciseSetInProgress.deserialize(JSON.stringify(set))
          )
        )
        return setsInProgress
      }
    }
    // Else pre-populate with template
    const setsFromTemplate = workoutTemplate.plannedExercises.map((plannedExercise) =>
      plannedExercise.plannedExerciseSets.map((plannedExerciseSet) => plannedExerciseSet.toExerciseSetInProgress()))
    return setsFromTemplate
  })
  const [showCompleteWorkoutModal, setShowCompleteWorkoutModal] = useState(false);
  const [showDiscardWorkoutModal, setShowDiscardWorkoutModal] = useState(false);

  useEffect(() => {
    localStorage.setItem("workoutInProgress", JSON.stringify(setsInProgressPerExercise));
  }, [setsInProgressPerExercise]);


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

  const discard = () => {
    localStorage.removeItem("workoutInProgress")
    showHome()
  }

  const submitWorkout = () => {
    alert("TODO: submit workout endpoint");
    setShowCompleteWorkoutModal(false);
    discard();
  };

  return (
    <>
      <div className="flex justify-between items-center shadow-black shadow-lg p-2 rounded-lg">
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
      <div className="mt-3 space-y-2">
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
          className="rounded-lg my-4 mx-2 px-2 py-1 bg-blue-950  border border-gray-950 shadow-black shadow-lg  text-white"
          onClick={()=> alert("TODO: add exercise after current exercise")}>
          Add exercise
        </button>
        <button className="rounded-lg my-4 mx-2 px-2 py-1 bg-green-950  border border-gray-950 shadow-black shadow-lg  text-white"
          onClick={() => setShowCompleteWorkoutModal(true)}>
          Complete workout
        </button>
        <button className="rounded-lg my-4 mx-2 px-2 py-1 bg-red-950 border border-gray-950 shadow-black shadow-lg  text-white"
          onClick={() => setShowDiscardWorkoutModal(true)}>
          Discard workout
        </button>
      </div>
      {showCompleteWorkoutModal &&
        <ConfirmSubmissionModal
          setsInProgressPerExercise={setsInProgressPerExercise}
          onCancel={() => setShowCompleteWorkoutModal(false)}
          onConfirm={submitWorkout}
        />}
      {showDiscardWorkoutModal &&
        <ConfirmDiscardModal
          onCancel={() => setShowDiscardWorkoutModal(false)}
          onConfirm={discard}
        />
      }
    </>
  )
}


function ConfirmSubmissionModal({ setsInProgressPerExercise, onCancel, onConfirm }: { setsInProgressPerExercise: ExerciseSetInProgress[][], onCancel: any, onConfirm: any }) {
  const anyIncompleteSets = setsInProgressPerExercise.some(exerciseSets =>
    exerciseSets.some(exerciseSet => !exerciseSet.markedComplete));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
      <div className="bg-gray-800 p-4 rounded-lg mx-5">
        <p>Are you sure you want to submit your workout? It cannot be edited after submission (but this feature will come soon 🙂)</p>
        {anyIncompleteSets && <p className="font-black my-3">Some sets are not marked complete and will be discarded.</p>}
        <button className="bg-green-950 p-2 rounded-lg m-4 shadow-black shadow-lg" onClick={onConfirm}>Yes, submit</button>
        <button className="bg-gray-950 p-2 rounded-lg m-4 shadow-black shadow-lg" onClick={onCancel}>No, go back</button>
      </div>
    </div>
  );
}

function ConfirmDiscardModal({ onCancel, onConfirm }: { onCancel: any, onConfirm: any }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
      <div className="bg-gray-800 p-4 rounded-lg mx-5">
        <p>Are you sure you want to discard your workout? This cannot be undone.</p>
        <button className="bg-red-950 p-2 rounded-lg m-4 shadow-black shadow-lg" onClick={onConfirm}>Yes, discard</button>
        <button className="bg-gray-950 p-2 rounded-lg m-4 shadow-black shadow-lg" onClick={onCancel}>No, go back</button>
      </div>
    </div>
  );
}