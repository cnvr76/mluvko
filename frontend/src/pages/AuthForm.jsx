import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLocation, useSearchParams } from "react-router-dom";

const AuthForm = () => {
  const { login, signup } = useAuth();
  const location = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isLoginMode = searchParams.get("type") !== "signup";
  const from = location.state?.from?.pathname || "/";

  const inputClassName = `
    w-full
    rounded-full
    bg-white/50
    border border-white/60
    px-5 py-3
    text-[#642f37]
    placeholder:text-[#642f37]/60
    outline-none
    shadow-[0_4px_15px_rgba(0,0,0,0.08)]
    focus:bg-white/70
  `;

  const buttonClassName = `
    mt-3
    px-8 py-4
    rounded-full
    bg-white/40
    backdrop-blur-xl
    border border-white/50
    shadow-[0_4px_20px_rgba(0,0,0,0.15)]
    font-semibold text-xl
    text-[#642f37]
    transition-all duration-200
    hover:scale-105
    active:scale-95
    hover:bg-white/50
    hover:text-[#ff7110]
    disabled:opacity-60
  `;

  const linkButtonClassName = `
    bg-transparent
    border-none
    font-semibold
    text-[#ff7110]
    cursor-pointer
    hover:text-[#642f37]
  `;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    let result;

    if (isLoginMode) {
      result = await login(formData.email, formData.password);
    } else {
      result = await signup(
        formData.username,
        formData.email,
        formData.password
      );

      if (result.success) {
        result = await login(formData.email, formData.password);
      }
    }

    if (!result.success) {
      setError(result.error);
    }

    setIsLoading(false);
  };

  const toggleMode = () => {
    setError(null);
    setSearchParams({ type: isLoginMode ? "signup" : "login" });
  };

  return (
    <main
      className="
        w-screen h-screen
        bg-cover bg-no-repeat bg-center
        flex items-center justify-center
        px-4
      "
      style={{
        backgroundImage: "url('/images/background.png')",
      }}
    >
      <section
        className="
          w-full max-w-md
          rounded-[2rem]
          bg-white/30
          backdrop-blur-xl
          border border-white/40
          shadow-[0_4px_30px_rgba(0,0,0,0.18)]
          px-8 py-10
          text-center
          text-[#642f37]
        "
      >
        <h2 className="text-3xl font-extrabold mb-8 drop-shadow">
          {isLoginMode ? "Prihlásiť sa" : "Registrácia"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLoginMode && (
            <input
              type="text"
              name="username"
              placeholder="Vaše meno"
              value={formData.username}
              onChange={handleChange}
              required={!isLoginMode}
              className={inputClassName}
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="mluvko@gmail.com"
            value={formData.email}
            onChange={handleChange}
            required
            className={inputClassName}
          />

          <input
            type="password"
            name="password"
            placeholder="Heslo"
            value={formData.password}
            onChange={handleChange}
            required
            className={inputClassName}
          />

          {error && (
            <p className="text-sm font-semibold text-red-600 -mt-1">{error}</p>
          )}

          <button type="submit" disabled={isLoading} className={buttonClassName}>
            {isLoading
              ? "Načítava sa..."
              : isLoginMode
              ? "Prihlásiť sa"
              : "Registrovať sa"}
          </button>
        </form>

        <div className="mt-6 text-center text-[#642f37]">
          {isLoginMode ? "Nemáte účet? " : "Už máte účet? "}

          <button
            type="button"
            onClick={toggleMode}
            className={linkButtonClassName}
          >
            {isLoginMode ? "Vytvoriť účet" : "Prihlásiť sa"}
          </button>
        </div>
      </section>
    </main>
  );
};

export default AuthForm;