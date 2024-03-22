"use client";

import { Config } from "../config"
import React, {useState} from "react";

interface IRanking {
    label: string;
    scoreLabel: string;
    users: string[];
    scores: number[];
    details?: string[];
    detailsLabel?: string;
}

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
