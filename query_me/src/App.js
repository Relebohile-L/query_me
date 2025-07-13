import React, { useState, useRef, useEffect } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import RunQueryPage from "./RunQueryPage";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import * as bootstrap from 'bootstrap'; // ✅ Import all bootstrap JS

function App() {
  const [isSignup, setIsSignup] = useState(false);
  const [user, setUser] = useState(null);
  const toastRef = useRef(null);

  // ✅ Attach Toast to window
  useEffect(() => {
    window.bootstrap = bootstrap;
  }, []);

  const handleLogout = () => {
    setUser(null);

    const toastEl = toastRef.current;
    if (toastEl) {
      const toast = new window.bootstrap.Toast(toastEl);
      toast.show();
    }
  };

  return (
    <div>
      {!user ? (
        isSignup ? (
          <SignupForm onLoginClick={() => setIsSignup(false)} />
        ) : (
          <LoginForm
            onSignupClick={() => setIsSignup(true)}
            onLoginSuccess={(userData) => setUser(userData)}
          />
        )
      ) : (
        <RunQueryPage user={user} onLogout={handleLogout} />
      )}

      {/* Toast */}
      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
        <div
          ref={toastRef}
          className="toast align-items-center text-white bg-success border-0"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">👋 You have successfully logged out.</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;





