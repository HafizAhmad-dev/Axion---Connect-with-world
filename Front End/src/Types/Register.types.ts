export interface FormState {
  username: string;
  displayName: string;
  emailLocal: string;
  emailDomain: string;
  password: string;
}

export interface PasswordValidation {
  minLength: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
}

export interface DemoAccount {
  username: string;
  displayName: string;
  email: string;
  password: string;
}

export interface FieldErrors {
  username?: string;
  displayName?: string;
  email?: string;
  password?: string;
}

export interface GeneralError {
  code: number | null;
  message: string;
}