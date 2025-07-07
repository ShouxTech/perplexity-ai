import { app, BrowserWindow } from 'electron/main';
import path from 'node:path';

let mainWindow;

const NEW_THREAD_JS = `window.location.href = '/';`;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(import.meta.dirname, 'preload.js')
        },
    });

    mainWindow.loadURL('https://www.perplexity.ai/', {
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
    });

    mainWindow.on('closed', () => {
        mainWindow = undefined;
    });
}

function executeNewThreadJS() {
    if (mainWindow.webContents.isLoading()) {
        mainWindow.webContents.once('did-finish-load', () => {
            mainWindow.webContents.executeJavaScript(NEW_THREAD_JS);
        });
    } else {
        mainWindow.webContents.executeJavaScript(NEW_THREAD_JS);
    }
}

function showAndFocusWindow() {
    if (!mainWindow) {
        createWindow();
    }
    mainWindow.show();
    mainWindow.focus();
}

function showAndFocusWindowAndNewThread() {
    showAndFocusWindow();
    executeNewThreadJS();
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', (event, argv) => {
        if (argv.includes('--new-thread')) {
            showAndFocusWindowAndNewThread();
            return;
        }
        showAndFocusWindow();
    });

    app.on('ready', createWindow);
}

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length > 0) return;
    createWindow();
});

app.on('browser-window-created', (_event, window) => {
    window.setMenuBarVisibility(false);
});

app.on('window-all-closed', () => {
    if (process.platform === 'darwin') return;
    app.quit();
});
