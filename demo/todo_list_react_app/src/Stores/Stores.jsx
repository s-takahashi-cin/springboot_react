// src/Stores/Stores.js
import { create } from "zustand";

const Stores = create((set) => ({
  titles: [],
  allTitles: [],
  isEditing: false,
  editingIndex: null,
  searchTerm: "",
  showModal: false,
  trashDeleteModal: false,
  deleteIndex: null,
  categoryOrder: "all",
  newTitle: "",
  newCategory: "long_term",
  isAdding: false,
  trashBox: [],
  isTrashView: false,
  setTitles: (titles) => set({ titles }),
  setAllTitles: (allTitles) => set({ allTitles }),
  setIsEditing: (isEditing) => set({ isEditing }),
  setEditingIndex: (index) => set({ editingIndex: index }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setShowModal: (val) => set({ showModal: val }),
  setTashDeleteModal: (val) => set({ trashDeleteModal: val }),
  setDeleteIndex: (index) => set({ deleteIndex: index }),
  setCategoryOrder: (order) => set({ categoryOrder: order }),
  setNewTitle: (title) => set({ newTitle: title }),
  setNewCategory: (cat) => set({ newCategory: cat }),
  setIsAdding: (val) => set({ isAdding: val }),
  toggleIsEditing: () => set((state) => ({ isEditing: !state.isEditing })),
  toggleIsAdding: () => set((state) => ({ isAdding: !state.isAdding })),
  setTrashBox: (items) => set({ trashBox: items }),
  setIsTrashView: (val) => set({ isTrashView: val }),
}));

export default Stores;
