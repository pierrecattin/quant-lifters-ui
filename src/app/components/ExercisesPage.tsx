"use client";

import { useState, useEffect } from "react";

import { ExerciseWithHistory, Deserializers } from "../classes"

import { FilterableExerciseTable } from "./FilterableExerciseTable"
import { ExercisePage } from "./ExercisePage"

export function ExercisesPage({ exercises, bodyparts, handleUpdateExerciseSets }:
  { exercises: ExerciseWithHistory[], bodyparts: string[], handleUpdateExerciseSets: any }) {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseWithHistory | null>(() => {
    let selectedExercise = null
    if (typeof window !== 'undefined') {
      selectedExercise = sessionStorage.getItem("selectedExercise");
      selectedExercise = selectedExercise == "null" ? null : selectedExercise
    }
    if (selectedExercise) {
      return Deserializers.deserializeExerciseWithHistory(selectedExercise)
    } else {
      return null;
    }
  });

  useEffect(() => {
    sessionStorage.setItem("selectedExercise", JSON.stringify(selectedExercise));
  }, [selectedExercise]);

  function resetSelectedExercise() {
    setSelectedExercise(null)
  }

  return (
    <>
      {selectedExercise === null && <FilterableExerciseTable exercises={exercises} bodyparts={bodyparts} onExerciseClick={setSelectedExercise} />}
      {selectedExercise === null ? <></> : <ExercisePage exercise={selectedExercise} goBack={resetSelectedExercise} handleUpdateExerciseSets={handleUpdateExerciseSets} />}
    </>
  )
}
