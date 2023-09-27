import React from 'react';
import { GoogleLogin } from 'react-google-login';

const LoginPage = () => {
  const responseGoogle = (response) => {
    console.log(response);
    // Handle the response, send it to the backend, etc.
  };

  return (
    <div>
      <h1>Login Page</h1>
      <GoogleLogin
        clientId="your-google-client-id"
        buttonText="Login with Google"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
      />
    </div>
  );
};

export default LoginPage;
