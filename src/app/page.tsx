"use client";

import { useState } from 'react';
import Image from "next/image";

class Exercise {
  name: string;
  primaryBodyparts: string[];
  secondaryBodyparts: string[]; 
  lastDayPerformed?: Date;
 
  constructor(name: string, primaryBodyparts: string[], secondaryBodyparts: string[], lastDayPerformed?: Date) {
    this.name = name;
    this.primaryBodyparts = primaryBodyparts;
    this.secondaryBodyparts = secondaryBodyparts;
    this.lastDayPerformed = lastDayPerformed;
  }
}

function ExerciseButton({ exercise }: {exercise: Exercise}) {
  return (
    <a className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
        <h2 className={`mb-3 text-2xl font-semibold`}>
          {exercise.name}{" "}
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
            -&gt;
          </span>
        </h2>
        <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
          {exercise.lastDayPerformed?.toDateString()}
        </p>
      </a>
  );
}

  function ExerciseTable({ exercises }: { exercises: Exercise[] }) {
    const rows:JSX.Element[] = [];  
    exercises.forEach((exercise) => {
      rows.push(
        <ExerciseButton
          exercise={exercise}/>
      );
    });

    return (
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
      {rows}
      </div>
    );
  }
  

function Train(){
  const e1 = new Exercise("bench", ["chest"], [], new Date("2024-01-30"))
  const e2 = new Exercise("squat", ["quads"], [])
  const exercises = [e1, e2]
  return(
    <ExerciseTable exercises={exercises} />
  )
}

function Stats(){
  return(
    "Some stats"
  )
}

function Config(){
  return(
      "Some config"
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