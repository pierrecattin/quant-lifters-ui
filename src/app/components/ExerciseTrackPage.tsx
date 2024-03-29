"use client";

import { useState, useEffect } from "react";

import { Config } from "../config"
import { ExerciseSetForExerciseLog, ExerciseSetInProgress, ExerciseWithHistory } from "../classes"

import { ExerciseSetTracker } from "./ExerciseSetTracker"
import { InfoModal } from "./InfoModal"
import { LoadingModal } from "./LoadingModal"

export function ExerciseTrackPage({ exercise, handleAddExerciseSets }: { exercise: ExerciseWithHistory, handleAddExerciseSets: any }) {
  const storageKey = "setInProgress_" + exercise.id;
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoModalMessage, setInfoModalMessage] = useState("");

  const [sets, setSets] = useState<ExerciseSetInProgress[]>(() => {
    let savedSets = null
    if (typeof window !== 'undefined') {
      savedSets = sessionStorage.getItem(storageKey);
    }
    if (savedSets) {
      const parsedSets: any[] = JSON.parse(savedSets);
      return parsedSets.map((set) => ExerciseSetInProgress.deserialize(JSON.stringify(set)))
    } else {
      return [new ExerciseSetInProgress()];
    }
  });

  // Use useEffect to update sessionStorage when sets change
  useEffect(() => {
    sessionStorage.setItem(storageKey, JSON.stringify(sets));
  }, [sets]);

  const handleSetChange = (index: number, field: string, value: number | undefined) => {
    const newSets = [...sets];
    newSets[index] = newSets[index].cloneAndUpdate(field, value);
    setSets(newSets);
  };

  const handleSetAdd = () => {
    setSets([...sets, new ExerciseSetInProgress()]);
  };

  const handleSetRemoval = (index: number) => {
    const newSets = [...sets];
    newSets.splice(index, 1);
    setSets(newSets);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setShowLoadingModal(true)
    const time = new Date().toISOString();
    const setsWithNumber = sets.map((set, index) => ({
      ...set,
      number_within_workout: index
    }));
    const body = {
      "exercise_id": exercise.id,
      "time": time,
      "sets": setsWithNumber,
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
    setShowLoadingModal(false)
    if (response.ok) {
      setInfoModalMessage("Set saved.");
      setShowInfoModal(true)
      const setsJson: any[] = await response.json()
      // Store new sets in react state so that it's available without having to fetch from the backend
      const completedExerciseSets = setsJson.map(exerciseSet =>
        new ExerciseSetForExerciseLog(exerciseSet.id, time, parseFloat(exerciseSet.weight), parseInt(exerciseSet.reps), parseInt(exerciseSet.rir), exerciseSet.wilksScore, exerciseSet.number_within_workout)
      );
      handleAddExerciseSets(completedExerciseSets)
      setSets([new ExerciseSetInProgress()]);
    } else {
      setInfoModalMessage("Failed to save sets. Check your connection and retry later.");
      setShowInfoModal(true)
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-2 space-y-2 pr-6">
        {sets.map((_, index) => (
          <ExerciseSetTracker key={index} exerciseSetsInProgress={sets} setIndex={index} exerciseWithHistory={exercise} handleSetChange={handleSetChange} handleSetRemoval={handleSetRemoval} />
        ))}
        <div className="flex space-x-2 my-6">
          <button type="button" onClick={handleSetAdd} className="py-1 px-3 mx-3 my-4 bg-green-700 text-white rounded-md border border-gray-950 shadow-black shadow-lg">
            <span className="font-black">+</span>
          </button>
          <button type="submit" className="p-1 bg-purple-900 text-white rounded-md my-4 px-5 border border-gray-950 shadow-black shadow-lg">
            Save
          </button>
        </div>
      </form>
      {showLoadingModal &&
        <LoadingModal message="Saving sets..." />
      }
      {showInfoModal &&
        <InfoModal message={infoModalMessage} onClose={() => setShowInfoModal(false)} />
      }</>
  );
}
