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

        // 顶部返回主菜单按钮
        const backTop = document.getElementById('back-to-menu-top');
        if (backTop) {
            backTop.addEventListener('click', () => this.goToMenu());
        }

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

    goToMenu() {
        // 停止当前游戏并返回主菜单
        if (this.currentMode === 'keyboard' && window.keyboardGame) {
            if (window.keyboardGame.stop) window.keyboardGame.stop();
        } else if (this.currentMode === 'pinyin' && window.pinyinGame) {
            if (window.pinyinGame.pause) window.pinyinGame.pause();
        }
        this.currentMode = null;
        this.showScreen('menu-screen');
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

        // 切换是否在游戏中（用于显示/隐藏计分、暂停等）
        const appEl = document.getElementById('app');
        if (appEl) {
            const inGame = screenId === 'keyboard-game' || screenId === 'pinyin-game';
            appEl.classList.toggle('in-game', inGame);
        }

        // 离开游戏时，确保暂停遮罩隐藏
        if (this.$overlay && (screenId !== 'keyboard-game' && screenId !== 'pinyin-game')) {
            this.$overlay.classList.remove('active');
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
        if (!this._audio) this._audio = new SimpleAudio();
        this._audio.play(type);
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
        const isKeyboard = this.currentMode === 'keyboard';
        const messageDiv = document.createElement('div');
        messageDiv.className = `game-message ${type}`;
        messageDiv.textContent = text;

        const bg = type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1';
        const fg = type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460';

        if (isKeyboard) {
            // 键盘关：使用右上角 toast，不遮挡视线
            let container = document.getElementById('toast-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'toast-container';
                container.style.cssText = `
                    position: fixed;
                    top: 88px; /* 头部下方 */
                    right: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    z-index: 1000;
                    pointer-events: none;
                `;
                document.body.appendChild(container);
            }
            messageDiv.style.cssText = `
                background: ${bg};
                color: ${fg};
                padding: 10px 14px;
                border-radius: 12px;
                font-size: 1rem;
                font-weight: 700;
                box-shadow: 0 8px 20px rgba(0,0,0,0.15);
                border-left: 6px solid ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
                animation: fadeIn 0.2s ease;
                max-width: 320px;
                pointer-events: none;
            `;
            container.appendChild(messageDiv);
        } else {
            // 其他屏幕：保持原中心提示
            messageDiv.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: ${bg};
                color: ${fg};
                padding: 20px 30px;
                border-radius: 15px;
                font-size: 1.5rem;
                font-weight: bold;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                z-index: 1000;
                animation: bounce 0.6s ease;
            `;
            document.body.appendChild(messageDiv);
        }

        setTimeout(() => {
            if (messageDiv.parentNode) messageDiv.parentNode.removeChild(messageDiv);
        }, 1800);
    }
}

// 简易音频引擎（Web Audio API）
class SimpleAudio {
    constructor() {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = AudioCtx ? new AudioCtx() : null;
        this.volume = 0.2;
    }
    ensure() {
        if (!this.ctx) return false;
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        return true;
    }
    tone(freq = 440, duration = 0.12, type = 'sine') {
        if (!this.ensure()) return;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = type;
        o.frequency.setValueAtTime(freq, this.ctx.currentTime);
        g.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        o.connect(g).connect(this.ctx.destination);
        o.start();
        o.stop(this.ctx.currentTime + duration);
    }
    seq(notes) {
        if (!this.ensure()) return;
        let t = this.ctx.currentTime;
        notes.forEach(n => {
            const o = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            o.type = n.type || 'sine';
            o.frequency.setValueAtTime(n.f, t);
            g.gain.setValueAtTime(this.volume * (n.v || 1), t);
            g.gain.exponentialRampToValueAtTime(0.0001, t + n.d);
            o.connect(g).connect(this.ctx.destination);
            o.start(t);
            o.stop(t + n.d);
            t += (n.gap || n.d * 0.2);
        });
    }
    play(type) {
        switch (type) {
            case 'correct':
                this.seq([
                    { f: 880, d: 0.10, type: 'sine' },
                    { f: 1175, d: 0.12, type: 'sine' },
                ]);
                break;
            case 'wrong':
                this.seq([
                    { f: 220, d: 0.15, type: 'square' },
                    { f: 180, d: 0.15, type: 'square' },
                ]);
                break;
            case 'success':
                this.seq([
                    { f: 659, d: 0.10 }, { f: 784, d: 0.10 }, { f: 987, d: 0.14 }
                ]);
                break;
            default:
                this.tone(520, 0.08, 'triangle');
        }
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
