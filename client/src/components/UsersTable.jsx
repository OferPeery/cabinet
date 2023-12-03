import React, { useContext } from "react";
import {
  Paper,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  TableContainer,
  IconButton,
  Tooltip,
} from "@mui/material";
import { DeleteForever } from "@mui/icons-material";
import UserContext from "../context/UserContext";

const UsersTable = ({ users, onDelete }) => {
  const { currentUser } = useContext(UserContext);

  return (
    <TableContainer
      component={Paper}
      sx={{ width: 600, height: 440, overflow: "scroll" }}
    >
      <Table
        sx={{ width: 600, minWidth: 600, maxHeight: 440 }}
        stickyHeader
        size="small"
      >
        <TableHead>
          <TableRow>
            <TableCell style={{ width: 200 }}>Username</TableCell>
            <TableCell>First name</TableCell>
            <TableCell>Last name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users?.map((user) => {
            const { _id, username, firstName, lastName, email } = user;
            const isCurrentUser = _id === currentUser._id;
            return (
              <TableRow
                key={_id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover .actions": { visibility: "visible" },
                }}
              >
                <TableCell component="th" scope="row">
                  {username}
                </TableCell>
                <TableCell>{firstName}</TableCell>
                <TableCell>{lastName}</TableCell>
                <TableCell>{email}</TableCell>
                <TableCell>
                  <Tooltip
                    title={
                      isCurrentUser
                        ? "You can't delete yourself"
                        : "Delete forever"
                    }
                    placement="top"
                    disableInteractive
                    arrow
                  >
                    <span>
                      <IconButton
                        className="actions"
                        color="error"
                        sx={{ visibility: "hidden" }}
                        onClick={() => onDelete(user)}
                        disabled={isCurrentUser}
                      >
                        <DeleteForever />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UsersTable;
