import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { LoginDTO } from "@Types/LoginDTO";
import logo from "@assets/logo_white.png";
import styles from "./styles.module.css";

import Curve from "./assets/Curve.svg";
import Circles from "./assets/Circles.svg";
import { useAuth } from "@hooks/useAuth";
import { ResetDTO } from "@Types/ResetDTO";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";

// import fontawesome

const isEmptyString = (string: string) => !string || string.trim() === "";

function LoginPage() {
  const [formData, setFormData] = useState<LoginDTO>({
    username: "",
    password: "",
  });
  const [resetForm, setResetForm] = useState<ResetDTO>({
    email: "",
  });
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  // Forgot Password Modal States
  const [showModal, setShowModal] = useState(false);
  //const [email, setEmail] = useState("");
  // const [code, setCode] = useState("");
  const [timer, setTimer] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  //const [codeSent, setCodeSent] = useState(false);
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // const [passwordMismatch, setPasswordMismatch] = useState(false);
  const auth = useAuth();

  // Since I commented the other code down
  // there this was just placed here so I could commit with no errors
  const setPasswordMismatch = (value: boolean) => {
    setPasswordMismatch(value);
  };

  // If first login goto -> reset-password
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (isEmptyString(formData.username) || isEmptyString(formData.password))
      return;

    try {
      const response = await auth.login(formData);

      if (!response.success) {
        setError(response.error);
        return;
      }
      console.log(response.admin);
      if (response.admin) {
        navigate("/admin/cameras");
      } else {
        navigate("/cameras");
      }
    } catch (error) {
      setError("Some unknown error occurred");
      console.error("Error trying to login: " + error);
    }
  };

  // const handleSendCode = () => {
  //   if (isEmptyString(email)) return;

  //   console.log("Sending reset code to:", email);

  //   setButtonDisabled(true);
  //   setTimer(30);
  //   setCodeSent(true);
  //   setEmail("");

  //   const countdown = setInterval(() => {
  //     setTimer((prev) => {
  //       if (prev <= 1) {
  //         clearInterval(countdown);
  //         setButtonDisabled(false);
  //         return 0;
  //       }
  //       return prev - 1;
  //     });
  //   }, 1000);
  // };

  const handleSendCode = async (e: FormEvent) => {
    e.preventDefault();
    if (isEmptyString(resetForm.email)) return;

    setButtonDisabled(true);
    setTimer(30);
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setButtonDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    try {
      const response = await auth.resetPassword(resetForm);
      setResetForm({ email: "" });
      if (!response.success) {
        setError(response.error);
        return;
      }
    } catch (error) {
      setResetForm({ email: "" });
      setError("Some unknown error occurred");
      console.error("Error trying to resetPassword: " + error);
    }
    //setCodeSent(true);
    //setEmail("");
  };

  // const handleVerifyCode = () => {
  //   if (isEmptyString(code)) return;
  //   setShowModal(false);
  //   setShowNewPasswordModal(true);
  // };

  const handlePasswordChange = () => {
    if (newPassword !== repeatPassword) {
      setPasswordMismatch(true);
    } else {
      setPasswordMismatch(false);
      setShowNewPasswordModal(false);
    }
  };

  return (
    <>
      <div className={styles.background}>
        <img src={Circles} />
        <img src={Curve} />
      </div>
      <section>
        <div className={styles.loginContainer}>
          <img
            src={logo}
            onClick={() => navigate("/")}
            alt="Logo"
            className={styles.loginLogo}
          />
          <div className={styles.loginBox}>
            <h2>DASHBOARD LOGIN</h2>
            <form onSubmit={handleLogin}>
              <div className={styles.inputGroup}>
                <div className={styles.iconInputWrapper}>
                  <FontAwesomeIcon icon={faUser} className={styles.inputIcon} />
                  <input
                    type="text"
                    placeholder="USERNAME"
                    required
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                </div>
                <div className={styles.iconInputWrapper}>
                  <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                  <input
                    type="password"
                    placeholder="PASSWORD"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </div>
              {error && <span className={styles.errorMessage}>{error}</span>}
              <button type="submit" className={styles.loginBtn}>
                LOGIN
              </button>
            </form>

            <a
              href="#"
              className={styles.forgotPassword}
              onClick={() => setShowModal(true)}
            >
              Forgot password?
            </a>
          </div>
        </div>
      </section>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Reset Password</h3>
            {/* {!codeSent ? ( */}
            <>
              <input
                type="email"
                placeholder="Enter your email"
                value={resetForm.email}
                onChange={(e) =>
                  setResetForm({ ...resetForm, email: e.target.value })
                }
              />
              <button
                className={styles.loginBtn}
                onClick={handleSendCode}
                disabled={buttonDisabled}
              >
                {buttonDisabled ? `Check your email ${timer}s` : "Send Code"}
              </button>
            </>
            {/* ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter the code sent to your email"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <button className={styles.loginBtn} onClick={handleVerifyCode}>
                  Verify Code
                </button>
              </>
            )} */}
            <button
              className={styles.closeBtn}
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showNewPasswordModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Set New Password</h3>
            <div className={styles.inputGroup}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Repeat Password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
              <button onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {/* {passwordMismatch && <span className={styles.errorMessage}>Passwords don't match</span>} */}
              {/* For some reason this is not working */}
            </div>
            <button
              className={styles.loginBtn}
              onClick={handlePasswordChange}
              disabled={
                newPassword !== repeatPassword || isEmptyString(newPassword)
              }
            >
              Confirm New Password
            </button>
            <button
              className={styles.closeBtn}
              onClick={() => setShowNewPasswordModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default LoginPage;
