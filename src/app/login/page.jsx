"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Navigator from '../components/navigator'

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("/api/auth/login", { email, password });
      const data = response.data;
    
      if (data.success) {
        const decodedToken = jwtDecode(data.token);
        if (decodedToken.role === "ROLE_ADMIN") {
          localStorage.setItem("token", data.token);
          router.push("/panel");
          return;
        } else {
          setError("Bu sayfaya erişmek için yetkiniz yok!");
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      if (error.response) {
        setError(
          error.response.data.message || "Giriş sırasında bir hata oluştu."
        );
      } else if (error.request) {
        setError("Sunucudan yanıt alınamadı.");
      } else {
        setError("İsteğiniz işlenirken bir hata oluştu.");
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Navigator />
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl  text-[#eadaff] tracking-[0.15rem] font-bold">
            Giriş Yap
          </h2>
          <h2 className="mt-6 text-center text-l  text-[#eadaff]">
            Oda SKY LAB Panel'e erişmek için giriş yap.
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 1a9 9 0 110 18a9 9 0 010-18zm1 13a1 1 0 11-2 0V9a1 1 0 112 0v5zm0-8a1 1 0 100-2a1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Giriş sırasında bir hata oluştu.
                  </h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-dark-gray rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-dark-gray rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-dark-gray bg-[#eadaff] hover:bg-[#27a68e]
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#27a68e]-500 transition-colors duration-300"
            >
              Giriş yap
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-[#eadaff]">
            Hesabınız yok mu?{" "}
            <a href="/register" className="font-medium text-[#27a68e]">
              Hesap oluşturun.
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

