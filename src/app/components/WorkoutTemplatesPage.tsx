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
      <h3 className="text-lg font-semibold mt-5">Active templates</h3>
      <WorkoutTemplatesBoxes workoutTemplates={workoutTemplates.filter(t => !t.is_archived)} isArchive={false} showTrack={showTrack} />
      <h3 className="text-lg font-semibold mt-5">Archived templates</h3>
      <WorkoutTemplatesBoxes workoutTemplates={workoutTemplates.filter(t => t.is_archived)} isArchive={true} showTrack={showTrack} />
    </div>
  )
}

function WorkoutTemplatesBoxes({ workoutTemplates, isArchive, showTrack }:
  { workoutTemplates: WorkoutTemplate[], isArchive: boolean, showTrack: any }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Prevent event propagation to stop triggering showTrack when menu button is clicked
  const handleMenuClick = (e:any) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
    alert("TODO")
  };

  return (
    <div className="mt-2 mb-11 grid gap-4">
      {workoutTemplates.map((template, index) => (
        <div className={`border border-gray-200 bg-slate-800 rounded-lg p-4 shadow-lg shadow-black text-left relative ${isArchive ? "" : "cursor-pointer"}`}
        key={index}
        onClick={isArchive ? undefined : () => showTrack(template.id)}>
          <div className="text-lg font-semibold ">
            <span style={isArchive ? { opacity: "0.5" } : {}}>{template.name} </span>
          </div>
          <div>
            <span className="opacity-50">Last performed TODO days ago</span>
          </div>
          <button className="absolute top-2 right-2 p-3 " onClick={handleMenuClick}>
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
