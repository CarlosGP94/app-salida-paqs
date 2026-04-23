import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import {
  gridPageSelector,
  gridPageCountSelector,
  useGridApiContext,
  useGridSelector,
  gridPageSizeSelector,
} from "@mui/x-data-grid";
import React from "react";

const DataGridFooter = () => {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  const pageSize = useGridSelector(apiRef, gridPageSizeSelector);
  const rowsCount = apiRef.current.getRowsCount();
  const limitMax =
    rowsCount < (page + 1) * pageSize ? rowsCount : (page + 1) * pageSize;

  return (
    <Stack
      alignItems="center"
      justifyContent="space-between"
      pl={3}
      pr={1.6}
      width={1}
    >
      <Typography
        variant="body2"
        color="text.primary"
      >{`${page * pageSize + 1}-${limitMax} de ${rowsCount}`}</Typography>
      <Pagination
        color="primary"
        count={pageCount}
        page={page + 1}
        onChange={(event, value) => {
          event.preventDefault();
          apiRef.current.setPage(value - 1);
        }}
      />
    </Stack>
  );
};

export default DataGridFooter;
