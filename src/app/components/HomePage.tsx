"use client";

import { useState, useEffect } from "react";

import { Config } from "../config"
import { LoginOrSignupPage } from "./LoginOrSignupPage"
import { pageName } from "../enums"
import { ExerciseSet, ExerciseWithHistory, PlannedExercise, WorkoutTemplate, PlannedExerciseSet } from "../classes"

import { ProfilePage } from "./ProfilePage"
import { WorkoutPage } from "./WorkoutPage"
import { ExercisesPage } from "./ExercisesPage"
import { StatsPage } from "./StatsPage"
import { CompetitionPage } from "./CompetitionPage"

export function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState(pageName.exercises);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${Config.backendUrl}login`, {
      method: 'POST',
      body: String(JSON.stringify({ email, password })),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.ok) {
      setIsAuthenticated(true);
    } else {
      const error = await response.json().then(x => x.error)
      alert(error)
    }
  };

  const logout = async () => {
    const response = await fetch(`${Config.backendUrl}logout`, {
      method: 'GET',
      credentials: 'include',
    });
    setIsAuthenticated(false);
  };


  function showProfile() {
    setCurrentPage(pageName.profile)
  }

  function showWorkout() {
    setCurrentPage(pageName.workout)
  }

  function showExercises() {
    setCurrentPage(pageName.exercises)
  }

  function showStats() {
    setCurrentPage(pageName.stats)
  }

  function showCompetition() {
    setCurrentPage(pageName.competition)
  }

  return (
    <>
      {isAuthenticated ? (
        <>
          <BottomNavBar currentPage={currentPage} showProfile={showProfile} showWorkout={showWorkout} showExercises={showExercises} showStats={showStats} showCompetition={showCompetition} />
          <Content currentPage={currentPage} logout={logout} />
        </>
      ) : (
        <LoginOrSignupPage onLogin={login} setIsAuthenticated={setIsAuthenticated} />
      )}
    </>
  );
}

function Content({ currentPage, logout }: { currentPage: pageName, logout: any }) {
  const [exercises, setExercises] = useState<ExerciseWithHistory[]>([]);
  const [bodyparts, setBodyparts] = useState<string[]>([]);
  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>([]);

  function flattenBodyparts(bodypartsJson: any[]) {
    return (
      bodypartsJson.flatMap((b) => (b.name))
    )
  }

  function fillExercises(exercisesJson: any[]) {
    let exercisesToSave: ExerciseWithHistory[] = []
    exercisesJson.forEach(exercise => {
      let exerciseSets: ExerciseSet[] = []
      const exerciseSetsRaw: any[] = exercise.sets
      exerciseSetsRaw.forEach(s => {
        const exerciseSet = new ExerciseSet(s.id, new Date(s.workout.start_time), s.weight, s.reps, s.rir, s.wilksScore)
        exerciseSets.push(exerciseSet)
      })

      const newExercise = new ExerciseWithHistory(exercise.id,
        exercise.name,
        flattenBodyparts(exercise.exercise_family.primary_bodyparts),
        flattenBodyparts(exercise.exercise_family.secondary_bodyparts),
        exercise.is_custom,
        exercise.created_by,
        exercise.shared_with,
        exerciseSets,
        exercise.exercise_family.name)
      exercisesToSave.push(newExercise)
    });
    setExercises(exercisesToSave);
  }

  useEffect(() => {
    fetch(`${Config.backendUrl}allbodyparts`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(json => flattenBodyparts(json.bodyparts))
      .then(stringArray => setBodyparts(stringArray))
      .catch(error => console.error(error));

    fetch(`${Config.backendUrl}userexerciseslog`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(json => fillExercises(json.exercises))
      .catch(error => console.error(error));

    // TODO: get from backend
    const pe1 =  new PlannedExerciseSet("1", "bench", 90)
    pe1.setTarget({weight:100, reps:12})
    const pe2 =  pe1.clone()
    const p1 = new PlannedExercise("1", "Bench",
      [pe1, pe2])
    const p2 = new PlannedExercise("2", "Skullcrusher",
      [pe1, pe2])
    const t1 = new WorkoutTemplate("1", "Push day", [p1, p2], false, new Date("2024-03-08"))
    const t2 = t1.clone()
    const t3 = t1.clone().archive()
    t3.lastWorkoutDate = new Date("2024-02-01")
    const t4 = t1.clone().archive()
    t4.lastWorkoutDate = new Date("2024-03-01")
    t1.id = "1"
    t2.id = "2"
    t3.id = "3"
    t4.id = "4"
    setWorkoutTemplates([t1, t2, t3, t4])
  }, []);

  function handleUpdateExerciseSets(exercise_id: string, newExerciseSets: ExerciseSet[]) {
    const newExercises = exercises.map(exercise => {
      if (exercise.id === exercise_id) {
        const newExercise = exercise.clone();
        newExercise.sets = newExerciseSets
        return newExercise;
      }
      return exercise;
    })
    setExercises(newExercises)
  }

  return (
    <div className={"absolute p-3 w-full"} >
      {currentPage === pageName.profile && <ProfilePage logout={logout} />}
      {currentPage === pageName.workout && <WorkoutPage workoutTemplates = {workoutTemplates} exercises={exercises} bodyparts={bodyparts}/>}
      {currentPage === pageName.exercises && <ExercisesPage exercises={exercises} bodyparts={bodyparts} handleUpdateExerciseSets={handleUpdateExerciseSets} />}
      {currentPage === pageName.stats && <StatsPage />}
      {currentPage === pageName.competition && <CompetitionPage />}
    </div>
  )
}

function BottomNavBar({ currentPage, showProfile, showWorkout, showExercises, showStats, showCompetition }:
  { currentPage: pageName, showProfile: any, showWorkout: any, showExercises: any, showStats: any, showCompetition: any }) {

  const pages = [
    { name: pageName.profile, action: showProfile, icon: '/icons/profile.svg' },
    { name: pageName.workout, action: showWorkout, icon: '/icons/workout.svg' },
    { name: pageName.exercises, action: showExercises, icon: '/icons/exercises.svg' },
    { name: pageName.stats, action: showStats, icon: '/icons/stats.svg' },
    { name: pageName.competition, action: showCompetition, icon: '/icons/competition.svg' },
  ];

  return (
    <div className="fixed z-50 inset-x-0 bottom-0 bg-gray-800 text-white flex justify-around items-center h-12 shadow-lg">
      {pages.map((page) => (
        <button
          key={page.name}
          onClick={page.action}
          className={`flex-1 flex justify-center items-center h-full transition-all duration-300 ease-in-out
                      ${currentPage === page.name ? 'bg-gray-700 -translate-y-1 shadow-xl' : 'shadow-black'}`}
          style={{ transform: currentPage === page.name ? 'translateY(-4px) ' : 'none' }}>
          <img src={page.icon} alt={`${page.name} icon`} className="w-10 h-10" />
        </button>
      ))}
    </div>
  );
}

