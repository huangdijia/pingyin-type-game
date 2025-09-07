// 拼音打字关游戏控制器（MVP）
// 常用字与词题库（不含声调，base 为拼音连写）
const PINYIN_COMMON_ITEMS = [
    // 人称与家庭
    { char: '我', base: 'wo', hint: '🙋' },
    { char: '你', base: 'ni', hint: '🙂' },
    { char: '他', base: 'ta', hint: '👦' },
    { char: '她', base: 'ta', hint: '👧' },
    { char: '我们', base: 'women', hint: '👨‍👩‍👧' },
    { char: '你们', base: 'nimen', hint: '🧑‍🤝‍🧑' },
    { char: '他们', base: 'tamen', hint: '👥' },
    { char: '妈妈', base: 'mama', hint: '👩' },
    { char: '爸爸', base: 'baba', hint: '👨' },
    { char: '爷爷', base: 'yeye', hint: '👴' },
    { char: '奶奶', base: 'nainai', hint: '👵' },
    { char: '哥哥', base: 'gege', hint: '👦' },
    { char: '姐姐', base: 'jiejie', hint: '👧' },
    { char: '弟弟', base: 'didi', hint: '👶' },
    { char: '妹妹', base: 'meimei', hint: '👶' },
    { char: '家', base: 'jia', hint: '🏠' },
    { char: '家人', base: 'jiaren', hint: '👪' },
    { char: '朋友', base: 'pengyou', hint: '🧑‍🤝‍🧑' },

    // 问候与常用表达
    { char: '你好', base: 'nihao', hint: '👋' },
    { char: '谢谢', base: 'xiexie', hint: '🙏' },
    { char: '不客气', base: 'bukeqi', hint: '🤗' },
    { char: '再见', base: 'zaijian', hint: '👋' },
    { char: '请', base: 'qing', hint: '🙏' },
    { char: '对不起', base: 'duibuqi', hint: '🙇‍♂️' },
    { char: '没关系', base: 'meiguanxi', hint: '😊' },
    { char: '早上好', base: 'zaoshanghao', hint: '🌅' },
    { char: '晚安', base: 'wanan', hint: '🌙' },

    // 学校相关
    { char: '老师', base: 'laoshi', hint: '👩‍🏫' },
    { char: '同学', base: 'tongxue', hint: '🧑‍🎓' },
    { char: '学校', base: 'xuexiao', hint: '🏫' },
    { char: '上学', base: 'shangxue', hint: '🎒' },
    { char: '放学', base: 'fangxue', hint: '🏠' },
    { char: '上课', base: 'shangke', hint: '🛎️' },
    { char: '下课', base: 'xiake', hint: '🛎️' },
    { char: '休息', base: 'xiuxi', hint: '😌' },
    { char: '作业', base: 'zuoye', hint: '📚' },
    { char: '课本', base: 'keben', hint: '📖' },
    { char: '书包', base: 'shubao', hint: '🎒' },
    { char: '铅笔', base: 'qianbi', hint: '✏️' },
    { char: '橡皮', base: 'xiangpi', hint: '🧽' },
    { char: '尺子', base: 'chizi', hint: '📏' },
    { char: '桌子', base: 'zhuozi', hint: '🧰' },
    { char: '椅子', base: 'yizi', hint: '🪑' },

    // 数字（1-10）
    { char: '一', base: 'yi', hint: '1️⃣' },
    { char: '二', base: 'er', hint: '2️⃣' },
    { char: '三', base: 'san', hint: '3️⃣' },
    { char: '四', base: 'si', hint: '4️⃣' },
    { char: '五', base: 'wu', hint: '5️⃣' },
    { char: '六', base: 'liu', hint: '6️⃣' },
    { char: '七', base: 'qi', hint: '7️⃣' },
    { char: '八', base: 'ba', hint: '8️⃣' },
    { char: '九', base: 'jiu', hint: '9️⃣' },
    { char: '十', base: 'shi', hint: '🔟' },

    // 颜色
    { char: '红', base: 'hong', hint: '🔴' },
    { char: '黄', base: 'huang', hint: '🟡' },
    { char: '蓝', base: 'lan', hint: '🔵' },
    { char: '绿', base: 'lv', hint: '🟢' },
    { char: '黑', base: 'hei', hint: '⚫' },
    { char: '白', base: 'bai', hint: '⚪' },

    // 动物
    { char: '狗', base: 'gou', hint: '🐶' },
    { char: '猫', base: 'mao', hint: '🐱' },
    { char: '鸟', base: 'niao', hint: '🐦' },
    { char: '鱼', base: 'yu', hint: '🐟' },
    { char: '马', base: 'ma', hint: '🐴' },
    { char: '牛', base: 'niu', hint: '🐮' },
    { char: '羊', base: 'yang', hint: '🐑' },
    { char: '虎', base: 'hu', hint: '🐯' },
    { char: '龙', base: 'long', hint: '🐲' },
    { char: '熊猫', base: 'xiongmao', hint: '🐼' },

    // 食物与水果
    { char: '苹果', base: 'pingguo', hint: '🍎' },
    { char: '香蕉', base: 'xiangjiao', hint: '🍌' },
    { char: '西瓜', base: 'xigua', hint: '🍉' },
    { char: '葡萄', base: 'putao', hint: '🍇' },
    { char: '草莓', base: 'caomei', hint: '🍓' },
    { char: '米饭', base: 'mifan', hint: '🍚' },
    { char: '面条', base: 'miantiao', hint: '🍜' },
    { char: '饺子', base: 'jiaozi', hint: '🥟' },

    // 动作与日常
    { char: '吃', base: 'chi', hint: '🍽️' },
    { char: '喝', base: 'he', hint: '🥤' },
    { char: '看', base: 'kan', hint: '👀' },
    { char: '听', base: 'ting', hint: '👂' },
    { char: '说', base: 'shuo', hint: '🗣️' },
    { char: '写', base: 'xie', hint: '✍️' },
    { char: '读', base: 'du', hint: '📖' },
    { char: '玩', base: 'wan', hint: '🎮' },
    { char: '学', base: 'xue', hint: '📘' },
    { char: '跑', base: 'pao', hint: '🏃' },
    { char: '跳', base: 'tiao', hint: '🤾' },
    { char: '唱', base: 'chang', hint: '🎤' },
    { char: '跳舞', base: 'tiaowu', hint: '💃' },
    { char: '睡觉', base: 'shuijiao', hint: '😴' },

    // 时间与天气
    { char: '今天', base: 'jintian', hint: '📅' },
    { char: '明天', base: 'mingtian', hint: '📆' },
    { char: '昨天', base: 'zuotian', hint: '📆' },
    { char: '现在', base: 'xianzai', hint: '⏰' },
    { char: '早上', base: 'zaoshang', hint: '🌅' },
    { char: '中午', base: 'zhongwu', hint: '🏙️' },
    { char: '晚上', base: 'wanshang', hint: '🌙' },
    { char: '太阳', base: 'taiyang', hint: '☀️' },
    { char: '月亮', base: 'yueliang', hint: '🌙' },
    { char: '星星', base: 'xingxing', hint: '⭐' },
    { char: '雨', base: 'yu', hint: '🌧️' },
    { char: '雪', base: 'xue', hint: '❄️' },
    { char: '风', base: 'feng', hint: '🌬️' },
    { char: '云', base: 'yun', hint: '☁️' },

    // 地点与国家
    { char: '中国', base: 'zhongguo', hint: '🇨🇳' },
    { char: '北京', base: 'beijing', hint: '🏯' },
    { char: '上海', base: 'shanghai', hint: '🏙️' },
    { char: '广州', base: 'guangzhou', hint: '🏙️' },

    // 形状与方向/方位
    { char: '大', base: 'da', hint: '🔺' },
    { char: '小', base: 'xiao', hint: '🔻' },
    { char: '上', base: 'shang', hint: '⬆️' },
    { char: '下', base: 'xia', hint: '⬇️' },
    { char: '左', base: 'zuo', hint: '⬅️' },
    { char: '右', base: 'you', hint: '➡️' },
    { char: '中', base: 'zhong', hint: '🎯' },

    // 汉字部首/自然
    { char: '水', base: 'shui', hint: '💧' },
    { char: '火', base: 'huo', hint: '🔥' },
    { char: '木', base: 'mu', hint: '🌳' },
    { char: '土', base: 'tu', hint: '🟫' },
    { char: '田', base: 'tian', hint: '🧩' },
    { char: '山', base: 'shan', hint: '⛰️' },

    // 身体部位
    { char: '眼睛', base: 'yanjing', hint: '👀' },
    { char: '耳朵', base: 'erduo', hint: '👂' },
    { char: '鼻子', base: 'bizi', hint: '👃' },
    { char: '嘴巴', base: 'zuiba', hint: '👄' },
    { char: '头发', base: 'toufa', hint: '💇' },
    { char: '手指', base: 'shouzhi', hint: '☝️' },
    { char: '脚', base: 'jiao', hint: '🦶' },

    // 心情/状态
    { char: '开心', base: 'kaixin', hint: '🙂' },
    { char: '生气', base: 'shengqi', hint: '😠' },
    { char: '伤心', base: 'shangxin', hint: '😢' },
    { char: '累', base: 'lei', hint: '🥱' },

    // z/zh/ch/sh/s 练习
    { char: '只', base: 'zhi', hint: '1️⃣' },
    { char: '纸', base: 'zhi', hint: '📄' },
    { char: '吃', base: 'chi', hint: '🍽️' },
    { char: '车', base: 'che', hint: '🚗' },
    { char: '书', base: 'shu', hint: '📚' },
    { char: '石', base: 'shi', hint: '🪨' },
    { char: '日', base: 'ri', hint: '☀️' },
    { char: '子', base: 'zi', hint: '👶' },
    { char: '刺', base: 'ci', hint: '🌵' },
    { char: '四', base: 'si', hint: '4️⃣' },
];
class PinyinGame {
    constructor() {
        this.isPlaying = false;
        this.isPaused = false;
        this.currentItem = null;
        this.awaitingSelection = false;

        // 题库：使用更全面的常用字与词
        this.items = PINYIN_COMMON_ITEMS;

        // DOM
        this.$char = document.getElementById('target-character');
        this.$hint = document.getElementById('character-hint');
        this.$input = document.getElementById('pinyin-input');
        this.$submit = document.getElementById('pinyin-submit');
        this.$candidates = document.getElementById('pinyin-candidates');

        this.bindEvents();
    }

