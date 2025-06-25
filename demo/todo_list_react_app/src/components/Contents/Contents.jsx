import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Contents.css";

function Contents() {
  const location = useLocation();
  const { state } = location;
  const { selectedTitle, titleId } = state || {};
  const [checkedItems, setCheckedItems] = useState({});
  const [contents, setContents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [contentToDelete, setContentToDelete] = useState(null);

  useEffect(() => {
    console.log("titleId:", titleId);

    if (titleId) {
      fetch(`http://localhost:8080/api/list?title_id=${titleId}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          setContents(data);
          // 初期状態として、全てのチェックボックスをfalseにする
          const initialCheckedItems = {};
          data.forEach((content) => {
            initialCheckedItems[content.id] = content.checked || false;
          });
          setCheckedItems(initialCheckedItems);
        })
        .catch((error) => console.error("Error fetching contents:", error));
    }
  }, [titleId]);

  const handleNewPost = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false); // モーダルを非表示
  };

  const handleSubmitPost = () => {
    fetch("http://localhost:8080/contents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: { id: titleId },
        content: newPostContent,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => {
        return fetch(`http://localhost:8080/api/list?title_id=${titleId}`);
      })
      .then((response) => response.json())
      .then((data) => {
        setContents(data);
        setShowModal(false);
        setNewPostContent("");
      })
      .catch((error) => console.error("Error posting content:", error));
  };

  const handleDeleteContent = (id) => {
    setContentToDelete(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    fetch(`http://localhost:8080/contents/${contentToDelete}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          return fetch(`http://localhost:8080/api/list?title_id=${titleId}`);
        }
        throw new Error("Network response was not ok.");
      })
      .then((response) => response.json())
      .then((data) => {
        setContents(data);
        setShowConfirmModal(false);
        setContentToDelete(null);
      })
      .catch((error) => console.error("Error deleting content:", error));
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setContentToDelete(null);
  };

  const handleCheckboxChange = (e, id) => {
    const isChecked = e.target.checked;
    setCheckedItems((prev) => ({
      ...prev,
      [id]: isChecked,
    }));

    // サーバーにチェック状態を保存
    fetch(`http://localhost:8080/contents/${id}/check`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        checked: isChecked,
      }),
    }).catch((error) => console.error("Error updating check state:", error));
  };

  return (
    <div className="content-container">
      <h2>{selectedTitle || "タイトルが設定されていません"}</h2>
      <button onClick={handleNewPost} className="content-button">
        ＋
      </button>
      {contents.length > 0 ? (
        <div>
          {contents.map((content) => (
            <div key={content.id} className="content-title">
              <input
                type="checkbox"
                className="check-box"
                checked={checkedItems[content.id] || false}
                onChange={(e) => handleCheckboxChange(e, content.id)}
              />
              <p>{content.content}</p>
              <button
                onClick={() => handleDeleteContent(content.id)}
                className="delete-button"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>詳細情報が見つかりません。</p>
      )}

      {showModal && (
        <div className="api-fetch-modal">
          <div>
            <input
              type="text"
              placeholder=""
              className="input-content"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
            <button onClick={handleSubmitPost}>投稿する</button>
            <button className="input-content-close" onClick={handleCloseModal}>
              x
            </button>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="confirm-modal">
          <div className="confirm-modal-content">
            <p>本当に削除しますか？</p>
            <button
              onClick={handleConfirmDelete}
              className="confirm-modal-button"
            >
              はい
            </button>
            <button
              onClick={handleCancelDelete}
              className="confirm-modal-button cancel"
            >
              いいえ
            </button>
          </div>
        </div>
      )}
      <Link to="/" className="home-bottom">
        home
      </Link>
    </div>
  );
}

export default Contents;
