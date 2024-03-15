import {getDaysBetweenDates} from "./utils"

export class ExerciseSet {
  id: string
  time: Date;
  weight: number;
  reps: number;
  rir: number;
  wilks: number;

  constructor(id: string, time: Date | string, weight: number, reps: number, rir: number, wilks: number) {
    this.id = id
    this.time = (typeof time === 'string') ? new Date(time) : time;
    this.weight = weight;
    this.reps = reps;
    this.rir = rir;
    this.wilks = wilks;
  }

  getTimeAsString() {
    return this.time.toDateString();
  }

  clone() {
    return new ExerciseSet(
      this.id,
      this.time,
      this.weight,
      this.reps,
      this.rir,
      this.wilks
    )
  }

  static deserialize(data: string): ExerciseSet {
    const parsedData = JSON.parse(data);
    return new ExerciseSet(
      parsedData.id,
      parsedData.time,
      parseFloat(parsedData.weight),
      parseInt(parsedData.reps, 10),
      parseInt(parsedData.rir, 10),
      parseFloat(parsedData.wilks)
    );
  }

}


export class ExerciseSetInProgress {
  weight?: number; 
  reps?: number;
  rir?: number;
  markedComplete: boolean

  constructor(weight?: number, reps?: number, rir?: number, markedComplete=false) {
    this.weight = weight;
    this.reps = reps;
    this.rir = rir
    this.markedComplete=markedComplete
  }

  cloneAndUpdate(field: string, value: number | boolean | undefined) {
    if (field === 'markedComplete') {
      const markedCompleteValue = Boolean(value);
      return new ExerciseSetInProgress(this.weight, this.reps, this.rir, markedCompleteValue);
    } else {
      return new ExerciseSetInProgress(
        field === 'weight' ? value as number : this.weight,
        field === 'reps' ? value as number : this.reps,
        field === 'rir' ? value as number : this.rir,
        this.markedComplete
      );
    }
  }

  static deserialize(data: string) {
    const parsedData = JSON.parse(data);
    return new ExerciseSetInProgress(
      parsedData.weight,
      parsedData.reps,
      parsedData.rir,
      parsedData.markedComplete
    );
  }
}

export class Records {
  weight: Number;
  wilks: Number;

  constructor(weight = 0, wilks = 0) {
    this.weight = weight;
    this.wilks = wilks;
  }
}

export class ExerciseWithHistory {
  id: string;
  name: string;
  primaryBodyparts: string[];
  secondaryBodyparts: string[];
  isCustom: boolean;
  createdBy: string;
  sharedWith: string[];
  sets: ExerciseSet[];
  exerciseFamily: string; // TODO temporary to not break the current UI. exerciseFamily should become a class and bodyparts should move over

  constructor(id: string, name: string, primaryBodyparts: string[], secondaryBodyparts: string[], isCustom: boolean,
    createdBy: string, sharedWith: string[], sets: ExerciseSet[], exerciseFamily: string) {
    this.id = id;
    this.name = name;
    this.primaryBodyparts = primaryBodyparts;
    this.secondaryBodyparts = secondaryBodyparts;
    this.isCustom = isCustom;
    this.createdBy = createdBy;
    this.sharedWith = sharedWith;
    this.sets = sets;
    this.exerciseFamily = exerciseFamily;
  }

  get daysSinceLastTimePerformed(): number | null {
    if (this.sets.length === 0) {
      return null; 
    }

    const sortedSets = this.sets.sort((a, b) => b.time.getTime() - a.time.getTime());
    const lastPerformedTime = sortedSets[0].time; 

    return getDaysBetweenDates(new Date(), lastPerformedTime);
  }

  clone(): ExerciseWithHistory {
    // Create a deep copy for complex types to avoid shared references
    const primaryBodypartsCopy = [...this.primaryBodyparts];
    const secondaryBodypartsCopy = [...this.secondaryBodyparts];
    const sharedWithCopy = [...this.sharedWith];
    const setsCopy = this.sets.map(set => set.clone());

    return new ExerciseWithHistory(
      this.id,
      this.name,
      primaryBodypartsCopy,
      secondaryBodypartsCopy,
      this.isCustom,
      this.createdBy,
      sharedWithCopy,
      setsCopy,
      this.exerciseFamily
    );
  }

