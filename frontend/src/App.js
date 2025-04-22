import React, { useState } from "react";
import "./App.css";
import { FaCloudUploadAlt, FaRegSmile, FaClipboardList, FaEraser } from "react-icons/fa";

function App() {
  const [file, setFile] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setTextInput("");
    setSummary("");
    setError("");
  };

  const handleTextChange = (e) => {
    setTextInput(e.target.value);
    setFile(null);
    setSummary("");
    setError("");
  };

  const handleClearInput = () => {
    setTextInput("");
    setFile(null);
    setSummary("");
    setError("");
  };

  const handleUpload = async () => {
    setLoading(true);
    setSummary("");
    setError("");
    try {
      let formData = new FormData();
      if (file) {
        formData.append("file", file);
      } else if (textInput.trim()) {
        const blob = new Blob([textInput], { type: "text/plain" });
        formData.append("file", blob, "input.txt");
      } else {
        setError("파일을 첨부하거나 텍스트를 입력해 주세요.");
        setLoading(false);
        return;
      }
      const res = await fetch("https://ilil-mesinjeo-yoyag-beuriping.onrender.com/summarize/", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.summary) {
        setSummary(data.summary);
        setTextInput(""); // 요약 성공 시 입력창 초기화
        setFile(null);
      } else setError(data.error || "요약에 실패했습니다.");
    } catch (err) {
      setError("서버 오류: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card upload-card">
        <FaCloudUploadAlt className="icon-main" />
        <h1>일일 메신저 요약 브리핑</h1>
        <p className="desc">업무용 메신저 대화 파일을 업로드하거나<br/>텍스트를 복사/붙여넣기 해주세요.<br/>AI가 중요 내용을 이모지와 함께 브리핑해드립니다.</p>
        <input type="file" accept=".txt,.json" onChange={handleFileChange} />
        <div className="or-text">또는</div>
        <div style={{position:'relative'}}>
          <textarea
            className="text-input"
            placeholder="여기에 메신저 대화를 붙여넣기 하세요"
            value={textInput}
            onChange={handleTextChange}
            rows={6}
          />
          <button
            className="clear-btn"
            type="button"
            onClick={handleClearInput}
            title="입력창 초기화"
            style={{position:'absolute',right:8,top:8,padding:4,background:'none',border:'none',cursor:'pointer'}}
            disabled={(!textInput && !file) || loading}
          >
            <FaEraser style={{color:'#a3a3a3',fontSize:'1.1rem'}} />
          </button>
        </div>
        <button onClick={handleUpload} disabled={(!file && !textInput.trim()) || loading}>
          {loading ? "요약 중..." : "요약하기"}
        </button>
        {error && <div className="error">{error}</div>}
      </div>
      {summary && (
        <div className="card summary-box">
          <div className="summary-header">
            <FaClipboardList className="icon-summary" />
            <h2>오늘의 브리핑 <FaRegSmile style={{verticalAlign:'middle'}} /></h2>
          </div>
          <pre className="summary-pre">{summary}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
