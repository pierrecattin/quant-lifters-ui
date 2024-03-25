import { getDaysBetweenDates } from "./utils"

export class NameAndId {
  name: string
  id: string

  constructor(name: string, id: string) {
    this.name = name
    this.id = id
  }

  clone() {
    return new NameAndId(this.name, this.id)
  }

  static deserialize(data: string): NameAndId {
    const parsedData = JSON.parse(data);
    return new NameAndId(
      parsedData.name,
      parsedData.id
    )
  }
}

abstract class BaseExerciseSet {
  id: string;
  weight: number;
  reps: number;
  rir: number;
  wilks: number;

  constructor(id: string, weight: number, reps: number, rir: number, wilks: number) {
    this.id = id;
    this.weight = weight;
    this.reps = reps;
    this.rir = rir;
    this.wilks = wilks;
  }

  abstract clone(): BaseExerciseSet;
}

export class ExerciseSetForExerciseLog extends BaseExerciseSet {
  time: Date;

  constructor(id: string, time: Date | string, weight: number, reps: number, rir: number, wilks: number) {
    super(id, weight, reps, rir, wilks);
    this.time = (typeof time === 'string') ? new Date(time) : time;
  }

  getTimeAsString() {
    return this.time.toDateString();
  }

  clone() {
    return new ExerciseSetForExerciseLog(
      this.id,
      this.time,
      this.weight,
      this.reps,
      this.rir,
      this.wilks
    );
  }

  static deserialize(data: string): ExerciseSetForExerciseLog {
    const parsedData = JSON.parse(data);
    return new ExerciseSetForExerciseLog(
      parsedData.id,
      parsedData.time,
      parseFloat(parsedData.weight),
      parseInt(parsedData.reps, 10),
      parseInt(parsedData.rir, 10),
      parseFloat(parsedData.wilks)
    );
  }
}

export class ExerciseSetForWorkoutLog extends BaseExerciseSet {
  exercise: NameAndId;

  constructor(id: string, exercise: NameAndId, weight: number, reps: number, rir: number, wilks: number) {
    super(id, weight, reps, rir, wilks);
    this.exercise = exercise;
  }

  clone() {
    return new ExerciseSetForWorkoutLog(
      this.id,
      this.exercise.clone(),
      this.weight,
      this.reps,
      this.rir,
      this.wilks
    );
  }

