// libraries
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export default function ConfirmDialog({
  open,
  onConfirm,
  onClose,
  title,
  content,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          minWidth: 350,
          minHeight: 160,
        },
      }}
    >
      <DialogTitle sx={{ typography: "subtitle1" }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ typography: "body2", whiteSpace: "pre-line" }}>
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm}>확인</Button>
        <Button onClick={onClose}>닫기</Button>
      </DialogActions>
    </Dialog>
  );
}
