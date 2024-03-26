"use client";
import React, { useState } from 'react';

import { ExerciseWithHistory, ExerciseFamily } from "../classes"
import { InfoButton } from './InfoButton'
import { InfoModal } from './InfoModal';
import { getInfoMessage } from "../utils"

export function ExerciseDetailsPage({ family, exercise }: { family: ExerciseFamily, exercise: ExerciseWithHistory }) {
  const [infoModalMessage, setInfoModalMessage] = useState<string | null>(null);

  const primary_bodyparts = `Primary bodypart${(family.primaryBodyparts.length > 1 ? "s" : "")}: ${family.primaryBodyparts.join(", ")}`
  const secondary_bodyparts = `Secondary bodypart${family.secondaryBodyparts.length > 1 ? "s" : ""}: ${family.secondaryBodyparts.join(", ")}`
  return (
    < >
      <div className="mt-5 mb-4">
        Family: {family.name}
      </div>
      <div>
        {primary_bodyparts}
      </div>
      {family.secondaryBodyparts.length > 0 &&
        <div>
          {secondary_bodyparts}
        </div>
      }
      {exercise.isUnilateral &&
        <div className="my-4 flex justify-stretch">
          Unilateral exercise
          <InfoButton onClick={() => setInfoModalMessage(getInfoMessage('is_unilateral'))} />
        </div>
      }
      {exercise.weightFactor != 1 &&
        <div className="my-4 flex justify-stretch">
          {`Weight factor of ${Math.round(exercise.weightFactor * 100)}%`}
          <InfoButton onClick={() => setInfoModalMessage(getInfoMessage('weight_factor'))} />
        </div>
      }
      {exercise.bodyweightInclusionFactor != 0 &&
        <div className="my-4 flex justify-stretch">
          {`${Math.round(exercise.bodyweightInclusionFactor * 100)}% of bodyweight added to weight`}
          <InfoButton onClick={() => setInfoModalMessage(getInfoMessage('bodyweight_inclusion_factor'))} />
        </div>
      }
      {exercise.createdBy !== undefined && `Created by ${exercise.createdBy}`}
      {infoModalMessage !== null && <InfoModal message={infoModalMessage} onClose={() => setInfoModalMessage(null)} />}
    </>
  )
} 