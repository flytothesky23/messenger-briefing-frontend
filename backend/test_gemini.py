import google.generativeai as genai

API_KEY = "AIzaSyAdcrt_VI_AUcg8WveTOpRO46sMZxdU4Bs"
genai.configure(api_key=API_KEY)

try:
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content("안녕하세요! 이 키와 모델이 정상적으로 동작하는지 테스트 중입니다.")
    print("정상 응답:", response.text)
except Exception as e:
    print("에러 발생:", e)