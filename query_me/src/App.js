import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import RunQueryPage from "./RunQueryPage"; // import the welcome page component
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [isSignup, setIsSignup] = useState(false);
  const [user, setUser] = useState(null); // stores logged-in user

  if (user) {
    return <RunQueryPage user={user} />; // render welcome page after login
  }

  return (
    <div>
      {isSignup ? (
        <SignupForm onLoginClick={() => setIsSignup(false)} />
      ) : (
        <LoginForm
          onSignupClick={() => setIsSignup(true)}
          onLoginSuccess={(userData) => setUser(userData)} // pass login success handler
        />
      )}
    </div>
  );
}

export default App;




