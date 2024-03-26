import { ExerciseSetForExerciseLog, Records } from "./classes"

export function recordsByTotalReps(exerciseSets: ExerciseSetForExerciseLog[]): Map<number, Records> {
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
  const converted =  s==="" ? undefined: Number(s)
  return(converted)
}


export function getInfoMessage(fieldName: string){
  let message = '';
  switch (fieldName) {
      case 'is_unilateral':
          message = 'Unilateral exercises, such as one-arm biceps curls, work one side of the body per set. Entering three sets in a template means that during the workout, you will log a total of six sets: three for each half of your body.';
          break;
      case 'weight_factor':
          message = 'The weight factor multiplies the input weight for volume calculations. Set it to 100% for exercises like barbell curls, and 200% for bilateral dumbbell exercises. This way, if you use 10kg dumbbells, you can simply log 10kg, and the system will calculate the volume using a total load of 20kg.';
          break;
      case 'bodyweight_inclusion_factor':
          message = 'The bodyweight inclusion factor specifies the percentage of your bodyweight to be considered in 1RM and volume calculations. For exercises that do not incorporate bodyweight, like bench press, set it to 0%. For bodyweight exercises, such as pull-ups, set it to 100%. This way, if you perform pull-ups with an additional 10kg weight and your bodyweight is 80kg, the system will automatically use a total load of 90kg.';
          break;
  }
  return message
}