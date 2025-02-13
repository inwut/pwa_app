import * as React from "react";
import useAutocomplete from "@mui/material/useAutocomplete";
import CloseIcon from "@mui/icons-material/Close";

import "./ProductsAutocomplete.css";

const AutocompleteItem = ({ label, onDelete, ...other }) => {
  return (
    <div className="autocomplete__item" {...other}>
      <span>{label}</span>
      <CloseIcon onClick={onDelete} />
    </div>
  );
};

const ProductsAutocomplete = ({ options }) => {
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
    options: options,
    getOptionLabel: (option) => option.title,
  });

  return (
    <section className="autocomplete" {...getRootProps()}>
      <div className="autocomplete__wrapper">
        {value.map((option, index) => {
          const { key, ...tagProps } = getTagProps({ index });
          return (
            <AutocompleteItem key={key} {...tagProps} label={option.title} />
          );
        })}
        <input
          id="product-input"
          placeholder="Product..."
          className="autocomplete__input"
          {...getInputProps()}
        />
      </div>
      {groupedOptions.length > 0 ? (
        <ul className="autocomplete__list" {...getListboxProps()}>
          {groupedOptions.map((option, index) => {
            const { key, ...optionProps } = getOptionProps({ option, index });
            return (
              <li key={key} {...optionProps}>
                {option.title}
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
};

export default ProductsAutocomplete;
