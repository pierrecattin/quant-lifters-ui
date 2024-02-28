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

  static deserialize(data: string){
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
  weight: string; // Using string to allow partially filled without using undefined, to prevent: https://medium.com/@kirichuk/why-react-component-is-changing-an-uncontrolled-input-to-be-controlled-1f19f9a1ef35
  reps: string;
  rir: string;

  constructor(weight = "", reps = "", rir = "") {
    this.weight = weight;
    this.reps = reps;
    this.rir = rir
  }

  static deserialize(data: string){
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

  constructor(id: string, name: string, primaryBodyparts: string[], secondaryBodyparts: string[], isCustom: boolean,
    createdBy: string, sharedWith: string[], sets: ExerciseSet[]) {
    this.id = id;
    this.name = name;
    this.primaryBodyparts = primaryBodyparts;
    this.secondaryBodyparts = secondaryBodyparts;
    this.isCustom = isCustom;
    this.createdBy = createdBy;
    this.sharedWith = sharedWith;
    this.sets = sets;
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
      setsCopy
    );
  }

  static deserialize(data: string){
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
      sets
    );
  }
}