    bindEvents() {
        if (this.$submit) {
            this.$submit.addEventListener('click', () => this.submit());
        }
        if (this.$input) {
            this.$input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') this.submit();
            });
        }
        if (this.$candidates) {
            this.$candidates.addEventListener('click', (e) => {
                const target = e.target;
                if (target.classList.contains('candidate')) {
                    this.chooseCandidate(target.dataset.char);
                }
            });
        }
    }

    start() {
        this.isPlaying = true;
        this.isPaused = false;
        this.awaitingSelection = false;
        this.nextItem();
        if (window.gameApp) window.gameApp.showMessage('📝 拼音打字开始！', 'info');
        if (this.$input) this.$input.focus();
    }

    pause() {
        this.isPaused = !this.isPaused;
        if (window.gameApp) window.gameApp.showMessage(this.isPaused ? '⏸️ 已暂停' : '▶️ 继续', 'info');
    }

    nextItem() {
        this.awaitingSelection = false;
        this.$input.value = '';
        this.$candidates.innerHTML = '';
        this.currentItem = this.items[Math.floor(Math.random() * this.items.length)];
        if (this.$char) this.$char.textContent = this.currentItem.char;
        if (this.$hint) this.$hint.textContent = this.currentItem.hint || '';
    }

    submit() {
        if (!this.isPlaying || this.isPaused) return;
        const val = (this.$input.value || '').trim().toLowerCase();
        if (!val) return;

        if (val === this.currentItem.base) {
            // 正确后直接判定通过并进入下一题
            if (window.gameApp) {
                window.gameApp.recordAttempt(true);
                window.gameApp.updateScore(10);
                window.gameApp.playSound('correct');
                window.gameApp.showEncouragement();
            }
            setTimeout(() => this.nextItem(), 200);
        } else {
            if (window.gameApp) {
                window.gameApp.recordAttempt(false);
                window.gameApp.playSound('wrong');
                window.gameApp.showMessage('❌ 拼音不对，再试一次', 'error');
            }
        }
    }

    renderCandidates(list) {
        this.$candidates.innerHTML = '';
        list.forEach((c) => {
            const div = document.createElement('div');
            div.className = 'candidate';
            div.dataset.char = c;
            div.textContent = c;
            this.$candidates.appendChild(div);
        });
    }

    chooseCandidate(char) {
        if (!this.awaitingSelection) return;
        const correct = char === this.currentItem.char;
        if (window.gameApp) {
            window.gameApp.recordAttempt(correct);
            if (correct) {
                window.gameApp.updateScore(10);
                window.gameApp.playSound('correct');
                window.gameApp.showEncouragement();
                setTimeout(() => this.nextItem(), 300);
            } else {
                window.gameApp.playSound('wrong');
                window.gameApp.showMessage('❌ 选错了，再看看提示', 'error');
            }
        }
    }
}

// 初始化
window.addEventListener('DOMContentLoaded', () => {
    window.pinyinGame = new PinyinGame();
});
