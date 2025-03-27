import React from "react";
import { useForm } from "react-hook-form";

import Button from "../../common/components/pageElements/Button.jsx";
import StyledTextField from "../../common/components/pageElements/StyledTextField.jsx";

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
      <StyledTextField
        label="Ingredient"
        type="text"
        autoComplete="off"
        fullWidth
        {...register("name", {
          required: "Ingredient is required.",
          validate: {
            noCommas: (value) =>
              !value.includes(",") || "Ingredient name cannot contain commas.",
            notDuplicate: (value) =>
              !ingredients.some((i) => i.ingredient === value) ||
              "This ingredient is already added.",
          },
        })}
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      <StyledTextField
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
