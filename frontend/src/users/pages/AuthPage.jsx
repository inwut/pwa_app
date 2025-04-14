import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import "./AuthPage.css";
import PageHeader from "../../common/components/pageElements/PageHeader.jsx";
import PageTitle from "../../common/components/pageElements/PageTitle.jsx";
import Button from "../../common/components/pageElements/Button.jsx";
import StyledTextField from "../../common/components/pageElements/StyledTextField.jsx";
import { useAuth } from "../../common/providers/AuthProvider.jsx";

const AuthPage = () => {
  const { signup, login } = useAuth();
  const navigate = useNavigate();
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const {
    register,
    handleSubmit,
    unregister,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  const switchModeHandler = () => {
    setIsSignUpMode((prevState) => !prevState);
    unregister("username");
  };

  const onSubmit = async ({ username, email, password }) => {
    if (isSignUpMode) {
      await signup(username, email, password);
    } else {
      await login(email, password);
    }
    navigate("/");
  };

  return (
    <>
      <PageHeader>
        <PageTitle text={isSignUpMode ? "Sign Up" : "Log In"} />
      </PageHeader>
      <form
        className="form form--auth"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        {isSignUpMode && (
          <StyledTextField
            label="Username"
            type="text"
            {...register("username", {
              required: "Username is required.",
              minLength: {
                value: 3,
                message: "Username should be minimum of 3 characters.",
              },
              maxLength: {
                value: 20,
                message: "Username should be maximum of 20 characters.",
              },
            })}
            error={!!errors.username}
            helperText={errors.username?.message}
            autoComplete="off"
            fullWidth
          />
        )}
        <StyledTextField
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
        <StyledTextField
          label="Password"
          type="password"
          {...register("password", {
            required: "Password is required.",
            minLength: {
              value: 6,
              message: "Password should be minimum of 6 characters.",
            },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
          autoComplete={isSignUpMode ? "new-password" : "off"}
          fullWidth
        />
        <Button
          classNames="form__auth-button"
          text={isSignUpMode ? "Sign Up" : "Log In"}
          size="large"
          type="submit"
          filled
          disabled={!isValid}
        />
        <Button
          classNames="form__switch-button"
          text={`Switch to ${isSignUpMode ? "Log In" : "Sign Up"}`}
          type="button"
          onClick={switchModeHandler}
        />
      </form>
    </>
  );
};

export default AuthPage;
