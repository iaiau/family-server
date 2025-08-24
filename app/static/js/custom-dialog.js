class CustomDialog {
  constructor() {
    this.modal = null;
    this.initTemplate();
  }

  // 初始化模态框模板
  initTemplate() {
    const modalHtml = `
      <div class="modal fade" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title"></h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body"></div>
            <div class="modal-footer"></div>
          </div>
        </div>
      </div>
    `;

    this.modal = $(modalHtml);
    $('body').append(this.modal);
  }

  // 公共方法：警告框
  alert(message, callback) {
    this.show({
      title: '提示',
      body: message,
      buttons: [{
        text: '确定',
        class: 'btn-primary',
        handler: callback
      }]
    });
  }

  // 公共方法：确认框
  confirm(message, confirmCallback, cancelCallback) {
    this.show({
      title: '确认操作',
      body: message,
      buttons: [
        {
          text: '取消',
          class: 'btn-secondary',
          handler: cancelCallback
        },
        {
          text: '确定',
          class: 'btn-danger',
          handler: confirmCallback
        }
      ]
    });
  }

  // 核心显示方法
  show(config) {
    const $modal = this.modal;
    const $title = $modal.find('.modal-title');
    const $body = $modal.find('.modal-body');
    const $footer = $modal.find('.modal-footer');

    // 填充内容
    $title.text(config.title || '');
    $body.html(config.body || '');
    $footer.empty();

    // 创建按钮
    config.buttons.forEach(btnConfig => {
      const $btn = $(`
        <button class="btn ${btnConfig.class}">
          ${btnConfig.text}
        </button>
      `);

      $btn.on('click', () => {
        if (typeof btnConfig.handler === 'function') {
          btnConfig.handler();
        }
        $modal.modal('hide');
      });

      $footer.append($btn);
    });

    // 绑定隐藏事件自动清理
    $modal.off('hidden.bs.modal')
          .on('hidden.bs.modal', () => $modal.remove());

    // 显示模态框
    $modal.modal('show');
  }
}

// 单例模式导出
window.CustomDialog = new CustomDialog();
