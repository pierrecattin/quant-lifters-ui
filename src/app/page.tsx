"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const BACKEND_URL = process.env.NEXT_PUBLIC_QUANT_LIFTERS_BACKEND_URL


class ExerciseSet{
  time: Date;
  weight: number;
  reps: number;
  rir: number;
  wilks: number;

  constructor(time: Date|string, weight: number, reps: number, rir: number, wilks: number){
    this.time = (typeof time === 'string') ? new Date(time) : time;
    this.weight = weight;
    this.reps = reps;
    this.rir = rir;
    this.wilks = wilks;
  }

  getTimeAsString() {
    return this.time.toDateString();
  }

}

class ExerciseSetInProgress{
  weight: string; // Using string to allow partially filled without using undefined, to prevent: https://medium.com/@kirichuk/why-react-component-is-changing-an-uncontrolled-input-to-be-controlled-1f19f9a1ef35
  reps: string;
  rir: string; 
 
  constructor(weight="", reps="", rir="") {
    this.weight = weight;
    this.reps = reps;
    this.rir = rir
  }
}


class ExerciseWithHistory{
  id: string;
  name: string;
  primaryBodyparts: string[];
  secondaryBodyparts: string[]; 
  isCustom: boolean;
  createdBy: string;
  sharedWith: string[];
  sets: ExerciseSet[];
 
  constructor(id: string, name: string, primaryBodyparts: string[], secondaryBodyparts: string[], isCustom: boolean, 
    createdBy: string, sharedWith: string[], sets:ExerciseSet[]) {
    this.id = id;
    this.name = name;
    this.primaryBodyparts = primaryBodyparts;
    this.secondaryBodyparts = secondaryBodyparts;
    this.isCustom = isCustom;
    this.createdBy = createdBy;
    this.sharedWith = sharedWith;
    this.sets = sets;
  }
}

enum pageName {
  profile,
  workout,
  exercises,
  stats,
  competition,
}


