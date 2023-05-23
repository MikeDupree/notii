import React, { useEffect, useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/material/Checkbox";

import DeleteIcon from "@mui/icons-material/Delete";
import { useSession } from "next-auth/react";

import { ipcHandler } from "../../../renderer/src/ipc";
import { ipcRenderer } from "electron";
import FileUpload from "./components/FileUpload";
import ItemList from "./components/ItemList";

export default function Todo({ test }) {
  const [items, setItems] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [fileUploadEnabled, setFileUploadEnabled] = useState(true);
  const session = useSession();

  const onLabelSelect = (label: string) => {
    setSelectedLabel(label);
  };

  const socket = ipcHandler("finance");
  const handleFinanceUpdate = (event, message) => {
    console.log(`TODO socket message`);
    console.log(message);
  };
  console.log("regiserting handleFinanceUpdate", ipcRenderer);
  ipcRenderer.addListener("todo:client", handleFinanceUpdate);

  useEffect(() => {
    //request todo data for user.
    // emit this when first mounting to get current todos
    socket.send(
      { userId: session?.data?.user?.sub },
      { channelOverride: "finance:get" }
    );

    return () => {
      // ipcRenderer.removeListener("todo:client", handleFinanceUpdate);
    };
  }, []);

  console.log(session);
  // Listen for messages from the server
  console.log("items", items);
  console.log("fileUploadEnabled", fileUploadEnabled);
  return (
    <div>
      <Container maxWidth="lg">
        <Box
          sx={{
            my: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Finance
          </Typography>
        </Box>

        {fileUploadEnabled ? (
          <Box>
            <FileUpload
              setItems={setItems}
              onComplete={(status) => {
                console.log("setting file upload", !status);
                setFileUploadEnabled(!status);
              }}
            />
          </Box>
        ) : (
          <Box>
            <ItemList items={items} onSelect={(selected) => {console.log(selected)}}/>
          </Box>
        )}
      </Container>
    </div>
  );
}
