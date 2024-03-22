"use client";

import { ExerciseWithHistory, ExerciseFamily } from "../classes"

export function ExerciseDetailsPage({ family, exercise }: {family: ExerciseFamily,  exercise: ExerciseWithHistory }) {

  const primary_bodyparts = "Primary bodypart" + (family.primaryBodyparts.length > 1 ? "s" : "") + ": " + family.primaryBodyparts.join(", ")
  const secondary_bodyparts = family.secondaryBodyparts.length == 0 ? "" : "Secondary bodypart" + (family.secondaryBodyparts.length > 1 ? "s" : "") + ": " + family.secondaryBodyparts.join(", ")
  return (
    <>
      <div>{primary_bodyparts}</div>
      <div>{secondary_bodyparts}</div>
    </>
  )
} 