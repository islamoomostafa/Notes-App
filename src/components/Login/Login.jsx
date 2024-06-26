import React, { useContext, useEffect } from "react";
import style from "./Login.module.css";
import regsiterImage from "../../assets/images/register.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useState } from "react";
import { UserContext } from "../../Context/UserContext.jsx";

export default function Login() {
  const { userInfo, setUserInfo, token, setToken } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  let navigate = useNavigate();

  let validationSchema = Yup.object({
    email: Yup.string()
      .required("*email is required")
      .email("Please Enter a valid email"),

    password: Yup.string()
      .required("*password is required")
      .matches(/^[A-Z]/, "Password must start with capital letter")
      .min(8, "Password must be at least 8 characters")
      .max(25, "Password must be at most 25 characters"),
  });

  let formic = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: handleLogin,
  });

  async function handleLogin(values) {
    setIsLoading(true);
    let { data } = await axios.post(
      "https://movies-api.routemisr.com/signin",
      values
    );

    setIsLoading(false);

    if (data.message === "success") {
      await setToken(data.token);
      await setUserInfo(data.user);
      document.cookie = `token=${data.token}`;
      document.cookie = `userData=${JSON.stringify(data.user)}`;

      navigate("/");
    }

    data.message === "email doesn't exist"
      ? setEmailError(data.message)
      : setEmailError(false);

    data.message === "incorrect password"
      ? setPasswordError(data.message)
      : setPasswordError(false);
  }

  useEffect(() => {
    if (token == null) return;
    navigate("/");
  }, [token]);

  return (
    <section className="min-vh-100 d-flex align-items-center justify-content-center bg-red-900">
      <div className={`${style.container} row`}>
        <figure className="col-md-8 m-0 p-md-0">
          <div className="image-container">
            <img src={regsiterImage} className="w-100" alt="Regsiter Image" />
          </div>
        </figure>
        <form
          onSubmit={formic.handleSubmit}
          className="col-md-4 d-flex flex-column justify-content-center px-5"
        >
          <h2 dir="rtl" className="m-0 fw-bold font-Cairo">
            نوّرت مرة تانية <i className="fa-solid fa-heart ms-0 text-main"></i>
          </h2>
          <p dir="rtl" className="mb-3 mt-1">
            سجّل دخول عشان تدخل على حسابك
          </p>
          <div
            dir="rtl"
            className="form-group d-flex flex-column gap-2 justify-content-center"
          >
            <input
              type="email"
              className="form-control"
              placeholder="الإيميل"
              name="email"
              id="email"
              onBlur={formic.handleBlur}
              onChange={formic.handleChange}
              value={formic.values.email}
            />
            {formic.errors.email && formic.touched.email ? (
              <div className="error">{formic.errors.email}</div>
            ) : null}

            {emailError ? <div className="error">{emailError}</div> : null}

            <input
              type="password"
              className="form-control"
              placeholder="الباسورد"
              name="password"
              id="password"
              onBlur={formic.handleBlur}
              onChange={formic.handleChange}
              value={formic.values.password}
            />
            {formic.errors.password && formic.touched.password ? (
              <div className="error">{formic.errors.password}</div>
            ) : null}

            {passwordError ? (
              <div className="error">{passwordError}</div>
            ) : null}

            <button type="submit" className="btn btn-main">
              {isLoading ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                "تسجيل الدخول"
              )}
            </button>
            <p>
              لسة ما عملتش حساب عندنا؟ ..{" "}
              <Link to="/signup" className="text-decoration-underline">
                إنشاء حساب
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
