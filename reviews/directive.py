from enum import Enum
from typing import Optional

import strawberry
from strawberry.schema_directive import Location


@strawberry.enum
class CacheControlScope(Enum):
    PRIVATE = 0
    PUBLIC = 1


@strawberry.schema_directive(
    name="cacheControl",
    locations=[
        Location.FIELD_DEFINITION,
        Location.OBJECT,
        Location.INTERFACE,
        Location.UNION,
    ],
)
class CacheControl:
    max_age: Optional[int]
    scope: Optional[CacheControlScope] = CacheControlScope.PUBLIC
    inheredit_max_age: Optional[bool] = False