  static deserialize(data: string): ExerciseSetForWorkoutLog {
    const parsedData = JSON.parse(data);
    return new ExerciseSetForWorkoutLog(
      parsedData.id,
      NameAndId.deserialize(JSON.stringify(parsedData.exercise)),
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

  constructor(weight?: number, reps?: number, rir?: number, markedComplete = false) {
    this.weight = weight;
    this.reps = reps;
    this.rir = rir
    this.markedComplete = markedComplete
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
  weightFactor: number;
  bodyWeightInclusionFactor: number;
  isUnilateral: boolean;
  isCustom: boolean;
  createdBy: string;
  sharedWith: string[];
  sets: ExerciseSetForExerciseLog[];



  constructor(id: string, name: string, weightFactor: number,
    bodyWeightInclusionFactor: number,
    isUnilateral: boolean, isCustom: boolean,
    createdBy: string, sharedWith: string[], sets: ExerciseSetForExerciseLog[]) {
    this.id = id;
    this.name = name;
    this.weightFactor = weightFactor;
    this.bodyWeightInclusionFactor = bodyWeightInclusionFactor;
    this.isUnilateral = isUnilateral;
    this.isCustom = isCustom;
    this.createdBy = createdBy;
    this.sharedWith = sharedWith;
    this.sets = sets;
  }

  get daysSinceLastTimePerformed(): number | null {
    if (this.sets.length === 0) {
      return null;
    }
    let mostRecentTime = this.sets[0].time;
    for (const set of this.sets) {
      if (set.time > mostRecentTime) {
        mostRecentTime = set.time;
      }
    }

    return getDaysBetweenDates(new Date(), mostRecentTime);
  }

  clone(): ExerciseWithHistory {
    // Create a deep copy for complex types to avoid shared references
    const sharedWithCopy = [...this.sharedWith];
    const setsCopy = this.sets.map(set => set.clone());

    return new ExerciseWithHistory(
      this.id,
      this.name,
      this.weightFactor,
      this.bodyWeightInclusionFactor,
      this.isUnilateral,
      this.isCustom,
      this.createdBy,
      sharedWithCopy,
      setsCopy,
    );
  }

  getFamily(exerciseFamilies: ExerciseFamily[]): ExerciseFamily {
    const family = exerciseFamilies.find(family => family.exercises.some(e => e.id === this.id));
    if (!family) throw new Error("Exercise not found in families list");
    return family;
  }


  static deserialize(data: string) {
    const parsedData = JSON.parse(data);
    const sets = parsedData.sets.map((set: any) => ExerciseSetForExerciseLog.deserialize(JSON.stringify(set)));
    return new ExerciseWithHistory(
      parsedData.id,
      parsedData.name,
      parsedData.weightFactor,
      parsedData.bodyWeightInclusionFactor,
      parsedData.isUnilateral,
      parsedData.isCustom,
      parsedData.createdBy,
      parsedData.sharedWith,
      sets,
    );
  }
}

export class ExerciseFamily {
  id: string;
  name: string;
  primaryBodyparts: string[];
  secondaryBodyparts: string[];
  isCustom: boolean;
  createdBy: string;
  sharedWith: string[];
  exercises: ExerciseWithHistory[];

  constructor(id: string, name: string, primaryBodyparts: string[], secondaryBodyparts: string[], isCustom: boolean,
    createdBy: string, sharedWith: string[], exercises: ExerciseWithHistory[]) {
    this.id = id;
    this.name = name;
    this.primaryBodyparts = primaryBodyparts;
    this.secondaryBodyparts = secondaryBodyparts;
    this.isCustom = isCustom;
    this.createdBy = createdBy;
    this.sharedWith = sharedWith;
    this.exercises = exercises;
  }


  get daysSinceLastTimePerformed(): number | null {
    let mostRecentTime: Date | null = null;

    for (const exercise of this.exercises) {
      if (exercise.sets.length === 0) continue;

      for (const set of exercise.sets) {
        if (!mostRecentTime || set.time > mostRecentTime) {
          mostRecentTime = set.time;
        }
      }
    }

    if (mostRecentTime === null) {
      return null;
    } else {
      return getDaysBetweenDates(new Date(), mostRecentTime);
    }
  }

  clone(): ExerciseFamily {
    // Create a deep copy for complex types to avoid shared references
    const primaryBodypartsCopy = [...this.primaryBodyparts];
    const secondaryBodypartsCopy = [...this.secondaryBodyparts];
    const sharedWithCopy = [...this.sharedWith];
    const exercisesCopy = this.exercises.map(exercise => exercise.clone());

    return new ExerciseFamily(
      this.id,
      this.name,
      primaryBodypartsCopy,
      secondaryBodypartsCopy,
      this.isCustom,
      this.createdBy,
      sharedWithCopy,
      exercisesCopy,
    );
  }

  static deserialize(data: string) {
    const parsedData = JSON.parse(data);
    const exercises = parsedData.exercises.map((exercise: any) => ExerciseWithHistory.deserialize(JSON.stringify(exercise)));
    return new ExerciseFamily(
      parsedData.id,
      parsedData.name,
      parsedData.primaryBodyparts,
      parsedData.secondaryBodyparts,
      parsedData.isCustom,
      parsedData.createdBy,
      parsedData.sharedWith,
      exercises,
    );
  }
}


export class WorkoutTemplate {
  id: string;
  name: string;
  plannedExercises: PlannedExercise[];
  isArchived: boolean;
  lastWorkoutDate: Date | null;

  constructor(id: string, name: string, plannedExercises: PlannedExercise[], isArchived = false, lastWorkoutDate: Date | null = null) {
    this.id = id;
    this.name = name;
    this.plannedExercises = plannedExercises;
    this.isArchived = isArchived;
    this.lastWorkoutDate = lastWorkoutDate;
  }

  getDaysSinceLastWorkout() {
    if (this.lastWorkoutDate === null) {
      return null
    } else {
      return getDaysBetweenDates(new Date(), this.lastWorkoutDate);
    }
  }

  archive() {
    this.isArchived = true
    return this
  }

  unarchive() {
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

export class Workout {
  id: string;
  start_time: Date;
  sets: ExerciseSetForWorkoutLog[];

  constructor(id: string, start_time: Date, sets: ExerciseSetForWorkoutLog[]) {
    this.id = id;
    this.start_time = start_time;
    this.sets = sets;
  }

  clone(): Workout {
    const setsClone = this.sets.map(set => set.clone());
    return new Workout(this.id, this.start_time, setsClone);
  }

  static deserialize(data: string): Workout {
    const parsedData = JSON.parse(data);
    const startTimeDeserialized = new Date(parsedData.start_time);
    const setsDeserialized = parsedData.sets.map((setData: string) => ExerciseSetForWorkoutLog.deserialize(JSON.stringify(setData)));
    return new Workout(parsedData.id, startTimeDeserialized, setsDeserialized);
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

  clone(): PlannedExercise {
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


  constructor(exerciseId: string, exerciseName?: string, restTimeinSec?: number) {
    this.exerciseId = exerciseId;
    this.exerciseName = exerciseName;
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

  toExerciseSetInProgress() {
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