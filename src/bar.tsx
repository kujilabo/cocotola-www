import React, { useState } from 'react';

function useAuth() {
  const [auth, setAuth] = useState(false);
  function handleClick() {
    setAuth(!auth);
  }
  return { auth, handleClick };
}

export default function Bar() {
  const { auth, handleClick } = useAuth();
  return (
    <div>
      {auth ? (
        <>
          <h1>Welcome</h1>
          <button name="signOut" onClick={handleClick}>
            Sign out
          </button>
        </>
      ) : (
        <>
          <h1>Please sign in</h1>
          <button name="signIn" onClick={handleClick}>
            Sign in
          </button>
        </>
      )}
    </div>
  );
}
