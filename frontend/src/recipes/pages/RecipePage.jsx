import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SendIcon from "@mui/icons-material/Send";
import Modal from "@mui/material/Modal";

import api from "../../common/api.js";
import "./RecipePage.css";
import PageHeader from "../../common/components/pageElements/PageHeader.jsx";
import PageTitle from "../../common/components/pageElements/PageTitle.jsx";
import Info from "../../common/components/pageElements/Info.jsx";
import Button from "../../common/components/pageElements/Button.jsx";
import Like from "../components/Like.jsx";
import Image from "../../common/components/pageElements/Image.jsx";
import IngredientsTable from "../components/IngredientsTable.jsx";
import Comment from "../components/Comment.jsx";
import Loader from "../../common/components/Loader.jsx";
import StyledTextField from "../../common/components/pageElements/StyledTextField.jsx";
import defaultImage from "../../assets/defaultRecipeImage.jpg";
import useApiRequest from "../../common/hooks/useApiRequest.jsx";
import { useAuth } from "../../common/providers/AuthProvider.jsx";
import { useError } from "../../common/providers/ErrorProvider.jsx";
import { saveToIDB, getFromIDB } from "../../utils/indexedDb.js";

const RecipePage = () => {
  const recipeId = useParams().recipeId;
  const { currentUser } = useAuth();
  const { fetchData, isLoading } = useApiRequest();
  const { showError } = useError();
  const [recipe, setRecipe] = useState(null);
  const [comment, setComment] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipeData();
  }, []);

  const fetchRecipeData = async () => {
    const data = await fetchData(`recipes/${recipeId}`);
    if (data) {
      setRecipe(data.recipe);
      await saveToIDB("recipes", data.recipe);
    } else {
      const cachedData = await getFromIDB("recipes", +recipeId);
      if (cachedData && cachedData.ingredients) {
        setRecipe(cachedData);
      } else {
        setRecipe(null);
      }
    }
  };

  const deleteRecipeHandler = async () => {
    try {
      await api.delete(`recipes/${recipeId}`);
    } catch (error) {
      showError(error);
    }
    navigate(-1);
  };

  const sendCommentHandler = async () => {
    try {
      await api.post("comments/", {
        content: comment,
        recipeId: recipe.id,
      });
      await fetchRecipeData();
      setComment("");
    } catch (error) {
      showError(error);
    }
  };

  const openDeleteModalHandler = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModalHandler = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : recipe !== null ? (
        <>
          {currentUser && currentUser.id === recipe.author.id && (
            <Modal open={showDeleteModal} onClose={closeDeleteModalHandler}>
              <div className="recipe__modal">
                <p className="text--primary recipe__modal-text">
                  Are you sure you want to delete this recipe?
                </p>
                <div className="recipe__modal-buttons">
                  <Button text="Delete" filled onClick={deleteRecipeHandler} />
                  <Button text="Cancel" onClick={closeDeleteModalHandler} />
                </div>
              </div>
            </Modal>
          )}
          <PageHeader>
            <PageTitle text={recipe.name} />
            <div className="recipe__toolbar">
              {currentUser && currentUser.id === recipe.author.id && (
                <Link to={`/recipes/edit/${recipe.id}`}>
                  <Button icon={<EditIcon />} size="large" />
                </Link>
              )}
              {currentUser &&
                (currentUser.id === recipe.author.id ||
                  currentUser.role === "admin") && (
                  <Button
                    icon={<DeleteOutlineIcon />}
                    size="large"
                    onClick={openDeleteModalHandler}
                  />
                )}
              <Like
                isLiked={recipe.isLiked}
                likes={recipe.likesCount}
                recipeId={recipe.id}
                updateRecipeData={fetchRecipeData}
                disabled={currentUser && currentUser.role === "admin"}
              />
            </div>
          </PageHeader>
          <Info>
            <Link to={`/profile/${recipe.author.id}`}>
              <Button text={`@${recipe.author.username}`} size="large" />
            </Link>
            <span>{new Date(recipe.createdAt).toDateString()}</span>
          </Info>
          <Image
            imageSrc={
              recipe.image
                ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${recipe.image}`
                : defaultImage
            }
            altText={recipe.name}
            classNames="recipe__photo"
          />
          <section className="recipe__main-info">
            <div className="recipe__instructions">
              <h3 className="text--heading recipe__section-title">
                Instructions
              </h3>
              <p>{recipe.instructions}</p>
            </div>
            <IngredientsTable show rows={recipe.ingredients} />
          </section>
          <h3 className="text--heading recipe__section-title">
            {recipe.commentsCount} Comments
          </h3>
          <section>
            {currentUser && currentUser.role === "user" && (
              <div className="comment-field">
                <StyledTextField
                  label="Comment"
                  type="text"
                  autoComplete="off"
                  variant="standard"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  fullWidth
                />
                <Button
                  icon={<SendIcon />}
                  disabled={comment.length === 0}
                  onClick={sendCommentHandler}
                />
              </div>
            )}
            {recipe.comments.map((c) => (
              <Comment
                key={c.id}
                isParent
                comment={c}
                recipeId={recipe.id}
                reloadData={fetchRecipeData}
              />
            ))}
          </section>
        </>
      ) : (
        <p className="text--primary text--filler">
          Oops... No recipe found for this request.
        </p>
      )}
    </>
  );
};

export default RecipePage;
