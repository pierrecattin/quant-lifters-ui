"use client";
import { useState, useEffect } from "react";

import { WorkoutTrackPage } from "./WorkoutTrackPage"
import { WorkoutHistoryPage } from "./WorkoutHistoryPage"
import { WorkoutCreatorPage } from "./WorkoutCreatorPage"
import { QuickWorkoutPage } from "./QuickWorkoutPage"
import { WorkoutTemplatesPage } from "./WorkoutTemplatesPage"

import { WorkoutTemplate, ExerciseWithHistory, ExerciseFamily, Workout } from "../classes"

export function WorkoutPage({ workoutTemplates, workoutLog, exerciseFamilies, bodyparts, handleAddExercise }:
  { workoutTemplates: WorkoutTemplate[], workoutLog:Workout[], exerciseFamilies: ExerciseFamily[], bodyparts: string[], handleAddExercise: any }) {
  enum workoutSubPageName {
    home = "Home",
    create = "Create",
    quickworkout = "Quick Workout",
    history = "History",
    track = "Track",
  }

  const [templateToTrack, setTemplateToTrack] = useState<WorkoutTemplate | null>(() => {
    if (typeof window !== 'undefined') {
      let workoutTemplateStored = localStorage.getItem("workoutTemplateInProgress")
      if (workoutTemplateStored !== null && workoutTemplateStored !== "null") { // !== "null" is to to handle legacy bug workoutTemplateInProgress = "null" in localstorage. This cannot happen anymore, but might still be stored in some ppl's phones. can be removed after every user refreshed.
        const template = WorkoutTemplate.deserialize(workoutTemplateStored)
        return template
      }
    }
    return null
  });

  const [currentWorkoutSubpage, setCurrentWorkoutSubpage] = useState(
    templateToTrack === null ? workoutSubPageName.home : workoutSubPageName.track
  );

  useEffect(() => {
    if(templateToTrack === null){
      localStorage.removeItem("workoutTemplateInProgress")
    } else {
      localStorage.setItem("workoutTemplateInProgress", JSON.stringify(templateToTrack));
    } 
  }, [templateToTrack]);

  function showHome() {
    setTemplateToTrack(null)
    setCurrentWorkoutSubpage(workoutSubPageName.home)
  }
  function showCreate() {
    setCurrentWorkoutSubpage(workoutSubPageName.create)
  }
  function showHistory() {
    setCurrentWorkoutSubpage(workoutSubPageName.history)
  }
  function showQuickWorkout() {
    setCurrentWorkoutSubpage(workoutSubPageName.quickworkout)
  }
  function showTrack(template: WorkoutTemplate) {
    setTemplateToTrack(template)
    setCurrentWorkoutSubpage(workoutSubPageName.track)
  }

  function getExercisesOfTemplate(template: WorkoutTemplate, exerciseFamilies: ExerciseFamily[]) {
    const allExercises = exerciseFamilies.reduce((allExercises, family) => {
      return allExercises.concat(family.exercises);
    }, [] as ExerciseWithHistory[]);
    const excercisesFilteredInOrder = template.plannedExercises.map(exerciseTemplate =>
      allExercises.filter(exercise => exercise.id == exerciseTemplate.id)[0])
    return excercisesFilteredInOrder
  }

  return (
    <>
      <div className="w-full">
        {currentWorkoutSubpage === workoutSubPageName.home &&
          <WorkoutTemplatesPage workoutTemplates={workoutTemplates}
            showCreate={showCreate}
            showHistory={showHistory}
            showQuickWorkout={showQuickWorkout}
            showTrack={showTrack} />}
        {currentWorkoutSubpage === workoutSubPageName.create && <WorkoutCreatorPage showHome={showHome} exerciseFamilies={exerciseFamilies} bodyparts={bodyparts} handleAddExercise={handleAddExercise} />}
        {currentWorkoutSubpage === workoutSubPageName.track && <WorkoutTrackPage showHome={showHome} workoutTemplate={templateToTrack as WorkoutTemplate} exercises={getExercisesOfTemplate(templateToTrack as WorkoutTemplate, exerciseFamilies)} />}
        {currentWorkoutSubpage === workoutSubPageName.history && <WorkoutHistoryPage showHome={showHome} workoutLog={workoutLog} />}
        {currentWorkoutSubpage === workoutSubPageName.quickworkout && <QuickWorkoutPage showHome={showHome} />}
      </div>
    </>
  )
}
