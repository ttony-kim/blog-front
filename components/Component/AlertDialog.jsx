import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";

export default function AlertDialog({ open, onClose, title }) {
  return (
    <Dialog open={open} onClose={onClose} aria-label={title}>
      <DialogTitle sx={{ typography: "subtitle1" }}>{title}</DialogTitle>
      <DialogActions>
        <Button onClick={onClose}>닫기</Button>
      </DialogActions>
    </Dialog>
  );
}
