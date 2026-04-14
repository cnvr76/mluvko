import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

const AuthForm = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const isLoginMode = searchParams.get("type") !== "signup";
  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

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

    if (result.success) {
      navigate(from, { replace: true });
    }

    setIsLoading(false);
  };

  const toggleMode = () => {
    setSearchParams({ type: isLoginMode ? "signup" : "login" });
  };

  return (
    <div
      className="w-screen h-screen flex flex-col justify-center"
      style={{ maxWidth: "400px", margin: "0 auto", padding: "2rem" }}
    >
      <h2>{isLoginMode ? "Prihlásiť sa do svojho účtu" : "Registrácia"}</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        {!isLoginMode && (
          <input
            type="text"
            name="username"
            placeholder="Tvoje meno"
            value={formData.username}
            onChange={handleChange}
            required={!isLoginMode}
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="tiger@cute.com"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Heslo"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={isLoading}>
          {isLoading
            ? "Načítava sa..."
            : isLoginMode
            ? "Prihlásiť sa"
            : "Registrácia"}
        </button>
      </form>

      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        {isLoginMode ? "Nemáte účet? " : "Už máte účet? "}
        <button
          type="button"
          onClick={toggleMode}
          style={{
            background: "none",
            border: "none",
            color: "blue",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          {isLoginMode ? "Vytvoriť účet" : "Prihlásiť sa"}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
