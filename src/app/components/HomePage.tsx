"use client";

import { useState, useEffect } from "react";

import { Config } from "../config"
import { LoginOrSignupPage } from "./LoginOrSignupPage"
import { pageName } from "../enums"
import { ExerciseSetForExerciseLog, Workout, ExerciseWithHistory, PlannedExercise, WorkoutTemplate, PlannedExerciseSet, ExerciseFamily } from "../classes"

import { ProfilePage } from "./ProfilePage"
import { WorkoutPage } from "./WorkoutPage"
import { ExercisesPage } from "./ExercisesPage"
import { StatsPage } from "./StatsPage"
import { LeaderboardPage } from "./LeaderboardPage"

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
  const [exerciseFamilies, setExerciseFamilies] = useState<ExerciseFamily[]>([]);
  const [bodyparts, setBodyparts] = useState<string[]>([]);
  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>([]);
  const [workoutLog, setWorkoutLog] = useState<Workout[]>([]);

  function flattenBodyparts(bodypartsJson: any[]) {
    return (
      bodypartsJson.flatMap((b) => (b.name))
    )
  }

  function fillExerciseFamilies(exercisesFamilyJson: any[]) {
    let exerciseFamiliesToSave: ExerciseFamily[] = []
    exercisesFamilyJson.forEach(exerciseFamilyJson => {
      let exercises: ExerciseWithHistory[] = []
      exerciseFamilyJson.exercises.forEach((exerciseJson: any) => {
        let exerciseSets: ExerciseSetForExerciseLog[] = []
        const exerciseSetsRaw: any[] = exerciseJson.sets
        exerciseSetsRaw.forEach(s => {
          const exerciseSet = new ExerciseSetForExerciseLog(s.id, new Date(s.workout.start_time), s.weight, s.reps, s.rir, s.wilksScore, s.number_within_workout)
          exerciseSets.push(exerciseSet)
        })

        const newExercise = new ExerciseWithHistory(exerciseJson.id,
          exerciseJson.name,
          exerciseJson.weight_factor,
          exerciseJson.bodyweight_inclusion_factor,
          exerciseJson.is_unilateral,
          exerciseJson.is_custom,
          exerciseJson.created_by?.username,
          exerciseJson.shared_with,
          exerciseSets)
        exercises.push(newExercise)
      });
      const exerciseFamily = new ExerciseFamily(
        exerciseFamilyJson.id,
        exerciseFamilyJson.name,
        flattenBodyparts(exerciseFamilyJson.primary_bodyparts),
        flattenBodyparts(exerciseFamilyJson.secondary_bodyparts),
        exerciseFamilyJson.is_custom,
        exerciseFamilyJson.created_by,
        exerciseFamilyJson.shared_with,
        exercises
      )
      exerciseFamiliesToSave.push(exerciseFamily);
    });

    setExerciseFamilies(exerciseFamiliesToSave);
  }

  function fillWorkoutLog(workoutlogJson: any[]) {
    const workoutLogToSave = workoutlogJson.map(w => Workout.deserialize(JSON.stringify(w)))
    setWorkoutLog(workoutLogToSave);
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
      .then(json => fillExerciseFamilies(json.exercise_families))
      .catch(error => console.error(error));

    fetch(`${Config.backendUrl}workoutslog`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(json => fillWorkoutLog(json.workouts))
      .catch(error => console.error(error));

    // TODO: get from backend
    const pe1 = new PlannedExerciseSet("1", "bench", 90)
    pe1.setTarget({ weight: 100, reps: 12 })
    const pe2 = pe1.clone()
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

  function handleUpdateExerciseSets(exerciseFamilyId: string, exerciseId: string, updatedExerciseSets: ExerciseSetForExerciseLog[]) {
    const newExerciseFamilies = exerciseFamilies.map(exerciseFamily => {
      if (exerciseFamily.id == exerciseFamilyId) {
        exerciseFamily.exercises.map(exercise => {
          if (exercise.id == exerciseId) {
            exercise.sets = updatedExerciseSets
            return exercise;
          }
          return exercise;
        })
      }
      return exerciseFamily
    })
    setExerciseFamilies(newExerciseFamilies)
  }

  function handleAddExercise(newExercise: ExerciseWithHistory, familyId: string) {
    const newExerciseFamilies = exerciseFamilies.map(exerciseFamily => {
      if (exerciseFamily.id === familyId) {
        exerciseFamily.exercises.push(newExercise)
      }
      return exerciseFamily
    })
    setExerciseFamilies(newExerciseFamilies)
  }

  return (
    <div className={"absolute p-3 w-full"} >
      {currentPage === pageName.profile && <ProfilePage logout={logout} />}
      {currentPage === pageName.workout && <WorkoutPage workoutTemplates={workoutTemplates} workoutLog={workoutLog} exerciseFamilies={exerciseFamilies} bodyparts={bodyparts} handleAddExercise={handleAddExercise} />}
      {currentPage === pageName.exercises && <ExercisesPage exerciseFamilies={exerciseFamilies} bodyparts={bodyparts} handleUpdateExerciseSets={handleUpdateExerciseSets} handleAddExercise={handleAddExercise} />}
      {currentPage === pageName.stats && <StatsPage />}
      {currentPage === pageName.competition && <LeaderboardPage exerciseFamilies={exerciseFamilies} bodyparts={bodyparts} />}
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

