// libraries
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useCategory } from "contexts/CategoryContext";
// axios
import axios from "api/axios";
// components
import AlertDialog from "@component/Component/AlertDialog";
import ConfirmDialog from "@component/Component/ConfirmDialog";

export default function Management() {
  const { refreshCategories } = useCategory();
  // 카테고리 정보
  const [categories, setCategories] = useState([]);
  // 선택한 List index
  const [selectedIndex, setSelectedIndex] = useState(0);
  // 선택한 삭제 index
  const [deleteIndex, setDeleteIndex] = useState(0);
  // confirm open 여부
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  // alert Dialog 정보
  const [alertDialog, setAlertDialog] = useState({
    open: false,
    message: "",
  });
  // 변경 여부
  const [isDirty, setIsDirty] = useState(false);

  // 선택된 카테고리 정보
  const selectedCategory = categories[selectedIndex] || {};

  // 초기 데이터 조회
  const init = async () => {
    const { data } = await axios.get("/api/categories/detail");

    if (data.length > 0) {
      setCategories(data);
      setSelectedIndex(0);
    }
  };

  // 카테고리 추가 버튼 클릭 event
  const handleAdd = () => {
    setCategories((prev) => [
      ...prev,
      {
        id: null,
        name: "카테고리",
        enabled: true,
        displayOrder: null,
      },
    ]);
    setSelectedIndex(categories.length);
    setIsDirty(true);
  };

  // 카테고리 수정 event
  const handleChange = (key, value) => {
    setCategories((prev) =>
      prev.map((category, index) =>
        index === selectedIndex ? { ...category, [key]: value } : category
      )
    );
    setIsDirty(true);
  };

  // 삭제 아이콘 클릭 event
  const handleDeleteIconClick = (e, index) => {
    e.stopPropagation(); // 클릭 이벤트 전파 방지
    setDeleteDialogOpen(true);
    setDeleteIndex(index);
  };

  // 카테고리 삭제 event
  const handleDelete = () => {
    setCategories((prev) => prev.filter((_, i) => i !== deleteIndex));
    setSelectedIndex(-1);
    setDeleteDialogOpen(false);
    setIsDirty(true);
  };

  // 카테고리 저장 event
  const handleSave = async () => {
    setSaveDialogOpen(false);

    try {
      await axios.post(
        "/api/categories",
        categories.map((item, index) => ({
          ...item,
          displayOrder: index + 1,
        }))
      );

      setAlertDialog({ open: true, message: "저장되었습니다" });
      setIsDirty(false);
      init();
      refreshCategories();
    } catch (error) {
      setAlertDialog({ open: true, message: error.message });
    }
  };

  // 카테고리 순서 변경 event
  const handleMove = (from, to) => {
    // 카테고리의 위치가 최상위, 최하위 일 경우, 선택된 카테고리가 없을 경우
    if (to < 0 || to >= categories.length || from < 0) return;

    const updated = [...categories];
    const temp = updated[from];
    updated[from] = updated[to];
    updated[to] = temp;

    setCategories(updated);
    setSelectedIndex(to);
    setIsDirty(true);
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    // 뒤로가기, 새로고침, 탭 닫기 대응
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      mt={4}
      gap={2}
    >
      <Box display="flex" gap={4} p={2}>
        {/* 카테고리 리스트 */}
        <Paper
          variant="outlined"
          sx={{ width: 400, height: 500, position: "relative" }}
        >
          <List>
            {categories.map((category, index) => (
              <ListItemButton
                key={index}
                selected={selectedIndex === index}
                onClick={() => setSelectedIndex(index)}
              >
                <ListItemText
                  primary={
                    <Typography variant="body2" noWrap>
                      {category.name}
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                        sx={{ ml: 0.5 }}
                      >
                        ({category.postCount ?? 0})
                      </Typography>
                    </Typography>
                  }
                />
                <IconButton
                  edge="end"
                  size="small"
                  onClick={(e) => handleDeleteIconClick(e, index)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </ListItemButton>
            ))}
          </List>

          {/* 순서 변경 버튼 */}
          <Box
            display="flex"
            justifyContent="center"
            gap={1}
            position="absolute"
            bottom={4}
            left={0}
            right={0}
          >
            <IconButton
              size="small"
              onClick={() => handleMove(selectedIndex, selectedIndex - 1)}
            >
              <ArrowUpwardIcon fontSize="inherit" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleMove(selectedIndex, selectedIndex + 1)}
            >
              <ArrowDownwardIcon fontSize="inherit" />
            </IconButton>
          </Box>
        </Paper>

        {/* 카테고리 상세 */}
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          sx={{ flexGrow: 1, minWidth: 400 }}
        >
          <Box
            display="flex"
            justifyContent="flex-end"
            gap={1}
            sx={{ width: "100%" }}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={handleAdd}
              size="small"
            >
              추가
            </Button>
          </Box>
          <TextField
            placeholder="카테고리 이름"
            size="small"
            variant="standard"
            value={selectedCategory.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            sx={{ mt: 2 }}
          />
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2">사용 여부</Typography>
            <Switch
              checked={selectedCategory.enabled ?? false}
              onChange={(e) => handleChange("enabled", e.target.checked)}
            />
          </Box>
        </Box>
      </Box>
      <Button
        variant="contained"
        color="inherit"
        onClick={() => setSaveDialogOpen(true)}
      >
        저장
      </Button>

      {/* Confirm & Alert Dialog */}
      <ConfirmDialog
        open={saveDialogOpen}
        title="카테고리 저장"
        content="저장하시겠습니까?"
        onClose={() => setSaveDialogOpen(false)}
        onConfirm={handleSave}
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        title="카테고리 삭제"
        content={`카테고리에 속한 글이 모두 삭제됩니다.
            카테고리를 삭제 하시겠습니까?`}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />
      <AlertDialog
        open={alertDialog.open}
        onClose={() => setAlertDialog({ ...alertDialog, open: false })}
        title={alertDialog.message}
      />
    </Box>
  );
}
