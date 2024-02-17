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

enum pageName {
  profile,
  workout,
  exercises,
  stats,
  competition,
}



function ExerciseTrack(){
  return(
    <div className="relative" >
    track
    </div>
  )
} 

function ExerciseHistory(){
  return(
    "history"
  )
} 

function ExerciseDetails(){
  return(
    "details"
  )
} 

function ExercisePage({ exercise, goBack}: {exercise: Exercise, goBack:any}){ 
  enum exerciseSubPageName {
    track = "Track",
    history = "History",
    details = "Details",
  }
  const [currentExerciseSubpage, setCurrentExerciseSubpage] = useState(exerciseSubPageName.track);
  
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


  return(
    <div className ="z-40 fixed w-full">
      <div className = "top-0">
        <div>
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
          <span className="text-lg mx-7">
            {exercise.name} 
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
        {currentExerciseSubpage === exerciseSubPageName.track && <ExerciseTrack  />}
        {currentExerciseSubpage === exerciseSubPageName.history && <ExerciseHistory />}
        {currentExerciseSubpage === exerciseSubPageName.details && <ExerciseDetails />}
      </div>
    </div>
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

function Exercises({exercises, bodyparts}: {exercises:Exercise[], bodyparts: string[]}){
  const [selectedExercise, setSelectedExercise] = useState<Exercise|undefined>(undefined)

  function resetSelectedExercise(){
    setSelectedExercise(undefined)
  }

  return(
    <>
    {selectedExercise === undefined && <FilterableExerciseTable exercises={exercises} bodyparts={bodyparts} onExerciseClick={setSelectedExercise}/>}  
    {selectedExercise == undefined ? <></>: <ExercisePage exercise={selectedExercise} goBack={resetSelectedExercise}/>} 
    </>
  )
}

function Workout(){
  return(
    "Workout page. For know, log your sets using the exercises page"
  )
}

function Stats(){
  return(
    "Stats page"
  )
}

function Competition(){
  return(
    "Competition page"
  )
}


function Profile({logout}: {logout:any}){
  return(
    <button type="submit" 
    onClick={logout}
    className="w-full m-4 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
      Logout
  </button>
  )
}

function Content({currentPage, logout}:{currentPage: pageName, logout: any}){
  const [exercises, setExercises] = useState< Exercise[]>([]);
  const [bodyparts, setBodyparts] = useState<string[]>([]);

  function flattenBodyparts(bodypartsJson: any[]){
    return (
      bodypartsJson.flatMap((b) => (b.name))
    )
  }

  function fillExercises(exercisesJson: any[]){
    let exercisesToSave: Exercise[] = []
    exercisesJson.forEach(exercise => {
        const newExercise = new Exercise(exercise.name, flattenBodyparts(exercise.primary_bodyparts), flattenBodyparts(exercise.secondary_bodyparts), false)
        exercisesToSave.push(newExercise)
      });
      setExercises(exercisesToSave);
    }



  useEffect(() => {
      fetch(`${BACKEND_URL}allbodyparts/`, {
        method: 'GET',
        credentials: 'include',
      })
      .then(response => response.json())
      .then(json => flattenBodyparts(json.bodyparts))
      .then(stringArray => setBodyparts(stringArray))
      .catch(error => console.error(error));
      
      fetch(`${BACKEND_URL}allexercises/`, {
        method: 'GET',
        credentials: 'include',
      })
      .then(response => response.json())
      .then(json => fillExercises(json.exercises))
      .catch(error => console.error(error));
  }, []);

  return(
    <div className={"absolute p-5 "} >
    {currentPage === pageName.profile && <Profile  logout={logout}/>}
    {currentPage === pageName.workout && <Workout  />}
    {currentPage === pageName.exercises &&  <Exercises exercises={exercises} bodyparts={bodyparts}/> }
    {currentPage === pageName.stats &&  <Stats /> }
    {currentPage === pageName.competition &&  <Competition/> }
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
  const [isAuthenticated, setIsAuthenticated] = useState(true);
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