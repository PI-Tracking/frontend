import logo from "@assets/logo.png";
import "./LoginPage.css";
import { FormEvent, useState } from "react";
import Circles from "./assets/Circles.svg";
import Curve from "./assets/Curve.svg";
import login from "@api/auth";
import { User } from "@Types/User";
import { UserDTO } from "@Types/UserDTO";
import { useNavigate } from "react-router-dom";

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
  const [formData, setFormData] = useState<UserDTO>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async function (e: FormEvent) {
    e.preventDefault();

    if (isEmptyString(formData.username) || isEmptyString(formData.password)) {
      return;
    }

    try {
      const response = await login(formData);
      console.log(response);

      if (response.status !== 200) {
        setError("Username/password combination is not valid");
        return;
      }

      if (response.data.admin) {
        navigate("/admin/cameras");
      }
      navigate("/cameras");
    } catch (error) {
      setError("Some unknown error occurred");
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
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Username"
                  required
                  value={formData.username}
                  onChange={({ target }) => {
                    setFormData((formData) => {
                      return {
                        ...formData,
                        username: target.value,
                      };
                    });
                  }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={({ target }) => {
                    setFormData((formData) => {
                      return {
                        ...formData,
                        password: target.value,
                      };
                    });
                  }}
                />
              </div>
              {!isEmptyString(error) ? (
                <span className="errorMessage">{error}</span>
              ) : (
                <></>
              )}
              <button type="submit" className="login-btn">
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
