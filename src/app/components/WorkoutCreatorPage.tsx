"use client";
import { useState } from "react";
import Image from "next/image";

import { FilterableExerciseTable } from "./FilterableExerciseTable"
import { WorkoutTemplate, ExerciseWithHistory, ExerciseFamily, PlannedExerciseSet } from "../classes"

export function WorkoutCreatorPage({ showHome, exerciseFamilies, bodyparts }: { showHome: any, exerciseFamilies: ExerciseFamily[], bodyparts: string[] }) {
  const [templateTitle, setTemplateTitle] = useState("");
  const [plannedExercises, setPlannedExercises] = useState<PlannedExerciseSet[][]>([]);
  const [showExercisesTable, setShowExercisesTable] = useState(false);

  function handleSave() {
    if (templateTitle === "") {
      alert("Please enter a name for this new template.")
    }
    alert("TODO")
  }

  function showExerciseSelector() {
    setShowExercisesTable(true)
  }

  function selectExercise(exercise: ExerciseWithHistory) {
    setShowExercisesTable(false)
    const newPlannedExercises = [...plannedExercises, [new PlannedExerciseSet(exercise.id, exercise.name)]]
    setPlannedExercises(newPlannedExercises)
  }

  function updatePlannedSets(index: number, newPlannedSets: PlannedExerciseSet[]) {
    const updatedPlannedExercises = [...plannedExercises];
    if (newPlannedSets.length != 0) {
      updatedPlannedExercises[index] = newPlannedSets;
    } else {
      updatedPlannedExercises.splice(index, 1)
    }

    setPlannedExercises(updatedPlannedExercises);
  }


  return (
    <>{!showExercisesTable &&
      <div>
        <div className="flex justify-between shadow-black shadow-lg px-4 py-2 rounded-lg">
          <button onClick={showHome}>
            <Image
              src="/icons/cross.svg"
              alt="Exit"
              width={24}
              height={24}
            />
          </button>
          <input className="bg-gray-900 text-white px-1 py-2"
            placeholder="New template"
            onChange={(e) => setTemplateTitle(e.target.value)}></input>
          <button
            onClick={handleSave}
            className="hover:text-blue-200">
            SAVE
          </button>
        </div>
        {plannedExercises.map((plannedSets, index) =>
          <ExerciseBox key={index} exerciseIndex={index} plannedSets={plannedSets} updatePlannedSets={updatePlannedSets} />)}
        <div className="flex justify-center">
          <button
            onClick={showExerciseSelector}
            className="rounded-lg mt-5 mb-12 px-3 py-2 bg-gray-800 border border-gray-100 hover:bg-gray-600 shadow-black shadow-lg">
            Add exercise
          </button>
        </div>
      </div>
    }
      {showExercisesTable &&
        <FilterableExerciseTable exerciseFamilies={exerciseFamilies} bodyparts={bodyparts} onExerciseClick={selectExercise} showAddButton={true}/>}
    </>
  )
}

