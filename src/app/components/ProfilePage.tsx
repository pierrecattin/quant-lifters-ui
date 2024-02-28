"use client";

export function ProfilePage({ logout }: { logout: any }) {
  return (
    <button type="submit"
      onClick={logout}
      className="w-full m-4 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
      Logout
    </button>
  )
}
