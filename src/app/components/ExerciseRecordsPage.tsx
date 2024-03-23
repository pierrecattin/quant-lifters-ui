"use client";

import { ExerciseWithHistory } from "../classes"
import { recordsByTotalReps } from "../utils"

export function ExerciseRecordsPage({ exercise }: { exercise: ExerciseWithHistory }) {

  const repsSorted = Array.from(recordsByTotalReps(exercise.sets).keys()).sort((a, b) => a - b);

  return (
    <>
      <div className="me-12 pt-1">
        <div className="bg-gray-800 border border-gray-200 rounded-lg p-4 mb-4 ">
          <table className="text-sm">
            <thead>
              <tr>
                <th scope="col" className="px-2 text-right">
                  Reps
                </th>
                <th scope="col" className="px-2 text-right">
                  Weight
                </th>
                <th scope="col" className="px-2 text-right">
                  Wilks-adjusted Weight
                </th>
              </tr>
            </thead>
            <tbody>
              {repsSorted.map((reps) => (
                <tr key={reps}>
                  <td className="text-right">
                    {reps}
                  </td>
                  <td className="px-2 text-right">
                    {recordsByTotalReps(exercise.sets).get(reps)!.weight.valueOf()}
                  </td>
                  <td className="px-2 text-right">
                      {recordsByTotalReps(exercise.sets).get(reps)!.wilks.valueOf()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
} 