function ExerciseBox({ exerciseIndex, plannedSets, updatePlannedSets }:
  { exerciseIndex: number, plannedSets: PlannedExerciseSet[], updatePlannedSets: any }) {

  const [withTimer, setWithTimer] = useState(true)
  const [withIntensity, setWithIntensity] = useState(true)
  const [withWeight, setWithWeight] = useState(false)
  const [withReps, setWithReps] = useState(true)
  const [withRir, setWithRir] = useState(false)

  function handleSetChange(setIndex: number, field: string, value: string) {
    const newSets = [...plannedSets];
    const setToUpdate = newSets[setIndex];
    if (field == "intensity") {
      setToUpdate.target.intensity = Number(value);
    } else if (field == "weight") {
      setToUpdate.target.weight = Number(value);
    } else if (field == "reps") {
      setToUpdate.target.reps = Number(value);
    } else if (field == "rir") {
      setToUpdate.target.rir = Number(value);
    } else if (field == "restTimeinSec") {
      setToUpdate.restTimeinSec = Number(value);
    }
    updatePlannedSets(exerciseIndex, newSets);
  };

  const addSet = () => {
    updatePlannedSets(exerciseIndex, [...plannedSets, plannedSets[plannedSets.length-1].clone()]);
  };

  const removeSet = (index: number) => {
    const newSets = [...plannedSets];
    newSets.splice(index, 1);
    updatePlannedSets(index, newSets);
  };

  function deleteExercise() {
    updatePlannedSets(exerciseIndex, []);
  }

  return (
    <div className="my-4 border border-gray-200 bg-slate-800 rounded-lg p-2 shadow-lg shadow-black text-left relative " >
      <div className="flex justify-between">
        <span>{plannedSets[0].exerciseName}</span>
        <span>
          <WeightIntensityToggle setWithWeight={setWithWeight} setWithIntensity={setWithIntensity} />
          <RepsRirToggle setWithReps={setWithReps} setWithRir={setWithRir} />
          <TimerToggle setWithTimer={setWithTimer} />
        </span>
      </div>
      <form className="mt-2 space-y-2 text-sm">
        {plannedSets.map((plannedSet, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span className="text-lg my-2">{index + 1}.</span>
            {withWeight && <div className="relative flex items-center"> <input
              type="number"
              step="0.25"
              min="0"
              className="w-20 p-1 border rounded-md text-gray-100 bg-gray-800"
              value={plannedSet.target.weight || ""}
              onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
              placeholder="Weight"
              required
            />
              <span className="absolute inset-y-0 right-1 flex items-center text-gray-100">kg</span>
            </div>}
            {withIntensity && 
            <div className="relative flex items-center"> 
            <input
              type="number"
              step="5"
              min="0"
              max="100"
              className="w-20 pl-1 py-1 border rounded-md text-gray-100 bg-gray-800 appearance-none"
              value={plannedSet.target.intensity || ""}
              onChange={(e) => handleSetChange(index, 'intensity', e.target.value)}
              placeholder="Intensity"
              required
            />
              <span className="absolute inset-y-0 right-1 flex items-center text-gray-100">%</span>
            </div>}
            {withReps && <input
              style={{ width: "20%" }}
              type="number"
              min="1"
              className="w-20 p-1 border rounded-md text-gray-100 bg-gray-800 "
              value={plannedSet.target.reps || ""}
              onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
              placeholder="Reps"
              required
            />}
            {withRir && <input
              style={{ width: "20%" }}
              type="number"
              min="0"
              className="w-20 p-1 border rounded-md  bg-gray-800"
              value={plannedSet.target.rir || ""}
              onChange={(e) => handleSetChange(index, 'rir', e.target.value)}
              placeholder="RiR"
              required
            />}
            {withTimer && 
            <div className="relative flex items-center"> 
            <input
              type="number"
              step="10"
              min="0"
              className="w-20 p-1 border rounded-md  bg-gray-800"
              value={plannedSet.restTimeinSec || ""}
              onChange={(e) => handleSetChange(index, 'restTimeinSec', e.target.value)}
              placeholder="Rest"
              required
            />
            <span className="absolute inset-y-0 right-1 flex items-center text-gray-100">s</span>
            </div>}
            {plannedSets.length > 1 && (
              <button type="button" onClick={() => removeSet(index)} className="py-1 px-3 bg-red-800 text-white rounded-md hover:bg-red-900 shadow-black shadow-lg">
                <span className="font-black">-</span>
              </button>
            )}
          </div>
        ))}
        <div className="flex justify-between ">
          <button type="button" onClick={addSet} className="py-1 px-3 mx-3 mt-4 bg-green-500 text-white rounded-md hover:bg-green-700 shadow-black shadow-lg">
            <span className="font-black">+</span>
          </button>
          <button
            onClick={deleteExercise}>
            <Image
              src="icons/bin.svg"
              alt="Delete"
              width={20}
              height={20}
            />
          </button>
        </div>
      </form>
    </div>
  )
}


