import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navigation.css";
import SearchBar from "../SearchBar/SearchBar";
import TodoList from "../TodoList/TodoList";
import AddTitleModal from "../AddTitleModal/AddTitleModal";
import CategoryBar from "../CategoryBar/CategoryBar";

const Navigation = () => {
  const [titles, setTitles] = useState([]);
  const [allTitles, setAllTitles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();
  const [categoryOrder, setCategoryOrder] = useState("newest");

  useEffect(() => {
    fetch("http://localhost:8080/api", { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setTitles(data);
        setAllTitles(data);
      })
      .catch((error) => console.error("Error fetching titles:", error));
  }, []);

  const handleAddTitle = () => {
    if (!newTitle) return;

    fetch("http://localhost:8080/titles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newTitle }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add title");
        }
        return response.json();
      })
      .then((data) => {
        setTitles([...titles, data]);
        setNewTitle("");
        setIsAdding(false);
        navigate("/");
      })
      .catch((error) => console.error("Error adding title:", error));
  };

  const toggleAdding = () => {
    setIsAdding(!isAdding);
    setNewTitle("");
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditingIndex(null);
  };

  const confirmDelete = () => {
    const titleId = titles[deleteIndex].id;

    fetch(`http://localhost:8080/titles/${titleId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete title");
        }
        const updatedTitles = titles.filter((_, i) => i !== deleteIndex);
        setTitles(updatedTitles);
        setShowModal(false);
        window.location.href = "http://localhost:3000/";
      })
      .catch((error) => console.error("Error deleting title:", error));
  };

  const cancelDelete = () => {
    setShowModal(false);
  };

  // フィルタリングロジック
  const filteredTitles = titles.filter((titleData) =>
    titleData.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //並べ替えロジック
  const handleCategoryChange = (selectedCategoryOrder) => {
    setCategoryOrder(selectedCategoryOrder);

    if (selectedCategoryOrder === "all") {
      setTitles(allTitles); // 全タイトルを表示
      return;
    }
  
    // カテゴリによるフィルタリング
    const filteredByCategory = titles.filter((title) => title.category === selectedCategoryOrder);
    setTitles(filteredByCategory); 
  };

  return (
    <nav className="navigation">
      <div className="web-title">
        <h2 className="nav-title">Sawa Todo List</h2>
        <button className="add-title-button" onClick={toggleAdding}>
          +
        </button>
      </div>

      <div className="bar-container">
        {/* SearchBarコンポーネント*/}
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <CategoryBar onCategoryChange={handleCategoryChange} />
      </div>

      <TodoList
        filteredTitles={filteredTitles}
        isEditing={isEditing}
        editingIndex={editingIndex}
        newTitle={newTitle}
        onEditClick={(index, currentTitle) => {
          setEditingIndex(index);
          setNewTitle(currentTitle);
        }}
        onDeleteClick={(index) => {
          setDeleteIndex(index);
          setShowModal(true);
        }}
        onSaveClick={(index) => {
          const updatedTitles = [...titles];
          updatedTitles[index].title = newTitle;
          setTitles(updatedTitles);
          setEditingIndex(null);
        }}
        onTitleChange={(e) => setNewTitle(e.target.value)}
      />

      {/* AddTitleModalコンポーネント*/}
      {isAdding && (
        <AddTitleModal
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          onAdd={handleAddTitle}
          onClose={() => setIsAdding(false)}
        />
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>削除確認</h3>
            <p>このタイトルを削除してもよろしいですか？</p>
            <button onClick={confirmDelete} className="confirm-button">
              はい
            </button>
            <button onClick={cancelDelete} className="cancel-button">
              いいえ
            </button>
          </div>
        </div>
      )}

      <div className="footer">
        <p>Sawa Takahashi</p>
        <button onClick={handleEditToggle} className="show-edit-button">
          {isEditing ? "閉じる" : "編集/削除"}
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
