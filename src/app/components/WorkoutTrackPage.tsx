"use client";
import Image from "next/image";
import { WorkoutTemplate, ExerciseWithHistory } from "../classes"
import { useState } from "react";

export function WorkoutTrackPage({ workoutTemplate, discard }: { workoutTemplate: WorkoutTemplate, discard: any }) {
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);

  function nextExercise() {
    setCurrentExerciseIdx(Math.min(currentExerciseIdx + 1, workoutTemplate.plannedExercises.length - 1))
  }
  function previousExercise() {
    setCurrentExerciseIdx(Math.max(currentExerciseIdx - 1, 0))
  }

  return (
    <>
      <div className="flex justify-between items-center shadow-black shadow-lg px-4 py-2 rounded-lg">
        <button
          onClick={previousExercise}
          className={`transition-opacity duration-300 ${currentExerciseIdx > 0 ? 'opacity-100' : 'opacity-0 cursor-default'}`}
          disabled={currentExerciseIdx <= 0}
        >
          Previous
        </button>
        <span className="text-lg">{workoutTemplate.plannedExercises[currentExerciseIdx].name}</span>
        <button
          onClick={nextExercise}
          className={`transition-opacity duration-300 ${currentExerciseIdx < workoutTemplate.plannedExercises.length - 1 ? 'opacity-100' : 'opacity-0 cursor-default'}`}
          disabled={currentExerciseIdx >= workoutTemplate.plannedExercises.length - 1}
        >
          Next
        </button>
      </div>
      <div>
      </div>

      <div>
        <button className="rounded-lg my-4 mx-2 px-2 py-1 bg-blue-950 border border-gray-950 shadow-black shadow-lg  text-white">
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
