import React from "react";
// import "./AddTitleModal.css";

const AddTitleModal = ({ newTitle, setNewTitle, onAdd, onClose }) => {
  return (
    <div className="add-title-container">
      <input
        type="text"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        className="title-input"
        placeholder="新しいタイトルを入力"
      />
      <div className="button-container">
        <button onClick={onAdd} className="add-button">
          追加
        </button>
        <button onClick={onClose} className="close-button">
          ×
        </button>
      </div>
    </div>
  );
};

export default AddTitleModal;
