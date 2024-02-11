"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const BACKEND_URL = process.env.NEXT_PUBLIC_QUANT_LIFTERS_BACKEND_URL

class Exercise {
  name: string;
  primaryBodyparts: string[];
  secondaryBodyparts: string[]; 
  lastDayPerformed?: Date;
  isCustom: boolean;
 
  constructor(name: string, primaryBodyparts: string[], secondaryBodyparts: string[], isCustom: boolean, lastDayPerformed?: Date) {
    this.name = name;
    this.primaryBodyparts = primaryBodyparts;
    this.secondaryBodyparts = secondaryBodyparts;
    this.isCustom = isCustom;
    this.lastDayPerformed = lastDayPerformed;
  }
}


function ExercisePage({ exercise, goBack}: {exercise: Exercise, goBack:any}){
  const primary_bodyparts = "Primary bodypart" + (exercise.primaryBodyparts.length>1 ? "s": "") + ": " + exercise.primaryBodyparts.join(", ")
  const secondary_bodyparts = exercise.secondaryBodyparts.length == 0 ? "": "Secondary bodypart" + (exercise.secondaryBodyparts.length>1 ? "s": "") + ": " + exercise.secondaryBodyparts.join(", ")
  return(
    <>
    <span
      className="mr-4 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-gray-300">
      <button onClick={goBack}>
        <Image
        src="/return_arrow.svg"
        alt="Return"
        width={50}
        height={50}
        priority
      />
      </button>
    </span>
    <br/>
    {primary_bodyparts}
    <br/>
    {secondary_bodyparts}
    </>
  )
}

