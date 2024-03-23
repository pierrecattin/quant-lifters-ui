"use client";

import { useState, useEffect } from "react";

import { ExerciseWithHistory, ExerciseFamily } from "../classes"

import { FilterableExerciseTable } from "./FilterableExerciseTable"
import { ExercisePage } from "./ExercisePage"

export function ExercisesPage({ exerciseFamilies, bodyparts, handleUpdateExerciseSets }:
  { exerciseFamilies: ExerciseFamily[], bodyparts: string[], handleUpdateExerciseSets: any }) {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseWithHistory | null>(() => {
    let selectedExercise = null
    if (typeof window !== 'undefined') {
      selectedExercise = sessionStorage.getItem("selectedExercise");
    }
    if (selectedExercise !== null) {
      return ExerciseWithHistory.deserialize(selectedExercise)
    } else {
      return null;
    }
  });

  useEffect(() => {
     if(selectedExercise === null){ 
      sessionStorage.removeItem("selectedExercise")
     } else {
      sessionStorage.setItem("selectedExercise", JSON.stringify(selectedExercise));
    }
  }, [selectedExercise]);

  function resetSelectedExercise() {
    setSelectedExercise(null)
  }

  return (
    <>
      {selectedExercise === null && <FilterableExerciseTable exerciseFamilies={exerciseFamilies} bodyparts={bodyparts} onExerciseClick={setSelectedExercise} showAddButton={true}/>}
      {selectedExercise === null ? <></> : <ExercisePage family={selectedExercise.getFamily(exerciseFamilies)} exercise={selectedExercise} goBack={resetSelectedExercise} handleUpdateExerciseSets={handleUpdateExerciseSets} />}
    </>
  )
}
