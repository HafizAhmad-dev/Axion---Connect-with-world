import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "../Store/Slices/UserSlice";
import type { ChangeEvent } from "react";
import { apiFetch } from "../utils/api";
import type {
  FormState,
  PasswordValidation,
  FieldErrors,
  GeneralError,
} from "../Types/Register.types";
import { saveUser } from "../services/localStorageService";

export const useRegister = () => {
  const [form, setForm] = useState<FormState>({
    username: "",
    displayName: "",
    emailLocal: "",
    emailDomain: "gmail.com",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState<GeneralError | null>(null);

  const [passwordValidation, setPasswordValidation] =
    useState<PasswordValidation>({
      minLength: false,
      hasNumber: false,
      hasSymbol: false,
    });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Password validation
  useEffect(() => {
    const password = form.password;
    setPasswordValidation({
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [form.password]);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;

    // Clear field error when user starts typing
    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }) as FieldErrors);
    }

    setForm((prev) => {
      if (name === "username") {
        return {
          ...prev,
          username: value,
          displayName:
            prev.username === prev.displayName ? value : prev.displayName,
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  }

  const fillDemoAccount = (account: any) => {
    const [emailLocal, emailDomain] = account.email.split("@");
    setForm({
      username: account.username,
      displayName: account.displayName,
      emailLocal,
      emailDomain,
      password: account.password,
    });
    setShowDemoAccounts(false);
    setFieldErrors({});
    setGeneralError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setFieldErrors({});
    setGeneralError(null);

    const isValidPassword =
      passwordValidation.minLength &&
      passwordValidation.hasNumber &&
      passwordValidation.hasSymbol;

    if (!isValidPassword && form.password) {
      setFieldErrors({ password: "Password does not meet requirements" });
      setIsLoading(false);
      return;
    }

    const payload = {
      username: form.username,
      displayName: form.displayName || form.username,
      email: `${form.emailLocal}@${form.emailDomain}`,
      password: form.password,
    };

    try {
      const response = await apiFetch("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
     
      localStorage.setItem("token", response.data.token);

      const userResponse = await apiFetch("/api/v1/auth/me/");
      const userData = userResponse.data;

      dispatch(setUser(userData.user));

      navigate("/");
    } catch (error) {
      setIsLoading(false);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status;
          const errorData = error.response.data;

          // Handle 404 - General error
          if (status === 404) {
            setGeneralError({
              code: 404,
              message:
                errorData?.message ||
                "Service unavailable. Please try again later.",
            });
            setFieldErrors({});
            return;
          }

          // Handle 400 - Field validation errors
          if (status === 400) {
            // Check if backend returned field-specific errors
            if (errorData.errors && typeof errorData.errors === "object") {
              console.log(errorData);
              // Store ALL field errors at once
              setFieldErrors(errorData.errors);
              setGeneralError(null);
            } else if (errorData.message) {
              // General validation error (not field-specific)
              setGeneralError({
                code: 400,
                message: errorData.message,
              });
              setFieldErrors({});
            } else {
              setGeneralError({
                code: 400,
                message: "Validation failed. Please check your input.",
              });
              setFieldErrors({});
            }
            return;
          }

          // Handle other status codes (409, 500, etc.)
          setGeneralError({
            code: status,
            message:
              errorData?.message || "Registration failed. Please try again.",
          });
          setFieldErrors({});
          return;
        }

        // Network error - No response from server
        if (error.request) {
          
          setGeneralError({
            code: null,
            message:
              "Cannot connect to server. Please check your internet connection.",
          });
          setFieldErrors({});
          return;
        }
      }

      // Unknown error
      setGeneralError({
        code: null,
        message: "Something went wrong. Please try again.",
      });
      setFieldErrors({});
    }
  };

  return {
    form,
    showPassword,
    isLoading,
    focusedField,
    passwordValidation,
    showDemoAccounts,
    fieldErrors,
    generalError,
    setShowPassword,
    setShowDemoAccounts,
    setFocusedField,
    handleChange,
    handleSubmit,
    fillDemoAccount,
  };
};