function ExerciseButton({ exercise, onExerciseClick }: {exercise: Exercise, onExerciseClick: any}) {
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
        <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
          {exercise.lastDayPerformed?.toDateString()}
        </p>
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
  { exercises: Exercise[], filterText: string, selectedBodyparts: string[], onExerciseClick: any }) {
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

function FilterableExerciseTable({ exercises, bodyparts, onExerciseClick }: { exercises: Exercise[], bodyparts: string[], onExerciseClick: any}) {
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

function Train(){
  const [selectedExercise, setSelectedExercise] = useState<Exercise|undefined>(undefined)
  const [exercises, setExercises] = useState< Exercise[]>([]);
  const [bodyparts, setBodyparts] = useState<string[]>([]);

  function fillExercises(exercisesJson: any[]){
    let exercisesToSave: Exercise[] = []
    exercisesJson.forEach(exercise => {
      const newExercise = new Exercise(exercise.name, exercise.primary_bodyparts, exercise.secondary_bodyparts, false)
      exercisesToSave.push(newExercise)
    });
    setExercises(exercisesToSave);
  }

  function resetSelectedExercise(){
    setSelectedExercise(undefined)
  }

  useEffect(() => {
      fetch(`${BACKEND_URL}allbodyparts/`, {
        method: 'GET',
        credentials: 'include',
      })
      .then(response => response.json())
      .then(json => setBodyparts(json.bodyparts))
      .catch(error => console.error(error));
      
      fetch(`${BACKEND_URL}allexercises/`, {
        method: 'GET',
        credentials: 'include',
      })
      .then(response => response.json())
      .then(json => fillExercises(json))
      .catch(error => console.error(error));
  }, []);


  return(
    <>
    {selectedExercise === undefined && <FilterableExerciseTable exercises={exercises} bodyparts={bodyparts} onExerciseClick={setSelectedExercise}/>}  
    {selectedExercise == undefined ? <></>: <ExercisePage exercise={selectedExercise} goBack={resetSelectedExercise}/>} 
    </>
  )
}

function Stats(){
  return(
    "Stats"
  )
}

function Config(){
  return(
    "Config"
  )
}

function Content({currentPage, leftPos}:{currentPage: string, leftPos:string}){
  return(
    <div className={"absolute px-5 "+leftPos} >
    {currentPage === 'train' && <Train  />}
    {currentPage === 'stats' &&  <Stats /> }
    {currentPage === 'config' &&  <Config /> }
    </div>
  )
}

function SideNav({showTrain, showStats, showConfig}:{showTrain: any, showStats:any, showConfig: any}){
  return(
    <nav
        id="sidenav-1"
        className="absolute left-0 top-0 z-[1035] h-full w-60 -translate-x-full overflow-hidden shadow-[0_4px_12px_0_rgba(0,0,0,0.07),_0_2px_4px_rgba(0,0,0,0.05)] data-[te-sidenav-hidden='false']:translate-x-0 bg-zinc-800"
        data-te-sidenav-init
        data-te-sidenav-hidden="false"
        data-te-sidenav-position="absolute">
      <ul className="relative m-0 list-none px-[0.2rem]" data-te-sidenav-menu-ref>
        <li className="relative">
          <a
            className="flex h-12 cursor-pointer items-center truncate rounded-[5px] px-6 py-4 text-[0.875rem] outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none text-gray-300 hover:bg-white/10 focus:bg-white/10 active:bg-white/10"
            data-te-sidenav-link-ref
            onClick={showTrain}>
            <span>Train</span>
          </a>
        </li>
        <li className="relative">
          <a
            className="flex h-12 cursor-pointer items-center truncate rounded-[5px] px-6 py-4 text-[0.875rem] outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none text-gray-300 hover:bg-white/10 focus:bg-white/10 active:bg-white/10"
            data-te-sidenav-link-ref
            onClick={showStats}>
            <span>Stats</span>
          </a>
        </li>
        <li className="relative">
          <a
            className="flex h-12 cursor-pointer items-center truncate rounded-[5px] px-6 py-4 text-[0.875rem] outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none text-gray-300 hover:bg-white/10 focus:bg-white/10 active:bg-white/10"
            data-te-sidenav-link-ref
            onClick={showConfig}>
            <span
              className="mr-4 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-gray-300">
              <Image
                src="/cogwheel.svg"
                alt="Settings"
                width={25}
                height={25}
                priority
              />
            </span>
          </a>
        </li>
      </ul>
    </nav> 
  )
}

function SideNavButton({toggleSideNav}: {toggleSideNav: any}){
  return(
    <button
        className="inline-block rounded bg-primary px-2 py-2.5 text-xs font-medium uppercase leading-tight text-white transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg z-[1036]"
       onClick={toggleSideNav}>
    <span className="block [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-white">
      <Image
        src="/sandwich.svg"
        alt="Settings"
        width={25}
        height={25}
      />
    </span>
    </button>
  )
}

function LoginPage({ onLogin }: { onLogin: (username: string, password: string) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onLogin(username, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState("blank");
  const [showSideNav, setShowSideNav] = useState(true);

  const login = async (username: string, password: string) => {
    const response = await fetch(`${BACKEND_URL}api-token-auth/`, {
      method: 'POST',
      body: String(JSON.stringify({ username, password })),
      headers: {
        'Content-Type': 'application/json', 
      },
      credentials: 'include',
    });
  
    if (response.ok) {
      setIsAuthenticated(true);
    } else {
      alert('Login failed');
    }
  };

  function showTrain(){
    setCurrentPage("train")
    setShowSideNav(false)
  }

  function showConfig(){
    setCurrentPage("config")
    setShowSideNav(false)
  }

  function showStats(){
    setCurrentPage("stats")
    setShowSideNav(false)
  }

  function toggleSideNav(){
    setShowSideNav(!showSideNav)
  }

  return (
    <>
      {isAuthenticated ? (
        <>
          {showSideNav && <SideNav showTrain={showTrain} showStats={showStats} showConfig={showConfig} />}
          {!showSideNav && <SideNavButton toggleSideNav={toggleSideNav} />}
          <Content currentPage={currentPage} leftPos={showSideNav ? "left-60" : "left-0"}/>
        </>
      ) : (
        <LoginPage onLogin={login} />
      )}
    </>
  );
}