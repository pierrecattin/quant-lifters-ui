"use client";
import { useState } from "react";
import Image from "next/image";
import { WorkoutTemplate } from "../classes"

export function WorkoutTemplatesPage({ workoutTemplates, showCreate, showHistory, showQuickWorkout, showTrack }:
  { workoutTemplates: WorkoutTemplate[], showCreate: any, showHistory: any, showQuickWorkout: any, showTrack: any }) {

  return (
    <div>
      <div className="flex justify-between">
        <button
          className="flex-grow rounded-lg bg-slate-300 text-black text-lg py-2 mx-1 shadow-lg shadow-black hover:bg-white"
          onClick={showCreate}>
          New template
        </button>
        <button
          className="flex-grow rounded-lg bg-slate-300 text-black text-lg py-2 mx-1 shadow-lg shadow-black hover:bg-white"
          onClick={showHistory}>
          History
        </button>
        <button
          className="flex-grow rounded-lg bg-slate-300 text-black text-lg py-2 mx-1 shadow-lg shadow-black hover:bg-white"
          onClick={showQuickWorkout}>
          Quick Workout
        </button>
      </div>
      <WorkoutTemplatesBoxes workoutTemplates={workoutTemplates.filter(t => !t.is_archived)} isArchive={false} showTrack={showTrack} />
      <h3 className="text-lg font-semibold mt-5">Archived templates</h3>
      <WorkoutTemplatesBoxes workoutTemplates={workoutTemplates.filter(t => t.is_archived)} isArchive={true} showTrack={showTrack} />
    </div>
  )
}

function WorkoutTemplatesBoxes({ workoutTemplates, isArchive, showTrack }:
  { workoutTemplates: WorkoutTemplate[], isArchive: boolean, showTrack: any }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="mt-6 mb-11 grid gap-4">
      {workoutTemplates.map((template, index) => (
        <div className="border border-gray-200 bg-slate-800 rounded-lg p-4 shadow-lg shadow-black text-left relative" key={index}>
          {!isArchive && 
          <div className="flex justify-center">
          <button className="text-black text-lg font-semibold rounded-lg border border-black shadow-lg shadow-black bg-slate-300 py-2 px-3 hover:bg-white" 
          onClick={() => showTrack(template.id)} >
            {template.name}
          </button>
          </div>
          }
          {isArchive && <div className="text-lg font-semibold " >
            {template.name}
          </div>
          }
          <button className="absolute top-2 right-2" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <Image
              src="/icons/menu.svg"
              alt="Menu"
              width={24}
              height={24}
            />
          </button>
          <ul style={isArchive ? { opacity: "0.5" } : {}}>
            {template.plannedExercises.map((exercise, index) => (
              <li key={index} className="mt-1">
                <strong>{exercise.name}</strong>
                <ol className="ml-4 list-decimal">
                  {exercise.plannedExerciseSets.map((set, index) => (
                    <li key={index}>
                      {set.target.reps != undefined ? `${set.target.reps}` : ""}
                      {set.target.reps != undefined && set.target.rir === undefined ? "x" : ""}
                      {set.target.rir != undefined ? `${set.target.rir}RiR @` : ""}
                      {set.target.weight != undefined ? `${set.target.weight}kg` : ""}
                      {set.target.intensity != undefined ? `${set.target.intensity * 100}%` : ""}
                    </li>
                  ))}
                </ol>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
