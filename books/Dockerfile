FROM python:3.10-slim as builder

RUN apt update && apt install -y gcc python3-dev gcc
RUN pip install -U pip setuptools wheel pdm

WORKDIR /app
COPY pyproject.toml pdm.lock /app/

RUN pdm export -o requirements.txt

FROM python:3.10-slim

WORKDIR /app

RUN apt update && apt install -y gcc python3-dev gcc curl

COPY --from=builder /app/requirements.txt /app/

RUN curl -sSL https://rover.apollo.dev/nix/latest | sh && ls $HOME/.rover/
ENV PATH=$HOME/.rover/bin:$PATH

RUN pip install -r requirements.txt


COPY . /app
WORKDIR /app

# # RUN strawberry export-schema app > books.graphql
# RUN ls -al /root/
# RUN rover subgraph check strawberry-federation-ayf32@current --schema ./books.graphql --name books
# # RUN	rover subgraph publish strawberry-federation-ayf32@current \
# # 		--name books --schema ./books.graphql \
# # 		--routing-url http://books:4000

CMD ["uvicorn", "app:app", "--port", "4000", "--host", "0.0.0.0", "--reload"]
