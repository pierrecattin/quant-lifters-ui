"use client";

import { Config } from "../config"
import { useState} from "react";

import { ExerciseWithHistory, ExerciseFamily } from "../classes"

import { FilterableExerciseTable } from "./FilterableExerciseTable"
import { LeaderboardExerciseRecordsPage } from "./LeaderboardExerciseRecordsPage"

import {IRanking} from "./LeaderboardPage"

export function LeaderboardExercisePage({ exerciseFamilies, bodyparts }:
  { exerciseFamilies: ExerciseFamily[], bodyparts: string[] }) {
    
  const [rankings, setRankings] = useState<Array<IRanking>>([]);

  function fillRankings (rankingsJson: any[]){
    const rankingsToSave : Array<IRanking> = rankingsJson.map((json) => JSON.parse(JSON.stringify(json)));
    setRankings(rankingsToSave);
  }

  const [selectedExercise, setSelectedExercise] = useState<ExerciseWithHistory | null>(null);

  const loadRankings = async (exercise:ExerciseWithHistory) => {
    setSelectedExercise(exercise);
    const response = await fetch(`${Config.backendUrl}allrankingsperexercise/${exercise.id}`, {
        method: 'GET',
        credentials: 'include',
    })
        .then(response => response.json())
        .then(json => fillRankings(json.rankings))
        .catch(error => console.error(error));
  };

  function resetSelectedExercise() {
    setSelectedExercise(null)
  }

  return (
    <>
      {selectedExercise === null && <FilterableExerciseTable exerciseFamilies={exerciseFamilies} bodyparts={bodyparts} onExerciseClick={loadRankings} showAddButton={false} />}
      {selectedExercise === null ? <></> : <LeaderboardExerciseRecordsPage exercise={selectedExercise} rankings={rankings} goBack={resetSelectedExercise}/>}
    </>
  )
}