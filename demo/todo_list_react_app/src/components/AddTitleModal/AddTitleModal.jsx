import React from "react";
import "./AddTitleModal.css";

const AddTitleModal = ({
  newTitle,
  setNewTitle,
  newCategory,
  setNewCategory,
  onAdd,
  onClose,
}) => {
  return (
    <div>
      <div className="add-title-container">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => {
            if (e.target.value.length <= 10) {
              setNewTitle(e.target.value);
            }
          }}
          className="title-input"
          placeholder="新しいタイトルを入力"
          maxLength={10}
        />

        {/* カテゴリ選択を追加 */}
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="category-select"
        >
          <option value="long_term">長期的</option>
          <option value="short_term">短期的</option>
          <option value="free">フリー</option>
        </select>
      </div>
      <div className="button-container">
        <button onClick={onAdd} className="add-button">
          追加
        </button>
        <button onClick={onClose} className="close-button">
          閉じる
        </button>
      </div>
    </div>
  );
};

export default AddTitleModal;
