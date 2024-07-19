import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-dark">
            <SignIn routing="hash" appearance={{
                elements: {
                    footer: {
                        display: 'none',
                    },
                },
            }} />
        </div>
    );
};

export default SignInPage;