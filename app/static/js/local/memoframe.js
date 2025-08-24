
// 全局变量
let memos = [];
let currentMemoId = null;
const modal = new bootstrap.Modal(document.getElementById('memoModal'));
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

// 初始化
$(document).ready(function() {
    // 从本地存储加载备忘录
    loadMemos();

    // 渲染备忘录列表
    renderMemos();

    // 检查提醒
    checkReminders();

    // 设置定时检查提醒
    setInterval(checkReminders, 60000); // 每分钟检查一次

    // 事件监听
    $('#addMemoBtn, #emptyAddBtn').click(showAddModal);
    $('#saveMemoBtn').click(saveMemo);
    $('#confirmDeleteBtn').click(deleteMemo);
    $('#searchInput, #categoryFilter, #priorityFilter').on('input change', filterMemos);
});

// 从本地存储加载备忘录
function loadMemos() {
    const savedMemos = localStorage.getItem('memos');
    if (savedMemos) {
        memos = JSON.parse(savedMemos);
    }
}

// 保存备忘录到本地存储
function saveMemosToLocalStorage() {
    localStorage.setItem('memos', JSON.stringify(memos));
}

// 渲染备忘录列表
function renderMemos(filteredMemos = null) {
    const memoList = $('#memoList');
    memoList.empty();

    const displayMemos = filteredMemos || memos;

    if (displayMemos.length === 0) {
        $('#emptyState').removeClass('d-none');
        return;
    }

    $('#emptyState').addClass('d-none');

    // 按优先级和日期排序（高优先级在前，最新的在前）
    displayMemos.sort((a, b) => {
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    displayMemos.forEach(memo => {
        const priorityClass = `priority-${memo.priority}`;
        const completedClass = memo.completed ? 'completed' : '';
        const reminderBadge = memo.reminder ? '<span class="reminder-badge ms-1"><i class="far fa-bell"></i></span>' : '';

        // 格式化日期
        const formattedDate = new Date(memo.createdAt).toLocaleString();

        // 生成标签HTML
        let tagsHtml = '';
        if (memo.tags && memo.tags.length > 0) {
            memo.tags.forEach(tag => {
                tagsHtml += `<span class="tag bg-secondary-subtle text-secondary">${tag}</span>`;
            });
        }

        // 分类图标
        let categoryIcon = '';
        switch(memo.category) {
            case 'work':
                categoryIcon = '<i class="fas fa-briefcase text-primary me-1"></i>';
                break;
            case 'life':
                categoryIcon = '<i class="fas fa-home text-success me-1"></i>';
                break;
            case 'study':
                categoryIcon = '<i class="fas fa-book text-info me-1"></i>';
                break;
            default:
                categoryIcon = '<i class="fas fa-ellipsis-h text-secondary me-1"></i>';
        }

        // 优先级标签
        let priorityLabel = '';
        switch(memo.priority) {
            case 'high':
                priorityLabel = '<span class="badge bg-danger">高优先级</span>';
                break;
            case 'medium':
                priorityLabel = '<span class="badge bg-warning text-dark">中优先级</span>';
                break;
            case 'low':
                priorityLabel = '<span class="badge bg-success">低优先级</span>';
                break;
        }

        const memoCard = `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card memo-card ${priorityClass} ${completedClass} fade-in">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title memo-title mb-0">${memo.title}</h5>
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" ${memo.completed ? 'checked' : ''}
                                    onchange="toggleComplete('${memo.id}')">
                            </div>
                        </div>

                        <p class="card-text text-muted mb-3" style="max-height: 80px; overflow: hidden; text-overflow: ellipsis;">
                            ${memo.content || '无内容'}
                        </p>

                        <div class="mb-2">
                            ${categoryIcon}${memo.category.charAt(0).toUpperCase() + memo.category.slice(1)}
                            ${reminderBadge}
                        </div>

                        <div class="mb-2">
                            ${priorityLabel}
                        </div>

                        <div class="mb-3 d-flex flex-wrap">
                            ${tagsHtml}
                        </div>

                        <div class="text-muted small mb-3">
                            创建于: ${formattedDate}
                        </div>

                        <div class="d-flex justify-content-end gap-2">
                            <button class="btn btn-sm btn-outline-primary" onclick="showEditModal('${memo.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="showDeleteModal('${memo.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        memoList.append(memoCard);
    });
}

// 显示新增备忘录模态框
function showAddModal() {
    $('#modalTitle').text('新增备忘录');
    $('#memoForm')[0].reset();
    $('#memoId').val('');
    currentMemoId = null;
    modal.show();
}

// 显示编辑备忘录模态框
function showEditModal(id) {
    const memo = memos.find(m => m.id === id);
    if (!memo) return;

    currentMemoId = id;
    $('#modalTitle').text('编辑备忘录');
    $('#memoId').val(id);
    $('#title').val(memo.title);
    $('#content').val(memo.content);
    $('#priority').val(memo.priority);
    $('#category').val(memo.category);
    $('#tags').val(memo.tags ? memo.tags.join(',') : '');

    // 格式化日期时间为本地格式
    if (memo.reminder) {
        const reminderDate = new Date(memo.reminder);
        // 转换为YYYY-MM-DDTHH:MM格式
        const formattedDateTime = reminderDate.toISOString().slice(0, 16);
        $('#reminder').val(formattedDateTime);
    } else {
        $('#reminder').val('');
    }

    modal.show();
}

// 显示删除确认模态框
function showDeleteModal(id) {
    currentMemoId = id;
    deleteModal.show();
}

// 保存备忘录
function saveMemo() {
    const title = $('#title').val().trim();
    const content = $('#content').val().trim();
    const priority = $('#priority').val();
    const category = $('#category').val();
    const tagsInput = $('#tags').val().trim();
    const reminder = $('#reminder').val();

    // 简单验证
    if (!title) {
        alert('请输入备忘录标题');
        return;
    }

    // 处理标签
    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

    if (currentMemoId) {
        // 编辑现有备忘录
        const index = memos.findIndex(m => m.id === currentMemoId);
        if (index !== -1) {
            memos[index] = {
                ...memos[index],
                title,
                content,
                priority,
                category,
                tags,
                reminder: reminder || null,
                updatedAt: new Date().toISOString()
            };
        }
    } else {
        // 新增备忘录
        const newMemo = {
            id: Date.now().toString(),
            title,
            content,
            priority,
            category,
            tags,
            reminder: reminder || null,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        memos.push(newMemo);
    }

    // 保存到本地存储
    saveMemosToLocalStorage();

    // 重新渲染
    renderMemos();

    // 关闭模态框
    modal.hide();

    // 显示成功提示
    showToast(currentMemoId ? '备忘录已更新' : '备忘录已添加');
}

// 删除备忘录
function deleteMemo() {
    if (!currentMemoId) return;

    memos = memos.filter(memo => memo.id !== currentMemoId);

    // 保存到本地存储
    saveMemosToLocalStorage();

    // 重新渲染
    renderMemos();

    // 关闭模态框
    deleteModal.hide();

    // 显示成功提示
    showToast('备忘录已删除');
}

// 切换完成状态
function toggleComplete(id) {
    const memo = memos.find(m => m.id === id);
    if (memo) {
        memo.completed = !memo.completed;
        memo.updatedAt = new Date().toISOString();
        saveMemosToLocalStorage();
        renderMemos();
    }
}

// 筛选备忘录
function filterMemos() {
    const searchTerm = $('#searchInput').val().toLowerCase();
    const categoryFilter = $('#categoryFilter').val();
    const priorityFilter = $('#priorityFilter').val();

    const filtered = memos.filter(memo => {
        // 搜索筛选
        const matchesSearch = searchTerm === '' ||
            memo.title.toLowerCase().includes(searchTerm) ||
            memo.content.toLowerCase().includes(searchTerm) ||
            (memo.tags && memo.tags.some(tag => tag.toLowerCase().includes(searchTerm)));

        // 分类筛选
        const matchesCategory = categoryFilter === 'all' || memo.category === categoryFilter;

        // 优先级筛选
        const matchesPriority = priorityFilter === 'all' || memo.priority === priorityFilter;

        return matchesSearch && matchesCategory && matchesPriority;
    });

    renderMemos(filtered);
}

// 检查提醒
function checkReminders() {
    const now = new Date();
    const fifteenMinutes = 15 * 60 * 1000; // 15分钟（毫秒）

    memos.forEach(memo => {
        if (memo.reminder && !memo.completed) {
            const reminderTime = new Date(memo.reminder);
            const timeDiff = reminderTime - now;

            // 检查是否在当前时间或15分钟内
            if (timeDiff >= 0 && timeDiff <= fifteenMinutes) {
                // 检查是否已经提醒过（避免重复提醒）
                const lastNotified = localStorage.getItem(`reminder_${memo.id}`);
                const nowStr = now.toISOString().split('T')[0]; // 仅比较日期

                if (!lastNotified || lastNotified !== nowStr) {
                    // 显示通知
                    showReminderNotification(memo);

                    // 记录今天已提醒
                    localStorage.setItem(`reminder_${memo.id}`, nowStr);
                }
            }
        }
    });
}

// 显示提醒通知
function showReminderNotification(memo) {
    // 检查浏览器是否支持通知
    if (Notification.permission === 'granted') {
        new Notification('备忘录提醒', {
            body: `${memo.title}\n${memo.content || '点击查看详情'}`,
            icon: 'https://cdn-icons-png.flaticon.com/128/1350/1350444.png'
        });
    } else if (Notification.permission !== 'denied') {
        // 请求通知权限
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('备忘录提醒', {
                    body: `${memo.title}\n${memo.content || '点击查看详情'}`,
                    icon: 'https://cdn-icons-png.flaticon.com/128/1350/1350444.png'
                });
            } else {
                // 不支持通知时，显示浏览器弹窗
                alert(`备忘录提醒: ${memo.title}\n${memo.content || ''}`);
            }
        });
    } else {
        // 权限被拒绝时，显示浏览器弹窗
        alert(`备忘录提醒: ${memo.title}\n${memo.content || ''}`);
    }
}

// 显示提示消息
function showToast(message) {
    // 检查是否已有toast，如有则移除
    $('.toast').remove();

    // 创建toast元素
    const toast = `
        <div class="toast position-fixed bottom-5 end-5 bg-success text-white" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-body d-flex align-items-center">
                <i class="fas fa-check-circle me-2"></i>
                <span>${message}</span>
            </div>
        </div>
    `;

    // 添加到页面
    $('body').append(toast);

    // 显示toast
    const bootstrapToast = new bootstrap.Toast($('.toast')[0]);
    bootstrapToast.show();

    // 3秒后自动隐藏
    setTimeout(() => {
        bootstrapToast.hide();
    }, 3000);
}