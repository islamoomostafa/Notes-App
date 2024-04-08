import React from "react";
import style from "./Register.module.css";
import regsiterImage from "../../assets/images/register.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useState } from "react";

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState(false);

  let navigate = useNavigate();
  let validationSchema = Yup.object({
    first_name: Yup.string()
      .required("لازم تكتب إسمك الأول")
      .min(3, "إسمك الأول لازم يبقى أكتر من 3 حروف")
      .max(25, "إسمك الأول لازم يبقى أقل من 25 حرف"),

    last_name: Yup.string()
      .required("لازم تكتب إسمك الأخير")
      .min(3, "إسمك الأخير لازم يبقى أكتر من 3 حروف")
      .max(25, "إسمك الأخير لازم يبقى أقل من 25 حرف"),

    email: Yup.string()
      .required("لازم تكتب إيميل")
      .email("من فضلك اكتب الإيميل مظبوط"),

    password: Yup.string()
      .required("لازم تكتب باسورد")
      .matches(/^[A-Z]/, "الباسورد لازم يبدأ بحرف كابيتال")
      .min(8, "الباسورد لازم يبقى أكتر من 8 حروف")
      .max(25, "الباسورد لازم يبقى أقل من 25 حرف"),

    age: Yup.number()
      .required("لازم تكتب سنّك")
      .min(16, "سنك لازم يكون أكبر من 16"),
  });

  let formic = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      age: "",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  async function handleSubmit(values) {
    setIsLoading(true);
    let { data } = await axios.post(
      "https://sticky-note-fe.vercel.app/signup",
      values
    );

    console.log(data);

    if (data.message === "success") {
      setIsLoading(false);
      navigate("/login");
    }

    if (data.errors.email) {
      setIsLoading(false);
      setValidationError(data.errors.email.message);
    }
  }

  return (
    <section
      className={`min-vh-100 d-flex align-items-center justify-content-center`}
    >
      <div className={`${style.container} row `}>
        <figure className="col-md-8 m-0 p-md-0 ">
          <div className="image-container ">
            <img
              src={regsiterImage}
              className={`${style.img} w-100`}
              alt="Regsiter Image"
            />
          </div>
        </figure>
        <form
          dir="rtl"
          onSubmit={formic.handleSubmit}
          className="col-md-4 d-flex flex-column justify-content-center px-5"
        >
          <h2 className="m-0 mb-3 fw-bold font-Cairo">إنشاء حساب</h2>
          <div className="form-group d-flex flex-column gap-2 justify-content-center">
            <input
              type="text"
              className="form-control"
              placeholder="الإسم الأول"
              name="first_name"
              id="first_name"
              onBlur={formic.handleBlur}
              onChange={formic.handleChange}
              value={formic.values.first_name}
            />
            {formic.errors.first_name && formic.touched.first_name ? (
              <div className="error">{formic.errors.first_name}</div>
            ) : null}
            <input
              type="text"
              className="form-control"
              placeholder="الإسم الأخير"
              name="last_name"
              id="last_name"
              onBlur={formic.handleBlur}
              onChange={formic.handleChange}
              value={formic.values.last_name}
            />
            {formic.errors.last_name && formic.touched.last_name ? (
              <div className="error">{formic.errors.last_name}</div>
            ) : null}
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
            {validationError ? (
              <div className="error">{validationError}</div>
            ) : null}
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
            <input
              type="text"
              inputMode="numeric"
              className="form-control"
              placeholder="السن"
              name="age"
              id="age"
              onBlur={formic.handleBlur}
              onChange={formic.handleChange}
              value={formic.values.age}
            />
            {formic.errors.age && formic.touched.age ? (
              <div className="error">{formic.errors.age}</div>
            ) : null}
            <button type="submit" className="btn btn-main">
              {isLoading ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                "إنشاء حساب"
              )}
            </button>
            <p>
              عندك حساب عندنا بالفعل؟ ..{" "}
              <Link to="/login" className="text-decoration-underline">
                سجّل دخول
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
