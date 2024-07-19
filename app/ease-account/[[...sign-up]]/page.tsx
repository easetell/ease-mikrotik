import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-dark">
      <SignUp
        routing="hash"
        appearance={{
          elements: {
            footer: {
              display: "none",
            },
          },
        }}
      />
    </div>
  );
};

export default SignUpPage;
