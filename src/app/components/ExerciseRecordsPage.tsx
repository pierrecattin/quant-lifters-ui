"use client";

import { ExerciseWithHistory } from "../classes"
import { recordsByTotalReps } from "../utils"

export function ExerciseRecordsPage({ exercise }: { exercise: ExerciseWithHistory }) {

  const repsSorted = Array.from(recordsByTotalReps(exercise.sets).keys()).sort((a, b) => a - b);

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Record per Reps
            </th>
            {repsSorted.map((reps) => (
              <th key={reps} scope="col" className="px-6 py-3">
                {reps}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              Weight
            </th>
            {repsSorted.map((reps) => (
              <td key={reps} className="px-6 py-4">
                {recordsByTotalReps(exercise.sets).get(reps)!.weight.valueOf()}
              </td>
            ))}
          </tr>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              Wilks-adjusted Weight
            </th>
            {repsSorted.map((reps) => (
              <td key={reps} className="px-6 py-4">
                {recordsByTotalReps(exercise.sets).get(reps)!.wilks.valueOf()}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
} 