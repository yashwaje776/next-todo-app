"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const cookieString = document.cookie;
    const userId = cookieString
      .split("; ")
      .find((row) => row.startsWith("userId="))
      ?.split("=")[1];
    setUserId(userId || null);
  }, [pathname]);

  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setUser(data);
        setLoggedIn(true);
      } catch (err) {
        setLoggedIn(false);
        setUser(null);
      }
    };
    fetchUser();
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown")) setShowDropdown(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setLoggedIn(false);
    setUser(null);
    setUserId(null);
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleProtectedNav = (path) => {
    router.push(loggedIn ? path : "/login");
  };

  return (
    <header className="bg-gray-900 text-white py-4 shadow-md sticky top-0 z-50 px-[10%]">
      <nav className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold tracking-wide">
          <Link href="/" className="hover:text-blue-400 transition-colors">
            MyApp
          </Link>
        </h1>

        <ul className="flex space-x-6 items-center">
            
          

          {loggedIn && user ? (
            <li className="relative dropdown">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="bg-blue-600 w-10 h-10 flex items-center justify-center rounded-full font-semibold text-white hover:bg-blue-700 transition cursor-pointer"
              >
                {user.name?.charAt(0).toUpperCase()}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-3 w-56 bg-white text-gray-900 rounded-lg shadow-lg p-4 z-50 transition-all">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <hr className="my-2 border-gray-300" />
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </li>
          ) : (
            <li>
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-medium transition"
              >
                Login
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
