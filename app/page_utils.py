from functools import wraps
from flask import request, jsonify
import math

def paginate(default_per_page=10, max_per_page=50):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            # 获取分页参数
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', default_per_page, type=int)

            # 确保每页条数是10的倍数且不超过最大值
            per_page = min(max_per_page, (per_page // 10) * 10 or default_per_page)

            # 调用原始函数获取数据
            result = f(*args, **kwargs)

            # 如果是查询集，进行分页处理
            if isinstance(result, (list, tuple)):
                total = len(result)
                total_pages = math.ceil(total / per_page)
                start = (page - 1) * per_page
                end = start + per_page
                paginated_data = result[start:end]

                return jsonify({
                    'data': paginated_data,
                    'pagination': {
                        'page': page,
                        'per_page': per_page,
                        'total': total,
                        'total_pages': total_pages
                    }
                })
            return result

        return wrapper

    return decorator
