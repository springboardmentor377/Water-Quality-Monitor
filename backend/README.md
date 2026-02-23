# Water-Quality-Monitor

## Run locally

From the `backend` folder, use the **same** Python for both install and run (uvicorn uses the Python that starts it):

```bash
cd backend
python -m pip install -r requirements.txt
uvicorn app.main:app --reload
```

If you have multiple Python versions, install into the one that runs uvicorn (e.g. `py -3.12 -m pip install -r requirements.txt` then run with that same interpreter).

## Libraries & Documentation

- [JWT](https://jwt.io/)
- [Pydantic](https://docs.pydantic.dev/)
- [SQLModel](https://sqlmodel.tiangolo.com/)
- [FastAPI](https://fastapi.tiangolo.com/)

## API URLs
- Water stations: https://rtwqmsdb1.cpcb.gov.in/data/internet/stations/stations.json
- Water station readings: https://rtwqmsdb1.cpcb.gov.in/data/internet/layers/10/index.json
