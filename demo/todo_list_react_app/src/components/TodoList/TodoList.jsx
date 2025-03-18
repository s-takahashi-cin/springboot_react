import React from "react";
import { Link } from "react-router-dom";
import "./TodoList.css";

const TodoList = ({
  filteredTitles,
  isEditing,
  editingIndex,
  newTitle,
  onEditClick,
  onDeleteClick,
  onSaveClick,
  onTitleChange,
}) => {
  return (
    <div className="todo-container">
      {filteredTitles.map((titleData, index) => (
        <div key={index} className="todo-item">
          {editingIndex === index ? (
            <>
              <input
                type="text"
                value={newTitle}
                onChange={onTitleChange}
                className="title-edit-input"
              />
              <div>
                <button
                  onClick={() => onSaveClick(index)}
                  className="save-button"
                >
                  保存
                </button>
                <button
                  onClick={() => onDeleteClick(index)}
                  className="title-delete-button"
                >
                  削除
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to={`/contents`}
                className="todo-list"
                state={{
                  selectedTitle: titleData.title,
                  titleId: titleData.id,
                }}
              >
                <span className="title">{titleData.title}</span>
              </Link>
              {isEditing && (
                <span
                  className="edit-button"
                  onClick={() => onEditClick(index, titleData.title)}
                >
                  編集
                </span>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default TodoList;
