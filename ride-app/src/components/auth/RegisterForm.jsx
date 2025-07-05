import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Link,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  addToast,
} from "@heroui/react";

import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("Register as...");
  const [isLoading, setIsLoading] = useState(false); // State to manage loading state

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Handle registration logic here
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Type:", type);

    if (name === "" || email === "" || password === "" || type === "Register as...") {
      addToast({
        title: "Error",
        description: "Please fill in all fields before submitting.",
        timeout: 4000,
        shouldShowTimeoutProgress: true,
        color: "danger",
        variant: "flat",
      });
      return;
    }

    setIsLoading(true); // Set loading state to true before making the API call

    api
      .post("/user/register", {
        name: name,
        email: email,
        password: password,
        type: type.toLowerCase(), // Convert type to lowercase for consistency
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200) {
          console.log("Registration successful:", res.data);
          addToast({
            title: "Success",
            description: "Registration successful! You can now log in.",
            timeout: 4000,
            shouldShowTimeoutProgress: true,
            color: "success",
            variant: "flat",
          });
          navigate("/login"); // Redirect to login page after successful registration
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error registering:", error);
        addToast({
          title: "Error",
          description: error.response?.data?.message || "An error occurred while registering. Please try again later.",
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
          <h1 className="text-2xl font-bold text-primary">Create Account</h1>
          <p className="text-gray-600">Join us and start your journey today</p>
        </div>

        <Input
          isRequired
          errorMessage="Please enter your name"
          label="Name"
          labelPlacement="outside"
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
        />

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

        <div className="flex justify-center w-full">
          <div className="w-1/2">
            <Dropdown backdrop="blur" className="w-full">
              <DropdownTrigger>
                <Button variant="bordered" color="secondary" fullWidth>
                  {type}
                </Button>
              </DropdownTrigger>

              <DropdownMenu
                onAction={(key) => {
                  if (key === "default") setType("Register as...");
                  if (key === "passenger") setType("Passenger");
                  if (key === "driver") setType("Driver");
                }}
              >
                <DropdownItem key="default">Register as...</DropdownItem>
                <DropdownItem key="passenger">Passenger</DropdownItem>
                <DropdownItem key="driver">Driver</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        <div className="flex justify-center w-full mt-5">
          <Button
            color="primary"
            className="w-1/2"
            type="submit"
            isLoading={isLoading}
            isDisabled={isLoading}
          >
            Register
          </Button>
        </div>

        <div className="text-center">
          <span className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </span>
        </div>
      </Form>
    </div>
  );
};

export default RegisterForm;
