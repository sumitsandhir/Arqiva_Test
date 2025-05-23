# Server

## Installation

`pip install -r requirements.txt`

## Running the server

`fastapi dev main.py`

Default will LISTEN on port localhost:8000

## Documentation:

### ReDoc

http://127.0.0.1:8000/redoc

### Swagger

http://127.0.0.1:8000/docs

### Example usage:

http://127.0.0.1:8000/

http://127.0.0.1:8000/contributions

http://127.0.0.1:8000/contributions/?skip=5&limit=5

http://127.0.0.1:8000/contributions?order_by=title

http://127.0.0.1:8000/contributions?owner=LiveMusic&title=jazz&match=all

http://127.0.0.1:8000/contributions?owner=LiveMusic&title=jazz&match=any

Requirements.txt provided. If additional libraries are required, please ensure this is updated.
pip freeze > requirements.txt
