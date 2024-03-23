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

export interface IRanking {
  label: string;
  scoreLabel: string;
  users: string[];
  scores: number[];
  details?: string[];
  detailsLabel?: string;
}

export function RankingTables({ rankings }:
  { rankings: Array<IRanking>}){
  return (
    <>
      <div className="h-screen overflow-y-scroll pb-96 mt-1">
        <div className="me-12">
            {rankings.map(ranking => (
              <div key={ranking.label} className="bg-gray-800 border border-gray-200 rounded-lg p-4 mb-4">
                <div className="text-lg font-bold flex justify-between items-center">
                  {ranking.label}
                </div>
                <div className="text-sm flex justify-between items-center">
                  {ranking.scoreLabel}
                </div>
                <div>
                  <table className="text-sm">
                    <tbody>
                      {ranking.users.map((user, index) => (
                        <tr key={index} >
                          <td className="text-right">
                            {index+1}.
                          </td>
                          <td className="px-1 text-left">
                            {user}
                          </td>
                          <td className="px-2 text-right">
                            {ranking.scores[index]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  )
}