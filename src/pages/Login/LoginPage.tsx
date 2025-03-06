import logo from "@assets/logo.png";
import "./login.css";
import Metaballs from "./components/Metaballs";
import { Waves } from "./components/Waves";

function LoginPage() {
  return (
    <>
      <Metaballs />
      <section>
        <div className="login-container">
          <img src={logo} alt="Logo" className="login-logo" />
          <div className="login-box">
            <h2>Dashboard Login</h2>
            <form>
              <div className="input-group">
                <input type="text" placeholder="Username" required />
                <input type="password" placeholder="Password" required />
              </div>
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
