"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

import { ExerciseFamily } from "../classes"

import { LeaderboardRankingsPage } from "./LeaderboardRankingsPage"
import { LeaderboardCompetitionPage } from "./LeaderboardCompetitionPage"
import { LeaderboardExercisePage } from "./LeaderboardExercisePage"



export function LeaderboardPage({ exerciseFamilies, bodyparts }:
  { exerciseFamilies: ExerciseFamily[], bodyparts: string[] }) {
    enum leaderboardSubPageName {
      rankings = "Rankings",
      competition = "Competition",
      exercise = "Exercise",
  }

  const [leaderboardSubpage, setLeaderboardSubpage] = useState(leaderboardSubPageName.rankings);
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


  function showRankings() {
    setLeaderboardSubpage(leaderboardSubPageName.rankings)
  }

  function showCompetition() {
    setLeaderboardSubpage(leaderboardSubPageName.competition)  
  }

  function showExercise() {
    setLeaderboardSubpage(leaderboardSubPageName.exercise)  
  }

  const pages = [
    { name: leaderboardSubPageName.rankings, action: showRankings },
    { name: leaderboardSubPageName.competition, action: showCompetition },
    { name: leaderboardSubPageName.exercise, action: showExercise },
  ];

  return (
    <div className="z-40 fixed w-full">
      <div className="top-0">
        <div className="inset-x-0 flex justify-around items-center h-12  ">
          {pages.map((page) => (
            <button
              key={page.name}
              onClick={page.action}
              className={`flex-1 flex justify-center items-center h-full shadow-md
            ${leaderboardSubpage === page.name ? ' border-b border-white text-white' : ' text-slate-500'}`}>
              {page.name}
            </button>
          ))}
        </div>
      </div>
      <div>
        {leaderboardSubpage === leaderboardSubPageName.rankings && <LeaderboardRankingsPage />}
        {leaderboardSubpage === leaderboardSubPageName.competition && <LeaderboardCompetitionPage />}
        {leaderboardSubpage === leaderboardSubPageName.exercise && <LeaderboardExercisePage  exerciseFamilies={exerciseFamilies} bodyparts={bodyparts} />}
      </div>
    </div>
  );
}