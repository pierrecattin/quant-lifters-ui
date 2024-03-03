"use client";
import Image from "next/image";

export function WorkoutHistoryPage({ showHome }: { showHome: any }) {
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
        TODO: WorkoutHistoryPage
      </div>
    </>
  )
}
