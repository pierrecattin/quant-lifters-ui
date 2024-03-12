"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { WorkoutTemplate } from "../classes"

export function WorkoutTemplatesPage({ workoutTemplates, showCreate, showHistory, showQuickWorkout, showTrack }:
  { workoutTemplates: WorkoutTemplate[], showCreate: any, showHistory: any, showQuickWorkout: any, showTrack: any }) {

  const activeTemplates = workoutTemplates.filter(t => !t.isArchived)
  const archivedTemplates = workoutTemplates.filter(t => t.isArchived)
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
      {activeTemplates.length === 0 && <span className="text-gray-300">You don&apos;t have any active template. Please create a template or start a quick workout.</span>}
      <WorkoutTemplatesBoxes workoutTemplates={activeTemplates} isArchive={false} showTrack={showTrack} />
      <h3 className="text-lg font-semibold mt-5">Archived templates</h3>
      <WorkoutTemplatesBoxes workoutTemplates={archivedTemplates} isArchive={true} showTrack={showTrack} />
    </div>
  )
}

function compareTemplatesDates(t1: WorkoutTemplate, t2: WorkoutTemplate) {
  if (t1.getDaysSinceLastWorkout() == null) {
    return 1
  }
  if (t2.getDaysSinceLastWorkout() == null) {
    return -1
  }
  return Number(t1.getDaysSinceLastWorkout()) > Number(t2.getDaysSinceLastWorkout()) ? 1 : -1
}

function WorkoutTemplatesBoxes({ workoutTemplates, isArchive, showTrack }:
  { workoutTemplates: WorkoutTemplate[], isArchive: boolean, showTrack: any }) {
  const [openDropdownTemplateId, setOpenDropdownTemplateId] = useState<string | null>(null);
  const boxesRef = useRef<HTMLDivElement>(null);

  const handleClickOutsideDropdown = (event: MouseEvent) => {
    if (boxesRef.current && !boxesRef.current.contains(event.target as Node)) {
      setOpenDropdownTemplateId(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideDropdown);
    return () => document.removeEventListener("mousedown", handleClickOutsideDropdown);
  }, []);


  const handleMenuToggle = (e: any, templateId: string) => {
    e.stopPropagation();
    if (templateId === openDropdownTemplateId ) {
      setOpenDropdownTemplateId(null);
    } else {
      setOpenDropdownTemplateId(templateId);
    }
  };

  const handleMenuClick = (e: any, option: string) => {
    e.stopPropagation();
    alert("TODO " + option + "; templateId:" + openDropdownTemplateId);
  }

  return (
    <div className="mt-2 mb-11 grid gap-4" ref={boxesRef}>
      {workoutTemplates.sort(compareTemplatesDates).map((template, index) => {
        const menuOptions = isArchive
          ? ["Unarchive", "Share", "Delete"]
          : ["Edit", "Rename", "Duplicate", "Share", "Archive", "Delete"];

        return (
          <div className={`border border-gray-200 bg-slate-800 rounded-lg p-4 shadow-lg shadow-black text-left relative ${isArchive ? "" : "cursor-pointer"}`}   
          key={index}
            onClick={isArchive ? undefined : () => showTrack(template)}>
            <div className="text-lg font-semibold ">
              <span style={isArchive ? { opacity: "0.5" } : {}}>{template.name}</span>
            </div>
            <div>
              <span className="opacity-50">{template.getDaysSinceLastWorkout() === null ? "" : `Last performed ${template.getDaysSinceLastWorkout()} days ago`}</span>
            </div>
            <span >
              <button className="absolute top-2 right-2 p-3" onClick={(e) => {handleMenuToggle(e, template.id); }}>
                <Image
                  src="/icons/menu.svg"
                  alt="Menu"
                  width={24}
                  height={24}
                />
              </button>
              {openDropdownTemplateId === template.id &&
                <div className="absolute  flex  flex-col right-2 top-10  w-40 mt-1 bg-black border border-gray-800  shadow-lg rounded-lg z-10">
                  {menuOptions.map((option, idx) => (
                    <button key={idx} className="px-4 py-2 text-left rounded-lg hover:bg-gray-100 hover:text-black"
                      onClick={(e: any) => handleMenuClick(e, option)}>{option}</button>
                  ))}
                </div>}
            </span>
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
        );
      })}
    </div>
  )
}