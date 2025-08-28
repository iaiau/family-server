
/**
 * Bootstrap分页组件封装
 * @param {Object} options 配置参数
 *   - container: 分页容器选择器
 *   - url: 请求地址
 *   - dataContainer: 数据容器选择器
 *   - params: 请求参数对象
 *   - pageKey: 页码参数名(默认'page')
 *   - callback: 数据渲染回调函数
 */
class Pagination {
  constructor(options) {
    this.options = $.extend({
      pageKey: 'page',
      params: {}
    }, options);

    this.init();
  }

  init() {
    this.loadData();
    this.bindEvents();
  }

  loadData() {
    const params = this.options.params;

    $.ajax({
      url: this.options.url,
      data: params,
      type: 'GET',
      dataType: 'json',
      success: (response) => {
        this.renderData(response);
        this.renderPagination(response.page);
      },
      error: (xhr) => {
        console.error('请求失败:', xhr.statusText);
      }
    });
  }

  renderData(response) {
    if (typeof this.options.callback === 'function') {
      this.options.callback(response.data, $(this.options.dataContainer));
    } else {
      this.defaultRender(response);
    }
  }

  defaultRender(data) {
    let html = '<table class="table table-bordered"><thead><tr>';
    if(data.length > 0) {
      Object.keys(data[0]).forEach(key => {
        html += `<th>${key}</th>`;
      });
      html += '</tr></thead><tbody>';
      data.forEach(item => {
        html += '<tr>';
        Object.values(item).forEach(val => {
          html += `<td>${val}</td>`;
        });
        html += '</tr>';
      });
      html += '</tbody></table>';
    } else {
      html = '<div class="alert alert-info">暂无数据</div>';
    }
    $(this.options.dataContainer).html(html);
  }

  renderPagination(page) {
    const { per_page, total } = page;
    const page_no = page.page;
    const last_page = Math.ceil(total / per_page);
    console.log("last_page" + last_page);
    const pagination = $(this.options.container);
    pagination.empty();

    pagination.append(`
        <li class="page-item">
            共 <span>${total}</span> 条
        </li>
    `);

    // 上一页
    pagination.append(`
      <li class="page-item ${page_no === 1 ? 'disabled' : ''}">
        <a class="page-link prev" href="#" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
    `);

    // 页码
    for(let i = 1; i <= last_page; i++) {
      pagination.append(`
        <li class="page-item ${i === page_no ? 'active' : ''}">
          <a class="page-link page-num" href="#" data-page="${i}">${i}</a>
        </li>
      `);
    }

    // 下一页
    pagination.append(`
      <li class="page-item ${page_no === last_page ? 'disabled' : ''}">
        <a class="page-link next" href="#" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    `);

    pagination.append(`
        <li class="page-item">
            <select class="per-page">
                <option value="10" ${per_page == 10 ? 'selected' : ''}>10条/页</option>
                <option value="20" ${per_page == 20 ? 'selected' : ''}>20条/页</option>
            </select>
        </li>
    `);
    pagination.append(`
        <li class="page-item">
            第 <input type="number" class="dynamic-page-no" value="${page_no}"></input> 页
        </li>
    `);
  }

  bindEvents() {
    $(document).off('click', '.page-num').on('click', '.page-num', (e) => {
      e.preventDefault();
      this.options.params.page = $(e.target).data('page');
      this.loadPage();
    });

    $(document).off('click', '.prev').on('click', '.prev', (e) => {
      e.preventDefault();
      const current = parseInt($(this.options.container).find('.active .page-link').data('page') || 1);

      if(current > 1) {this.options.params.page = current - 1;this.loadPage();}
    });

    $(document).off('click', '.next').on('click', '.next', (e) => {
      e.preventDefault();
      const current = parseInt($(this.options.container).find('.active .page-link').data('page') || 1);
      const lastPage = $(this.options.container).find('.page-num').last().data('page');

      if(current < lastPage) {this.options.params.page = current + 1;this.loadPage();}
    });

    $(document).off('change', '.per-page').on('change','.per-page',(e)=>{
        e.preventDefault();
        this.options.params.per_page = e.target.value;
        this.loadData();
    });

    $(document).off('change', '.dynamic-page-no').on('change','.dynamic-page-no',(e)=>{
        e.preventDefault();
        this.options.params.page = e.target.value;
        this.loadData();
    });
  }

  loadPage(page) {
    this.loadData(page);
  }

  updateParams(params) {
    this.options.params = params;
    this.loadData();
  }
}
