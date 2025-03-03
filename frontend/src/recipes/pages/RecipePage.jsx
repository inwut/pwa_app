import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";

import "./RecipePage.css";
import PageHeader from "../../common/components/pageElements/PageHeader.jsx";
import PageTitle from "../../common/components/pageElements/PageTitle.jsx";
import Info from "../../common/components/pageElements/Info.jsx";
import Button from "../../common/components/pageElements/Button.jsx";
import Like from "../components/Like.jsx";
import Image from "../../common/components/pageElements/Image.jsx";
import IngredientsTable from "../components/IngredientsTable.jsx";
import Comment from "../components/Comment.jsx";

const RecipePage = () => {
  const navigate = useNavigate();
  const recipeId = useParams().recipeId;
  const [recipe, setRecipe] = useState({
    author: {},
    comments: [],
    ingredients: [],
  });
  const [comment, setComment] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const testRecipe = {
    id: 1,
    isLiked: true,
    name: "Healthy breakfast",
    image:
      "https://wallpapers.com/images/hd/aesthetic-food-pictures-yw84jpuaeol0h8vh.jpg",
    author: {
      id: 0,
      username: "dariavetrykush",
    },
    likes: 45,
    instructions:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam aliquam id nunc et rutrum. Vestibulum sit amet sapien imperdiet, rhoncus odio eget, bibendum nibh. Phasellus ac leo vitae tortor sodales dignissim. Phasellus sodales pulvinar sapien eu malesuada. Quisque placerat, magna ac hendrerit ullamcorper, massa tortor porta dui, at blandit arcu nunc eget nisi. Proin ullamcorper leo quam, a varius leo luctus et. Mauris dignissim massa a risus blandit, at posuere lacus tincidunt. In hac habitasse platea dictumst. Ut condimentum nulla vitae odio vestibulum maximus sit amet a nisl. Pellentesque sed rhoncus orci. Donec ultricies eros ac massa dignissim vehicula. Donec ut cursus lorem. Maecenas non arcu euismod, interdum orci ut, vulputate libero. Donec id dolor accumsan, mollis est ac, scelerisque velit. Donec malesuada, nulla in maximus tincidunt, nisi odio semper justo, ut consequat velit mauris vel orci. Donec faucibus odio dolor, vehicula consectetur diam aliquet non.",
    ingredients: [
      { id: 1, ingredient: "Bread", amount: "2 slices" },
      { id: 2, ingredient: "Tomatoes", amount: "2" },
      { id: 3, ingredient: "Sour cream", amount: "to taste" },
    ],
    comments: [
      {
        id: 1,
        text: "Lorem ipsum dolor sit amet.",
        author: { id: 1, username: "1" },
        responses: [
          {
            id: 2,
            text: 'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.',
            author: { id: 2, username: "1.1" },
          },
        ],
      },
      {
        id: 3,
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing.",
        author: { id: 1, username: "2" },
        responses: [
          {
            id: 4,
            text: "Lorem ipsum.",
            author: { id: 2, username: "2.1" },
          },
          {
            id: 5,
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ut.",
            author: { id: 2, username: "2.2" },
            responses: [
              {
                id: 6,
                text: 'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.',
                author: { id: 2, username: "2.2.1" },
              },
            ],
          },
        ],
      },
    ],
  };

  useEffect(() => {
    fetchRecipeData();
  }, []);

  const fetchRecipeData = () => {
    //api request
    setRecipe(testRecipe);
  };

  const deleteRecipeHandler = () => {
    //api request
    navigate(-1);
  };

  const sendCommentHandler = () => {
    //api request
  };

  const openDeleteModalHandler = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModalHandler = () => {
    setShowDeleteModal(false);
  };

  const countComments = (comments) => {
    let counter = 0;
    const count = (comments) => {
      comments.forEach((comment) => {
        counter++;
        if (comment.responses) {
          count(comment.responses);
        }
      });
    };
    count(comments);
    return counter;
  };

  return (
    <>
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
      <PageHeader>
        <PageTitle text={recipe.name} />
        <div className="recipe__toolbar">
          {recipe.author.id === 0 && (
            <>
              <Link to={`/recipes/edit/${recipe.id}`}>
                <Button icon={<EditIcon />} size="large" />
              </Link>
              <Button
                icon={<DeleteOutlineIcon />}
                size="large"
                onClick={openDeleteModalHandler}
              />
            </>
          )}
          <Like
            isLiked={recipe.isLiked}
            likes={recipe.likes}
            recipeId={recipeId}
          />
        </div>
      </PageHeader>
      <Info>
        <Link to={`/profile/${recipe.author.id}`}>
          <Button text={`@${recipe.author.username}`} size="large" />
        </Link>
      </Info>
      <Image
        imageSrc={recipe.image}
        altText={recipe.name}
        classNames="recipe__photo"
      />
      <section className="recipe__main-info">
        <div className="recipe__instructions">
          <h3 className="text--heading recipe__section-title">Instructions</h3>
          <p>{recipe.instructions}</p>
        </div>
        <IngredientsTable show rows={recipe.ingredients} />
      </section>
      <h3 className="text--heading recipe__section-title">
        {countComments(recipe.comments)} Comments
      </h3>
      <section>
        <div className="comment-field">
          <TextField
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
        {recipe.comments.map((c) => (
          <Comment key={c.id} parent comment={c} />
        ))}
      </section>
    </>
  );
};

export default RecipePage;
