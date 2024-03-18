"use client";
import { useState } from "react";
import Image from "next/image";

import { ExerciseWithHistory } from "../classes"

export function ExerciseCreatorPage({ goBack, bodyparts }: { goBack: any, bodyparts: string[] }) {
    const [exerciseTitle, setExerciseTitle] = useState("");

    function handleSave() {
        if (exerciseTitle === "") {
            alert("Please enter a name for this new exercise.")
        }
        alert("TODO")
    }
    return (
        <div className="flex justify-between shadow-black shadow-lg px-4 py-2 rounded-lg">
            <button onClick={goBack}>
                <Image
                    src="/icons/cross.svg"
                    alt="Exit"
                    width={24}
                    height={24}
                />
            </button>
            <input className="bg-gray-900 text-white px-1 py-2"
                placeholder="New exercise"
                onChange={(e) => setExerciseTitle(e.target.value)}></input>
            <button
                onClick={handleSave}
                className="hover:text-blue-200">
                SAVE
            </button>
        </div>
    )
}