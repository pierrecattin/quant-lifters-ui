"use client";
import { useState } from "react";

import { WorkoutTrackPage } from "./WorkoutTrackPage"
import { WorkoutHistoryPage } from "./WorkoutHistoryPage"
import { WorkoutCreatorPage } from "./WorkoutCreatorPage"
import { QuickWorkoutPage } from "./QuickWorkoutPage"
import { WorkoutTemplatesPage } from "./WorkoutTemplatesPage"

import { WorkoutTemplate, ExerciseWithHistory } from "../classes"

export function WorkoutPage({ workoutTemplates, exercises, bodyparts }: 
  { workoutTemplates: WorkoutTemplate[], exercises: ExerciseWithHistory[], bodyparts:string[] }) {
  enum workoutSubPageName {
    home = "Home",
    create = "Create",
    quickworkout = "Quick Workout",
    history = "History",
    track = "Track",
  }

  const [currentWorkoutSubpage, setCurrentWorkoutSubpage] = useState(workoutSubPageName.home);

  function showHome() {
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
  function showTrack() {
    setCurrentWorkoutSubpage(workoutSubPageName.track)
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
        {currentWorkoutSubpage === workoutSubPageName.create && <WorkoutCreatorPage showHome={showHome} exercises={exercises} bodyparts={bodyparts} />}
        {currentWorkoutSubpage === workoutSubPageName.track && <WorkoutTrackPage showHome={showHome} />}
        {currentWorkoutSubpage === workoutSubPageName.history && <WorkoutHistoryPage showHome={showHome} />}
        {currentWorkoutSubpage === workoutSubPageName.quickworkout && <QuickWorkoutPage showHome={showHome} />}
      </div>
    </>
  )
}
