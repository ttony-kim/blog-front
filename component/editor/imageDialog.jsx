import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";

export default function ImageDialog({ open, handleClose, handleImageUpload }) {
  const [url, setUrl] = useState("");

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          minWidth: "30%",
        },
      }}
    >
      <DialogTitle>Image Add</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="url"
          label="URL"
          variant="standard"
          fullWidth
          onChange={(e) => {
            setUrl(e.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose()}>Cancel</Button>
        <Button onClick={() => handleImageUpload(url)}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}
