import { List, ListItem, ListItemText } from "@mui/material";

export default function Post() {
  console.log("hello");

  return (
    <List>
      <ListItem>
        <ListItemText primary="Single-line item" secondary="Secondary text" />
      </ListItem>
      <ListItem>
        <ListItemText primary="Single-line item" secondary="Secondary text" />
      </ListItem>
      <ListItem>
        <ListItemText primary="Single-line item" secondary="Secondary text" />
      </ListItem>
    </List>
  );
}
