"use client";
import Image from "next/image";

export function WorkoutCreatorPage({ showHome }: { showHome: any }) {
  return (
    <>
      <button onClick={showHome}>
        <Image
          src="icons/return_arrow.svg"
          alt="Return"
          width={20}
          height={20}
        />
      </button>
      <div>
        TODO: WorkoutCreatorPage
      </div>
    </>
  )
}
