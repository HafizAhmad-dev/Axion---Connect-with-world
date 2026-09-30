import React from "react";
import { Link } from "react-router";
import { useRegister } from "../hooks/useRegisterHook";
import RegisterForm from "../Components/RegisterForm";
import {HeaderIcon} from "../Components/RegisterIcons";
const Register: React.FC = () => {
  const {
    form,
    showPassword,
    isLoading,
    focusedField,
    passwordValidation,
    fieldErrors,
    generalError,
    setShowPassword,
    setFocusedField,
    handleChange,
    handleSubmit,
  } = useRegister();


  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="relative">
          <div className="absolute -top-5 -right-5 w-20 h-20 bg-blue-200 rounded-full opacity-20 blur-2xl"></div>
          <div className="absolute -bottom-5 -left-5 w-20 h-20 bg-indigo-200 rounded-full opacity-20 blur-2xl"></div>

          <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="h-1.5 bg-linear-to-r from-[#2a51ff] via-blue-400 to-indigo-400"></div>

            <div className="px-7 pt-7 pb-7">
              {/* Header */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-linear-to-br from-blue-100 to-indigo-100 rounded-2xl mb-3 shadow-inner">
                  <HeaderIcon />
                </div>
                <h2 className="text-2xl font-bold bg-linear-to-r from-[#2a51ff] to-blue-600 bg-clip-text text-transparent">
                  Create account
                </h2>
                <p className="text-xs text-gray-400 mt-1">Get started in seconds</p>
              </div>

            

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <RegisterForm
                  form={form}
                  showPassword={showPassword}
                  isLoading={isLoading}
                  focusedField={focusedField}
                  passwordValidation={passwordValidation}
                  fieldErrors={fieldErrors}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  onChange={handleChange}
                  onFocus={setFocusedField}
                  onBlur={() => setFocusedField(null)}
                />
              </form>

              {/* General Error */}
              {generalError && (
                <div className="mt-4 px-4 py-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {generalError.message}
                </div>
              )}

              {/* Divider */}
              <div className="relative mt-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-gray-400">or</span>
                </div>
              </div>

              {/* Login Link */}
              <p className="text-center text-xs text-gray-500 mt-4">
                Already have an account?{" "}
                <Link to="/auth/login" className="font-medium text-[#2a51ff] hover:text-blue-700 transition-colors">
                  Sign in →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;