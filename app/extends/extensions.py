from flask_sqlalchemy import BaseQuery

class PaginatedQuery(BaseQuery):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._paginate_params = None

    def apply_pagination(self, page=1, per_page=20):
        self._paginate_params = (page, per_page)
        return self

    def __iter__(self):
        if self._paginate_params:
            page, per_page = self._paginate_params
            return self.paginate(page, per_page).items.__iter__()
        return super().__iter__()
