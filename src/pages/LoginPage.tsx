import "../styles/login.css";
import logo from "../images/logo.png"; 

function LoginPage () {
  return (
    <div className="login-container">
      <img src={logo} alt="Logo" className="login-logo" />
      <div className="login-box">
        <h2>Dashboard Login</h2>
        <form>
          <div className="input-group">
            <input type="text" placeholder="Username" required />
            <input type="password" placeholder="Password" required />
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
        <a href="#" className="forgot-password">Forgot password?</a> 
      </div>
    </div>
  );
};


export default LoginPage;