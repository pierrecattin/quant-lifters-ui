"use client";

import { ExerciseWithHistory } from "../classes"

export function ExerciseDetailsPage({ exercise }: { exercise: ExerciseWithHistory }) {

  const primary_bodyparts = "Primary bodypart" + (exercise.primaryBodyparts.length > 1 ? "s" : "") + ": " + exercise.primaryBodyparts.join(", ")
  const secondary_bodyparts = exercise.secondaryBodyparts.length == 0 ? "" : "Secondary bodypart" + (exercise.secondaryBodyparts.length > 1 ? "s" : "") + ": " + exercise.secondaryBodyparts.join(", ")
  return (
    <>
      <div>{primary_bodyparts}</div>
      <div>{secondary_bodyparts}</div>
    </>
  )
} 