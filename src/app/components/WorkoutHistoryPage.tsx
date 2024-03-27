"use client";
import Image from "next/image";
import { Workout } from "../classes";

export function WorkoutHistoryPage({ showHome, workoutLog }: { showHome: any, workoutLog: Workout[] }) {
  return (
    <>
      <div className="flex items-center space-x-2">
        <button onClick={showHome} className="flex items-center justify-center p-2">
          <Image src="icons/return_arrow.svg" alt="Return" width={20} height={20} />
        </button>
        <h1 className="text-xl font-bold">Workout History</h1>
      </div>
      <section className="mt-3 pb-96 space-y-4">
        {workoutLog.sort((a, b) =>
          a.start_time > b.start_time ? -1 : 1
        ).map(workout => (
          <article key={workout.id} className="bg-gray-800 border border-gray-200 rounded-lg p-4">
            <header className="text-lg font-semibold mb-2">
              {new Date(workout.start_time).toLocaleDateString("en-US", {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })}
            </header>
            <div className="space-y-2">
              {workout.sets.sort((a, b) => a.numberWithinWorkout < b.numberWithinWorkout ? -1 : 2).reduce<React.ReactNode[]>(
                (acc, set, index, array) => {
                  const isDifferent = index === 0 || set.exercise.name !== array[index - 1].exercise.name;
                  if (isDifferent) acc.push(<div key={`exercise-${index}`} className="font-semibold">{set.exercise.name}</div>);
                  acc.push(
                    <div key={set.id} className="ml-4">
                      {set.numberWithinWorkout+1}. {set.reps} x {set.weight}kg with {set.rir} RIR
                    </div>
                  );
                  return acc;
                }, [])}
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
