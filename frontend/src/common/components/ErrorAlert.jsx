import React, { useState } from "react";
import { Alert, AlertTitle, Zoom, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ErrorAlert = ({ message, onClose }) => {
  const [open, setOpen] = useState(true);
  return (
    <Zoom in={open}>
      <Alert
        severity="error"
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              setOpen(false);
              onClose();
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{
          position: "absolute",
          zIndex: 3,
          top: "2%",
          left: "50%",
          transform: "translateX(-50%) !important",
        }}
      >
        <AlertTitle>Oops!</AlertTitle>
        {message}
      </Alert>
    </Zoom>
  );
};

export default ErrorAlert;
