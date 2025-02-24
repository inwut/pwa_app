import React, { useState } from "react";
import { useForm } from "react-hook-form";

import "./AuthPage.css";
import PageHeader from "../../common/components/pageElements/PageHeader.jsx";
import PageTitle from "../../common/components/pageElements/PageTitle.jsx";
import Button from "../../common/components/formElements/Button.jsx";
import TextField from "@mui/material/TextField";

const AuthPage = () => {
  const [signUpMode, setSignUpMode] = useState(true);
  const {
    register,
    handleSubmit,
    unregister,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  const switchModeHandler = () => {
    setSignUpMode((prevState) => !prevState);
    unregister("username");
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <>
      <PageHeader>
        <PageTitle text={signUpMode ? "Sign Up" : "Log In"} />
      </PageHeader>
      <form
        className="form form--auth"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        {signUpMode && (
          <TextField
            label="Username"
            type="text"
            {...register("username", {
              required: "Username is required.",
              minLength: {
                value: 3,
                message: "Username should be minimum of 3 symbols.",
              },
            })}
            error={!!errors.username}
            helperText={errors.username?.message}
            autoComplete="off"
            fullWidth
          />
        )}
        <TextField
          label="Email"
          type="email"
          {...register("email", {
            required: "Email is required.",
            pattern: {
              value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
              message: "Incorrect email address.",
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
          autoComplete="email"
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          {...register("password", {
            required: "Password is required.",
            minLength: {
              value: 6,
              message: "Password should be minimum of 6 symbols.",
            },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
          autoComplete={signUpMode ? "new-password" : "off"}
          fullWidth
        />
        <Button
          classNames="form__auth-button"
          text={signUpMode ? "Sign Up" : "Log In"}
          size="large"
          type="submit"
          filled
          disabled={!isValid}
        />
        <Button
          classNames="form__switch-button"
          text={`Switch to ${signUpMode ? "Log In" : "Sign Up"}`}
          type="button"
          onClick={switchModeHandler}
        />
      </form>
    </>
  );
};

export default AuthPage;
