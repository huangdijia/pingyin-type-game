// 游戏主控制器
class TypeGameApp {
    constructor() {
        this.currentMode = null;
        this.score = 0;
        this.accuracy = 100;
        this.totalAttempts = 0;
        this.correctAttempts = 0;
        this.$overlay = null;
        
        this.initEventListeners();
        this.updateStats();
    }

    initEventListeners() {
        // 菜单按钮事件
        document.querySelectorAll('.menu-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.target.dataset.mode;
                this.switchToMode(mode);
            });
        });

        // 返回菜单按钮事件
        document.querySelectorAll('#back-to-menu, #pinyin-back-menu').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showScreen('menu-screen');
                this.currentMode = null;
            });
        });

        // 暂停按钮事件
        const pauseBtn = document.getElementById('pause-game');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                this.pauseGame();
            });
        }

        // 暂停遮罩
        this.$overlay = document.getElementById('pause-overlay');
        const resumeBtn = document.getElementById('overlay-resume');
        if (this.$overlay && resumeBtn) {
            resumeBtn.addEventListener('click', () => this.pauseGame());
            this.$overlay.addEventListener('click', (e) => {
                // 点击遮罩空白区域也继续（点击卡片不触发）
                if (e.target === this.$overlay) this.pauseGame();
            });
        }
    }

    switchToMode(mode) {
        this.currentMode = mode;
        this.resetStats();

        switch (mode) {
            case 'keyboard':
                this.showScreen('keyboard-game');
                // 不自动开始，等待用户点击“开始”按钮
                if (window.keyboardGame && window.keyboardGame.resetToIdle) {
                    window.keyboardGame.resetToIdle();
                }
                break;
            case 'pinyin':
                this.showScreen('pinyin-game');
                if (window.pinyinGame) {
                    window.pinyinGame.start();
                }
                break;
            case 'daily':
                // 日常训练模式 - 后续实现
                alert('🚧 日常训练模式正在开发中...');
                break;
        }
    }

    showScreen(screenId) {
        // 隐藏所有屏幕
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // 显示指定屏幕
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
    }

    updateScore(points) {
        this.score += points;
        document.getElementById('score').textContent = this.score;
    }

    recordAttempt(isCorrect) {
        this.totalAttempts++;
        if (isCorrect) {
            this.correctAttempts++;
        }
        
        this.accuracy = this.totalAttempts > 0 
            ? Math.round((this.correctAttempts / this.totalAttempts) * 100)
            : 100;
            
        document.getElementById('accuracy').textContent = this.accuracy + '%';
    }

    resetStats() {
        this.score = 0;
        this.totalAttempts = 0;
        this.correctAttempts = 0;
        this.accuracy = 100;
        this.updateStats();
    }

    updateStats() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('accuracy').textContent = this.accuracy + '%';
    }

    pauseGame() {
        if (this.currentMode === 'keyboard' && window.keyboardGame) {
            window.keyboardGame.pause();
        } else if (this.currentMode === 'pinyin' && window.pinyinGame) {
            window.pinyinGame.pause();
        }

        // 切换遮罩显示
        if (this.$overlay) {
            this.$overlay.classList.toggle('active');
        }
    }

    playSound(type) {
        // 音效播放 - 后续实现
        console.log(`Playing sound: ${type}`);
    }

    showEncouragement() {
        const encouragements = [
            '🌟 太棒了！',
            '👏 干得好！',
            '🎉 继续加油！',
            '💪 你真厉害！',
            '🏆 完美！'
        ];
        
        const randomMsg = encouragements[Math.floor(Math.random() * encouragements.length)];
        this.showMessage(randomMsg, 'success');
    }

    showMessage(text, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `game-message ${type}`;
        messageDiv.textContent = text;
        messageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
            color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
            padding: 20px 30px;
            border-radius: 15px;
            font-size: 1.5rem;
            font-weight: bold;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            animation: bounce 0.6s ease;
        `;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 2000);
    }
}

// 初始化游戏应用
window.addEventListener('DOMContentLoaded', () => {
    window.gameApp = new TypeGameApp();
});

// 全局键盘事件监听
document.addEventListener('keydown', (e) => {
    if (window.gameApp && window.gameApp.currentMode === 'keyboard' && window.keyboardGame) {
        window.keyboardGame.handleKeyPress(e.key.toLowerCase());
    }
});
