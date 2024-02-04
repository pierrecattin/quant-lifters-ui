"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const BACKEND_URL = "https://quant-lifters.onrender.com/trainer/"

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

function ExerciseButton({ exercise }: {exercise: Exercise}) {
  return (
    <button className="group m-1 rounded-lg border border-gray-500 px-5 py-4 transition-colors bg-gray-900 hover:border-red-700 hover:bg-neutral-800/50">
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

function ExerciseTable({ exercises, filterText, selectedBodyparts }: { exercises: Exercise[], filterText: string, selectedBodyparts: string[] }) {
    const exerciseButtons:JSX.Element[] = [];
    exercises.forEach((exercise) => {
      if(selectedBodyparts.length == 0 || 
        selectedBodyparts.filter(x => exercise.primaryBodyparts.includes(x) || exercise.secondaryBodyparts.includes(x)).length>0){
        if(exercise.name.toLowerCase().includes(filterText.toLowerCase())){
          exerciseButtons.push(
            <ExerciseButton exercise={exercise} key={exercise.name}/>
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

function FilterableExerciseTable({ exercises, bodyparts }: { exercises: Exercise[], bodyparts: string[]}) {
  const [filterText, setFilterText] = useState('');
  const initSelectedBodyparts: string[] = []
  const [selectedBodyparts, setSelectedBodyparts] = useState(initSelectedBodyparts)

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
        selectedBodyparts={selectedBodyparts}/>
    </div>
  )
}

function Train(){
  const initExercises: Exercise[] = []
  const initBodyparts: string[] = []
  const [exercises, setExercises] = useState(initExercises);
  const [bodyparts, setBodyparts] = useState(initBodyparts)

  function fillExercises(exercisesJson: any[]){
    let exercisesToSave: Exercise[] = []
    exercisesJson.forEach(exercise => {
      const newExercise = new Exercise(exercise.name, exercise.primary_bodyparts, exercise.secondary_bodyparts, false)
      console.log(newExercise)
      exercisesToSave.push(newExercise)
    });
    setExercises(exercisesToSave);
  }

  useEffect(() => {
    fetch(BACKEND_URL+"allbodyparts/")
      .then(response => response.json())
      .then(json => setBodyparts(json.bodyparts))
      .catch(error => console.error(error));

    fetch(BACKEND_URL+"allexercises/")
      .then(response => response.json())
      .then(json => fillExercises(json))
      .catch(error => console.error(error));
  }, []);


  return(
    <FilterableExerciseTable exercises={exercises} bodyparts={bodyparts}  />
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
        className="absolute left-0 top-0 z-[1035] h-full w-60 -translate-x-full overflow-hidden bg-white shadow-[0_4px_12px_0_rgba(0,0,0,0.07),_0_2px_4px_rgba(0,0,0,0.05)] data-[te-sidenav-hidden='false']:translate-x-0 dark:bg-zinc-800"
        data-te-sidenav-init
        data-te-sidenav-hidden="false"
        data-te-sidenav-position="absolute">
      <ul className="relative m-0 list-none px-[0.2rem]" data-te-sidenav-menu-ref>
        <li className="relative">
          <a
            className="flex h-12 cursor-pointer items-center truncate rounded-[5px] px-6 py-4 text-[0.875rem] text-gray-600 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
            data-te-sidenav-link-ref
            onClick={showTrain}>
            <span>Train</span>
          </a>
        </li>
        <li className="relative">
          <a
            className="flex h-12 cursor-pointer items-center truncate rounded-[5px] px-6 py-4 text-[0.875rem] text-gray-600 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
            data-te-sidenav-link-ref
            onClick={showStats}>
            <span>Stats</span>
          </a>
        </li>
        <li className="relative">
          <a
            className="flex h-12 cursor-pointer items-center truncate rounded-[5px] px-6 py-4 text-[0.875rem] text-gray-600 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
            data-te-sidenav-link-ref
            onClick={showConfig}>
            <span
              className="mr-4 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-gray-400 dark:[&>svg]:text-gray-300">
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

export default function Home() {
  const [currentPage, setCurrentPage] = useState("blank");
  const [showSideNav, setShowSideNav] = useState(true);

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

  return(
    <>
      {showSideNav && <SideNav showTrain={showTrain} showStats={showStats} showConfig={showConfig} />}
      {!showSideNav && <SideNavButton toggleSideNav={toggleSideNav} />}
      <Content currentPage={currentPage} leftPos={showSideNav ? "left-60" : "left-0"}/>
    </>
  )
}