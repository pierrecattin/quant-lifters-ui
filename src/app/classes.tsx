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

  static deserialize(data: string) {
    const parsedData = JSON.parse(data)
    return new ExerciseSet(parsedData.id,
      parsedData.time,
      parseFloat(parsedData.weight),
      parseInt(parsedData.reps),
      parseInt(parsedData.rir),
      parsedData.wilksScore)
  }

}


export class ExerciseSetInProgress {
  weight?: number; 
  reps?: number;
  rir?: number;

  constructor(weight?: number, reps?: number, rir?: number) {
    this.weight = weight;
    this.reps = reps;
    this.rir = rir
  }

  static deserialize(data: string) {
    const parsedData = JSON.parse(data);
    return new ExerciseSetInProgress(
      parsedData.weight,
      parsedData.reps,
      parsedData.rir
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
  exerciseFamily: string; //temporary to not break the current UI. exerciseFamily should become a class and bodyparts should move over

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

  fillImpliedTargetItems(){
    alert("TODO: fillImpliedTargetItems")
  }

  setTarget(target: { reps?: number; weight?: number; intensity?: number; rir?: number }) {
    this.target = { ...target };
    return this; 
  }
  
  clone(): PlannedExerciseSet {
    return new PlannedExerciseSet(this.exerciseId, this.exerciseName, this.restTimeinSec).setTarget(this.target);
  }

}