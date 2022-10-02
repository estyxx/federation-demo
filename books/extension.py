from directive import CacheControl
from graphql import GraphQLResolveInfo
from strawberry.extensions import Extension
from strawberry.field import StrawberryField
from strawberry.types import ExecutionContext
from strawberry.utils.await_maybe import AwaitableOrValue


class CachePolicy:
    pass


class ApolloCacheControlExtension(Extension):
    def __init__(
        self,
        *,
        default_max_age: int = 0,
        calculate_http_headers: bool = True,
        execution_context: ExecutionContext,
    ):
        self.default_max_age = default_max_age
        self.execution_context = execution_context
        self.calculate_http_headers = calculate_http_headers
        self.max_age = self.default_max_age

    def on_executing_start(self):
        """This method is called after the executing step"""
        # print(self.execution_context.context["request"].headers)

    def on_executing_end(self):
        # <class 'starlette.datastructures.Headers'>
        # print(self.execution_context.context["request"].headers.raw)
        request = self.execution_context.context["request"]
        headers = request.headers.raw
        headers.append((b"cache-control", f"max-age={self.max_age}, public".encode()))
        request.headers._list = headers
        # .update({'Cache-Control': f"max-age={self.max_age}"})
        for header in request.headers.items():
            print(header)
        # print(self.execution_context.context["request"].headers)

    def resolve(
        self, _next, root, info: GraphQLResolveInfo, *args, **kwargs
    ) -> AwaitableOrValue[object]:
        schema: Schema = info.schema._strawberry_schema  # type: ignore

        # Info(_raw_info=info, _field=field)
        field: StrawberryField = schema.get_field_for_type(  # type: ignore
            field_name=info.field_name,
            type_name=info.parent_type.name,
        )
        if field:
            print(field.name)

            directive: CacheControl = next(
                filter(lambda k: isinstance(k, CacheControl), field.directives), None
            )
            if directive:
                self.max_age = directive.max_age

        return _next(root, info, *args, **kwargs)