  static deserialize(data: string) {
    const parsedData = JSON.parse(data);
    const sets = parsedData.sets.map((set: any) => ExerciseSet.deserialize(JSON.stringify(set)));
    return new ExerciseWithHistory(
      parsedData.id,
      parsedData.name,
      parsedData.primaryBodyparts,
      parsedData.secondaryBodyparts,
      parsedData.isCustom,
      parsedData.createdBy,
      parsedData.sharedWith,
      sets,
      parsedData.exerciseFamily
    );
  }
}

export class WorkoutTemplate {
  id: string;
  name: string;
  plannedExercises: PlannedExercise[];
  isArchived: boolean;
  lastWorkoutDate: Date|null;

  constructor(id: string, name: string, plannedExercises: PlannedExercise[], isArchived=false, lastWorkoutDate: Date|null = null) {
    this.id = id;
    this.name = name;
    this.plannedExercises = plannedExercises;
    this.isArchived = isArchived;
    this.lastWorkoutDate = lastWorkoutDate;
  }
  
  getDaysSinceLastWorkout(){
    if (this.lastWorkoutDate === null){
      return null
    } else {
      return getDaysBetweenDates(new Date(), this.lastWorkoutDate);
    }
  }

  archive(){
    this.isArchived = true
    return this
  }

  unarchive(){
    this.isArchived = false
    return this
  }

  clone(): WorkoutTemplate {
    return new WorkoutTemplate("",
      this.name,
      this.plannedExercises.map(p => p.clone()),
      this.isArchived,
      null)
  }

  static deserialize(data: string): WorkoutTemplate {
    const parsedData = JSON.parse(data);
    const plannedExercises = parsedData.plannedExercises.map((pe: any) => PlannedExercise.deserialize(JSON.stringify(pe)));
    return new WorkoutTemplate(
      parsedData.id,
      parsedData.name,
      plannedExercises,
      parsedData.isArchived,
      parsedData.lastWorkoutDate ? new Date(parsedData.lastWorkoutDate) : null
    );
  }
}

export class PlannedExercise {
  id: string;
  name: string;
  plannedExerciseSets: PlannedExerciseSet[];

  constructor(id: string, name: string, plannedExerciseSets: PlannedExerciseSet[]) {
    this.id = id;
    this.name = name;
    this.plannedExerciseSets = plannedExerciseSets;
  }

  clone(): PlannedExercise{
    return new PlannedExercise(
      this.id,
      this.name,
      this.plannedExerciseSets.map(p => p.clone())
    )
  }

  static deserialize(data: string): PlannedExercise {
    const parsedData = JSON.parse(data);
    const plannedExerciseSets = parsedData.plannedExerciseSets.map((pes: any) => PlannedExerciseSet.deserialize(JSON.stringify(pes)));
    return new PlannedExercise(
      parsedData.id,
      parsedData.name,
      plannedExerciseSets
    );
  }
}

export class PlannedExerciseSet {
  exerciseName?: string;
  exerciseId: string;
  restTimeinSec?: number;
  target: {
    reps?: number;
    weight?: number;
    intensity?: number;
    rir?: number;
  };


  constructor(exerciseId: string, exerciseName?:string, restTimeinSec?: number) {
    this.exerciseId=exerciseId;
    this.exerciseName=exerciseName;
    this.target = {};
    this.restTimeinSec = restTimeinSec;
  }

  setTarget(target: { reps?: number; weight?: number; intensity?: number; rir?: number }) {
    this.target = { ...target };
    return this; 
  }
  
  clone(): PlannedExerciseSet {
    return new PlannedExerciseSet(this.exerciseId, this.exerciseName, this.restTimeinSec).setTarget(this.target);
  }

  toExerciseSetInProgress(){
    // TODO: fill implied target items
    return new ExerciseSetInProgress(this.target?.weight, this.target?.reps, this.target?.rir)
  }

  static deserialize(data: string): PlannedExerciseSet {
    const parsedData = JSON.parse(data);
    const set = new PlannedExerciseSet(parsedData.exerciseId, parsedData.exerciseName, parsedData.restTimeinSec);
    set.setTarget(parsedData.target);
    return set;
  }

}