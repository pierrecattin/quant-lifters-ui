import React, { useState } from 'react';
import Image from 'next/image';

import { Config } from "../config"
import { ExerciseFamily, ExerciseWithHistory } from '../classes';
import { InfoButton } from './InfoButton'
import { InfoModal } from './InfoModal';
import { LoadingModal } from './LoadingModal';

export function ExerciseCreatorPage({ goBack, exerciseFamilies, handleAddExercise }: { goBack: any, exerciseFamilies: ExerciseFamily[], handleAddExercise: any }) {
    const [exerciseTitle, setExerciseTitle] = useState("");
    const [selectedFamily, setSelectedFamily] = useState<ExerciseFamily | undefined>(undefined);
    const [isUnilateral, setIsUnilateral] = useState(false);
    const [weightFactor, setWeightFactor] = useState(1);
    const [bodyweightInclusionFactor, setBodyweightInclusionFactor] = useState(0);
    const [infoModalMessage, setInfoModalMessage] = useState<string | undefined>(undefined);
    const [showLoadingModal, setShowLoadingModal] = useState(false);

    function changeSelectedFamily(id: string) {
        const s = exerciseFamilies.find(family => family.id == id)
        setSelectedFamily(s);
    }

    async function handleSave() {
        if (exerciseTitle === "") {
            setInfoModalMessage("Please enter a name for the new exercise.");
            return;
        }
        if (selectedFamily === undefined) {
            setInfoModalMessage("Please select an exercise family.");
            return;
        }

        const body = {
            name: exerciseTitle,
            family_id: selectedFamily.id,
            is_unilateral: isUnilateral,
            weight_factor: weightFactor,
            bodyweight_inclusion_factor: bodyweightInclusionFactor,
        };


        setShowLoadingModal(true)
        const response = await fetch(`${Config.backendUrl}createcustomexercise`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(body),
        });
        setShowLoadingModal(false)
        if (response.ok) {
            setInfoModalMessage("Exercise saved.");
            const newExerciseJson: any = await response.json()
            const newExercise = new ExerciseWithHistory(newExerciseJson.id,
                newExerciseJson.name,
                newExerciseJson.weight_factor,
                newExerciseJson.bodyweight_inclusion_factor,
                newExerciseJson.is_unilateral,
                newExerciseJson.is_custom,
                newExerciseJson.created_by.username,
                newExerciseJson.shared_with,
                []
            )
            handleAddExercise(newExercise, selectedFamily.id);
            goBack();
        } else if(response.status===409){
            console.log(response)
            setInfoModalMessage(`Failed to save the exercise. ${(await response.json())?.error}`);
        } else {
            setInfoModalMessage("Failed to save the exercise. Check your connection and retry later.");
        }
    }

    function handleInfo(fieldName: string) {
        let message = '';
        switch (fieldName) {
            case 'is_unilateral':
                message = 'Unilateral exercises, such as one-arm biceps curls, work one side of the body per set. Entering three sets in a template means that during the workout, you will log a total of six sets: three for each half of your body.';
                break;
            case 'weight_factor':
                message = 'The weight factor multiplies the input weight for volume calculations. Set it to 100% for exercises like barbell curls, and 200% for bilateral dumbbell exercises. Thus, if you use 10kg dumbbells, simply enter 10kg, and the system will calculate the volume using a total load of 20kg.';
                break;
            case 'bodyweight_inclusion_factor':
                message = 'The bodyweight inclusion factor specifies the percentage of your bodyweight to be considered in 1RM and volume calculations. For exercises that do not incorporate bodyweight, like bench press, set it to 0%. For bodyweight exercises, such as pull-ups, set it to 100%. For instance, if you perform pull-ups with an additional 10kg weight and your bodyweight is 80kg, the system will automatically use a total load of 90kg.';
                break;
        }
        setInfoModalMessage(message);
    }

    return (
        <>
            <div className="flex justify-between shadow-black shadow-lg px-4 py-2 rounded-lg">
                <button onClick={goBack}>
                    <Image src="/icons/cross.svg" alt="Exit" width={24} height={24} />
                </button>
                <input
                    className="bg-gray-900 text-white px-1 py-2"
                    placeholder="New exercise"
                    value={exerciseTitle}
                    onChange={(e) => setExerciseTitle(e.target.value)}
                />
                <button onClick={handleSave} className="hover:text-blue-200">
                    SAVE
                </button>
            </div>
            <div className="flex items-center">
                <select
                    value={selectedFamily?.id}
                    onChange={(e) => changeSelectedFamily(e.target.value)}
                    className="bg-gray-800 text-white px-1 py-2 rounded-lg mb-2 mt-7 overflow-auto max-h-60">
                    <option value="">Select Exercise Family</option>
                    {exerciseFamilies.map((family) => (
                        <option key={family.id} value={family.id}>
                            {family.name}
                        </option>
                    ))}
                </select>
                <button
                    className="mt-5 ml-3 h-6 w-6 flex justify-center items-center rounded-full bg-green-950 border border-green-800 shadow-black shadow-lg text-white text-xl hover:bg-green-800"
                    onClick={() => alert("TODO: exercise family creator")}>
                    <Image
                        src="icons/plus.svg"
                        alt="Add"
                        width={12}
                        height={12}
                    />
                </button>
            </div>
            {selectedFamily !== undefined && (
                <div>
                    <p>{`Primary bodypart${selectedFamily.primaryBodyparts.length > 1 ? "s" : ""}`}: {selectedFamily.primaryBodyparts.join(', ')}</p>
                    {selectedFamily.secondaryBodyparts.length > 0 &&
                        <p>{`Secondary bodypart${selectedFamily.secondaryBodyparts.length > 1 ? "s" : ""}`}: {selectedFamily.secondaryBodyparts.join(', ')}</p>}
                </div>
            )}
            <div className="flex items-center my-2 mt-4">
                <label className="flex items-center">
                    Unilateral:
                    <div className="relative mx-2">
                        <input
                            id="isUnilateralCheckbox"
                            type="checkbox"
                            className="sr-only"
                            checked={isUnilateral}
                            onChange={(e) => setIsUnilateral(e.target.checked)}
                        />
                        <div className="block bg-gray-800 w-6 h-6 rounded-md border-2 border-gray-700">
                            {isUnilateral && <span className="flex items-center justify-center text-white">✓</span>}
                        </div>
                    </div>
                    <InfoButton onClick={() => handleInfo('is_unilateral')} />
                </label>
            </div>
            <div className="flex items-center my-2">
                <span>Weight Factor (%):</span>
                <input
                    className="rounded-lg bg-gray-800 text-white py-1 px-2 mx-2 w-12"
                    type="number"
                    value={weightFactor * 100}
                    onChange={(e) => setWeightFactor(Number(e.target.value) / 100)}
                />
                <InfoButton onClick={() => handleInfo('weight_factor')} />
            </div>
            <div className="flex items-center my-2">
                <span>Bodyweight Inclusion Factor (%):</span>
                <input
                    className="rounded-lg bg-gray-800 text-white py-1 px-2 mx-2 w-12"
                    type="number"
                    value={bodyweightInclusionFactor * 100}
                    onChange={(e) => setBodyweightInclusionFactor(Number(e.target.value) / 100)}
                    min="0"
                    max="100"
                />
                <InfoButton onClick={() => handleInfo('bodyweight_inclusion_factor')} />
            </div>
            {infoModalMessage !== undefined && <InfoModal message={infoModalMessage} onClose={() => setInfoModalMessage(undefined)} />}
            {showLoadingModal && <LoadingModal message="Saving exercise..." />}
        </>
    );
}