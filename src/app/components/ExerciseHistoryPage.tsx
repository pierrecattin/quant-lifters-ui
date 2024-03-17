"use client";

import { useState } from "react";
import Image from "next/image";

import { Config } from "../config"
import { ExerciseSetForExerciseLog } from "../classes"
import { LoadingModal } from "./LoadingModal";
import { InfoModal } from "./InfoModal";
import { YesNoModal } from "./YesNoModal";

export function ExerciseHistoryPage({ exerciseSets, handleDeleteExerciseSets }: { exerciseSets: ExerciseSetForExerciseLog[], handleDeleteExerciseSets: any }) {
    const [dayToDelete, setDayToDelete] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showLoadingModal, setShowLoadingModal] = useState(false);

    const setsByDay = new Map<string, ExerciseSetForExerciseLog[]>();
    exerciseSets.forEach(exerciseSet => {
        const date = exerciseSet.getTimeAsString();
        if (!setsByDay.get(date)) {
            setsByDay.set(date, []);
        }
        setsByDay.get(date)?.push(exerciseSet);
    });

    const daysSorted = Array.from(setsByDay.keys()).sort((a, b) => new Date(a) < new Date(b) ? 1 : -1);

    const handleDeleteConfirm = async () => {
        setShowDeleteModal(false);
        const setsIds = setsByDay.get(dayToDelete)?.map(set => set.id);
        if (setsIds) {
            setShowLoadingModal(true)
            const response = await fetch(`${Config.backendUrl}deleteexercisesets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ ids: setsIds }),
            });
            setShowLoadingModal(false);

            if (response.ok) {
                handleDeleteExerciseSets(setsIds)
            } else {
                alert('Failed to delete sets.');
            }
        }
    };

    const deleteSetsOfDay = (day: string) => {
        setDayToDelete(day);
        setShowDeleteModal(true);
    };

    return (
        <div className="h-screen overflow-y-scroll pb-96 mt-1">
            {setsByDay.size > 0 && (
                <div className="me-12">
                    {daysSorted.map(day => {
                        const daySets = setsByDay.get(day) ?? [];
                        return (
                            <div key={day} className="bg-gray-800 border border-gray-200 rounded-lg p-4 mb-4">
                                <div className="text-lg font-bold flex justify-between items-center">
                                    <span>{day}</span>
                                    <span className="">
                                        <button onClick={() => deleteSetsOfDay(day)}>
                                            <Image
                                                src="icons/bin.svg"
                                                alt="Delete"
                                                width={20}
                                                height={20}
                                            />
                                        </button>
                                    </span>
                                </div>
                                <div>
                                    {daySets.map((set, index) => (
                                        <div key={index} className="">
                                            <span>{set.reps} x {1 * set.weight}kg with {set.rir}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            {
                setsByDay.size === 0 && (
                    <span className="text-gray-200 mx-5">Not performed yet </span>)}
            {
                showDeleteModal && <YesNoModal 
                message={`Are you sure you want to delete the sets of ${dayToDelete}? This cannot be undone.`}
                warning="" 
                onNo={() => setShowDeleteModal(false)} 
                onYes={handleDeleteConfirm}
                yesVerb="delete"
                noVerb="go back" 
                yesColor="bg-red-950 "/>
            }
            {
                showLoadingModal &&
                <LoadingModal message="Deleting sets..." />
            }
            {
                showErrorModal &&
                <InfoModal message="Failed to delete sets. Check your connection and try again later." onClose={() => setShowErrorModal(false)} />
            }
        </div>
    );
}