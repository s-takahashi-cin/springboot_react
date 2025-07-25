import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import SearchBar from "../SearchBar/SearchBar";
import TodoList from "../TodoList/TodoList";
import AddTitleModal from "../AddTitleModal/AddTitleModal";
import CategoryBar from "../CategoryBar/CategoryBar";
import Stores from "../../Stores/Stores";

const Navigation = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(null); // "add" | "delete" | "trashDelete" | null
  const [activeView, setActiveView] = useState(null); // "add" | "edit" | "trash" | null

  const {
    titles,
    setTitles,
    allTitles,
    setAllTitles,
    editingIndex,
    categoryOrder,
    trashBox,
    setEditingIndex,
    searchTerm,
    setSearchTerm,
    setTrashBox,
    deleteIndex,
    setDeleteIndex,
    setCategoryOrder,
    newTitle,
    setNewTitle,
    newCategory,
    setNewCategory,
    setIsAdding,
  } = Stores();

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
      body: JSON.stringify({ title: newTitle, category: newCategory }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add title");
        }
        return response.json();
      })
      .then((data) => {
        // allTitlesに追加
        const updatedAllTitles = [...allTitles, data];
        setAllTitles(updatedAllTitles);

        // categoryOrderを使ってフィルタリング
        if (categoryOrder === "all") {
          setTitles(updatedAllTitles);
        } else {
          const filtered = updatedAllTitles.filter(
            (title) => title.category === categoryOrder
          );
          setTitles(filtered);
        }

        setNewTitle("");
        setIsAdding(false);
        navigate("/");
      })
      .catch((error) => console.error("Error adding title:", error));
  };

  const toggleAdding = () => {
    setActiveView((prev) => (prev === "add" ? null : "add"));
    setNewTitle("");
  };

  const handleEditToggle = () => {
    setActiveView((prev) => (prev === "edit" ? null : "edit"));
    setEditingIndex(null);
  };

  const fetchTitles = () => {
    fetch("http://localhost:8080/api?deleted=false")
      .then((res) => res.json())
      .then((data) => {
        setTitles(data);
        setAllTitles(data);
        navigate("/");
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchTrashBox();
  }, []);

  // ゴミ箱移動処理
  const confirmDelete = () => {
    const deletedItemId = deleteIndex;

    fetch(`http://localhost:8080/titles/${deletedItemId}/trash`, {
      method: "PATCH",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to move to trash");
        return response.text(); // レスポンス確認用
      })
      .then((data) => {
        console.log("レスポンス:", data);
        fetchTitles();
        setOpenModal(null);
        window.location.reload();
      })
      .catch((error) => console.error(error));
  };

  // モーダル削除「いいえ」押下時
  const cancelDelete = () => {
    setOpenModal(null);
  };

  //ゴミ箱一覧取得
  const fetchTrashBox = () => {
    fetch("http://localhost:8080/api?deleted=true")
      .then((res) => res.json())
      .then((data) => {
        setTrashBox(data);
      })
      .catch((error) => console.error(error));
  };

  // ゴミ箱モード切替ハンドラー
  const toggleTrashView = () => {
    setActiveView((prev) => {
      const next = prev === "trash" ? null : "trash";
      if (next === "trash") fetchTrashBox(); // 開くときだけ取得
      return next;
    });
  };

  //ゴミ箱内削除処理
  const confirmFinalDelete = () => {
    fetch(`http://localhost:8080/titles/${deleteIndex}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete");
        // 完全削除後はゴミ箱リストを再取得
        fetchTrashBox();
        setOpenModal(null);
        window.location.reload();
      })
      .catch((error) => console.error(error));
  };

  const cancel = () => {
    setOpenModal(null);
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
    const filteredByCategory = allTitles.filter(
      (title) => title.category === selectedCategoryOrder
    );
    setTitles(filteredByCategory);
  };

  const handleRestore = (id) => {
    fetch(`http://localhost:8080/titles/${id}/restore`, {
      method: "PATCH",
    })
      .then((res) => {
        if (!res.ok) throw new Error("復元に失敗しました");
        // ゴミ箱と通常タイトル両方を更新
        fetchTrashBox();
        fetchTitles();
      })
      .catch((error) => console.error("復元エラー:", error));
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
        isEditing={activeView === "edit"}
        editingIndex={editingIndex}
        newTitle={newTitle}
        onEditClick={(index, currentTitle) => {
          setEditingIndex(index);
          setNewTitle(currentTitle);
        }}
        onDeleteClick={(index) => {
          const id = titles[index].id;
          setDeleteIndex(id);
          setOpenModal("delete");
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
      {activeView === "add" && (
        <AddTitleModal
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          onAdd={handleAddTitle}
          onClose={() => setActiveView(null)}
        />
      )}

      {openModal === "delete" && (
        <div className="modal">
          <div className="modal-content">
            <h3>削除確認</h3>
            <p>このタイトルをゴミ箱に移動しますか？</p>
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
        <div className="footer-buttons">
          <button onClick={handleEditToggle} className="show-edit-button">
            {activeView === "edit" ? "閉じる" : "編集"}
          </button>
          <button onClick={toggleTrashView} className="show-trash-button">
            {activeView === "trash" ? "閉じる" : `🗑️（${trashBox.length}）`}
          </button>
        </div>
      </div>

      {activeView === "trash" && (
        <div className="trash-container">
          <h3>ゴミ箱</h3>
          {trashBox.length > 0 ? (
            trashBox.map((item) => (
              <div key={item.id} className="trash-item">
                <span>{item.title}</span>
                <div className="trash-buttons">
                  <button
                    onClick={() => {
                      setDeleteIndex(item.id); // item.idを直接セット
                      setOpenModal("trashDelete");
                    }}
                    className="final-del-button"
                  >
                    完全削除
                  </button>
                  <button
                    onClick={() => handleRestore(item.id)}
                    className="restore-button"
                  >
                    戻す
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>ゴミ箱は空です</p>
          )}
        </div>
      )}

      {openModal === "trashDelete" && (
        <div className="modal">
          <div className="modal-content">
            <h3>完全削除確認</h3>
            <p>このタイトルを完全に削除してもよろしいですか？</p>
            <button onClick={confirmFinalDelete} className="confirm-button">
              はい
            </button>
            <button onClick={cancel} className="cancel-button">
              いいえ
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
