// libraries
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const MAX_FILES = 5; // 최대 파일 개수
const MAX_FILE_SIZE_MB = 5; // 개별 파일당 최대 용량
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".pdf"]; // 허용 확장자

const FileUploader = ({
  onFilesChange,
  initialFiles = [],
  onDeletedIdsChange,
}) => {
  // 기존 파일 정보
  const [existingFiles, setExistingFiles] = useState(initialFiles);
  // 새로운 파일 정보
  const [newFiles, setNewFiles] = useState([]);
  // 삭제할 파일 정보
  const [deletedFileIds, setDeleteFileIds] = useState([]);
  // error 메세지
  const [errorMsg, setErrorMsg] = useState("");

  // dropzone에 파일을 추가 했을 경우 실행되는 event
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (!acceptedFiles || acceptedFiles.length === 0) {
        return;
      }

      setNewFiles((prevFiles) => {
        let newFiles = [...prevFiles];
        let errorMessage = "";

        for (const file of acceptedFiles) {
          // 파일 중복 체크
          const isDuplicate =
            newFiles.some(
              (f) => f.name === file.name && f.size === file.size
            ) ||
            existingFiles.some(
              (f) => f.name === file.name && f.size === file.size
            );
          if (isDuplicate) {
            errorMessage = `동일한 파일 "${file.name}"이 이미 첨부되어 있어요.`;
            break;
          }
          // 최대 파일 개수 체크
          if (newFiles.length >= MAX_FILES) {
            errorMessage = `파일은 최대 ${MAX_FILES}개까지만 첨부할 수 있어요.`;
            break;
          }

          newFiles.push(file);
        }

        setErrorMsg(errorMessage);

        return newFiles.slice(0, MAX_FILES);
      });
    },
    [existingFiles]
  );

  // 파일 크기가 크거나, 허용하지 않은 확장자의 파일을 넣었을 경우 실행되는 event
  const onDropRejected = useCallback((fileRejections) => {
    if (!fileRejections || fileRejections.length === 0) return;

    const firstRejection = fileRejections[0];
    let errorMessage = "";

    if (firstRejection && firstRejection.errors.length > 0) {
      const error = firstRejection.errors[0];

      switch (error.code) {
        case "file-too-large":
          errorMessage = `파일 크기는 최대 ${MAX_FILE_SIZE_MB}MB까지만 첨부할 수 있습니다.`;
          break;
        case "file-invalid-type":
          errorMessage = `허용되지 않는 확장자입니다. 업로드 가능한 파일 형식을 확인해주세요.`;
          break;
        default:
          errorMessage = `파일을 첨부할 수 없습니다. 다시 시도해 주세요.`;
      }
    }

    setErrorMsg(errorMessage);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "application/pdf": [],
    },
    maxSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    multiple: true,
    onDrop,
    onDropRejected,
  });

  // 파일 삭제 event
  const handleRemove = useCallback((index, isExisting) => {
    if (isExisting) {
      setExistingFiles((prevFiles) => {
        const removedFileId = prevFiles[index].id;
        setDeleteFileIds((prevIds) => [...prevIds, removedFileId]);

        return prevFiles.filter((_, i) => i !== index);
      });
    } else {
      setNewFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    }

    setErrorMsg("");
  }, []);

  useEffect(() => {
    if (onFilesChange) onFilesChange(newFiles);
  }, [newFiles, onFilesChange]);

  useEffect(() => {
    if (onDeletedIdsChange) onDeletedIdsChange(deletedFileIds);
  }, [deletedFileIds, onDeletedIdsChange]);

  return (
    <Box sx={{ mt: 3 }}>
      <Paper
        {...getRootProps()}
        sx={{
          border: "2px dashed #aaa",
          borderRadius: 2,
          padding: 3,
          textAlign: "center",
          backgroundColor: isDragActive ? "#f9f9f9" : "#fafafa",
          color: "#666",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "#f0f0f0",
          },
        }}
      >
        <input {...getInputProps()} />
        <Typography variant="body2" color="textSecondary">
          파일을 드래그하거나 여기를 클릭해서 첨부하세요
        </Typography>
        <Typography variant="caption" color="textSecondary">
          (최대 {MAX_FILES}개, {MAX_FILE_SIZE_MB}MB 이하,{" "}
          {ALLOWED_EXTENSIONS.join(", ")}만 가능)
        </Typography>
      </Paper>
      {errorMsg && (
        <Typography color="error" sx={{ mt: 1, fontSize: "0.875rem" }}>
          {errorMsg}
        </Typography>
      )}
      <List sx={{ mt: 2 }}>
        {existingFiles.map((file, index) => (
          <ListItem
            key={file.id}
            secondaryAction={
              <IconButton edge="end" onClick={() => handleRemove(index, true)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            }
            disablePadding
          >
            <ListItemText
              primary={
                <Typography variant="body2" noWrap>
                  {file.name}
                  <Typography
                    component="span"
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: 0.5 }}
                  >
                    · {(file.size / 1024).toFixed(1)} KB
                  </Typography>
                </Typography>
              }
              sx={{ ml: 1 }}
            />
          </ListItem>
        ))}
        {newFiles.map((file, index) => (
          <ListItem
            key={`${file.name}-${file.size}-${index}`}
            secondaryAction={
              <IconButton edge="end" onClick={() => handleRemove(index, false)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            }
            disablePadding
          >
            <ListItemText
              primary={
                <Typography variant="body2" noWrap>
                  {file.name}
                  <Typography
                    component="span"
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: 0.5 }}
                  >
                    · {(file.size / 1024).toFixed(1)} KB
                  </Typography>
                </Typography>
              }
              sx={{ ml: 1 }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default FileUploader;
