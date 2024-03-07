import { ExerciseSet, Records } from "./classes"

export function recordsByTotalReps(exerciseSets: ExerciseSet[]): Map<number, Records> {
  let recordsByTotalReps = new Map<number, Records>();
  exerciseSets.forEach(set => {
    const currentRecord = recordsByTotalReps.get(set.reps + set.rir);
    if (currentRecord === undefined) {
      recordsByTotalReps.set(set.reps + set.rir, new Records(set.weight, set.wilks));
    }
    else {
      const newRecord = new Records(Math.max(set.weight, currentRecord!.weight.valueOf()), Math.max(set.wilks, currentRecord!.wilks.valueOf()));
      recordsByTotalReps.set(set.reps + set.rir, newRecord);
    }
  });
  return recordsByTotalReps;
}