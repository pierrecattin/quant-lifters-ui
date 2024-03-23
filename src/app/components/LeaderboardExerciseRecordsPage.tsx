"use client";

import { ExerciseWithHistory } from "../classes"

import {IRanking, RankingTables} from "./LeaderboardPage"

import Image from "next/image";

export function LeaderboardExerciseRecordsPage({ exercise, rankings, goBack }:
  { exercise: ExerciseWithHistory, rankings: Array<IRanking>, goBack: any}) {
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
          <span className="text-lg">

          </span>
        </div>
        <div>
          <RankingTables rankings={rankings} />
        </div>
      </div>
    </div>
  )
}
