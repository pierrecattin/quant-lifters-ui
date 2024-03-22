"use client";

import { useState, useEffect } from "react";

import { ExerciseWithHistory, ExerciseFamily } from "../classes"

import { FilterableExerciseTable } from "./FilterableExerciseTable"
import { LeaderboardExerciseRecordsPage } from "./LeaderboardExerciseRecordsPage"

export function LeaderboardExercisePage({ exerciseFamilies, bodyparts }:
    { exerciseFamilies: ExerciseFamily[], bodyparts: string[] }) {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseWithHistory | null>(null);

  function resetSelectedExercise() {
    setSelectedExercise(null)
  }

  return (
    <>
      {selectedExercise === null && <FilterableExerciseTable exerciseFamilies={exerciseFamilies} bodyparts={bodyparts} onExerciseClick={setSelectedExercise}  />}
      {selectedExercise === null ? <></> : <LeaderboardExerciseRecordsPage exercise={selectedExercise} goBack={resetSelectedExercise}/>}
    </>
  )
}