function ExerciseTrackPage({exercise, onAddExerciseSets }:{exercise: ExerciseWithHistory, onAddExerciseSets: any}) {
  const storageKey = "SetInProgress_" + exercise.id
  const [sets, setSets] = useState<ExerciseSetInProgress[]>(() => {
    let savedSets = null
    if (typeof window !== 'undefined') { 
      savedSets = localStorage.getItem(storageKey);
    } 
    return savedSets ? JSON.parse(savedSets) : [new ExerciseSetInProgress()];
  });

  // Use useEffect to update localStorage when sets change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(sets));
  }, [sets]);

  const handleSetChange = (index: number, field: string, value: string) => {
    const newSets = [...sets];
    newSets[index] = { ...newSets[index], [field]: value };
    setSets(newSets);
  };

  const addSet = () => {
    setSets([...sets, new ExerciseSetInProgress() ]);
  };

  const removeSet = (index: number) => {
    const newSets = [...sets];
    newSets.splice(index, 1);
    setSets(newSets);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    const time = new Date().toISOString();
    const body={
      "exercise_id": exercise.id,
      "time":  time,
      "sets": sets,
    }
    e.preventDefault();
    const response = await fetch(`${BACKEND_URL}saveexercisesets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    if (response.ok) {
      alert("Set saved.")
      // Store new sets in react state so that it's available without having to fetch from the backen
      const completedExerciseSets = sets.map(set => 
        new ExerciseSet(time, parseFloat(set.weight), parseInt(set.reps), parseInt(set.rir), 0)
        );
        onAddExerciseSets(completedExerciseSets)
      setSets([new ExerciseSetInProgress()]);
    } else {
      alert('Failed to save sets');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {sets.map((set, index) => (
        <div key={index} className="flex items-center space-x-2">
          <span className="text-lg">{index + 1}.</span>
          <input
            type="number"
            step="0.25"
            min="0"
            className="w-20 p-1 border rounded-md text-gray-100 bg-gray-800"
            value={set.weight}
            onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
            placeholder="Weight"
            required
          />
          <input
            type="number"
            min="1"
            className="w-20 p-1 border rounded-md text-gray-100 bg-gray-800 "
            value={set.reps}
            onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
            placeholder="Reps"
            required
          />
          <input
            type="number"
            min="0"
            className="w-20 p-1 border rounded-md  bg-gray-800"
            value={set.rir}
            onChange={(e) => handleSetChange(index, 'rir', e.target.value)}
            placeholder="RiR"
            required
          />
          {sets.length > 1 && (
            <button type="button" onClick={() => removeSet(index)} className="py-1 px-3 my-2 bg-red-800 text-white rounded-md">
              <span className="font-black">-</span>
            </button>
          )}
        </div>
      ))}
      <div className="flex space-x-2 my-6">
        <button type="button" onClick={addSet} className="py-1 px-3 mx-3 my-4 bg-green-500 text-white rounded-md">
          <span className="font-black">+</span>
        </button>
        <button type="submit" className="p-1 bg-purple-900 text-white rounded-md my-4 px-5">
          Save
        </button>
      </div>
    </form>
  );
}

function ExerciseSetsBoxes({setsByDay}: {setsByDay:Map<string, ExerciseSet[]>}){
  const daysSorted = Array.from(setsByDay.keys()).sort((a, b) => new Date(a) < new Date(b) ? 1 : -1);
  return(
    <div className="me-12">
    {daysSorted.map(day => {
      const daySets = setsByDay.get(day) ?? [];
      return (
        <div key={day} className="bg-gray-800 border border-gray-200 rounded-lg p-4 my-4">
          <div className="text-lg font-bold">
            {day}
          </div>
          <div>
            {daySets.map((set, index) => (
              <div key={index} className="">
                <span>{set.reps} x {1 * set.weight}kg with {set.rir}RiR - Wilks: {1*set.wilks}</span>
              </div>
            ))}
          </div>
        </div>
      );
    })}
  </div>
)
}

function ExerciseHistoryPage({exerciseSets}: {exerciseSets: ExerciseSet[]}) {

  const setsByDay = new Map<string, ExerciseSet[]>();
  exerciseSets.forEach(exerciseSet => {
    const exerciseSetConv = new ExerciseSet(exerciseSet.time, exerciseSet.weight, exerciseSet.reps, exerciseSet.rir, exerciseSet.wilks); // strange failure if we don't create new
    const date = exerciseSetConv.getTimeAsString();
    if (!setsByDay.get(date)) {
      setsByDay.set(date, []);
    }
    setsByDay.get(date)?.push(exerciseSetConv);
  });

  return (
    <>
      {setsByDay.size > 0 && <ExerciseSetsBoxes setsByDay={setsByDay}/>}
      {setsByDay.size === 0 && (
          <span className="text-gray-200 mx-5">Not performed yet </span>)}
    </>
  );
}

function ExerciseDetailsPage({exercise}: {exercise: ExerciseWithHistory}){
  
  const primary_bodyparts = "Primary bodypart" + (exercise.primaryBodyparts.length>1 ? "s": "") + ": " + exercise.primaryBodyparts.join(", ")
  const secondary_bodyparts = exercise.secondaryBodyparts.length == 0 ? "": "Secondary bodypart" + (exercise.secondaryBodyparts.length>1 ? "s": "") + ": " + exercise.secondaryBodyparts.join(", ")
  return(
    <>
      <div>{primary_bodyparts}</div>
      <div>{secondary_bodyparts}</div>
    </>
  )
} 

function ExercisePage({ exercise, goBack, handleAddExerciseSets }: {exercise: ExerciseWithHistory, goBack:any, handleAddExerciseSets:any}){ 
  enum exerciseSubPageName {
    track = "Track",
    history = "History",
    details = "Details",
  }

  const [currentExercise, setCurrentExercise] = useState(exercise); // Updatable by children
  const [currentExerciseSubpage, setCurrentExerciseSubpage] = useState(exerciseSubPageName.track);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLSpanElement>(null);

  const handleClickOutsideDropdown = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideDropdown);
    return () => document.removeEventListener("mousedown", handleClickOutsideDropdown);
  }, []);

  function handleAddExerciseSetsInExercisePage(newSets: ExerciseSet[]){
      const updatedExercise = { ...exercise, sets: [...exercise.sets, ...newSets] };
      setCurrentExercise(updatedExercise);
      handleAddExerciseSets(exercise.id, newSets);
  };

  function showTrack(){
    setCurrentExerciseSubpage(exerciseSubPageName.track)
  }

  function showHistory(){
    setCurrentExerciseSubpage(exerciseSubPageName.history)
  }

  function showDetails(){
    setCurrentExerciseSubpage(exerciseSubPageName.details)
  }
  
  const pages = [
    { name: exerciseSubPageName.track, action: showTrack},
    { name: exerciseSubPageName.history, action: showHistory },
    { name: exerciseSubPageName.details, action: showDetails },
  ];

  function onMenuClick(){
    alert("TODO: only enable for custom exercise")
  }


  return (
    <div className="z-40 fixed w-full">
      <div className="top-0">
        <div className="flex justify-between items-center">
          <span>
            <button onClick={goBack}>
              <Image
                src="icons/return_arrow.svg"
                alt="Return"
                width={20}
                height={20}
              />
            </button>
          </span>
          <span className="text-lg">
            {exercise.name}
          </span>
          <span className="relative mx-7" ref={dropdownRef}>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <Image
                src="icons/menu.svg"
                alt="Menu"
                width={20}
                height={20}
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-1 z-50">
                <button
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={onMenuClick}>
                  Edit
                </button>
                <button 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={onMenuClick}>
                  Delete
                </button>
                <button
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={onMenuClick}>
                  Share
                </button>
              </div>
            )}
          </span>
        </div>
        <div className="inset-x-0 flex justify-around items-center h-12  ">
          {pages.map((page) => (
          <button 
            key={page.name} 
            onClick={page.action} 
            className={`flex-1 flex justify-center items-center h-full shadow-md
            ${currentExerciseSubpage === page.name ?  ' border-b border-white text-white' : ' text-slate-500'}`}>
            {page.name}
          </button>
        ))}
        </div>
      </div>
      <div className="my-3">
        {currentExerciseSubpage === exerciseSubPageName.track && <ExerciseTrackPage exercise={currentExercise} onAddExerciseSets={handleAddExerciseSetsInExercisePage} />}
        {currentExerciseSubpage === exerciseSubPageName.history && <ExerciseHistoryPage exerciseSets={currentExercise.sets} />}
        {currentExerciseSubpage === exerciseSubPageName.details && <ExerciseDetailsPage exercise={currentExercise} />}
      </div>
    </div>
  );
}
function ExerciseButton({ exercise, onExerciseClick }: {exercise: ExerciseWithHistory, onExerciseClick: any}) {
  function click(){
    onExerciseClick(exercise)
  }
  return (
    <button 
      className="group m-1 rounded-lg border border-gray-500 px-5 py-4 transition-colors bg-gray-900 hover:border-red-700 hover:bg-neutral-800/50"
      onClick={click}>
        <h2 className={`mb-3 text-2xl font-semibold`}>
          {exercise.name}{" "}
          <span className="inline-block transition-transform group-hover:translate-x-2 motion-reduce:transform-none">
            -&gt;
          </span>
        </h2>
      </button>
  );
}


function BodypartButton({name, onToggleBodypart}: {name: string, onToggleBodypart: any}){
  const [isSelected, setIsSelected] = useState(false)
  function toggle(){
    onToggleBodypart(name, !isSelected)
    setIsSelected(!isSelected)
  }
  const className =  isSelected ? 'bg-gray-100 text-gray-900 border-blue-200' : 'bg-gray-900 text-gray-100 border-neutral-500'
  return(
    <button className={'rounded-[5px] m-1 p-1 border ' + className } onClick={toggle}>
      {name}
    </button>
  )
}

function ExerciseTable({ exercises, filterText, selectedBodyparts, onExerciseClick }: 
  { exercises: ExerciseWithHistory[], filterText: string, selectedBodyparts: string[], onExerciseClick: any }) {
    const exerciseButtons:JSX.Element[] = [];
    exercises.forEach((exercise) => {
      if(selectedBodyparts.length == 0 || 
        selectedBodyparts.filter(x => exercise.primaryBodyparts.includes(x) || exercise.secondaryBodyparts.includes(x)).length>0){
        if(exercise.name.toLowerCase().includes(filterText.toLowerCase())){
          exerciseButtons.push(
            <ExerciseButton exercise={exercise} key={exercise.name} onExerciseClick={onExerciseClick}/>
          );
        }
      }
    });

    return (
      <div className="mb-32 grid lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
      {exerciseButtons}
      </div>
    );
  }
  
function SearchBar({filterText, onFilterChange}: {filterText: string, onFilterChange: any}){
  return(
      <form className='m-1' >
        <input className='text-gray-100 bg-gray-800 border border-neutral-500'
          type="text" 
          placeholder="Search exercises..."
          value={filterText}
          onChange={(e) => onFilterChange(e.target.value)}/>
      </form>
    );
}

function FilterableExerciseTable({ exercises, bodyparts, onExerciseClick }: { exercises: ExerciseWithHistory[], bodyparts: string[], onExerciseClick: any}) {
  const [filterText, setFilterText] = useState('');
  const [selectedBodyparts, setSelectedBodyparts] = useState<string[]>([])

  function addOrRemoveBodypart(bodypart: string, add: boolean){
    let newBodyparts = [...selectedBodyparts]
    if(add){
      newBodyparts.push(bodypart)
    } else{
      newBodyparts = newBodyparts.filter(x => x != bodypart)
    }
    setSelectedBodyparts(newBodyparts)
    
  }
  const bodypartButtons:JSX.Element[] = [];  
  bodyparts.forEach((bodypart) => {
    bodypartButtons.push(
      <BodypartButton name={bodypart} onToggleBodypart={addOrRemoveBodypart} key={bodypart}/>
    )
  });

  return(
    <div>
      <SearchBar filterText={filterText} onFilterChange={setFilterText}/>
      {bodypartButtons}
      <ExerciseTable 
        exercises={exercises}
        filterText={filterText} 
        selectedBodyparts={selectedBodyparts}
        onExerciseClick={onExerciseClick}/>
    </div>
  )
}

function ExercisesPage({exercises, bodyparts, handleAddExerciseSets }: 
  {exercises:ExerciseWithHistory[], bodyparts: string[], handleAddExerciseSets: any}){
  const [selectedExercise, setSelectedExercise]  = useState<ExerciseWithHistory|null>(() => {
    let selectedExercise = null
    if (typeof window !== 'undefined') { 
      selectedExercise = localStorage.getItem("selectedExercise");
    }
    return selectedExercise ? JSON.parse(selectedExercise) : null;
  });

  useEffect(() => {
      localStorage.setItem("selectedExercise", JSON.stringify(selectedExercise));
    }, [selectedExercise]);

  function resetSelectedExercise(){
    setSelectedExercise(null)
  }

  return(
    <>
    {selectedExercise === null && <FilterableExerciseTable exercises={exercises} bodyparts={bodyparts} onExerciseClick={setSelectedExercise}/>}  
    {selectedExercise === null ? <></>: <ExercisePage exercise={selectedExercise} goBack={resetSelectedExercise} handleAddExerciseSets ={handleAddExerciseSets }/>} 
    </>
  )
}

function WorkoutPage(){
  return(
    "TODO: Workout page. For know, log your sets using the exercises page."
  )
}

function StatsPage(){
  return(
    "TODO: Stats page"
  )
}

function CompetitionPage(){
  return(
    "TODO: Competition page"
  )
}


function ProfilePage({logout}: {logout:any}){
  return(
    <button type="submit" 
    onClick={logout}
    className="w-full m-4 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
      Logout
  </button>
  )
}

function Content({currentPage, logout}:{currentPage: pageName, logout: any}){
  const [exercises, setExercises] = useState< ExerciseWithHistory[]>([]);
  const [bodyparts, setBodyparts] = useState<string[]>([]);

  function flattenBodyparts(bodypartsJson: any[]){
    return (
      bodypartsJson.flatMap((b) => (b.name))
    )
  }

  function fillExercises(exercisesJson: any[]){
    let exercisesToSave: ExerciseWithHistory[] = []
        exercisesJson.forEach(exercise => {
          let exerciseSets: ExerciseSet[] = []
          const exerciseSetsRaw: any[] = exercise.sets 
          exerciseSetsRaw.forEach(s => {
            const exerciseSet = new ExerciseSet(new Date(s.workout.start_time), s.weight, s.reps, s.rir, s.wilksScore)
            exerciseSets.push(exerciseSet)
          })

          const newExercise = new ExerciseWithHistory(exercise.id, 
            exercise.name, 
            flattenBodyparts(exercise.primary_bodyparts), 
            flattenBodyparts(exercise.secondary_bodyparts), 
            exercise.is_custom,
            exercise.created_by,
            exercise.shared_with,
            exerciseSets)
          exercisesToSave.push(newExercise)
      });
      setExercises(exercisesToSave);
    }

  useEffect(() => {
      fetch(`${BACKEND_URL}allbodyparts`, {
        method: 'GET',
        credentials: 'include',
      })
      .then(response => response.json())
      .then(json => flattenBodyparts(json.bodyparts))
      .then(stringArray => setBodyparts(stringArray))
      .catch(error => console.error(error));
      
      fetch(`${BACKEND_URL}userexerciseslog`, {
        method: 'GET',
        credentials: 'include',
      })
      .then(response => response.json())
      .then(json => fillExercises(json.exercises))
      .catch(error => console.error(error));
  }, []);

  function handleAddExerciseSets(exercise_id: string, newExerciseSets: ExerciseSet[]){
    const newExercises = exercises.map(exercise => {
      if (exercise.id === exercise_id){
        return {...exercise, sets: [...exercise.sets, ...newExerciseSets]};
      }
      return exercise;
    })
    setExercises(newExercises)
  }

  return(
    <div className={"absolute p-5 "} >
    {currentPage === pageName.profile && <ProfilePage  logout={logout}/>}
    {currentPage === pageName.workout && <WorkoutPage  />}
    {currentPage === pageName.exercises &&  <ExercisesPage exercises={exercises} bodyparts={bodyparts} handleAddExerciseSets ={handleAddExerciseSets}/> }
    {currentPage === pageName.stats &&  <StatsPage /> }
    {currentPage === pageName.competition &&  <CompetitionPage /> }
    </div>
  )
}

function BottomNavBar({ currentPage, showProfile, showWorkout, showExercises, showStats, showCompetition }:
  { currentPage: pageName, showProfile: any, showWorkout: any, showExercises: any, showStats: any, showCompetition: any }) {

  const pages = [
    { name: pageName.profile, action: showProfile, icon: '/icons/profile.svg' },
    { name: pageName.workout, action: showWorkout, icon: '/icons/workout.svg' },
    { name: pageName.exercises, action: showExercises, icon: '/icons/exercises.svg' },
    { name: pageName.stats, action: showStats, icon: '/icons/stats.svg' },
    { name: pageName.competition, action: showCompetition, icon: '/icons/competition.svg' },
  ];

  return (
    <div className="fixed z-50 inset-x-0 bottom-0 bg-gray-800 text-white flex justify-around items-center h-12 shadow-lg">
      {pages.map((page) => (
        <button 
          key={page.name} 
          onClick={page.action} 
          className={`flex-1 flex justify-center items-center h-full transition-all duration-300 ease-in-out
                      ${currentPage === page.name ? 'bg-gray-700 -translate-y-1 shadow-xl' : 'shadow-black'}`}
          style={{ transform: currentPage === page.name ? 'translateY(-4px) ' : 'none' }}>
            <img src={page.icon} alt={`${page.name} icon`} className="w-10 h-10" />
        </button>
      ))}
    </div>
  );
}

function LoginPage({
  onLogin, onSignUpClick}: {onLogin: (username: string, password: string) => void, onSignUpClick: any }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      onLogin(email, password);
    };
    return(
      <>
      <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="w-full max-w-xs p-9 space-y-4 rounded-lg bg-gray-800 shadow-black">
      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                className="mt-1 p-1 block w-full rounded-md bg-gray-700 border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-white" 
                placeholder="Email" required />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-1 p-1 block w-full rounded-md bg-gray-700 border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-white" 
                placeholder="Password" required />
        </div>
        <button type="submit" 
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Login
        </button>
      </form>
      <button 
        onClick={onSignUpClick}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
          No account yet? Sign up!
      </button>
    </div>
  </div>
  </>
  )
}


function SignUpPage({showLogin}:{showLogin: any}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const createUser = (event: React.FormEvent) => {
    event.preventDefault();
    const signup = async () => {
      const response = await fetch(`${BACKEND_URL}createuser`, {
        method: 'POST',
        body: String(JSON.stringify({ username, email, password })),
        headers: {
          'Content-Type': 'application/json', 
        }
      });
    
        if (response.ok) {
          alert("User profile created")
          showLogin();
        } else {
          const error = await response.json().then(x=>x.error)
          alert(error)
        }
    };
    signup()
  };

  return (
    <>
    <div className="flex justify-center items-center h-screen bg-gray-900">
    <div className="w-full max-w-xs p-9 space-y-4 rounded-lg bg-gray-800 shadow-black">
    <form onSubmit={createUser} className="space-y-4 mb-10">
    <h2 className="text-xl font-semibold text-gray-300">Sign Up</h2>
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-300">Username</label>
        <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                 className="mt-1 p-1  block w-full rounded-md bg-gray-700 border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-white" 
                 placeholder="Username" required />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                 className="mt-1 p-1  block w-full rounded-md bg-gray-700 border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-white" 
                 placeholder="Email" required />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-1 block w-full rounded-md bg-gray-700 border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-white" 
              placeholder="Password" required />
      </div>
      <button type="submit" 
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        Sign Up
      </button>
    </form>
    <button 
      onClick={showLogin}
      className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
        Return to login
    </button>
  </div>
</div>
</>

  );
}

function LoginOrSignupPage({
  onLogin,
  setIsAuthenticated
}: {
  onLogin: (username: string, password: string) => void,
  setIsAuthenticated: any
}) {
  const [signUpIsShown, setSignUpIsShown] = useState(false);

  // ByPass login if user is already authenticated (via cookie authToken)
  const userIsAuthenticated = async () => {
    fetch(`${BACKEND_URL}userisauthenticated`, {
      method: 'GET',
      credentials: 'include',
    })
    .then(response => response.json())
    .then(x => setIsAuthenticated(Boolean(x.is_authenticated)))
    .catch(error => console.error(error));
  }
  userIsAuthenticated();

  function showSignup(){
    setSignUpIsShown(true)
  }

  function showLogin(){
    setSignUpIsShown(false)
  }

  return (
    <>
    {!signUpIsShown && <LoginPage onLogin={onLogin} onSignUpClick={showSignup}/> } 
    {signUpIsShown && <SignUpPage showLogin={showLogin} />}
    </>
  );
}


export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState(pageName.exercises);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${BACKEND_URL}login`, {
      method: 'POST',
      body: String(JSON.stringify({ email, password })),
      headers: {
        'Content-Type': 'application/json', 
      },
      credentials: 'include',
    });
  
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        const error = await response.json().then(x=>x.error)
        alert(error)
      }
  };

  const logout = async () => {
    const response = await fetch(`${BACKEND_URL}logout`, {
      method: 'GET',
      credentials: 'include',
    });
    setIsAuthenticated(false);
  };

  
  function showProfile(){
    setCurrentPage(pageName.profile)
  }

  function showWorkout(){
    setCurrentPage(pageName.workout)
  }

  function showExercises(){
    setCurrentPage(pageName.exercises)
  }

  function showStats(){
    setCurrentPage(pageName.stats)
  }
  
  function showCompetition(){
    setCurrentPage(pageName.competition)
  }

  return (
    <>
      {isAuthenticated ? (
        <>
          <BottomNavBar currentPage={currentPage} showProfile={showProfile} showWorkout={showWorkout} showExercises={showExercises} showStats={showStats} showCompetition={showCompetition} />
          <Content currentPage={currentPage} logout={logout}/>
        </>
      ) : (
        <LoginOrSignupPage onLogin={login} setIsAuthenticated={setIsAuthenticated}/>
      )}
    </>
  );
}