import { NextPage } from "next";
import Head from "next/head";
import { motion } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaSpaceShuttle } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/router";

type FormValues = {
  email: string;
  password: string;
};

const Index: NextPage = () => {
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

  const handleRegisterClick = () => {
    router.push("/register");
  };

  return (
    <>
      <Head>
        <title>commerce-galaxy</title>
        <meta name="Commerce Galaxy" content="Trade across the Galaxy." />
      </Head>

      <div className="min-h-screen bg-gray-900 text-white">
        <header className="container mx-auto py-6 text-center">
          <h1 className="text-4xl font-bold mb-2">Commerce Galaxy</h1>
          <p className="text-lg">The ultimate space trading game</p>
        </header>

        <main className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center"
          >
            <FaSpaceShuttle className="text-6xl mb-4" />
            <p className="mb-6 text-center max-w-md">
              Join the universe of intergalactic commerce. Trade goods, join
              trade associations, and dominate the galaxy!
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input
                {...register("email", { required: "Email is required" })}
                placeholder="Email"
                type="email"
                className="px-4 py-2 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                {...register("password", { required: "Password is required" })}
                placeholder="Password"
                type="password"
                className="px-4 py-2 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errorMessage && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isLoading ? "Loading..." : "Login"}
              </button>
            </form>
            <button
              type="button"
              className="mt-4 px-4 py-2 bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={handleRegisterClick}
            >
              Register
            </button>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default Index;
