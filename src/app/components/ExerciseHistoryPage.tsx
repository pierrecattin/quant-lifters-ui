"use client";

import { useState } from "react";
import Image from "next/image";

import { Config } from "../config"
import { ExerciseSet } from "../classes"

export function ExerciseHistoryPage({ exerciseSets, handleDeleteExerciseSets }: { exerciseSets: ExerciseSet[], handleDeleteExerciseSets: any }) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [dayToDelete, setDayToDelete] = useState('');

    const setsByDay = new Map<string, ExerciseSet[]>();
    exerciseSets.forEach(exerciseSet => {
        const date = exerciseSet.getTimeAsString();
        if (!setsByDay.get(date)) {
            setsByDay.set(date, []);
        }
        setsByDay.get(date)?.push(exerciseSet);
    });

    const daysSorted = Array.from(setsByDay.keys()).sort((a, b) => new Date(a) < new Date(b) ? 1 : -1);

    const handleDeleteConfirm = async () => {
        const setsIds = setsByDay.get(dayToDelete)?.map(set => set.id);
        if (setsIds) {
            const response = await fetch(`${Config.backendUrl}deleteexercisesets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ ids: setsIds }),
            });

            if (response.ok) {
                handleDeleteExerciseSets(setsIds)
            } else {
                alert('Failed to delete sets.');
            }
        }

        setIsDeleteModalOpen(false);
    };

    const deleteSetsOfDay = (day: string) => {
        setDayToDelete(day);
        setIsDeleteModalOpen(true);
    };

    return (
        <div className="h-screen overflow-y-scroll pb-96 mt-1">
            <ConfirmDeleteSetsOfDay isOpen={isDeleteModalOpen} day={dayToDelete} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDeleteConfirm} />
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
                                            <span>{set.reps} x {1 * set.weight}kg with {set.rir} RiR - Wilks: {1 * set.wilks}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            {setsByDay.size === 0 && (
                <span className="text-gray-200 mx-5">Not performed yet </span>)}
        </div>
    );
}

function ConfirmDeleteSetsOfDay({ isOpen, day, onClose, onConfirm }: { day: string, isOpen: boolean, onClose: any, onConfirm: any }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-10 rounded-lg text-black">
                <p className="m-5">Are you sure you want to delete the sets of {day}?</p>
                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="bg-gray-900 rounded-lg text-white p-4">Cancel</button>
                    <button onClick={onConfirm} className="bg-red-950 rounded-lg text-white p-4">Confirm</button>
                </div>
            </div>
        </div>
    );
}