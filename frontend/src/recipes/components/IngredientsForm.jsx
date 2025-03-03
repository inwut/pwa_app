import React from "react";
import TextField from "@mui/material/TextField";
import { useForm } from "react-hook-form";

import Button from "../../common/components/pageElements/Button.jsx";

const IngredientsForm = ({ onAdd, ingredients }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = (data) => {
    onAdd(data);
    reset();
  };

  return (
    <form className="form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Ingredient"
        type="text"
        autoComplete="off"
        fullWidth
        {...register("ingredient", {
          required: "Ingredient is required.",
          validate: (value) =>
            !ingredients.some((i) => i.ingredient === value) ||
            "This ingredient is already added.",
        })}
        error={!!errors.ingredient}
        helperText={errors.ingredient?.message}
      />
      <TextField
        label="Amount"
        type="text"
        autoComplete="off"
        fullWidth
        {...register("amount", {
          required: "Amount is required.",
        })}
        error={!!errors.amount}
        helperText={errors.amount?.message}
      />
      <Button filled text="Add to table" type="submit" disabled={!isValid} />
    </form>
  );
};

export default IngredientsForm;
