import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const ApiFetch = () => {
  const [titles, setTitles] = useState([]);
  const [contents, setContents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api", { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        console.log("フロントデータ取得:", data);
        setTitles(data);
      })
      .catch((error) => console.error("Error fetching titles:", error));
  }, []);

  const fetchContents = (titleId) => {
    fetch(`http://localhost:8080/api/list?title_id=${titleId}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setContents(data);
        navigate("/contents", { state: { contents: data } });
      })
      .catch((error) => console.error("Error fetching contents:", error));
  };

  const handleNewPost = () => {
    setShowModal(true); // モーダルを表示
  };

  const handleCloseModal = () => {
    setShowModal(false); // モーダルを非表示
  };

  const handleSubmitPost = () => {
    // 新規投稿をサーバーに送信
    fetch("http://localhost:8080/titles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newPostTitle }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => {
        console.log("新規投稿成功:", data);
        // 新しいタイトルを取得し、状態を更新
        return fetch("http://localhost:8080/api");
      })
      .then((response) => response.json())
      .then((data) => {
        setTitles(data);
        // モーダルを閉じる
        setShowModal(false);
        // フィールドをクリアする
        setNewPostTitle("");
      })
      .catch((error) => console.error("Error posting title:", error));
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh",
      }}
    >
      <button
        onClick={handleNewPost}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          padding: "10px 20px",
          backgroundColor: "rgb(191, 236, 115)",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        ＋
      </button>
      {titles.map((title, index) => (
        <div
          key={index}
          onClick={() => fetchContents(title.id)}
          style={{
            cursor: "pointer",
            padding: "20px",
            border: "2px solid black",
            margin: "10px",
            textAlign: "center",
            borderRadius: "8px",
            width: "150px",
          }}
        >
          <h2>{title.title}</h2>
        </div>
      ))}

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              backgroundColor: "#2c2c2c",
              padding: "20px",
              borderRadius: "8px",
              width: "800px",
              height: "500px",
              textAlign: "left",
            }}
          >
            <button
              onClick={handleCloseModal}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "transparent",
                border: "none",
                color: "black",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              x
            </button>
            <h2 style={{ color: "#cccccc" }}>新規投稿</h2>
            <input
              type="text"
              placeholder="タイトルを入力"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              style={{
                width: "97%",
                padding: "10px",
                margin: "10px 0",
                borderRadius: "5px",
                border: "1px solid #ccc",
                background: "#cccccc",
              }}
            />
            <button
              onClick={handleSubmitPost}
              style={{
                padding: "10px 20px",
                backgroundColor: "#cccccc",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              投稿する
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
