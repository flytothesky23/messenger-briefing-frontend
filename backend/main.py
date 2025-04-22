from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import google.generativeai as genai

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Google Gemini API Key (사용자 요청에 따라 최신 키로 업데이트)
genai.configure(api_key=os.getenv("GOOGLE_API_KEY", "AIzaSyAdcrt_VI_AUcg8WveTOpRO46sMZxdU4Bs"))

@app.post("/summarize/")
async def summarize(file: UploadFile = File(...)):
    content = (await file.read()).decode("utf-8")
    prompt = f"다음은 하루치 업무 메신저 대화입니다. 요약 및 중요사항을 브리핑 형식으로 정리해줘. 각 중요 포인트마다 관련 이모지도 함께 붙여줘.\n\n{content}"
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt)
        summary = response.text.strip()
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    return {"summary": summary}
