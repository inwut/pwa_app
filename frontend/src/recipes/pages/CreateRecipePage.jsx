import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PhotoIcon from "@mui/icons-material/Photo";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import ClearIcon from "@mui/icons-material/Clear";

import "./CreateRecipePage.css";
import PageHeader from "../../common/components/pageElements/PageHeader.jsx";
import PageTitle from "../../common/components/pageElements/PageTitle.jsx";
import IngredientsForm from "../components/IngredientsForm.jsx";
import Button from "../../common/components/pageElements/Button.jsx";
import IngredientsTable from "../components/IngredientsTable.jsx";
import Image from "../../common/components/pageElements/Image.jsx";
import StyledTextField from "../../common/components/pageElements/StyledTextField.jsx";

const CreateRecipePage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  const recipeId = useParams().recipeId;
  const [ingredients, setIngredients] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    if (recipeId) {
      fetchRecipeData();
    }
  }, []);

  const fetchRecipeData = () => {
    // api request
    setValue("title", "Healthy breakfast", { shouldValidate: true });
    setValue("instructions", "Instructions", {
      shouldValidate: true,
    });
    setPhoto("PHOTO");
    setPhotoPreview(
      "https://wallpapers.com/images/hd/aesthetic-food-pictures-yw84jpuaeol0h8vh.jpg",
    );
    setIngredients([{ id: 1, ingredient: "bread", amount: "2" }]);
  };

  const onSubmit = (data) => {
    if (recipeId) {
      // api request put
    } else {
      // api request post
    }
  };

  const addIngredientHandler = (ingredient) => {
    setIngredients([...ingredients, { id: uuidv4(), ...ingredient }]);
  };

  const deleteIngredientHandler = (id) => {
    setIngredients(ingredients.filter((i) => i.id !== id));
  };

  const changePhotoHandler = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const uploadPhotoHandler = () => {
    document.getElementById("fileInput").click();
  };

  const deletePhotoHandler = () => {
    setPhoto(null);
    setPhotoPreview("");
  };

  return (
    <>
      <PageHeader>
        <PageTitle text={`${recipeId ? "Edit" : "Create"} Recipe`} />
      </PageHeader>
      <div className="create-recipe">
        <form className="form" noValidate>
          <StyledTextField
            label="Title"
            type="text"
            autoComplete="off"
            fullWidth
            {...register("title", {
              required: "Title is required.",
            })}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
          <StyledTextField
            label="Instructions"
            type="text"
            multiline
            minRows="3"
            autoComplete="off"
            fullWidth
            {...register("instructions", {
              required: "Instructions are required.",
            })}
            error={!!errors.instructions}
            helperText={errors.instructions?.message}
          />
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={changePhotoHandler}
          />
          <Button
            filled
            text={photoPreview ? "Change photo" : "Add photo"}
            icon={<PhotoIcon />}
            onClick={uploadPhotoHandler}
          />
          {photoPreview && (
            <div className="create-recipe__image-wrapper">
              <Button
                icon={<ClearIcon />}
                classNames="create-recipe__close-button"
                filled
                onClick={deletePhotoHandler}
              />
              <Image imageSrc={photoPreview} alt="Recipe photo" />
            </div>
          )}
        </form>
        <IngredientsForm
          onAdd={addIngredientHandler}
          ingredients={ingredients}
        />
        <IngredientsTable
          create
          rows={ingredients}
          onDelete={deleteIngredientHandler}
        />
        <Button
          classNames="create-recipe__submit-button"
          text="Submit"
          filled
          size="large"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid || ingredients.length === 0}
        />
      </div>
    </>
  );
};

export default CreateRecipePage;
