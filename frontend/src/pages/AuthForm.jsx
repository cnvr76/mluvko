import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { useQueryState, parseAsStringLiteral } from "nuqs";
import PageLoading from "../components/loading/PageLoading";
import useMediaReady from "../hooks/useMediaReady";
import { APP_BACKGROUND } from "../constants/media";

const AUTH_MEDIA = [APP_BACKGROUND];

const AUTH_TYPES = ["login", "signup"];

const AuthForm = () => {
  const { login, signup } = useAuth();

  const [type, setType] = useQueryState(
    "type",
    parseAsStringLiteral(AUTH_TYPES).withDefault("login"),
  );
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [isPwdVisible, setIsPwdVisible] = useState(false);

  const isMediaReady = useMediaReady(AUTH_MEDIA);
  const isLoginMode = type !== "signup";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (isLoginMode) {
        return login(formData.email, formData.password);
      }
      const signupResult = await signup(
        formData.username,
        formData.email,
        formData.password,
      );
      return signupResult.success
        ? login(formData.email, formData.password)
        : signupResult;
    },
  });
  const isLoading = submitMutation.isPending;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const result = await submitMutation.mutateAsync();
    if (!result.success) {
      setError(result.error);
    }
  };

  const toggleMode = () => {
    setError(null);
    // keep pushing a new history entry (as before), so "back" undoes the toggle
    setType(isLoginMode ? "signup" : "login", { history: "push" });
  };

  if (!isMediaReady) return <PageLoading />;

  return (
    <main className="relative isolate w-full min-h-dvh flex items-center justify-center px-4 py-page-top">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: `url('${APP_BACKGROUND}')` }}
      />

      <section
        className="
          w-full max-w-md
          surface-glass rounded-panel shadow-panel-strong
          px-6 sm:px-8 py-10
          text-center text-text
        "
      >
        <h2 className="text-fluid-3xl font-extrabold mb-8 drop-shadow">
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
              className="field rounded-full"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="mluvko@gmail.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="field rounded-full"
          />

          <div className="relative">
            <input
              type={isPwdVisible ? "text" : "password"}
              name="password"
              placeholder="Heslo"
              value={formData.password}
              onChange={handleChange}
              required
              className="field rounded-full pr-12"
            />
            <button
              type="button"
              onClick={() => setIsPwdVisible((prev) => !prev)}
              aria-label={isPwdVisible ? "Skryť heslo" : "Zobraziť heslo"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text hover:text-accent transition-colors duration-200 cursor-pointer"
            >
              <i
                className={`fa-solid fa-eye${isPwdVisible ? "-slash" : ""} fa-fw`}
                aria-hidden="true"
              />
            </button>
          </div>

          {error && (
            <p className="text-fluid-sm font-semibold text-danger -mt-1">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="
              btn-pill surface-glass bg-white/40 border-white/50 shadow-control
              mt-3 px-8 py-4
              text-fluid-xl text-text
              hover:bg-white/50 hover:text-accent
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
            "
          >
            {isLoading
              ? "Načítava sa..."
              : isLoginMode
                ? "Prihlásiť sa"
                : "Registrovať sa"}
          </button>
        </form>

        <div className="mt-6 text-center text-fluid-lg text-text">
          {isLoginMode ? "Nemáte účet? " : "Už máte účet? "}

          <button
            type="button"
            onClick={toggleMode}
            className="font-semibold text-accent hover:text-text cursor-pointer"
          >
            {isLoginMode ? "Vytvoriť účet" : "Prihlásiť sa"}
          </button>
        </div>
      </section>
    </main>
  );
};

export default AuthForm;
