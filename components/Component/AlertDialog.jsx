// libraries
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

export default function AlertDialog({ open, onClose, title }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-label={title}
      PaperProps={{
        sx: {
          minWidth: 300,
          minHeight: 130,
        },
      }}
    >
      <DialogTitle sx={{ typography: "subtitle1", whiteSpace: "nowrap" }}>
        {title}
      </DialogTitle>
      <DialogActions>
        <Button onClick={onClose}>닫기</Button>
      </DialogActions>
    </Dialog>
  );
}
