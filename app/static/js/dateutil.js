
/**
 * jQuery日期工具类 - DateUtil
 * 提供常用日期格式转换和计算方法
 */
(function($) {
    $.DateUtil = {
        /**
         * 将日期对象格式化为指定格式字符串
         * @param {Date} date - 日期对象
         * @param {String} format - 格式字符串(yyyy-MM-dd HH:mm:ss)
         * @return {String} 格式化后的日期字符串
         */
        format: function(date, format) {
            if (!date) return '';

            const pad = num => num.toString().padStart(2, '0');
            const maps = {
                'yyyy': date.getFullYear(),
                'MM': pad(date.getMonth() + 1),
                'dd': pad(date.getDate()),
                'HH': pad(date.getHours()),
                'mm': pad(date.getMinutes()),
                'ss': pad(date.getSeconds())
            };

            return format.replace(/(yyyy|MM|dd|HH|mm|ss)/g, match => maps[match]);
        },

        /**
         * 将GMT时间字符串转换为日期对象
         * @param {String} gmtString - GMT时间字符串
         * @return {Date} 日期对象
         */
        parseGMT: function(gmtString) {
            return new Date(gmtString);
        },

        /**
         * 获取当前时间并格式化
         * @param {String} format - 格式字符串(默认yyyy-MM-dd HH:mm:ss)
         * @return {String} 格式化后的当前时间
         */
        now: function(format = 'yyyy-MM-dd HH:mm:ss') {
            return this.format(new Date(), format);
        },

        /**
         * 将日期转换为中文格式(2025年08月23日 16:24:13 星期六)
         * @param {Date} date - 日期对象
         * @return {String} 中文格式日期字符串
         */
        toChinese: function(date) {
            if (!date) return '';

            const weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
            return `${date.getFullYear()}年${(date.getMonth() + 1).toString().padStart(2, '0')}月` +
                   `${date.getDate().toString().padStart(2, '0')}日 ` +
                   `${date.getHours().toString().padStart(2, '0')}:` +
                   `${date.getMinutes().toString().padStart(2, '0')}:` +
                   `${date.getSeconds().toString().padStart(2, '0')} ` +
                   weeks[date.getDay()];
        },

        /**
         * 计算两个日期之间的天数差
         * @param {Date} date1 - 日期1
         * @param {Date} date2 - 日期2
         * @return {Number} 天数差(绝对值)
         */
        daysBetween: function(date1, date2) {
            const diff = Math.abs(date1.getTime() - date2.getTime());
            return Math.floor(diff / (1000 * 60 * 60 * 24));
        }
    };
})(jQuery);
