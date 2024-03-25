"use client";
import Image from "next/image";
import { useState } from "react";
import { ExerciseWithHistory, ExerciseFamily } from "../classes"
import { ExerciseCreatorPage } from "./ExerciseCreatorPage"
export function FilterableExerciseTable({ exerciseFamilies, bodyparts, onExerciseClick, showAddButton, handleAddExercise }:
  { exerciseFamilies: ExerciseFamily[], bodyparts: string[], onExerciseClick: any, showAddButton: boolean, handleAddExercise: any }) {
  const [filterText, setFilterText] = useState('');
  const [selectedBodyparts, setSelectedBodyparts] = useState<string[]>([])
  const [showCreatorPage, setShowCreatorPage] = useState(false);

  function addOrRemoveBodypart(bodypart: string, add: boolean) {
    let newBodyparts = [...selectedBodyparts];
    if (add) {
      newBodyparts.push(bodypart);
    } else {
      newBodyparts = newBodyparts.filter(x => x !== bodypart);
    }
    setSelectedBodyparts(newBodyparts);
  }

  const bodypartButtons: JSX.Element[] = bodyparts.sort().map((bodypart) => (
    <BodypartButton name={bodypart} onToggleBodypart={addOrRemoveBodypart} key={bodypart} />
  ));

  const familiesFilteredAndSorted = exerciseFamilies
    .filter(family => {
      const hasSelectedBodyparts = selectedBodyparts.length === 0 ||
        selectedBodyparts.some(bodypart => family.primaryBodyparts.includes(bodypart) || family.secondaryBodyparts.includes(bodypart));
      const nameMatchesFilter = family.name.toLowerCase().includes(filterText.toLowerCase());
      const exercisesMatchFilter = family.exercises.some(exercise => exercise.name.toLowerCase().includes(filterText.toLowerCase()));
      return hasSelectedBodyparts && (nameMatchesFilter || exercisesMatchFilter);
    })
    .sort(compareLastTimePerformed);

  return (
    <>
      {!showCreatorPage &&
        <>
          <div>
            <div className="flex justify-between items-center">
              <SearchBar filterText={filterText} onFilterChange={setFilterText} />
              {showAddButton && <button
                className="ml-3 h-10 w-10 flex justify-center items-center rounded-full bg-green-950 border border-green-800 shadow-black shadow-lg text-white text-xl hover:bg-green-800"
                onClick={() => setShowCreatorPage(true)}>
                <Image
                  src="icons/plus.svg"
                  alt="Add"
                  width={20}
                  height={20}
                />
              </button>}
            </div>
            {bodypartButtons}
            <div className="mb-32 grid lg:max-w-5xl lg:w-full grid-cols-1 lg:mb-0 lg:grid-cols-4 lg:text-left">
              {familiesFilteredAndSorted.map(family => (
                <ExerciseFamilyBox key={family.id} family={family} onExerciseClick={onExerciseClick} filterText={filterText.toLowerCase()} />
              ))}
            </div>
          </div>
        </>}
      {showCreatorPage && <ExerciseCreatorPage goBack={() => setShowCreatorPage(false)} exerciseFamilies={exerciseFamilies} handleAddExercise={handleAddExercise}/>}
    </>
  );
}

function ExerciseFamilyBox({ family, onExerciseClick, filterText }: { family: ExerciseFamily, onExerciseClick: any, filterText: string }) {
  const exercisesFilteredAndSorted = family.exercises.filter(exercise => exercise.name.toLowerCase().includes(filterText))
    .sort(compareLastTimePerformed);
  return (
    <div className="group m-1 rounded-lg border border-gray-500 p-2 bg-gray-900 shadow-lg shadow-black">
      <h2 className={`text-lg`}>{family.name}</h2>
      <div className="grid lg:max-w-5xl lg:w-full grid-cols-1 lg:mb-0 lg:text-left">
        {exercisesFilteredAndSorted.map(exercise => (
          <ExerciseButton item={exercise} key={exercise.id} onClick={() => onExerciseClick(exercise)} />
        ))}
      </div>
    </div>
  );
}

function ExerciseButton({ item, onClick }: { item: ExerciseWithHistory, onClick: any }) {
  return (
    <button
      className="m-1 rounded-lg border border-gray-500 p-2 bg-gray-800 hover:border-red-700 hover:bg-neutral-800/50 shadow-lg shadow-black text-white"
      onClick={onClick}>
      <h3>{item.name}</h3>
      {item.daysSinceLastTimePerformed !== null && <p className="mt-1 text-sm opacity-50">Done {item.daysSinceLastTimePerformed} days ago</p>}
    </button>
  );
}

function BodypartButton({ name, onToggleBodypart }: { name: string, onToggleBodypart: any }) {
  const [isSelected, setIsSelected] = useState(false);
  function toggle() {
    onToggleBodypart(name, !isSelected);
    setIsSelected(!isSelected);
  }
  const className = isSelected ? 'bg-gray-100 text-gray-900 border-blue-200' : 'bg-gray-900 text-gray-100 border-neutral-500';
  return (
    <button className={`rounded-[5px] m-1 p-1 border shadow-lg shadow-black ${className}`} onClick={toggle}>
      {name}
    </button>
  );
}

function SearchBar({ filterText, onFilterChange }: { filterText: string, onFilterChange: any }) {
  return (
    <form className='m-1'>
      <input
        className='p-1 text-gray-100 bg-gray-800 border border-neutral-500 rounded-lg'
        type="text"
        placeholder="Search exercises..."
        value={filterText}
        onChange={(e) => onFilterChange(e.target.value)}
      />
    </form>
  );
}

function compareLastTimePerformed(e1: ExerciseFamily | ExerciseWithHistory, e2: ExerciseFamily | ExerciseWithHistory) {
  if (e1.daysSinceLastTimePerformed === null && e2.daysSinceLastTimePerformed !== null) return 1;
  if (e2.daysSinceLastTimePerformed === null && e1.daysSinceLastTimePerformed !== null) return -1;
  if (e1.daysSinceLastTimePerformed != e2.daysSinceLastTimePerformed) {
    return Number(e1.daysSinceLastTimePerformed) - Number(e2.daysSinceLastTimePerformed);
  }
  return e1.name.localeCompare(e2.name)
}