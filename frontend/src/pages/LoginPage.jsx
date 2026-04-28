import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import api from "../api/client";
import { setUser } from "../store/authSlice";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import PageContainer from "../components/layout/PageContainer";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 900);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Введите имя пользователя");
      return;
    }

    try {
      const response = await api.post("/auth/login", {
        username: username.trim(),
      });

      dispatch(
        setUser({
          userId: response.data.id,
          username: response.data.username,
        })
      );

      navigate("/boards");
    } catch (err) {
      setError(err.response?.data?.error || "Не удалось выполнить вход");
    }
  }

  return (
    <PageContainer
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: isMobile ? "48px" : "90px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "70px",
          left: "80px",
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.45)",
          filter: "blur(20px)",
          display: isMobile ? "none" : "block",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "220px",
          right: "120px",
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          background: "rgba(190, 225, 255, 0.35)",
          filter: "blur(24px)",
          display: isMobile ? "none" : "block",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1.1fr 420px",
          gap: isMobile ? "32px" : "72px",
          alignItems: "start",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            paddingTop: isMobile ? "0" : "30px",
          }}
        >
          <p
            style={{
              color: "var(--color-primary-strong)",
              fontWeight: "700",
              marginBottom: "18px",
              fontSize: isMobile ? "26px" : "28px",
            }}
          >
            Task Manager
          </p>

          <h1
            style={{
              fontSize: isMobile ? "44px" : "58px",
              lineHeight: "1.08",
              marginBottom: "22px",
              maxWidth: "700px",
              color: "var(--color-text)",
            }}
          >
            Лёгкое управление
            <br />
            досками и задачами
          </h1>

          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: isMobile ? "16px" : "20px",
              lineHeight: "1.7",
              maxWidth: "620px",
              marginBottom: "34px",
            }}
          >
            Создавай доски, распределяй задачи по колонкам и отслеживай
            прогресс в спокойном и аккуратном интерфейсе.
          </p>

          <div
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
              maxWidth: "560px",
            }}
          >
            {[
              ["Порядок в задачах", "Всё собрано в одном месте"],
              ["Нежный дизайн", "Вдохновлён ясным небом."],
              ["Удобная работа", "Ничего лишнего на экране"],
            ].map(([title, text]) => (
              <div
                key={title}
                style={{
                  background: "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(255,255,255,0.7)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "20px",
                  padding: "16px 18px",
                  minWidth: isMobile ? "100%" : "170px",
                  boxShadow: "0 8px 20px rgba(110, 160, 210, 0.10)",
                }}
              >
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "15px",
                    marginBottom: "6px",
                    color: "var(--color-text)",
                  }}
                >
                  {title}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "var(--color-text-secondary)",
                    lineHeight: "1.5",
                  }}
                >
                  {text}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            paddingTop: isMobile ? "0" : "160px",
            width: "100%",
            maxWidth: isMobile ? "100%" : "420px",
            justifySelf: isMobile ? "stretch" : "start",
          }}
        >
          <Card>
            <h2
              style={{
                marginBottom: "10px",
                fontSize: isMobile ? "30px" : "34px",
                color: "var(--color-text)",
              }}
            >
              Вход
            </h2>

            <p
              style={{
                marginBottom: "24px",
                color: "var(--color-text-secondary)",
                fontSize: "16px",
                lineHeight: "1.6",
              }}
            >
              Введите имя пользователя, чтобы продолжить
            </p>

            <form
              onSubmit={handleLogin}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <Input
                type="text"
                placeholder="Введите username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              {error && (
                <div
                  style={{
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

              <Button type="submit">Войти</Button>
            </form>

            <p
              style={{
                marginTop: "20px",
                fontSize: "14px",
                color: "var(--color-text-secondary)",
                textAlign: "center",
                lineHeight: "1.5",
              }}
            >
              Если пользователя ещё нет, он создастся автоматически.
            </p>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

export default LoginPage;