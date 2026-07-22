import { useState, useEffect, useCallback } from "react";
import type { ChangeEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import Axios from "axios";
import { selectUser, setUser } from "../Store/Slices/UserSlice";
import type { AppDispatch } from "../Store/store";
import { apiFetch } from "../utils/api";

type LoginForm = {
  email?: string;
  username?: string;
  password: string;
};

type FieldErrors = Partial<Record<keyof LoginForm, string[]>>;

interface LoginSuccessResponse {
  success: true;
  message: string;
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface BackendFieldError {
  field: keyof LoginForm;
  message: string;
}

interface LoginErrorResponse {
  success: false;
  message: string;
  errors?: BackendFieldError[];
}

const DEMO_ACCOUNTS = [
  {
    email: "test1@mail.com",
    password: "123456",
  },
  {
    email: "test2@mail.com",
    password: "123456",
  },
];

const Login = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginForm>({
    email: "",
    username: "",
    password: "",
  });

  const [useUsername, setUseUsername] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (user?.id) {
      navigate("/");
    }

    return () => {
      setIsMounted(false);
    };
  }, [user, navigate]);

  // Reset form on unmount
  useEffect(() => {
    return () => {
      if (!isMounted) {
        setForm({ email: "", username: "", password: "" });
        setFieldErrors({});
        setGeneralError(null);
      }
    };
  }, [isMounted]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    setFieldErrors((prev) => ({
      ...prev,
      [name]: [],
    }));

    setGeneralError(null);
  }

  function toggleLoginMethod() {
    setUseUsername((prev) => !prev);

    // Reset form when switching methods
    setForm({
      email: "",
      username: "",
      password: "",
    });

    setFieldErrors({});
    setGeneralError(null);
  }

  function fillDemoAccount(email: string, password: string) {
    setUseUsername(false);
    setForm({
      email,
      username: "",
      password,
    });
    setFieldErrors({});
    setGeneralError(null);
  }

  const validateField = useCallback(
    (field: keyof LoginForm, value: string): string[] => {
      if (field === "password") {
        if (!value.trim()) return ["Password required"];
        if (value.length < 6) return ["Password must be at least 6 characters"];
        return [];
      }

      if (field === "email" && !useUsername) {
        if (!value.trim()) return ["Email required"];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value))
          return ["Please enter a valid email address"];
        return [];
      }

      if (field === "username" && useUsername) {
        if (!value.trim()) return ["Username required"];
        if (value.length < 3) return ["Username must be at least 3 characters"];
        return [];
      }

      return [];
    },
    [useUsername],
  );

  function validate(): boolean {
    const errors: FieldErrors = {};

    if (useUsername) {
      const usernameErrors = validateField("username", form.username || "");
      if (usernameErrors.length) errors.username = usernameErrors;
    } else {
      const emailErrors = validateField("email", form.email || "");
      if (emailErrors.length) errors.email = emailErrors;
    }

    const passwordErrors = validateField("password", form.password);
    if (passwordErrors.length) errors.password = passwordErrors;

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  // Login.tsx - Update handleSubmit
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setGeneralError(null);

    const payload = useUsername
      ? {
          username: form.username,
          password: form.password,
        }
      : {
          email: form.email,
          password: form.password,
        };

    try {
      const response = await apiFetch(`/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = response.data as LoginSuccessResponse;
      console.log(data);

      if (data.success) {
        // ✅ Store token first
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // ✅ Dispatch user to Redux
        dispatch(setUser(data.user));

        console.log("Login successful, navigating to home...");

        // ✅ Small delay to ensure Redux state is committed
        setTimeout(() => {
          navigate("/");
        }, 50);
      }
    } catch (err: unknown) {
      setLoading(false);

      if (Axios.isAxiosError(err)) {
        if (err.response) {
          const errorData = err.response.data as LoginErrorResponse;

          if (err.response.status === 401) {
            console.log(errorData);
            setGeneralError(errorData.message || "Invalid credentials");
            return;
          }
        }
      }
    } finally {
      setLoading(false);
    }
  }

  const inputClass = (hasError?: boolean) =>
    `w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all duration-200 ${
      hasError
        ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
        : "border-gray-200 focus:border-[#2a51ff] focus:ring-[#2a51ff]/20"
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute -top-5 -right-5 w-20 h-20 bg-blue-200 rounded-full opacity-20 blur-2xl"></div>
          <div className="absolute -bottom-5 -left-5 w-20 h-20 bg-indigo-200 rounded-full opacity-20 blur-2xl"></div>

          {/* Main card */}
          <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Gradient accent bar */}
            <div className="h-1.5 bg-linear-to-r from-[#2a51ff] via-blue-400 to-indigo-400"></div>

            {/* Header */}
            <div className="px-7 pt-7 pb-4 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-linear-to-br from-blue-100 to-indigo-100 rounded-2xl mb-3 shadow-inner">
                <svg
                  className="w-7 h-7 text-[#2a51ff]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold bg-linear-to-r from-[#2a51ff] to-blue-600 bg-clip-text text-transparent">
                Welcome back
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Sign in to your account
              </p>
            </div>

            {/* Demo Accounts - Modern chips */}
            <div className="px-7 mb-2">
              <div className="flex gap-2 justify-center">
                {DEMO_ACCOUNTS.map((acc, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => fillDemoAccount(acc.email, acc.password)}
                    className="px-3 py-1.5 text-xs font-medium bg-linear-to-r from-gray-100 to-gray-50 text-gray-600 rounded-full hover:from-gray-200 hover:to-gray-100 hover:text-[#2a51ff] transition-all duration-200 hover:scale-105"
                    aria-label={`Use demo account ${i + 1}`}
                  >
                    Demo {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="px-7 pb-7 space-y-3.5"
              noValidate
            >
              {generalError && (
                <div
                  className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5"
                  role="alert"
                >
                  <p className="text-red-600 text-sm font-medium flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {generalError}
                  </p>
                </div>
              )}

              {/* Email/Username field */}
              <div className="group">
                <div
                  className={`relative transition-all duration-200 ${
                    focusedField === "identifier"
                      ? "transform scale-[1.02]"
                      : ""
                  }`}
                >
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2a51ff] transition-colors z-10">
                    {useUsername ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </div>
                  <input
                    type={useUsername ? "text" : "email"}
                    name={useUsername ? "username" : "email"}
                    placeholder={useUsername ? "Username" : "Email address"}
                    value={
                      useUsername ? (form.username ?? "") : (form.email ?? "")
                    }
                    onChange={handleChange}
                    onFocus={() => setFocusedField("identifier")}
                    onBlur={() => setFocusedField(null)}
                    className={inputClass(
                      !!(useUsername
                        ? fieldErrors.username
                        : fieldErrors.email),
                    )}
                    aria-label={useUsername ? "Username" : "Email address"}
                    aria-invalid={
                      !!(useUsername ? fieldErrors.username : fieldErrors.email)
                    }
                    aria-describedby={
                      useUsername ? "username-error" : "email-error"
                    }
                    autoComplete={useUsername ? "username" : "email"}
                  />
                </div>
                <div
                  id={useUsername ? "username-error" : "email-error"}
                  role="alert"
                >
                  {(useUsername
                    ? fieldErrors.username
                    : fieldErrors.email
                  )?.map((msg, idx) => (
                    <p
                      key={idx}
                      className="text-xs text-red-500 mt-1 ml-1 flex items-center gap-1"
                    >
                      <span>•</span> {msg}
                    </p>
                  ))}
                </div>
              </div>

              {/* Password field */}
              <div className="group">
                <div
                  className={`relative transition-all duration-200 ${
                    focusedField === "password" ? "transform scale-[1.02]" : ""
                  }`}
                >
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2a51ff] transition-colors z-10">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    className={inputClass(!!fieldErrors.password)}
                    aria-label="Password"
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby="password-error"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2a51ff] transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                <div id="password-error" role="alert">
                  {fieldErrors.password?.map((msg, idx) => (
                    <p
                      key={idx}
                      className="text-xs text-red-500 mt-1 ml-1 flex items-center gap-1"
                    >
                      <span>•</span> {msg}
                    </p>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-linear-to-r from-[#2a51ff] to-blue-600 text-white font-medium rounded-xl hover:from-[#1a3fd9] hover:to-blue-700 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
                aria-label="Sign in"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
                )}
              </button>

              {/* Toggle login method */}
              <button
                type="button"
                onClick={toggleLoginMethod}
                className="w-full text-center text-xs text-gray-500 hover:text-[#2a51ff] transition-colors flex items-center justify-center gap-1"
                aria-label={
                  useUsername
                    ? "Switch to email login"
                    : "Switch to username login"
                }
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
                {useUsername
                  ? "Login with Email instead"
                  : "Login with Username instead"}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-gray-400">New here?</span>
                </div>
              </div>

              {/* Register Link */}
              <p className="text-center text-xs text-gray-500">
                Don't have an account?{" "}
                <Link
                  to="/auth/register"
                  className="font-medium text-[#2a51ff] hover:text-blue-700 transition-colors inline-flex items-center gap-1"
                  aria-label="Create new account"
                >
                  Create account
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
