import React from "react";
import {
  Paper,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  TableContainer,
} from "@mui/material";

const ActivityLogTable = ({ activityLog }) => {
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
            <TableCell style={{ width: 200 }}>Time</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Activity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {activityLog
            ?.sort((a, b) => b.timestamp - a.timestamp)
            .map((log) => (
              <TableRow
                key={log._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {new Date(log.timestamp).toLocaleString()}
                </TableCell>
                <TableCell>{log.username}</TableCell>
                <TableCell>{log.activityType}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ActivityLogTable;
