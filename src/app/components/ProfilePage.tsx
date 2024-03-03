"use client";

export function ProfilePage({ logout }: { logout: any }) {
  return (
    <button type="submit"
      onClick={logout}
      className="m-4 py-2 px-4 rounded-md shadow-lg shadow-black text-sm font-medium text-white bg-purple-600 hover:bg-purple-700">
      Logout
    </button>
  )
}
