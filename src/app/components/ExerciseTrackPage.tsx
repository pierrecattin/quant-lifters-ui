"use client";

import { useState, useEffect } from "react";

import { Config } from "../config"
import { ExerciseSet, Records, ExerciseSetInProgress, ExerciseWithHistory, Deserializers } from "../classes"


function recordsByTotalReps(exerciseSets: ExerciseSet[]): Map<number, Records> {
  let recordsByTotalReps = new Map<number, Records>();
  exerciseSets.forEach(set => {
    const currentRecord = recordsByTotalReps.get(set.reps + set.rir);
    if (currentRecord === undefined) {
      recordsByTotalReps.set(set.reps + set.rir, new Records(set.weight, set.wilks));
    }
    else {
      const newRecord = new Records(Math.max(set.weight, currentRecord!.weight.valueOf()), Math.max(set.wilks, currentRecord!.wilks.valueOf()));
      recordsByTotalReps.set(set.reps + set.rir, newRecord);
    }
  });
  return recordsByTotalReps;
}


export function ExerciseTrackPage({ exercise, handleAddExerciseSets }: { exercise: ExerciseWithHistory, handleAddExerciseSets: any }) {
  const storageKey = "SetInProgress_" + exercise.id
  const [sets, setSets] = useState<ExerciseSetInProgress[]>(() => {
    let savedSets = null
    if (typeof window !== 'undefined') {
      savedSets = sessionStorage.getItem(storageKey);
    }
    if (savedSets) {
      const parsedSets: any[] = JSON.parse(savedSets);
      return parsedSets.map((set) => Deserializers.deserializeExerciseSetInProgress(JSON.stringify(set)))
    } else {
      return [new ExerciseSetInProgress()];
    }
  });

  // Use useEffect to update sessionStorage when sets change
  useEffect(() => {
    sessionStorage.setItem(storageKey, JSON.stringify(sets));
  }, [sets]);

  const handleSetChange = (index: number, field: string, value: string) => {
    const newSets = [...sets];
    newSets[index] = { ...newSets[index], [field]: value };
    setSets(newSets);
  };

  const addSet = () => {
    setSets([...sets, new ExerciseSetInProgress()]);
  };

  const removeSet = (index: number) => {
    const newSets = [...sets];
    newSets.splice(index, 1);
    setSets(newSets);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    const time = new Date().toISOString();
    const body = {
      "exercise_id": exercise.id,
      "time": time,
      "sets": sets,
    }
    e.preventDefault();
    const response = await fetch(`${Config.backendUrl}saveexercisesets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    if (response.ok) {
      alert("Set saved.")
      const setsJson: any[] = await response.json()
      // Store new sets in react state so that it's available without having to fetch from the backend
      const completedExerciseSets = setsJson.map(exerciseSet =>
        new ExerciseSet(exerciseSet.id, time, parseFloat(exerciseSet.weight), parseInt(exerciseSet.reps), parseInt(exerciseSet.rir), exerciseSet.wilksScore)
      );
      handleAddExerciseSets(completedExerciseSets)
      setSets([new ExerciseSetInProgress()]);
    } else {
      alert('Failed to save sets');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 space-y-2">
      {sets.map((set, index) => (
        <div key={index} className="flex items-center space-x-2">
          <span className="text-lg my-2">{index + 1}.</span>
          <input
            type="number"
            step="0.25"
            min="0"
            className="w-20 p-1 border rounded-md text-gray-100 bg-gray-800"
            value={set.weight}
            onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
            placeholder="Weight"
            required
          />
          <input
            type="number"
            min="1"
            className="w-20 p-1 border rounded-md text-gray-100 bg-gray-800 "
            value={set.reps}
            onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
            placeholder="Reps"
            required
          />
          <input
            type="number"
            min="0"
            className="w-20 p-1 border rounded-md  bg-gray-800"
            value={set.rir}
            onChange={(e) => handleSetChange(index, 'rir', e.target.value)}
            placeholder="RiR"
            required
          />
          {sets.length > 1 && (
            <button type="button" onClick={() => removeSet(index)} className="py-1 px-3 bg-red-800 text-white rounded-md">
              <span className="font-black">-</span>
            </button>
          )}
          {set.weight != "" && set.reps != "" && set.rir != "" && recordsByTotalReps(exercise.sets).has(Number(set.reps) + Number(set.rir)) && (
            <span>{parseFloat((Number(set.weight) / recordsByTotalReps(exercise.sets).get(Number(set.reps) + Number(set.rir))!.weight.valueOf() * 100).toPrecision(3))}% of PR</span>
          )}
        </div>
      ))}
      <div className="flex space-x-2 my-6">
        <button type="button" onClick={addSet} className="py-1 px-3 mx-3 my-4 bg-green-500 text-white rounded-md">
          <span className="font-black">+</span>
        </button>
        <button type="submit" className="p-1 bg-purple-900 text-white rounded-md my-4 px-5">
          Save
        </button>
      </div>
    </form>
  );
}