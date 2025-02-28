import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Paper } from "@mui/material";

import "./IngredientsTable.css";
import Button from "../../common/components/formElements/Button.jsx";

const IngredientsTable = ({ create, show, rows, onDelete }) => {
  return (
    <div className="table">
      <TableContainer component={Paper}>
        <Table size="small">
          {create && (
            <TableHead>
              <TableRow>
                <TableCell>Ingredient</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
          )}
          {show && (
            <TableHead>
              <TableRow>
                <TableCell>
                  <h3 className="text--heading recipe__section-title">
                    Ingredients
                  </h3>
                </TableCell>
              </TableRow>
            </TableHead>
          )}
          <TableBody>
            {rows.map(({ id, ingredient, amount }) => (
              <TableRow key={id}>
                <TableCell>{ingredient}</TableCell>
                <TableCell>{amount}</TableCell>
                {create && (
                  <TableCell>
                    <Button
                      icon={<DeleteOutlineIcon />}
                      onClick={() => onDelete(id)}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default IngredientsTable;
