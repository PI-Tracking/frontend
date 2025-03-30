// This should only go to this page when its the first time logging in

import "./ResetPassword.css";
import { useState, FormEvent } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const isEmptyString = (string: string) => !string || string.trim() === "";

function ResetPasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const navigate = useNavigate();

  const handleResetPassword = (e: FormEvent) => {
    e.preventDefault();

    if (
      isEmptyString(oldPassword) ||
      isEmptyString(newPassword) ||
      isEmptyString(repeatPassword)
    ) {
      return;
    }

    if (newPassword !== repeatPassword) {
      setPasswordMismatch(true);
      return;
    }

    console.log("Password successfully reset!");

    navigate("/login");
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleResetPassword}>
        <div className="input-group">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>

        <div className="input-group">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="input-group">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Repeat New Password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {passwordMismatch && (
          <span className="error-message">Passwords don't match</span>
        )}

        <button
          type="submit"
          className="submit-btn"
          disabled={
            newPassword !== repeatPassword || isEmptyString(newPassword)
          }
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default ResetPasswordPage;
