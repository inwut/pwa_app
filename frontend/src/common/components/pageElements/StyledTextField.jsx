import { TextField, styled } from "@mui/material";

const StyledTextField = styled(TextField)`
  & label {
    z-index: 0;
    font-family: "Libre Franklin", serif;
    font-optical-sizing: auto;
    font-style: normal;
    color: #74796d;
  }

  & input {
    font-family: "Libre Franklin", serif;
    font-optical-sizing: auto;
    font-style: normal;
    color: #141e0c;
  }

  & label.Mui-focused {
    color: #476730;
  }

  & .Mui-underline:after,
  & .MuiInput-root:after {
    border-bottom-color: #476730;
  }

  & .MuiOutlinedInput-root fieldset {
    border-color: #e0e3e7;
  }

  & .MuiOutlinedInput-root:hover fieldset,
  & .MuiOutlinedInput-root.Mui-focused fieldset,
  & .MuiInput-root:hover fieldset,
  & .MuiInput-root.Mui-focused fieldset {
    border-color: #476730;
  }
`;

export default StyledTextField;
