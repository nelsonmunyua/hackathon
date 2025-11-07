import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Welcome Back</h1>
        <p>Sign in to access your account and manage your items</p>
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          afterSignInUrl="/"
        />
      </div>
    </div>
  );
};

export default SignInPage;
