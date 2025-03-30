import logo from "@assets/logo.png";
import "./LoginPage.css";
import { FormEvent, useState } from "react";
import Circles from "./assets/Circles.svg";
import Curve from "./assets/Curve.svg";
import login from "@api/auth";
import { UserDTO } from "@Types/UserDTO";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const isEmptyString = (string: string) => !string || string.trim() === "";

function LoginPage() {
  const [formData, setFormData] = useState<UserDTO>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  // Forgot Password Modal States
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // const [passwordMismatch, setPasswordMismatch] = useState(false);

  // Since I commented the other code down there this was just placed here so I could commit with no errors
  const setPasswordMismatch = (value: boolean) => {
    setPasswordMismatch(value);
  };

  // If first login goto -> reset-password
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (isEmptyString(formData.username) || isEmptyString(formData.password))
      return;

    try {
      const response = await login(formData);

      console.log("Login response:", response);

      if (response.status !== 200) {
        setError("Username/password combination is not valid");
        return;
      }

      if (response.data && response.data.admin) {
        navigate("/admin/cameras");
      } else {
        navigate("/cameras");
      }
    } catch (error) {
      setError("Some unknown error occurred");
      console.error("Error trying to login: " + error);
    }
  };

  const handleSendCode = () => {
    if (isEmptyString(email)) return;

    console.log("Sending reset code to:", email);

    setButtonDisabled(true);
    setTimer(30);
    setCodeSent(true);
    setEmail("");

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
  };

  const handleVerifyCode = () => {
    if (isEmptyString(code)) return;
    setShowModal(false);
    setShowNewPasswordModal(true);
  };

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
      <div className="background">
        <img src={Circles} />
        <img src={Curve} />
      </div>
      <section>
        <div className="login-container">
          <img src={logo} alt="Logo" className="login-logo" />
          <div className="login-box">
            <h2>Dashboard Login</h2>
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Username"
                  required
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              {error && <span className="errorMessage">{error}</span>}
              <button type="submit" className="login-btn">
                Login
              </button>
            </form>
            <a
              href="#"
              className="forgot-password"
              onClick={() => setShowModal(true)}
            >
              Forgot password?
            </a>
          </div>
        </div>
      </section>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Reset Password</h3>
            {!codeSent ? (
              <>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  className="login-btn"
                  onClick={handleSendCode}
                  disabled={buttonDisabled}
                >
                  {buttonDisabled ? `Wait ${timer}s` : "Send Code"}
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter the code sent to your email"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <button className="login-btn" onClick={handleVerifyCode}>
                  Verify Code
                </button>
              </>
            )}
            <button className="close-btn" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {showNewPasswordModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Set New Password</h3>
            <div className="input-group">
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
              {/* {passwordMismatch && <span className="errorMessage">Passwords don't match</span>} */}
              {/* For some reason this is not working */}
            </div>
            <button
              className="login-btn"
              onClick={handlePasswordChange}
              disabled={
                newPassword !== repeatPassword || isEmptyString(newPassword)
              }
            >
              Confirm New Password
            </button>
            <button
              className="close-btn"
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
