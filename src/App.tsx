import { useState } from "react";
import QRCode from "react-qr-code";
import "./App.css";

function App() {
  const [shortUrl, setShortUrl] = useState("");
  const [originalUrl, setOriginalUrl] = useState("");
  const [expirationTime, setExpirationTime] = useState(1);

  const [isLoading, setIsLoading] = useState(false);

  const [viewMode, setViewMode] = useState("url");

  const handleShortenUrl = async () => {
    if (!originalUrl) {
      alert("Por favor, insira uma URL");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://encurtador-url-hoyb.onrender.com/shorten-url",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: originalUrl,
            expireHours: Number(expirationTime),
          }),
        },
      );

      if (!response.ok) {
        alert("Erro ao encurtar URL");
        return;
      }

      const data = await response.json();
      setShortUrl(data.url);

      setViewMode("url");
      setOriginalUrl("");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro de conexão");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1>Encurtador de URL 🔗</h1>
      <p>
        Encurte suas URLs de maneira simples e rápida.🚀 <br />
        Com a opção de URL e QR Code, você pode compartilhar links de forma mais
        eficiente. <br />
        Escolha o tempo de expiração para maior controle sobre seus links.
      </p>
      <div className="card">
        <div className="input-group">
          <input
            type="text"
            placeholder="Cole sua URL aqui..."
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            disabled={isLoading}
          />

          <select
            defaultValue="1"
            value={expirationTime}
            onChange={(e) => setExpirationTime(Number(e.target.value))}
            disabled={isLoading}
          >
            <option value="1">1hr</option>
            <option value="2">2hrs</option>
            <option value="5">5hrs</option>
            <option value="10">10hrs</option>
            <option value="24">24hrs</option>
          </select>
        </div>

        <button onClick={handleShortenUrl} disabled={isLoading}>
          {isLoading ? "Encurtando..." : "Encurtar URL"}
        </button>
      </div>

      {shortUrl && (
        <div className="result">
          <div className="result-type">
            <button
              onClick={() => setViewMode("url")}
              className={viewMode === "url" ? "active-tab" : ""}
            >
              URL
            </button>
            <button
              onClick={() => setViewMode("qr")}
              className={viewMode === "qr" ? "active-tab" : ""}
            >
              QR Code
            </button>
          </div>

          <div className="result-content">
            {viewMode === "url" ? (
              <p>
                <a href={shortUrl} target="_blank" rel="noreferrer">
                  {shortUrl}
                </a>
              </p>
            ) : (
              <div
                style={{
                  background: "white",
                  padding: "16px",
                  borderRadius: "8px",
                  width: "fit-content",
                  margin: "0 auto",
                }}
              >
                <QRCode value={shortUrl} size={150} />
              </div>
            )}
          </div>
        </div>
      )}

      <p>
        Feito por{" "}
        <a href="https://github.com/JoaoPeNascimento">João Nascimento</a>
      </p>
    </>
  );
}

export default App;