function WeightIntensityToggle({ setWithWeight, setWithIntensity }: { setWithWeight: any, setWithIntensity: any }) {
  enum modes {
    intensity,
    weight,
    none,
  }
  const [mode, setMode] = useState(modes.intensity);

  const intensitySvg = "M21.7071 3.70711C22.0976 3.31658 22.0976 2.68342 21.7071 2.29289C21.3166 1.90237 20.6834 1.90237 20.2929 2.29289L2.29289 20.2929C1.90237 20.6834 1.90237 21.3166 2.29289 21.7071C2.68342 22.0976 3.31658 22.0976 3.70711 21.7071L21.7071 3.70711Z" +
    " M11 6.5C11 8.98528 8.98528 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5ZM4.00693 6.5C4.00693 7.87689 5.12311 8.99307 6.5 8.99307C7.87689 8.99307 8.99307 7.87689 8.99307 6.5C8.99307 5.12311 7.87689 4.00693 6.5 4.00693C5.12311 4.00693 4.00693 5.12311 4.00693 6.5Z" +
    " M22 17.5C22 19.9853 19.9853 22 17.5 22C15.0147 22 13 19.9853 13 17.5C13 15.0147 15.0147 13 17.5 13C19.9853 13 22 15.0147 22 17.5ZM15.0069 17.5C15.0069 18.8769 16.1231 19.9931 17.5 19.9931C18.8769 19.9931 19.9931 18.8769 19.9931 17.5C19.9931 16.1231 18.8769 15.0069 17.5 15.0069C16.1231 15.0069 15.0069 16.1231 15.0069 17.5Z"
  const weightSvg = "M441.993,368.062l-68.646-194.324c-4.422-12.521-18.29-22.329-31.57-22.329H281.52 c5.571-10.072,8.516-21.359,8.516-33.011c0-37.694-30.67-68.366-68.367-68.366s-68.365,30.672-68.365,68.366 c0,11.686,2.913,22.95,8.48,33.011h-60.225c-13.28,0-27.146,9.808-31.57,22.329L1.343,368.062 c-2.276,6.447-1.638,12.896,1.759,17.693c3.394,4.797,9.26,7.549,16.096,7.549h404.941c6.835,0,12.703-2.752,16.096-7.549 C443.63,380.958,444.27,374.509,441.993,368.062z M433.097,380.708c-1.759,2.486-4.939,3.855-8.958,3.855H19.198 c-4.019,0-7.199-1.369-8.958-3.855c-1.759-2.486-1.992-5.943-0.652-9.73l68.647-194.324c3.16-8.942,13.842-16.5,23.326-16.5h68.03 c4.051,0,6.858-2.378,3.688-6.912c-7.196-10.294-11.233-22.233-11.233-34.842c0-32.875,26.746-59.623,59.623-59.623 c32.877,0,59.625,26.748,59.625,59.623c0,11.953-3.361,23.591-10.181,33.334c-2.864,4.092-2.208,8.418,3.639,8.418h67.028 c9.485,0,20.166,7.557,23.326,16.5l68.645,194.324C435.088,374.764,434.855,378.221,433.097,380.708z"
  let svgPath = ""
  switch (mode) {
    case modes.intensity: {
      svgPath = intensitySvg
      break;
    }
    default: {
      svgPath = weightSvg
      break;
    }

  }

  const handleClick = () => {
    switch (mode) {
      case modes.intensity: {
        setMode(modes.weight)
        setWithWeight(true)
        setWithIntensity(false)
        break;
      }
      case modes.weight: {
        setMode(modes.none)
        setWithWeight(false)
        setWithIntensity(false)
        break;
      }
      case modes.none: {
        setMode(modes.intensity)
        setWithWeight(false)
        setWithIntensity(true)
        break;
      }
    }
  }

  return (
    <button className={`rounded-full mx-1 p-1 shadow-lg shadow-black ${mode === modes.none ? "bg-slate-900" : "bg-slate-500"}`}
      onClick={handleClick}>
      <svg width="1.5em" height="1.5em" viewBox={mode === modes.intensity ? "-2.5 0 30 24" : "-15 0 500 443"} xmlns="http://www.w3.org/2000/svg">
        <path d={svgPath}
          stroke={mode === modes.none ? "#64748b" : "white"}
          fill="white"
          strokeWidth={mode === modes.intensity ? "0.1" : "15"} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

function RepsRirToggle({ setWithReps, setWithRir }: { setWithReps: any, setWithRir: any }) {
  enum modes {
    reps,
    rir,
    both,
    none
  }
  const [mode, setMode] = useState(modes.reps);

  const handleClick = () => {
    switch (mode) {
      case modes.reps: {
        setMode(modes.rir)
        setWithReps(false)
        setWithRir(true)
        break;
      }
      case modes.rir: {
        setMode(modes.both)
        setWithReps(true)
        setWithRir(true)
        break;
      }
      case modes.both: {
        setMode(modes.none)
        setWithReps(false)
        setWithRir(false)
        break;
      }
      case modes.none: {
        setMode(modes.reps)
        setWithReps(true)
        setWithRir(false)
        break;
      }
    }
  }

  return (
    <button className={`rounded-full mx-1 p-1 shadow-lg shadow-black ${mode === modes.none ? "bg-slate-900" : "bg-slate-500"}`}
      onClick={handleClick}>
      {mode != modes.both &&
        <svg width="1.5em" height="1.5em" viewBox="19 -100 30 120" xmlns="http://www.w3.org/2000/svg">
          <text stroke={mode === modes.none ? "#64748b" : "white"}
            fill={mode === modes.none ? "#64748b" : mode === modes.rir ? "black" : "white"}
            fontSize="120">#</text>
        </svg>}
      {mode === modes.both &&
        <svg width="1.5em" height="1.5em" viewBox="25 -80 30 120" xmlns="http://www.w3.org/2000/svg">
          <text stroke="white" fill="white" fontSize="70">#</text>
          <text stroke="white" fontSize="70"> &nbsp; #</text>
        </svg>}
    </button>
  )
}


function TimerToggle({ setWithTimer }: { setWithTimer: any }) {
  const [isToggled, setIsToggled] = useState(true);

  const handleClick = () => {
    setWithTimer(!isToggled)
    setIsToggled(!isToggled)
  }

  return (
    <button className={`rounded-full mx-1 p-1 shadow-lg shadow-black ${isToggled ? "bg-slate-500" : "bg-slate-900"}`}
      onClick={handleClick}>
      <svg width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 3H14M12 9V13L14 15M12 21C16.4183 21 20 17.4183 20 13C20 8.58172 16.4183 5 12 5C7.58172 5 4 8.58172 4 13C4 15.3894 5.04751 17.5341 6.70835 19"
          stroke={isToggled ? "white" : "#64748b"}
          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}