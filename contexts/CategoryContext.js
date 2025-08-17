// libraries
import { createContext, useContext, useEffect, useState } from "react";
// axios
import axios from "axios";
// common code data
import { codeData as code } from "data/codeData";

const CategoryContext = createContext();

export function CategoryProvider({ children }) {
  // 카테고리 정보
  const [categories, setCategories] = useState([
    { id: code.all.value, name: code.all.text },
  ]);
  // 선택된 카테고리 ID
  const [selectedCategoryId, setSelectedCategoryId] = useState(-1);

  // 카테고리 정보 새로 고침
  const refreshCategories = async () => {
    const { data } = await axios.get("/api/categories");
    setCategories(() => [{ id: code.all.value, name: code.all.text }, ...data]);
  };

  useEffect(() => {
    refreshCategories();
  }, []);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        selectedCategoryId,
        setSelectedCategoryId,
        refreshCategories,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export const useCategory = () => useContext(CategoryContext);
