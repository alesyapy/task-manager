import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Pencil, Trash2 } from "lucide-react";

import api from "../api/client";

import {
  setBoards,
  addBoard,
  updateBoard,
  removeBoard,
  setBoardsLoading,
  setBoardsError,
  clearBoards,
} from "../store/boardsSlice";
import { logout } from "../store/authSlice";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import PageContainer from "../components/layout/PageContainer";

function BoardsPage() {
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [editingBoardId, setEditingBoardId] = useState(null);
  const [editingBoardTitle, setEditingBoardTitle] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userId, username } = useSelector((state) => state.auth);
  const {
    items: boards,
    loading,
    error,
  } = useSelector((state) => state.boards);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 900);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    loadBoards();
  }, [userId]);

  async function loadBoards() {
    dispatch(setBoardsLoading(true));
    dispatch(setBoardsError(""));

    try {
      const response = await api.get("/boards");
      const userBoards = response.data.filter(
        (board) => String(board.ownerId) === String(userId)
      );

      dispatch(setBoards(userBoards));
    } catch (err) {
      dispatch(
        setBoardsError(err.response?.data?.error || "Не удалось загрузить доски")
      );
    } finally {
      dispatch(setBoardsLoading(false));
    }
  }

  async function handleCreateBoard(e) {
    e.preventDefault();
    dispatch(setBoardsError(""));

    const trimmedTitle = newBoardTitle.trim();

    if (!trimmedTitle) {
      dispatch(setBoardsError("Введите название доски"));
      return;
    }

    if (!userId) {
      dispatch(setBoardsError("Не найден userId. Войдите заново."));
      return;
    }

    try {
      const response = await api.post("/boards", {
        title: trimmedTitle,
        ownerId: userId,
      });

      dispatch(addBoard(response.data));
      setNewBoardTitle("");
    } catch (err) {
      dispatch(
        setBoardsError(err.response?.data?.error || "Не удалось создать доску")
      );
    }
  }

  function startEditBoard(board) {
    setEditingBoardId(board.id);
    setEditingBoardTitle(board.title);
    dispatch(setBoardsError(""));
  }

  function cancelEditBoard() {
    setEditingBoardId(null);
    setEditingBoardTitle("");
  }

  async function handleUpdateBoard(e, boardId) {
    e.preventDefault();
    dispatch(setBoardsError(""));

    const trimmedTitle = editingBoardTitle.trim();

    if (!trimmedTitle) {
      dispatch(setBoardsError("Введите название доски"));
      return;
    }

    try {
      const response = await api.patch(`/boards/${boardId}`, {
        title: trimmedTitle,
      });

      dispatch(updateBoard(response.data));
      setEditingBoardId(null);
      setEditingBoardTitle("");
    } catch (err) {
      dispatch(
        setBoardsError(err.response?.data?.error || "Не удалось изменить доску")
      );
    }
  }

  function handleLogout() {
    dispatch(logout());
    dispatch(clearBoards());
    navigate("/");
  }

  async function handleDeleteBoard(boardId) {
    const confirmed = window.confirm("Удалить эту доску?");
    if (!confirmed) return;

    try {
      await api.delete(`/boards/${boardId}`);
      dispatch(removeBoard(boardId));
    } catch (err) {
      dispatch(
        setBoardsError(err.response?.data?.error || "Не удалось удалить доску")
      );
    }
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Удалить аккаунт? Это действие нельзя отменить."
    );

    if (!confirmed) return;

    dispatch(setBoardsError(""));

    try {
      await api.delete(`/users/${userId}`);

      dispatch(logout());
      dispatch(clearBoards());

      navigate("/");
    } catch (err) {
      const serverMessage = err.response?.data?.error || "";

      if (
        serverMessage.toLowerCase().includes("cannot delete user") &&
        serverMessage.toLowerCase().includes("boards")
      ) {
        dispatch(
          setBoardsError(
            "Нельзя удалить аккаунт, пока у вас есть доски. Сначала удалите все доски."
          )
        );
      } else {
        dispatch(setBoardsError(serverMessage || "Не удалось удалить аккаунт"));
      }
    }
  }

  return (
    <PageContainer
      style={{
        minHeight: "100vh",
        paddingTop: isMobile ? "36px" : "56px",
        paddingBottom: "40px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "30px",
          left: "30px",
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.35)",
          filter: "blur(26px)",
          display: isMobile ? "none" : "block",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "220px",
          right: "60px",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          background: "rgba(190, 225, 255, 0.30)",
          filter: "blur(30px)",
          display: isMobile ? "none" : "block",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <div>
            <p
              style={{
                color: "var(--color-primary-strong)",
                fontWeight: "700",
                marginBottom: "10px",
                fontSize: isMobile ? "16px" : "18px",
              }}
            >
              Task Manager
            </p>

            <h1
              style={{
                fontSize: isMobile ? "40px" : "54px",
                lineHeight: "1.08",
                color: "var(--color-text)",
                marginBottom: "12px",
              }}
            >
              Мои доски
            </h1>

            <p
              style={{
                color: "var(--color-text-secondary)",
                fontSize: isMobile ? "16px" : "19px",
                lineHeight: "1.7",
                maxWidth: "700px",
              }}
            >
              Создавай новые доски, открывай существующие и управляй своими
              задачами в лёгком облачном интерфейсе.
            </p>
          </div>

          <Card
            style={{
              minWidth: isMobile ? "100%" : "320px",
              padding: "20px",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                color: "var(--color-text-secondary)",
                marginBottom: "6px",
              }}
            >
              Пользователь
            </p>

            <h3
              style={{
                fontSize: "24px",
                color: "var(--color-text)",
                marginBottom: "18px",
              }}
            >
              {username || "Гость"}
            </h3>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <Button onClick={handleLogout} variant="secondary">
                Выйти
              </Button>

              <Button onClick={handleDeleteAccount} variant="danger">
                Удалить аккаунт
              </Button>
            </div>
          </Card>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "380px 1fr",
            gap: "28px",
            alignItems: "start",
          }}
        >
          <Card>
            <h2
              style={{
                fontSize: "30px",
                color: "var(--color-text)",
                marginBottom: "10px",
              }}
            >
              Создать доску
            </h2>

            <p
              style={{
                color: "var(--color-text-secondary)",
                fontSize: "15px",
                lineHeight: "1.6",
                marginBottom: "20px",
              }}
            >
              Добавь новую доску для своих задач, проектов или учебных планов.
            </p>

            <form
              onSubmit={handleCreateBoard}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <Input
                type="text"
                placeholder="Название доски"
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
              />

              <Button type="submit">Создать</Button>
            </form>

            {error && (
              <div
                style={{
                  marginTop: "16px",
                  background: "#ffe8e8",
                  color: "#a63c3c",
                  padding: "12px 14px",
                  borderRadius: "14px",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            )}
          </Card>

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "18px",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <h2
                style={{
                  fontSize: "30px",
                  color: "var(--color-text)",
                }}
              >
                Ваши доски
              </h2>

              <span
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "15px",
                }}
              >
                Всего: {boards.length}
              </span>
            </div>

            {loading ? (
              <Card>
                <p
                  style={{
                    color: "var(--color-text-secondary)",
                    fontSize: "16px",
                  }}
                >
                  Загрузка досок...
                </p>
              </Card>
            ) : boards.length === 0 ? (
              <Card>
                <h3
                  style={{
                    fontSize: "24px",
                    color: "var(--color-text)",
                    marginBottom: "10px",
                  }}
                >
                  Пока досок нет
                </h3>

                <p
                  style={{
                    color: "var(--color-text-secondary)",
                    fontSize: "16px",
                    lineHeight: "1.6",
                  }}
                >
                  Создай первую доску слева, и она появится здесь.
                </p>
              </Card>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile
                    ? "1fr"
                    : "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "20px",
                }}
              >
                {boards.map((board) => (
                  <Card key={board.id}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "0",
                          right: "0",
                          display: "flex",
                          gap: "8px",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => startEditBoard(board)}
                          title="Редактировать доску"
                          style={iconButtonStyle}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteBoard(board.id)}
                          title="Удалить доску"
                          style={{
                            ...iconButtonStyle,
                            border: "1px solid rgba(220,107,107,0.20)",
                            background: "rgba(255,240,240,0.9)",
                            color: "#c75b5b",
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {editingBoardId === board.id ? (
                        <form
                          onSubmit={(e) => handleUpdateBoard(e, board.id)}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                            paddingRight: "88px",
                            marginBottom: "18px",
                          }}
                        >
                          <Input
                            type="text"
                            value={editingBoardTitle}
                            onChange={(e) =>
                              setEditingBoardTitle(e.target.value)
                            }
                          />

                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              flexWrap: "wrap",
                            }}
                          >
                            <Button type="submit">Сохранить</Button>
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={cancelEditBoard}
                            >
                              Отмена
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <h3
                          style={{
                            fontSize: "24px",
                            color: "var(--color-text)",
                            marginBottom: "10px",
                            wordBreak: "break-word",
                            paddingRight: "88px",
                          }}
                        >
                          {board.title}
                        </h3>
                      )}

                      <p
                        style={{
                          color: "var(--color-text-secondary)",
                          fontSize: "15px",
                          lineHeight: "1.6",
                          marginBottom: "22px",
                          flexGrow: 1,
                        }}
                      >
                        Открой доску, чтобы управлять колонками и карточками.
                      </p>

                      <Button onClick={() => navigate(`/boards/${board.id}`)}>
                        Открыть доску
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

const iconButtonStyle = {
  width: "38px",
  height: "38px",
  borderRadius: "12px",
  border: "1px solid rgba(124,194,246,0.28)",
  background: "rgba(255,255,255,0.82)",
  color: "var(--color-primary-strong)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 6px 14px rgba(110,160,210,0.08)",
  cursor: "pointer",
};

export default BoardsPage;