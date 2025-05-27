import React, { useEffect, useRef, useState } from "react";
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
import useApiRequest from "../../common/hooks/useApiRequest.js";
import { useNotification } from "../../common/providers/NotificationProvider.jsx";
import { deleteFromIDB, getFromIDB, saveToIDB } from "../../utils/indexedDb.js";

const CreateRecipePage = () => {
  const recipeId = useParams().recipeId;
  const [fetchedRecipe, setFetchedRecipe] = useState(null);
  const [draftRecipe, setDraftRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);
  const { fetchData, isLoading } = useApiRequest();
  const { showError, showInfo } = useNotification();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    trigger,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  const name = watch("name");
  const instructions = watch("instructions");

  useEffect(() => {
    if (recipeId) {
      fetchRecipeData();
    } else {
      loadDraftRecipe();
    }
  }, [recipeId]);

  useEffect(() => {
    if (fetchedRecipe) {
      setValues(fetchedRecipe);
    }
  }, [fetchedRecipe]);

  useEffect(() => {
    if (draftRecipe) {
      setValues(draftRecipe);
    }
  }, [draftRecipe]);

  useEffect(() => {
    if (recipeId) return;

    const timeout = setTimeout(() => {
      saveToIDB(
        "appData",
        {
          name,
          instructions,
          ingredients,
          image,
        },
        "draftRecipe",
      );
    }, 500);

    return () => clearTimeout(timeout);
  }, [name, instructions, ingredients, image]);

  const loadDraftRecipe = async () => {
    const draft = await getFromIDB("appData", "draftRecipe");
    if (draft) {
      setDraftRecipe(draft);
    }
  };

  const fetchRecipeData = async () => {
    const data = await fetchData(`recipes/edit/${recipeId}`);
    if (data) {
      setFetchedRecipe(data.recipe);
    } else {
      const profile = await getFromIDB("profile", "me");
      if (profile) {
        const recipe = profile.recipes.find((r) => r.id === +recipeId);
        setFetchedRecipe(recipe);
      } else {
        setFetchedRecipe(null);
      }
    }
  };

  const setValues = (recipe) => {
    if (recipe.name) {
      setValue("name", recipe.name, { shouldDirty: true, shouldTouch: true });
      trigger("name");
    }
    if (recipe.instructions) {
      setValue("instructions", recipe.instructions, {
        shouldDirty: true,
        shouldTouch: true,
      });
      trigger("instructions");
    }
    if (recipe.ingredients) setIngredients(recipe.ingredients);
    if (recipe.image) {
      setImage(recipe.image);
      setImagePreview(
        recipeId
          ? `http://localhost:5000/uploads/${fetchedRecipe.image}`
          : URL.createObjectURL(recipe.image),
      );
    }
    setFocus("name");
  };

  const onSubmit = async (data) => {
    if (!navigator.onLine) {
      showInfo("You're offline. Please, try again once you're back online.");
      return;
    }
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
      let response;
      if (recipeId) {
        response = await api.put(`recipes/${recipeId}`, formData);
      } else {
        response = await api.post("recipes/", formData);
        await deleteFromIDB("appData", "draftRecipe");
      }
      navigate(`/recipes/${response.data.recipe.id}`);
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
                value={name || ""}
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
                value={instructions || ""}
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
                ref={fileInputRef}
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
