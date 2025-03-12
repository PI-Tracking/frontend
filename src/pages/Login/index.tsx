import logo from "@assets/logo.png";
import "./LoginPage.css";
import { useState } from "react";
import Circles from "./assets/Circles.svg";
import Curve from "./assets/Curve.svg";
import login from "@api/auth";
import { User } from "@Types/User";


const isEmptyString = (string: string) => {
  if (typeof string != "string") {
    return true;
  }

  if (string === undefined) {
    return true;
  }

  return string == "";
};

function LoginPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleLogin = async function () {
    if (isEmptyString(username) || isEmptyString(password)) {
      return;
    }

    try {
      const response = await login({
        username: username,
        password: password,
      } as User);

      console.log(response);
    } catch (error) {
      setError("Username password combination is invalid!");
      console.error("Error trying to login: " + error);
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
            <form>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Username"
                  required
                  value={username}
                  onChange={({ target }) => setUsername(target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={({ target }) => setPassword(target.value)}
                />
              </div>
              {!isEmptyString(error) ? (
                <span className="errorMessage">{error}</span>
              ) : (
                <></>
              )}
              <button type="submit" className="login-btn" onClick={handleLogin}>
                Login
              </button>
            </form>
            <a href="#" className="forgot-password">
              Forgot password?
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default LoginPage;
