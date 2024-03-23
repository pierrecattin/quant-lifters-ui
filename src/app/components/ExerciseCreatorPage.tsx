import React, { useState } from 'react';
import Image from 'next/image';
import { ExerciseFamily } from '../classes';
import { InfoButton } from './InfoButton'
import { InfoModal } from './InfoModal';

export function ExerciseCreatorPage({ goBack, exerciseFamilies }: { goBack: any, exerciseFamilies: ExerciseFamily[] }) {
    const [exerciseTitle, setExerciseTitle] = useState("");
    const [selectedFamily, setSelectedFamily] = useState<ExerciseFamily | undefined>(undefined);
    const [isUnilateral, setIsUnilateral] = useState(false);
    const [weightFactor, setWeightFactor] = useState(1);
    const [bodyweightInclusionFactor, setBodyweightInclusionFactor] = useState(0);
    const [infoModalMessage, setInfoModalMessage] = useState<string | undefined>(undefined);

    function changeSelectedFamily(id: string) {
        const s = exerciseFamilies.find(family => family.id == id)
        setSelectedFamily(s);
    }

    async function handleSave() {
        if (exerciseTitle === "") {
            alert("Please enter a name for the new exercise.");
            return;
        }
        if (selectedFamily === undefined) {
            alert("Please select an exercise family.");
            return;
        }

        const exerciseData = {
            name: exerciseTitle,
            exercise_family_id: selectedFamily.id,
            is_unilateral: isUnilateral,
            weight_factor: weightFactor,
            bodyweight_inclusion_factor: bodyweightInclusionFactor,
        };

        alert("TODO");
    }

    function handleInfo(fieldName: string) {
        let message = '';
        switch (fieldName) {
            case 'is_unilateral':
                message = 'For unilateral exercises (e.g. one arm biceps curl), one set is for one half of the body. Entering three sets in a template means that during the workout, you be able to log three sets per body half.';
                break;
            case 'weight_factor':
                message = 'The weight factor is used to multiply the input weight for volume calculations. Set it to 100% for e.g. barbell exercises, and 200% for bilateral dumbbell exercises. This way if you use 10kg dumbbells, you can simply enter 10kg, but the volume calculations will know that the total weight is 20kg.';
                break;
            case 'bodyweight_inclusion_factor':
                message = 'The bodyweight inclusion factor indicates the percentage of your bodyweight to include for 1RM and volume calculations. It should be 0% for exercises that don\'t include bodyweight (e.g. benchpress), and 100% for full bodyweight exercises (e.g., pull-ups).';
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
                    Is Unilateral
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
        </>
    );
}