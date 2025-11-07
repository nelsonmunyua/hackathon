import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Join Our Community</h1>
        <p>Create an account to start sharing and borrowing items</p>
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          afterSignUpUrl="/"
        />
      </div>
    </div>
  );
};

export default SignUpPage;
