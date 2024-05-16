import { useState } from "react";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";

type FormValues = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      //const response = await fetch('https://api.commercegalaxy.online/login', {
      const response = await fetch("http://localhost:8081/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.email,
          password: data.password,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Login successful:", result);

        // Save the auth token in a session storage
        sessionStorage.setItem("authToken", result.access_token);
        sessionStorage.setItem("userID", result.id);

        reset();
        router.push("/hq"); // Navigate to dashboard after successful login
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Login failed");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold mb-6 text-center">Login</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 bg-gray-800 p-6 rounded shadow-md"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              {...register("email", { required: "Email is required" })}
              placeholder="Email"
              type="email"
              className="mt-1 px-4 py-2 bg-gray-700 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              {...register("password", { required: "Password is required" })}
              placeholder="Password"
              type="password"
              className="mt-1 px-4 py-2 bg-gray-700 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 rounded w-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
