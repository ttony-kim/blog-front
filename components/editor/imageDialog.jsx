// libraries
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";

export default function ImageDialog({
  open,
  handleCloseClick,
  handleImageUpload,
}) {
  // image url 상태 값
  const [url, setUrl] = useState("");

  return (
    <Dialog
      open={open}
      onClose={handleCloseClick}
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
        <Button onClick={() => handleCloseClick()}>Cancel</Button>
        <Button onClick={() => handleImageUpload(url)}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}
