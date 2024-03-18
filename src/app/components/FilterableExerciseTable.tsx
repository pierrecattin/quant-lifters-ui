"use client";

import Image from "next/image";

import { useState } from "react";
import { ExerciseWithHistory } from "../classes"

import { ExerciseCreatorPage } from "./ExerciseCreatorPage"

export function FilterableExerciseTable({ exercises, bodyparts, onExerciseClick }: { exercises: ExerciseWithHistory[], bodyparts: string[], onExerciseClick: any }) {
  const [currentSubPage, setCurrentSubpage] = useState("list")
  const [filterText, setFilterText] = useState('');
  const [selectedBodyparts, setSelectedBodyparts] = useState<string[]>([])

  function addOrRemoveBodypart(bodypart: string, add: boolean) {
    let newBodyparts = [...selectedBodyparts]
    if (add) {
      newBodyparts.push(bodypart)
    } else {
      newBodyparts = newBodyparts.filter(x => x != bodypart)
    }
    setSelectedBodyparts(newBodyparts)
  }

  const bodypartButtons: JSX.Element[] = [];
  bodyparts.sort().forEach((bodypart) => {
    bodypartButtons.push(
      <BodypartButton name={bodypart} onToggleBodypart={addOrRemoveBodypart} key={bodypart} />
    )
  });

  return (
    <>
      {currentSubPage === "list" &&
        <div>
          <div className="flex justify-between items-center">
            <SearchBar filterText={filterText} onFilterChange={setFilterText} />
            {/* <button
              className="ml-3 h-10 w-10 flex justify-center items-center rounded-full bg-green-950 border border-green-800 shadow-black shadow-lg text-white text-xl hover:bg-green-800"
              onClick={() => setCurrentSubpage("create")}>
              <Image
                src="icons/plus.svg"
                alt="Add"
                width={20}
                height={20}
              />
            </button> */}
          </div>
          {bodypartButtons}
          <ExerciseTable
            exercises={exercises}
            filterText={filterText}
            selectedBodyparts={selectedBodyparts}
            onExerciseClick={onExerciseClick} />
        </div>
      }
      {currentSubPage === "create" &&
        <ExerciseCreatorPage goBack={() => setCurrentSubpage("list")} bodyparts={bodyparts} />
      }
    </>
  )
}

function ExerciseButton({ exercise, onExerciseClick }: { exercise: ExerciseWithHistory, onExerciseClick: any }) {
  function click() {
    onExerciseClick(exercise)
  }
  return (
    <button
      className="group m-1 rounded-lg border border-gray-500 p-2 bg-gray-900 hover:border-red-700 hover:bg-neutral-800/50 shadow-lg shadow-black"
      onClick={click}>
      <h2 className={`text-lg`}>
        {exercise.name}
      </h2>
      {exercise.daysSinceLastTimePerformed !== null &&
        <p className="mt-1 text-sm opacity-50">
          Done {exercise.daysSinceLastTimePerformed} days ago
        </p>}
    </button>
  );
}


function BodypartButton({ name, onToggleBodypart }: { name: string, onToggleBodypart: any }) {
  const [isSelected, setIsSelected] = useState(false)
  function toggle() {
    onToggleBodypart(name, !isSelected)
    setIsSelected(!isSelected)
  }
  const className = isSelected ? 'bg-gray-100 text-gray-900 border-blue-200' : 'bg-gray-900 text-gray-100 border-neutral-500'
  return (
    <button className={'rounded-[5px] m-1 p-1 border shadow-lg shadow-black ' + className} onClick={toggle}>
      {name}
    </button>
  )
}

function ExerciseTable({ exercises, filterText, selectedBodyparts, onExerciseClick }:
  { exercises: ExerciseWithHistory[], filterText: string, selectedBodyparts: string[], onExerciseClick: any }) {
  const exercisesFilteredAndSorted = exercises.filter(exercise => {
    if (selectedBodyparts.length == 0 ||
      selectedBodyparts.filter(x => exercise.primaryBodyparts.includes(x) || exercise.secondaryBodyparts.includes(x)).length == selectedBodyparts.length) {
      if (exercise.name.toLowerCase().includes(filterText.toLowerCase())) {
        return true;
      }
    }
    return false;
  }).sort((e1, e2) => {
    if (e1.daysSinceLastTimePerformed === null) return 1;
    if (e2.daysSinceLastTimePerformed === null) return -1;

    return Number(e1.daysSinceLastTimePerformed) - Number(e2.daysSinceLastTimePerformed);
  })


  return (
    <div className="mb-32 grid lg:max-w-5xl lg:w-full grid-cols-2 lg:mb-0 lg:grid-cols-4 lg:text-left">
      {exercisesFilteredAndSorted.map(exercise =>
        <ExerciseButton exercise={exercise} key={exercise.name} onExerciseClick={onExerciseClick} />
      )}
    </div>
  );
}

function SearchBar({ filterText, onFilterChange }: { filterText: string, onFilterChange: any }) {
  return (
    <form className='m-1' >
      <input className='p-1 text-gray-100 bg-gray-800 border border-neutral-500 rounded-lg'
        type="text"
        placeholder="Search exercises..."
        value={filterText}
        onChange={(e) => onFilterChange(e.target.value)} />
    </form>
  );
}

