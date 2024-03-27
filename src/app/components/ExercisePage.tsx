"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

import { ExerciseSetForExerciseLog, ExerciseWithHistory, ExerciseFamily } from "../classes"

import { ExerciseTrackPage } from "./ExerciseTrackPage"
import { ExerciseHistoryPage } from "./ExerciseHistoryPage"
import { ExerciseRecordsPage } from "./ExerciseRecordsPage"
import { ExerciseDetailsPage } from "./ExerciseDetailsPage"


export function ExercisePage({ family, exercise, goBack, handleUpdateExerciseSets }:
  { family: ExerciseFamily, exercise: ExerciseWithHistory, goBack: any, handleUpdateExerciseSets: any }) {
  enum exerciseSubPageName {
    track = "Track",
    history = "History",
    records = "Records",
    details = "Details",
  }

  const [currentExercise, setCurrentExercise] = useState(exercise); // Updatable by children
  const [currentExerciseSubpage, setCurrentExerciseSubpage] = useState(exerciseSubPageName.track);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLSpanElement>(null);

  const handleClickOutsideDropdown = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideDropdown);
    return () => document.removeEventListener("mousedown", handleClickOutsideDropdown);
  }, []);

  function handleAddExerciseSets(newSets: ExerciseSetForExerciseLog[]) {
    const updatedSets = [...currentExercise.sets, ...newSets];
    handleUpdateExerciseSets(family.id, exercise.id, updatedSets);
  };

  function handleDeleteExerciseSets(setsIds: string[]) {
    const updatedSets = currentExercise.sets.filter((set) => !(setsIds.includes(set.id)))
    handleUpdateExerciseSets(family.id, exercise.id, updatedSets);
  };

  function showTrack() {
    setCurrentExerciseSubpage(exerciseSubPageName.track)
  }

  function showHistory() {
    setCurrentExerciseSubpage(exerciseSubPageName.history)
  }

  function showRecords() {
    setCurrentExerciseSubpage(exerciseSubPageName.records)
  }

  function showDetails() {
    setCurrentExerciseSubpage(exerciseSubPageName.details)
  }

  const pages = [
    { name: exerciseSubPageName.track, action: showTrack },
    { name: exerciseSubPageName.history, action: showHistory },
    { name: exerciseSubPageName.records, action: showRecords },
    { name: exerciseSubPageName.details, action: showDetails },
  ];

  function onMenuClick() {
    alert("TODO: only enable for custom exercise")
  }


  return (
    <div className="z-40 fixed w-full">
      <div className="top-0">
        <div className="flex justify-between items-center">
          <span>
            <button onClick={goBack}>
              <Image
                src="icons/return_arrow.svg"
                alt="Return"
                width={20}
                height={20}
              />
            </button>
          </span>
          <span className="text-lg">
            {exercise.name}
          </span>
          <span className="relative mx-7" ref={dropdownRef}>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <Image
                src="icons/menu.svg"
                alt="Menu"
                width={20}
                height={20}
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-black text-white border border-gray-800 shadow-lg rounded-lg z-50">
                <button
                  className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-black w-full text-left rounded-lg"
                  onClick={onMenuClick}>
                  Edit
                </button>
                <button
                  className="block px-4 py-2 text-sm  hover:bg-gray-100 hover:text-black w-full text-left rounded-lg"
                  onClick={onMenuClick}>
                  Delete
                </button>
                <button
                  className="block px-4 py-2 text-sm  hover:bg-gray-100 hover:text-black w-full text-left rounded-lg"
                  onClick={onMenuClick}>
                  Share
                </button>
              </div>
            )}
          </span>
        </div>
        <div className="inset-x-0 flex justify-around items-center h-12  ">
          {pages.map((page) => (
            <button
              key={page.name}
              onClick={page.action}
              className={`flex-1 flex justify-center items-center h-full shadow-md
            ${currentExerciseSubpage === page.name ? ' border-b border-white text-white' : ' text-slate-500'}`}>
              {page.name}
            </button>
          ))}
        </div>
      </div>
      <div>
        {currentExerciseSubpage === exerciseSubPageName.track && <ExerciseTrackPage exercise={currentExercise} handleAddExerciseSets={handleAddExerciseSets} />}
        {currentExerciseSubpage === exerciseSubPageName.history && <ExerciseHistoryPage exerciseSets={currentExercise.sets} handleDeleteExerciseSets={handleDeleteExerciseSets} />}
        {currentExerciseSubpage === exerciseSubPageName.records && <ExerciseRecordsPage exercise={currentExercise} />}
        {currentExerciseSubpage === exerciseSubPageName.details && <ExerciseDetailsPage family={family} exercise={currentExercise} />}
      </div>
    </div>
  );
}