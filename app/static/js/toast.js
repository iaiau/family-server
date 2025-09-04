(function($) {
    $.glassToast = function(options) {
        // 默认配置
        const defaults = {
            message: '操作成功',
            type: 'success',
            position: 'top-right',
            duration: 3000,
            dismissible: true,
            animation: true,
            glassOpacity: 0.85,
            dynamicText: true
        };

        // 合并配置
        const settings = $.extend({}, defaults, options);

        // 高级样式配置
        const styleConfig = {
            success: {
                baseColor: '#10b981',
                lightColor: 'rgba(16, 185, 129, 0.15)',
                icon: '<svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
                textClass: 'text-success-emphasis'
            },
            error: {
                baseColor: '#ef4444',
                lightColor: 'rgba(239, 68, 68, 0.15)',
                icon: '<svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
                textClass: 'text-danger-emphasis'
            },
            warning: {
                baseColor: '#f59e0b',
                lightColor: 'rgba(245, 158, 11, 0.15)',
                icon: '<svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
                textClass: 'text-warning-emphasis'
            },
            info: {
                baseColor: '#3b82f6',
                lightColor: 'rgba(59, 130, 246, 0.15)',
                icon: '<svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
                textClass: 'text-info-emphasis'
            }
        };

        // 创建容器（单例模式）
        let container = $(`#glass-toast-container-${settings.position}`);
        if (!container.length) {
            container = $('<div>').attr('id', `glass-toast-container-${settings.position}`)
                .addClass('glass-toast-container position-fixed d-flex flex-column gap-3 p-3')
                .css({
                    'z-index': '9999',
                    'pointer-events': 'none',
                    'max-width': '100%',
                    'width': '350px'
                });

            // 动态位置计算
            const positionMap = {
                'top-left': { top: '20px', left: '20px' },
                'top-center': { top: '20px', left: '50%', transform: 'translateX(-50%)' },
                'top-right': { top: '20px', right: '20px' },
                'bottom-left': { bottom: '20px', left: '20px' },
                'bottom-center': { bottom: '20px', left: '50%', transform: 'translateX(-50%)' },
                'bottom-right': { bottom: '20px', right: '20px' }
            };
            
            container.css(positionMap[settings.position] || positionMap['top-right']);
            $('body').append(container);
        }

        // 创建Toast元素（毛玻璃效果核心）
        const toastId = 'toast-' + Math.random().toString(36).substr(2, 9);
        const currentStyle = styleConfig[settings.type];
        const toast = $('<div>').attr('id', toastId)
            .addClass('toast glass-toast d-flex align-items-start p-3 rounded-3')
            .css({
                'backdrop-filter': 'blur(10px)',
                '-webkit-backdrop-filter': 'blur(10px)',
                'background-color': `rgba(255, 255, 255, ${settings.glassOpacity})`,
                'border': `1px solid ${currentStyle.baseColor}20`,
                'box-shadow': `0 4px 30px ${currentStyle.baseColor}15`,
                'color': currentStyle.baseColor,
                'opacity': settings.animation ? 0 : 1,
                'transform': settings.animation ? 'translateY(20px)' : 'translateY(0)',
                'transition': 'all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)'
            });

        // 动态文字颜色系统
        if (settings.dynamicText) {
            toast.addClass(currentStyle.textClass);
        }

        // 构建内容结构
        const toastContent = $('<div>').addClass('d-flex w-100');
        
        // 图标区域
        const iconArea = $('<div>').addClass('flex-shrink-0 me-3 d-flex align-items-start')
            .css('color', currentStyle.baseColor)
            .html(currentStyle.icon);
        
        // 文字内容区
        const textArea = $('<div>').addClass('flex-grow-1');
        
        // 标题
        const title = $('<div>').addClass('toast-title fw-semibold mb-1')
            .text(settings.type.charAt(0).toUpperCase() + settings.type.slice(1));
        
        // 消息内容
        const message = $('<div>').addClass('toast-message small')
            .text(settings.message);
        
        textArea.append(title, message);
        toastContent.append(iconArea, textArea);
        toast.append(toastContent);

        // 可关闭按钮
        if (settings.dismissible) {
            const closeBtn = $('<button>').attr({
                'type': 'button',
                'class': 'btn-close ms-2',
                'data-bs-dismiss': 'toast',
                'aria-label': 'Close'
            }).css('filter', `invert(1) opacity(0.7)`);
            
            toastContent.append(closeBtn);
            
            // 自定义关闭逻辑
            closeBtn.on('click', function() {
                hideToast(toast);
            });
        }

        // 添加到容器
        container.append(toast);

        // 显示动画
        if (settings.animation) {
            setTimeout(() => {
                toast.css({
                    'opacity': 1,
                    'transform': 'translateY(0)'
                });
            }, 10);
        }

        // 自动隐藏逻辑
        if (settings.duration > 0) {
            const timer = setTimeout(() => {
                hideToast(toast);
            }, settings.duration);

            // 悬停暂停功能
            toast.hover(
                () => clearTimeout(timer),
                () => {
                    const newTimer = setTimeout(() => {
                        hideToast(toast);
                    }, settings.duration);
                    toast.data('timer', newTimer);
                }
            );
        }

        // 隐藏动画函数
        function hideToast(toastElement) {
            if (settings.animation) {
                toastElement.css({
                    'opacity': 0,
                    'transform': 'translateY(-20px)'
                });
                setTimeout(() => {
                    toastElement.remove();
                    if (!container.children().length) {
                        container.remove();
                    }
                }, 300);
            } else {
                toastElement.remove();
                if (!container.children().length) {
                    container.remove();
                }
            }
        }

        return toast;
    };
})(jQuery);
