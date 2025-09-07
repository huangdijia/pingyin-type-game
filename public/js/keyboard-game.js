// 键盘熟悉关游戏控制器
class KeyboardGame {
    constructor() {
        this.isPlaying = false;
        this.isPaused = false;
        this.fallingLetters = [];
        this.gameSpeed = 3000; // 初始速度（毫秒）
        this.minSpeed = 1000;  // 最快速度
        this.difficulty = 1;   // 难度等级
        this.gameTimer = null;
        this.animationFrame = null;
        
        // 键盘区域定义 - 从基础键位开始
        this.keyGroups = {
            basic: ['a', 's', 'd', 'f', 'j', 'k', 'l'],  // 基础主键区
            leftHand: ['q', 'w', 'e', 'r', 't', 'a', 's', 'd', 'f', 'g', 'z', 'x', 'c', 'v', 'b'],
            rightHand: ['y', 'u', 'i', 'o', 'p', 'h', 'j', 'k', 'l', 'n', 'm'],
            full: 'abcdefghijklmnopqrstuvwxyz'.split('')
        };
        
        this.currentKeyGroup = 'basic'; // 当前练习的键位组
        this.container = document.getElementById('falling-letters');
        this.startOverlay = document.getElementById('keyboard-start-overlay');
        this.startBtn = document.getElementById('keyboard-start-btn');
        
        this.initKeyboard();
        this.initStartUI();
    }

    initKeyboard() {
        // 高亮显示当前练习的键位
        this.highlightCurrentKeys();
    }

    highlightCurrentKeys() {
        // 重置所有按键样式
        document.querySelectorAll('.key').forEach(key => {
            key.classList.remove('highlight', 'disabled');
        });

        // 高亮当前练习的键位
        this.keyGroups[this.currentKeyGroup].forEach(letter => {
            const keyElement = document.querySelector(`[data-key="${letter}"]`);
            if (keyElement) {
                keyElement.classList.add('highlight');
            }
        });

        // 禁用不在练习范围内的键位
        document.querySelectorAll('.key').forEach(key => {
            const keyChar = key.dataset.key;
            if (!this.keyGroups[this.currentKeyGroup].includes(keyChar)) {
                key.classList.add('disabled');
            }
        });
    }

    initStartUI() {
        if (this.startBtn) {
            this.startBtn.addEventListener('click', () => this.start());
        }
    }

    showStartOverlay() {
        if (this.startOverlay) this.startOverlay.classList.add('active');
    }

    hideStartOverlay() {
        if (this.startOverlay) this.startOverlay.classList.remove('active');
    }

    resetToIdle() {
        // 清空状态但不弹“游戏结束”提示
        this.isPlaying = false;
        this.isPaused = false;
        if (this.gameTimer) clearTimeout(this.gameTimer);
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
        this.fallingLetters.forEach(letter => {
            if (letter.element && letter.element.parentNode) {
                letter.element.parentNode.removeChild(letter.element);
            }
        });
        this.fallingLetters = [];
        if (this.container) this.container.innerHTML = '';
        this.showStartOverlay();
    }

    start() {
        this.isPlaying = true;
        this.isPaused = false;
        this.fallingLetters = [];
        this.difficulty = 1;
        this.gameSpeed = 3000;
        
        // 清空容器
        this.container.innerHTML = '';
        this.hideStartOverlay();
        
        // 开始生成掉落字母
        this.generateLetter();
        this.startGameLoop();
        
        // 显示游戏开始提示
        window.gameApp.showMessage('🎮 游戏开始！按下掉落的字母！', 'info');
    }

