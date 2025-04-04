import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PhotoIcon from "@mui/icons-material/Photo";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import ClearIcon from "@mui/icons-material/Clear";

import api from "../../common/api.js";
import "./CreateRecipePage.css";
import PageHeader from "../../common/components/pageElements/PageHeader.jsx";
import PageTitle from "../../common/components/pageElements/PageTitle.jsx";
import IngredientsForm from "../components/IngredientsForm.jsx";
import Button from "../../common/components/pageElements/Button.jsx";
import IngredientsTable from "../components/IngredientsTable.jsx";
import Image from "../../common/components/pageElements/Image.jsx";
import StyledTextField from "../../common/components/pageElements/StyledTextField.jsx";
import Loader from "../../common/components/Loader.jsx";
import useApiRequest from "../../common/hooks/useApiRequest.jsx";
import { useError } from "../../common/providers/ErrorProvider.jsx";
import { getFromIDB } from "../../utils/indexedDb.js";

const CreateRecipePage = () => {
  const recipeId = useParams().recipeId;
  const [fetchedRecipe, setFetchedRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const { fetchData, isLoading } = useApiRequest();
  const { showError } = useError();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    if (recipeId) {
      fetchRecipeData();
    }
  }, [recipeId]);

  useEffect(() => {
    if (fetchedRecipe) {
      setValues();
    }
  }, [fetchedRecipe]);

  const fetchRecipeData = async () => {
    const data = await fetchData(`recipes/edit/${recipeId}`);
    if (data) {
      setFetchedRecipe(data.recipe);
    } else {
      const profile = await getFromIDB("profile", "me");
      if (profile) {
        const recipe = profile.recipes.find((r) => r.id === recipeId);
        setFetchedRecipe(recipe);
      } else {
        setFetchedRecipe(null);
      }
    }
  };

  const setValues = () => {
    setValue("name", fetchedRecipe.name);
    setValue("instructions", fetchedRecipe.instructions);
    setIngredients(fetchedRecipe.ingredients);
    if (fetchedRecipe.image) {
      setImage(fetchedRecipe.image);
      setImagePreview(`http://localhost:5000/uploads/${fetchedRecipe.image}`);
    }
    setFocus("name");
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("instructions", data.instructions);
    formData.append(
      "ingredients",
      JSON.stringify(ingredients.map(({ id, ...rest }) => rest)),
    );
    if (image) {
      formData.append("image", image);
    }
    try {
      if (recipeId) {
        await api.put(`recipes/${recipeId}`, formData);
        navigate(`/recipes/${recipeId}`);
      } else {
        const response = await api.post("recipes/", formData);
        navigate(`/recipes/${response.data.recipe.id}`);
      }
    } catch (error) {
      showError(error);
    }
  };

  const addIngredientHandler = (ingredient) => {
    setIngredients([...ingredients, { id: uuidv4(), ...ingredient }]);
  };

  const deleteIngredientHandler = (id) => {
    setIngredients(ingredients.filter((i) => i.id !== id));
  };

  const changeImageHandler = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImageHandler = () => {
    document.getElementById("fileInput").click();
  };

  const deleteImageHandler = () => {
    setImage(null);
    setImagePreview("");
  };

  return (
    <>
      <PageHeader>
        <PageTitle text={`${recipeId ? "Edit" : "Create"} Recipe`} />
      </PageHeader>
      {recipeId && isLoading ? (
        <Loader />
      ) : (
        (fetchedRecipe !== null || !recipeId) && (
          <div className="create-recipe">
            <form className="form" noValidate>
              <StyledTextField
                label="Name"
                type="text"
                autoComplete="off"
                fullWidth
                {...register("name", {
                  required: "Name is required.",
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
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
                onChange={changeImageHandler}
              />
              <Button
                filled
                text={imagePreview ? "Change image" : "Add image"}
                icon={<PhotoIcon />}
                onClick={uploadImageHandler}
              />
              {imagePreview && (
                <div className="create-recipe__image-wrapper">
                  <Button
                    icon={<ClearIcon />}
                    classNames="create-recipe__close-button"
                    filled
                    onClick={deleteImageHandler}
                  />
                  <Image imageSrc={imagePreview} alt="Recipe image" />
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
        )
      )}
    </>
  );
};

export default CreateRecipePage;
