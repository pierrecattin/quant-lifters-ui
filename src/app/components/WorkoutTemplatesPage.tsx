"use client";
export function WorkoutTemplatesPage({showCreate, showHistory, showQuickWorkout}: {showCreate: any, showHistory: any, showQuickWorkout: any}) {

  return (
    <><div className="flex justify-between">
          <button
            className="flex-grow rounded-lg  bg-slate-300 text-black text-lg py-1 mx-1 shadow-lg shadow-black hover:bg-white"
            onClick={showCreate}>
            New template
          </button>
          <button
            className="flex-grow rounded-lg  bg-slate-300 text-black text-lg py-1 mx-1 shadow-lg shadow-black hover:bg-white"
            onClick={showHistory}>
            History
          </button>
          <button
            className="flex-grow rounded-lg  bg-slate-300 text-black text-lg py-1 mx-1 shadow-lg shadow-black hover:bg-white"
            onClick={showQuickWorkout}>
            Quick Workout
          </button>
        </div>
          <div>
            TODO: show templates. For now, please use the exercises page to record workouts.
          </div>
        </>
  )
}
