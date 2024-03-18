"use client";

import { Config } from "../config"
import React, {useState} from "react";

export function CompetitionPage() {

    const [rankingData, setRankingData] = useState(null)
    const loadRankings = async () => {
        const response = await fetch(`${Config.backendUrl}allrankings`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(response => response.json())
            .then(json => setRankingData(json))
            .catch(error => console.error(error));
    };
    
    return (
        <>
            <button type="submit"
                onClick={loadRankings}
                className="m-4 py-2 px-4 rounded-md shadow-lg shadow-black text-sm font-medium text-white bg-purple-600 hover:bg-purple-700">
                Load Rankings
            </button>
            <div>
                <pre>
                    {JSON.stringify(rankingData, null, '\t')}
                </pre>
            </div>
        </>
    )
}
