"use client";

import { Config } from "../config"
import React, {useState} from "react";

import {IRanking, RankingTables} from "./LeaderboardPage"

export function LeaderboardRankingsPage() {


    const [rankings, setRankings] = useState<Array<IRanking>>([])
    
    function fillRankings (rankingsJson: any[]){
        const rankingsToSave : Array<IRanking> = rankingsJson.map((json) => JSON.parse(JSON.stringify(json)));
        setRankings(rankingsToSave);
    }

    const loadRankings = async () => {
        const response = await fetch(`${Config.backendUrl}allrankings`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(response => response.json())
            .then(json => fillRankings(json.rankings))
            .catch(error => console.error(error));
    };
    

    return (
        <>
            <button type="submit"
                onClick={loadRankings}
                className="m-4 py-2 px-4 rounded-md shadow-lg shadow-black text-sm font-medium text-white bg-purple-600 hover:bg-purple-700">
                Load Rankings
            </button>
            <RankingTables rankings={rankings} />
        </>
    )
}
