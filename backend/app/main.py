from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"msg": "IPU backend is running"}
