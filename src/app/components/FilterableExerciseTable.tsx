"use client";

import { useState } from "react";
import { ExerciseWithHistory } from "../classes"

export function FilterableExerciseTable({ exercises, bodyparts, onExerciseClick }: { exercises: ExerciseWithHistory[], bodyparts: string[], onExerciseClick: any }) {
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
  bodyparts.forEach((bodypart) => {
    bodypartButtons.push(
      <BodypartButton name={bodypart} onToggleBodypart={addOrRemoveBodypart} key={bodypart} />
    )
  });

  return (
    <div>
      <SearchBar filterText={filterText} onFilterChange={setFilterText} />
      {bodypartButtons}
      <ExerciseTable
        exercises={exercises}
        filterText={filterText}
        selectedBodyparts={selectedBodyparts}
        onExerciseClick={onExerciseClick} />
    </div>
  )
}

function ExerciseButton({ exercise, onExerciseClick }: { exercise: ExerciseWithHistory, onExerciseClick: any }) {
  function click() {
    onExerciseClick(exercise)
  }
  return (
    <button
      className="group m-1 rounded-lg border border-gray-500 px-5 py-4 transition-colors bg-gray-900 hover:border-red-700 hover:bg-neutral-800/50"
      onClick={click}>
      <h2 className={`mb-3 text-2xl font-semibold`}>
        {exercise.name}{" "}
        <span className="inline-block transition-transform group-hover:translate-x-2 motion-reduce:transform-none">
          -&gt;
        </span>
      </h2>
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
    <button className={'rounded-[5px] m-1 p-1 border ' + className} onClick={toggle}>
      {name}
    </button>
  )
}

function ExerciseTable({ exercises, filterText, selectedBodyparts, onExerciseClick }:
  { exercises: ExerciseWithHistory[], filterText: string, selectedBodyparts: string[], onExerciseClick: any }) {
  const exerciseButtons: JSX.Element[] = [];
  exercises.forEach((exercise) => {
    if (selectedBodyparts.length == 0 ||
      selectedBodyparts.filter(x => exercise.primaryBodyparts.includes(x) || exercise.secondaryBodyparts.includes(x)).length == selectedBodyparts.length) {
      if (exercise.name.toLowerCase().includes(filterText.toLowerCase())) {
        exerciseButtons.push(
          <ExerciseButton exercise={exercise} key={exercise.name} onExerciseClick={onExerciseClick} />
        );
      }
    }
  });

  return (
    <div className="mb-32 grid lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
      {exerciseButtons}
    </div>
  );
}

function SearchBar({ filterText, onFilterChange }: { filterText: string, onFilterChange: any }) {
  return (
    <form className='m-1' >
      <input className='p-1 text-gray-100 bg-gray-800 border border-neutral-500'
        type="text"
        placeholder="Search exercises..."
        value={filterText}
        onChange={(e) => onFilterChange(e.target.value)} />
    </form>
  );
}

