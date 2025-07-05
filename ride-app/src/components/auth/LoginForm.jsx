import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  addToast,
} from "@heroui/react";
import useUserStore from "../../context/store";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State to manage loading state
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Handle login logic here
    console.log("Email:", email);
    console.log("Password:", password);
    setIsLoading(true); // Set loading state to true when starting the login process

    api
      .post("/user/login", {
        email: email,
        password: password,
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200) {
          console.log("Login successful:", res.data.user);
          setUser(res.data.user);
          navigate(`/${res.data.user.type}/dashboard`); // Redirect based on user type
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error logging in:", error);
        addToast({
          title: "Error",
          description:
            "An error occurred while logging in. Please try again later.",
          timeout: 4000,
          shouldShowTimeoutProgress: true,
          color: "danger",
          variant: "flat",
        });
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Form
        className="flex flex-col w-full max-w-md p-6 gap-5 bg-white rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-primary">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue your journey</p>
        </div>

        <Input
          isRequired
          errorMessage="Please enter your email"
          label="Email"
          labelPlacement="outside"
          placeholder="Enter your email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          isRequired
          errorMessage="Please enter your password"
          label="Password"
          labelPlacement="outside"
          placeholder="Enter your password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="mt-4">
          <Button
            color="primary"
            fullWidth
            type="submit"
            isLoading={isLoading}
            isDisabled={isLoading}
          >
            Login
          </Button>
        </div>

        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </span>
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;
