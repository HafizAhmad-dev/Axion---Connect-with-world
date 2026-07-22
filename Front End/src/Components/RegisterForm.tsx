import React from "react";
import { 
  UserIcon, 
  DisplayNameIcon, 
  EmailIcon, 
  PasswordIcon, 
  EyeIcon,
  CheckIcon,
  XIcon,
  SpinnerIcon
} from "./RegisterIcons";
import type { FormState, PasswordValidation, FieldErrors } from '../Types/Register.types'

interface RegisterFormProps {
  form: FormState;
  showPassword: boolean;
  isLoading: boolean;
  focusedField: string | null;
  passwordValidation: PasswordValidation;
  fieldErrors: FieldErrors;
  onTogglePassword: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onFocus: (field: string) => void;
  onBlur: () => void;
}

const getStatusIcon = (isValid: boolean, hasValue: boolean) => {
  if (!hasValue) return null;
  return isValid ? <CheckIcon /> : <XIcon />;
};

const RegisterForm: React.FC<RegisterFormProps> = ({
  form,
  showPassword,
  isLoading,
  focusedField,
  passwordValidation,
  fieldErrors,
  onTogglePassword,
  onChange,
  onFocus,
  onBlur,
}) => {
  const hasPassword = form.password !== "";

  return (
    <div className="space-y-3.5">
      {/* Username */}
      <div>
        <div className={`relative transition-all duration-200 ${focusedField === "username" ? "transform scale-[1.02]" : ""}`}>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
            <UserIcon />
          </div>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={onChange}
            onFocus={() => onFocus("username")}
            onBlur={onBlur}
            placeholder="Username"
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#2a51ff] focus:ring-2 focus:ring-[#2a51ff]/20 transition-all duration-200"
            required
          />
        </div>
        {fieldErrors.username && <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.username}</p>}
      </div>

      {/* Display Name */}
      <div>
        <div className={`relative transition-all duration-200 ${focusedField === "displayName" ? "transform scale-[1.02]" : ""}`}>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
            <DisplayNameIcon />
          </div>
          <input
            type="text"
            name="displayName"
            value={form.displayName}
            onChange={onChange}
            onFocus={() => onFocus("displayName")}
            onBlur={onBlur}
            placeholder="Display name (optional)"
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#2a51ff] focus:ring-2 focus:ring-[#2a51ff]/20 transition-all duration-200"
          />
        </div>
        {fieldErrors.displayName && <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.displayName}</p>}
      </div>

      {/* Email */}
      <div>
        <div className={`relative transition-all duration-200 ${focusedField === "email" ? "transform scale-[1.02]" : ""}`}>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
            <EmailIcon />
          </div>
          <div className="flex bg-gray-50 border border-gray-200 rounded-xl focus-within:bg-white focus-within:border-[#2a51ff] focus-within:ring-2 focus-within:ring-[#2a51ff]/20 transition-all duration-200 overflow-hidden">
            <input
              type="text"
              name="emailLocal"
              value={form.emailLocal}
              onChange={onChange}
              onFocus={() => onFocus("email")}
              onBlur={onBlur}
              placeholder="Email"
              className="flex-1 pl-9 pr-2 py-2.5 text-sm bg-transparent focus:outline-none"
              required
            />
            <div className="flex items-center px-2 text-gray-400 text-sm">@</div>
            <select
              name="emailDomain"
              value={form.emailDomain}
              onChange={onChange}
              className="bg-transparent focus:outline-none px-2 py-2.5 text-sm text-gray-700 cursor-pointer hover:text-[#2a51ff] transition-colors"
            >
              <option value="gmail.com">gmail.com</option>
              <option value="outlook.com">outlook.com</option>
              <option value="yahoo.com">yahoo.com</option>
              <option value="proton.me">proton.me</option>
            </select>
          </div>
        </div>
        {fieldErrors.email && <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.email}</p>}
      </div>

      {/* Password */}
      <div>
        <div className={`relative transition-all duration-200 ${focusedField === "password" ? "transform scale-[1.02]" : ""}`}>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
            <PasswordIcon />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={onChange}
            onFocus={() => onFocus("password")}
            onBlur={onBlur}
            placeholder="Password"
            className="w-full pl-9 pr-10 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#2a51ff] focus:ring-2 focus:ring-[#2a51ff]/20 transition-all duration-200"
            required
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2a51ff] transition-colors"
          >
            <EyeIcon show={showPassword} />
          </button>
        </div>

        {/* Password Requirements */}
        <div className="mt-2 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className={`text-xs ${hasPassword && !passwordValidation.minLength ? "text-red-500" : passwordValidation.minLength ? "text-green-600" : "text-gray-500"}`}>
              • Minimum 8 characters
            </span>
            {getStatusIcon(passwordValidation.minLength, hasPassword)}
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-xs ${hasPassword && !passwordValidation.hasNumber ? "text-red-500" : passwordValidation.hasNumber ? "text-green-600" : "text-gray-500"}`}>
              • At least 1 number
            </span>
            {getStatusIcon(passwordValidation.hasNumber, hasPassword)}
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-xs ${hasPassword && !passwordValidation.hasSymbol ? "text-red-500" : passwordValidation.hasSymbol ? "text-green-600" : "text-gray-500"}`}>
              • At least 1 symbol (!@#$%^&*)
            </span>
            {getStatusIcon(passwordValidation.hasSymbol, hasPassword)}
          </div>
        </div>

        {/* Password strength */}
        {hasPassword && (
          <div className="mt-2">
            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-300 rounded-full ${
                passwordValidation.minLength && passwordValidation.hasNumber && passwordValidation.hasSymbol
                  ? "w-full bg-gradient-to-r from-green-400 to-green-500"
                  : passwordValidation.minLength && (passwordValidation.hasNumber || passwordValidation.hasSymbol)
                  ? "w-2/3 bg-gradient-to-r from-yellow-400 to-yellow-500"
                  : "w-1/3 bg-gradient-to-r from-red-400 to-red-500"
              }`} />
            </div>
            <p className="text-xs mt-1 text-center font-medium">
              {passwordValidation.minLength && passwordValidation.hasNumber && passwordValidation.hasSymbol
                ? "✓ Strong password"
                : passwordValidation.minLength && (passwordValidation.hasNumber || passwordValidation.hasSymbol)
                ? "⚠️ Medium password"
                : "❌ Weak password"}
            </p>
          </div>
        )}
        
        {fieldErrors.password && <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.password}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || (form.password !== "" && (!passwordValidation.minLength || !passwordValidation.hasNumber || !passwordValidation.hasSymbol))}
        className="w-full py-2.5 bg-gradient-to-r from-[#2a51ff] to-blue-600 text-white font-medium rounded-xl hover:from-[#1a3fd9] hover:to-blue-700 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <SpinnerIcon />
            Creating account...
          </div>
        ) : (
          "Sign up"
        )}
      </button>
    </div>
  );
};

export default RegisterForm;