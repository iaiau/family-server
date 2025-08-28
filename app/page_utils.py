import math


def get_page(query, page_no, per_page):
    page = {}
    page["page"] = 1
    page["per_page"] = 10
    if page and per_page:
        page["page"], page["per_page"] = int(page_no), int(per_page)
        total = query.count()
        page["total"] = total
        total_page = math.ceil(total / page["per_page"])
        if total_page <= page["page"]:
            page["page"] = total_page
        if page["page"] <= 1:
            page["page"] = 1
        query = query.limit(page["per_page"]).offset((page["page"] - 1) * page["per_page"])
    return query, page
