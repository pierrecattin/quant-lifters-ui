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

export function getDaysBetweenDates(date1: Date, date2: Date): number {
  // Create new dates normalized to midnight to ignore time of day
  const normalizedDate1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const normalizedDate2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());

  const differenceInDays = (normalizedDate1.getTime() - normalizedDate2.getTime()) / (1000 * 3600 * 24);
  return Math.round(differenceInDays); 
}


export function stringToNumberOrUndefined(s:string){
  return( s==="" ? undefined: Number(s))
}