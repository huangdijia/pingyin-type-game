const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#ffffff',
    title: '拼音打字王',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: undefined
    }
  });

  // 生产包内的本地文件路径（public/index.html 与打包一起分发）
  const indexPath = path.join(__dirname, '../public/index.html');
  win.loadFile(indexPath);

  // 关闭默认菜单，避免误触
  Menu.setApplicationMenu(null);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

