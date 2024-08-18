"use client";
import Button from "@/components/button";
import FormGroup from "@/components/fromgroup";
import { API_URL } from "@/constant";
import { useAppSelector } from "@/redux/hooks";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RiArrowDropRightLine } from "react-icons/ri";
import { toast } from "react-toastify";
import "./page.scss";

function Login() {
  const route = useRouter();
  const { login } = useAppSelector((state) => state.login);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");

  // console.log(emailError);

  useEffect(() => {
    if (login?.accessToken) {
      route.push("/profile");
    } else {
      setIsLoggedIn(false);
    }
  }, [login, route]);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    if (
      fullName.trim() !== "" &&
      mobile.trim() !== "" &&
      password.trim() !== ""
    ) {
      const data: any = {
        name: fullName,
        mobile: mobile.startsWith("+88") ? mobile.split("+88")[1] : mobile,
        password: password,
        role_id: 2,
      };
      if (email) {
        data.email = email;
      }

      try {
        const response = await axios.post(`${API_URL}/users`, data);
        if (response.status === 201) {
          toast.success("Registration Success!");
          route.push("/login");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setEmailError(error?.response?.data?.errors?.email);
          setMobileError(error?.response?.data?.errors?.mobile);
        }
        console.error("Registration error:", error);
        toast.error("Registration Error!");
      }
    }
  };

  return (
    <>
      {!isLoggedIn ? (
        <main>
          <section className="md:block hidden">
            <div className="container">
              <div className="flex items-center font-gotham font-normal text-sm mt-3 mb-3">
                <Link href={"/"}>Home</Link>
                <RiArrowDropRightLine className=" text-xl" />
                <Link href={"/register"}> Register </Link>
              </div>
            </div>
          </section>
          <section className="flex justify-center items-center register">
            <div className="md:w-[400px] w-[95%] register-area p-8">
              <h2 className=" font-gotham font-normal text-xl black-text">
                Create an Account
              </h2>
              <form onSubmit={handleLogin}>
                <FormGroup
                  className="mt-2"
                  title="Full Name*"
                  placeholder="Full Name"
                  required
                  onChange={(e) => setFullName(e.target.value)}
                />
                <FormGroup
                  className="mt-2"
                  type="email"
                  title="E-Mail"
                  placeholder="Your Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className=" font-gotham text-xs warning">{emailError}</p>
                <FormGroup
                  className="mt-2"
                  title="Mobile *"
                  placeholder="Mobile Number"
                  required
                  onChange={(e) => setMobile(e.target.value)}
                />
                <p className=" font-gotham text-xs warning">{mobileError}</p>
                <FormGroup
                  type="password"
                  className="mt-2"
                  title="Password*"
                  placeholder="Enter Password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button className="w-full py-1 mt-3 font-gotham font-normal text-base">
                  Register
                </Button>
              </form>
              <h3 className="font-gotham font-normal text-sm black-text my-2 text-center relative auth-border">
                Already have an account?
              </h3>
              <h3 className="font-gotham font-normal text-sm black-text">
                If you already have an account with us, Please{" "}
                <Link className="secondary-text" href={"/login"}>
                  Login
                </Link>
                .
              </h3>
            </div>
          </section>
        </main>
      ) : (
        <></>
      )}
    </>
  );
}

export default Login;
