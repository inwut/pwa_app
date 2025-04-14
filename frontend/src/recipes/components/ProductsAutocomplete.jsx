import React, { useEffect, useState } from "react";
import useAutocomplete from "@mui/material/useAutocomplete";
import CloseIcon from "@mui/icons-material/Close";

import "./ProductsAutocomplete.css";
import useApiRequest from "../../common/hooks/useApiRequest.js";
import { saveArrayToIDB, getAllFromIDB } from "../../utils/indexedDb.js";

const ProductsAutocomplete = ({ onIngredientsChange }) => {
  const [ingredients, setIngredients] = useState([]);
  const { fetchData, isLoading } = useApiRequest();

  const {
    getRootProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
  } = useAutocomplete({
    id: "products-autocomplete",
    multiple: true,
    options: ingredients,
    getOptionLabel: (option) => option.name,
  });

  useEffect(() => {
    fetchIngredients();
  }, []);

  useEffect(() => {
    if (onIngredientsChange) {
      onIngredientsChange(value);
    }
  }, [value, onIngredientsChange]);

  const fetchIngredients = async () => {
    const data = await fetchData("recipes/ingredients");
    if (data) {
      setIngredients(data);
      await saveArrayToIDB("ingredients", data);
    } else {
      const cachedData = await getAllFromIDB("ingredients");
      if (cachedData) {
        setIngredients(cachedData);
      } else {
        setIngredients([]);
      }
    }
  };

  return (
    <section className="autocomplete" {...getRootProps()}>
      <div className="autocomplete__wrapper">
        {value.map((option, index) => {
          const { key, onDelete, ...other } = getTagProps({ index });
          return (
            <div
              className="autocomplete__item text--primary"
              key={key}
              {...other}
            >
              <span>{option.name}</span>
              <CloseIcon onClick={onDelete} />
            </div>
          );
        })}
        <input
          id="product-input"
          placeholder="Ingredient..."
          className="text--primary autocomplete__input"
          {...getInputProps()}
        />
      </div>
      {!isLoading && groupedOptions && groupedOptions.length > 0 ? (
        <ul className="autocomplete__list" {...getListboxProps()}>
          {groupedOptions.map((option, index) => {
            const { key, ...optionProps } = getOptionProps({ option, index });
            return (
              <li key={key} className="text--primary" {...optionProps}>
                {option.name}
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
};
export default ProductsAutocomplete;