    pause() {
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            if (this.gameTimer) clearTimeout(this.gameTimer);
            if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
            window.gameApp.showMessage('⏸️ 游戏暂停', 'info');
        } else {
            this.startGameLoop();
            this.generateLetter();
            window.gameApp.showMessage('▶️ 游戏继续', 'info');
        }
    }

    stop() {
        this.isPlaying = false;
        this.isPaused = false;
        
        if (this.gameTimer) clearTimeout(this.gameTimer);
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
        
        // 清空所有掉落字母
        this.fallingLetters.forEach(letter => {
            if (letter.element && letter.element.parentNode) {
                letter.element.parentNode.removeChild(letter.element);
            }
        });
        this.fallingLetters = [];
        
        window.gameApp.showMessage('🎯 游戏结束！', 'info');
    }

    generateLetter() {
        if (!this.isPlaying || this.isPaused) return;

        // 随机选择一个字母
        const availableKeys = this.keyGroups[this.currentKeyGroup];
        const randomLetter = availableKeys[Math.floor(Math.random() * availableKeys.length)];
        
        // 创建掉落字母元素
        const letterElement = document.createElement('div');
        letterElement.className = 'falling-letter';
        letterElement.textContent = randomLetter.toUpperCase();
        letterElement.style.left = Math.random() * (this.container.offsetWidth - 60) + 'px';
        letterElement.style.animationDuration = (this.gameSpeed / 1000) + 's';
        
        this.container.appendChild(letterElement);

        // 创建字母对象
        const letter = {
            element: letterElement,
            char: randomLetter,
            startTime: Date.now(),
            duration: this.gameSpeed
        };

        this.fallingLetters.push(letter);

        // 设置字母消失定时器
        setTimeout(() => {
            this.removeLetter(letter, false);
        }, this.gameSpeed);

        // 根据难度调整下次生成时间
        const nextGenerationTime = Math.max(500, this.gameSpeed * 0.3);
        this.gameTimer = setTimeout(() => this.generateLetter(), nextGenerationTime);
    }

    handleKeyPress(key) {
        if (!this.isPlaying || this.isPaused) return;

        // 检查是否是有效的练习键位
        if (!this.keyGroups[this.currentKeyGroup].includes(key)) {
            this.handleWrongKey(key);
            return;
        }

        // 高亮按下的键
        this.highlightKey(key);

        // 查找匹配的掉落字母
        let hitLetter = null;
        for (let i = 0; i < this.fallingLetters.length; i++) {
            if (this.fallingLetters[i].char === key) {
                hitLetter = this.fallingLetters[i];
                break;
            }
        }

        if (hitLetter) {
            this.handleCorrectHit(hitLetter);
        } else {
            this.handleMiss(key);
        }
    }

    highlightKey(key) {
        const keyElement = document.querySelector(`[data-key="${key}"]`);
        if (keyElement) {
            keyElement.classList.add('active');
            setTimeout(() => {
                keyElement.classList.remove('active');
            }, 200);
        }
    }

    handleCorrectHit(letter) {
        // 移除字母
        this.removeLetter(letter, true);
        
        // 更新分数和统计
        const points = this.calculatePoints();
        window.gameApp.updateScore(points);
        window.gameApp.recordAttempt(true);
        
        // 播放成功音效
        window.gameApp.playSound('correct');
        
        // 显示鼓励信息
        if (Math.random() < 0.3) { // 30%概率显示鼓励
            window.gameApp.showEncouragement();
        }
        
        // 增加难度
        this.increaseDifficulty();
    }

    handleMiss(key) {
        window.gameApp.recordAttempt(false);
        window.gameApp.playSound('wrong');
        
        // 显示错误反馈
        window.gameApp.showMessage('❌ 没有找到对应字母！', 'error');
        
        // 键盘震动效果
        const keyElement = document.querySelector(`[data-key="${key}"]`);
        if (keyElement) {
            keyElement.classList.add('shake');
            setTimeout(() => keyElement.classList.remove('shake'), 500);
        }
    }

    handleWrongKey(key) {
        window.gameApp.recordAttempt(false);
        window.gameApp.playSound('wrong');
        window.gameApp.showMessage('⚠️ 这个键不在练习范围内！', 'error');
    }

    removeLetter(letter, wasHit) {
        const index = this.fallingLetters.indexOf(letter);
        if (index > -1) {
            this.fallingLetters.splice(index, 1);
        }

        if (letter.element && letter.element.parentNode) {
            if (wasHit) {
                // 添加命中动画
                letter.element.style.animation = 'none';
                letter.element.classList.add('bounce');
                letter.element.style.background = 'linear-gradient(45deg, #4ecdc4, #44a08d)';
                letter.element.style.color = 'white';
                
                setTimeout(() => {
                    if (letter.element.parentNode) {
                        letter.element.parentNode.removeChild(letter.element);
                    }
                }, 300);
            } else {
                // 字母掉落到底部
                letter.element.parentNode.removeChild(letter.element);
                if (this.isPlaying) {
                    window.gameApp.recordAttempt(false);
                }
            }
        }
    }

    calculatePoints() {
        // 根据难度和速度计算分数
        const basePoints = 10;
        const difficultyMultiplier = this.difficulty * 0.5;
        const speedBonus = Math.max(1, (3000 - this.gameSpeed) / 100);
        
        return Math.round(basePoints + difficultyMultiplier + speedBonus);
    }

    increaseDifficulty() {
        // 每成功击中10个字母增加难度
        if (window.gameApp.correctAttempts % 10 === 0 && window.gameApp.correctAttempts > 0) {
            this.difficulty++;
            this.gameSpeed = Math.max(this.minSpeed, this.gameSpeed - 200);
            
            // 检查是否应该升级键位组
            this.checkKeyGroupUpgrade();
            
            window.gameApp.showMessage(`🎯 难度提升！Level ${this.difficulty}`, 'success');
        }
    }

    checkKeyGroupUpgrade() {
        const correctCount = window.gameApp.correctAttempts;
        
        if (correctCount >= 50 && this.currentKeyGroup === 'basic') {
            this.currentKeyGroup = 'leftHand';
            this.highlightCurrentKeys();
            window.gameApp.showMessage('🎉 解锁左手键位！', 'success');
        } else if (correctCount >= 100 && this.currentKeyGroup === 'leftHand') {
            this.currentKeyGroup = 'rightHand';
            this.highlightCurrentKeys();
            window.gameApp.showMessage('🎉 解锁右手键位！', 'success');
        } else if (correctCount >= 150 && this.currentKeyGroup === 'rightHand') {
            this.currentKeyGroup = 'full';
            this.highlightCurrentKeys();
            window.gameApp.showMessage('🎉 解锁全键盘！', 'success');
        }
    }

    startGameLoop() {
        if (!this.isPlaying || this.isPaused) return;
        
        // 游戏主循环 - 处理动画和碰撞检测
        const gameLoop = () => {
            if (!this.isPlaying || this.isPaused) return;
            
            // 检查是否有字母掉落到底部
            this.fallingLetters.forEach(letter => {
                if (letter.element) {
                    const rect = letter.element.getBoundingClientRect();
                    const containerRect = this.container.getBoundingClientRect();
                    
                    // 如果字母掉出容器底部
                    if (rect.top > containerRect.bottom) {
                        this.removeLetter(letter, false);
                    }
                }
            });
            
            this.animationFrame = requestAnimationFrame(gameLoop);
        };
        
        gameLoop();
    }
}

// 初始化键盘游戏
window.addEventListener('DOMContentLoaded', () => {
    window.keyboardGame = new KeyboardGame();
});
