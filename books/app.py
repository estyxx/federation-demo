import datetime
from dataclasses import field
from typing import List

import strawberry
from directive import CacheControl
from extension import ApolloCacheControlExtension
from starlette.applications import Starlette
from starlette.routing import Route
from strawberry.asgi import GraphQL


@strawberry.federation.type(keys=["id"])
class Book:
    id: strawberry.ID
    title: str
    a_field_that_will_be_overridden: str = strawberry.federation.field(
        default="this is coming from the books service", shareable=True
    )
    updated_at: datetime.datetime = field(default_factory=datetime.datetime.now)


def get_books() -> List[Book]:
    return [Book(id=strawberry.ID("1"), title="The Dark Tower")]


@strawberry.type
class Query:
    books: List[Book] = strawberry.field(
        resolver=get_books, directives=[CacheControl(max_age=10)]
    )


schema = strawberry.federation.Schema(
    query=Query, enable_federation_2=True, extensions=[ApolloCacheControlExtension]
)

app = Starlette(debug=True, routes=[Route("/", GraphQL(schema))])
