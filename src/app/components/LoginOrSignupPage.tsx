"use client";

import { useState } from "react";
import { Config } from "../config"


export function LoginOrSignupPage({
    onLogin,
    setIsAuthenticated
}: {
    onLogin: (username: string, password: string) => void,
    setIsAuthenticated: any
}) {
    const [signUpIsShown, setSignUpIsShown] = useState(false);

    // ByPass login if user is already authenticated (via cookie authToken)
    const userIsAuthenticated = async () => {
        fetch(`${Config.backendUrl}userisauthenticated`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(response => response.json())
            .then(x => setIsAuthenticated(Boolean(x.is_authenticated)))
            .catch(error => console.error(error));
    }
    userIsAuthenticated();

    function showSignup() {
        setSignUpIsShown(true)
    }

    function showLogin() {
        setSignUpIsShown(false)
    }

    return (
        <>
            {!signUpIsShown && <LoginPage onLogin={onLogin} onSignUpClick={showSignup} />}
            {signUpIsShown && <SignUpPage showLogin={showLogin} />}
        </>
    );
}


function LoginPage({
    onLogin, onSignUpClick }: { onLogin: (username: string, password: string) => void, onSignUpClick: any }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onLogin(email, password);
    };
    return (
        <>
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <div className="w-full max-w-xs p-9 space-y-4 rounded-lg bg-gray-800 shadow-black">
                    <form onSubmit={handleSubmit} className="space-y-4 mb-10">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 p-1 block w-full rounded-md bg-gray-700 border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-white"
                                placeholder="Email" required />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 p-1 block w-full rounded-md bg-gray-700 border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-white"
                                placeholder="Password" required />
                        </div>
                        <button type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Login
                        </button>
                    </form>
                    <button
                        onClick={onSignUpClick}
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                        No account yet? Sign up!
                    </button>
                </div>
            </div>
        </>
    )
}


function SignUpPage({ showLogin }: { showLogin: any }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const createUser = (event: React.FormEvent) => {
        event.preventDefault();
        const signup = async () => {
            const response = await fetch(`${Config.backendUrl}createuser`, {
                method: 'POST',
                body: String(JSON.stringify({ username, email, password })),
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                alert("User profile created")
                showLogin();
            } else {
                const error = await response.json().then(x => x.error)
                alert(error)
            }
        };
        signup()
    };

    return (
        <>
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <div className="w-full max-w-xs p-9 space-y-4 rounded-lg bg-gray-800 shadow-black">
                    <form onSubmit={createUser} className="space-y-4 mb-10">
                        <h2 className="text-xl font-semibold text-gray-300">Sign Up</h2>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-300">Username</label>
                            <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                                className="mt-1 p-1  block w-full rounded-md bg-gray-700 border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-white"
                                placeholder="Username" required />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 p-1  block w-full rounded-md bg-gray-700 border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-white"
                                placeholder="Email" required />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 p-1 block w-full rounded-md bg-gray-700 border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-white"
                                placeholder="Password" required />
                        </div>
                        <button type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Sign Up
                        </button>
                    </form>
                    <button
                        onClick={showLogin}
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                        Return to login
                    </button>
                </div>
            </div>
        </>
    );
}