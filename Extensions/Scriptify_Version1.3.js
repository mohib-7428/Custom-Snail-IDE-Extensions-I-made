(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('Scriptify must run unsandboxed.');
  }

  const BLUE_ICON = "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNTAgNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiByeD0iNSIgZmlsbD0iIzM3NzZhYiIvPjxwYXRoIGQ9Ik0xNyAxOEwxMCAyNUwxNyAzMk0zMyAxOEw0MCAyNUwzMyAzMk0yNyAxNUwyMyAzNSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=";

  let pyodide = null;
  let lastResponse = "";
  let latestList = "";

  class Scriptify {
    getInfo() {
      return {
        id: 'ScriptifyV13',
        name: 'Scriptify',
        blockIconURI: BLUE_ICON,
        menuIconURI: BLUE_ICON,
        color1: '#3776ab',
        blocks: [
          { blockType: Scratch.BlockType.BUTTON, text: 'Open Scriptify Panel', opcode: 'loadGUI' },
          "---",
          { blockType: Scratch.BlockType.LABEL, text: "Python and TS" },
          { opcode: 'runPython', blockType: Scratch.BlockType.COMMAND, text: 'Execute Python [CODE]', arguments: { CODE: { type: Scratch.ArgumentType.STRING, defaultValue: 'print("hello")' } } },
          { opcode: 'checkPython', blockType: Scratch.BlockType.REPORTER, text: 'Check Python [CODE]', arguments: { CODE: { type: Scratch.ArgumentType.STRING, defaultValue: 'print("test")' } } },
          { opcode: 'downloadLib', blockType: Scratch.BlockType.COMMAND, text: 'Download Library [LIB]', arguments: { LIB: { type: Scratch.ArgumentType.STRING, defaultValue: 'numpy' } } },
          { opcode: 'onPythonRun', blockType: Scratch.BlockType.HAT, text: 'when Python finishes', isEdgeActivated: false },
          { opcode: 'executeTS', blockType: Scratch.BlockType.COMMAND, text: 'Execute TS [CODE]', arguments: { CODE: { type: Scratch.ArgumentType.STRING, defaultValue: 'let x: number = 5;' } } },
          { opcode: 'executeTSX', blockType: Scratch.BlockType.COMMAND, text: 'Execute TSX [CODE]', arguments: { CODE: { type: Scratch.ArgumentType.STRING, defaultValue: 'const e = <div></div>;' } } },
          { opcode: 'checkTS', blockType: Scratch.BlockType.REPORTER, text: 'Check TS [CODE]', arguments: { CODE: { type: Scratch.ArgumentType.STRING, defaultValue: 'let x: number = 5;' } } },
          "---",
          { blockType: Scratch.BlockType.LABEL, text: "Web Tools" },
          { opcode: 'executeHTML', blockType: Scratch.BlockType.COMMAND, text: 'Execute HTML [CODE]', arguments: { CODE: { type: Scratch.ArgumentType.STRING, defaultValue: '<h1>Hi</h1>' } } },
          { opcode: 'onHTMLRun', blockType: Scratch.BlockType.HAT, text: 'when HTML is injected', isEdgeActivated: false },
          { opcode: 'executeCSS', blockType: Scratch.BlockType.COMMAND, text: 'Execute CSS [CODE]', arguments: { CODE: { type: Scratch.ArgumentType.STRING, defaultValue: 'body { background: black; }' } } },
          { opcode: 'executeJS', blockType: Scratch.BlockType.COMMAND, text: 'Execute JS [CODE]', arguments: { CODE: { type: Scratch.ArgumentType.STRING, defaultValue: 'alert("Hi");' } } },
          { opcode: 'toggleLayer', blockType: Scratch.BlockType.COMMAND, text: 'Toggle HTML Layer [STATE]', arguments: { STATE: { type: Scratch.ArgumentType.STRING, menu: 'displayMenu' } } },
          { opcode: 'clearAll', blockType: Scratch.BlockType.COMMAND, text: 'Clear All Overlays' },
          { opcode: 'checkHTML', blockType: Scratch.BlockType.REPORTER, text: 'Check HTML [CODE]', arguments: { CODE: { type: Scratch.ArgumentType.STRING, defaultValue: '<h1>hi</h1>' } } },
          "---",
          { blockType: Scratch.BlockType.LABEL, text: "Data and Files" },
          { opcode: 'fetchURL', blockType: Scratch.BlockType.COMMAND, text: 'Fetch from [URL]', arguments: { URL: { type: Scratch.ArgumentType.STRING, defaultValue: 'https://api.github.com' } } },
          { opcode: 'getURL', blockType: Scratch.BlockType.COMMAND, text: 'Get from [URL]', arguments: { URL: { type: Scratch.ArgumentType.STRING, defaultValue: 'https://api.github.com' } } },
          { opcode: 'postURL', blockType: Scratch.BlockType.COMMAND, text: 'Post to [URL] with [DATA]', arguments: { URL: { type: Scratch.ArgumentType.STRING, defaultValue: 'https://httpbin.org/post' }, DATA: { type: Scratch.ArgumentType.STRING, defaultValue: '{"key":"value"}' } } },
          { opcode: 'onApiFinish', blockType: Scratch.BlockType.HAT, text: 'when API fetch finishes', isEdgeActivated: false },
          { opcode: 'lastApiResponse', blockType: Scratch.BlockType.REPORTER, text: 'last API response' },
          { opcode: 'isValidAPI', blockType: Scratch.BlockType.REPORTER, text: 'Is Valid API [URL]', arguments: { URL: { type: Scratch.ArgumentType.STRING, defaultValue: 'https://api.github.com' } } },
          { opcode: 'saveToFile', blockType: Scratch.BlockType.COMMAND, text: 'save [TEXT] as [NAME].txt', arguments: { TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'hello' }, NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'data' } } },
          "---",
          { blockType: Scratch.BlockType.LABEL, text: "JSON" },
          { opcode: 'createJSONList', blockType: Scratch.BlockType.COMMAND, text: 'Create List [STR]', arguments: { STR: { type: Scratch.ArgumentType.STRING, defaultValue: '["a", "b"]' } } },
          { opcode: 'decompileList', blockType: Scratch.BlockType.COMMAND, text: 'Decompile List [JSON]', arguments: { JSON: { type: Scratch.ArgumentType.STRING, defaultValue: '{"items": [1,2]}' } } },
          { opcode: 'formatJSON', blockType: Scratch.BlockType.REPORTER, text: 'Format JSON [JSON]', arguments: { JSON: { type: Scratch.ArgumentType.STRING, defaultValue: '{"a":1}' } } },
          { opcode: 'getLatestList', blockType: Scratch.BlockType.REPORTER, text: 'Latest List' },
          "---",
          { opcode: 'version', blockType: Scratch.BlockType.REPORTER, text: 'version' }
        ],
        menus: {
          displayMenu: { acceptReporters: true, items: ['show', 'hide'] }
        }
      };
    }

    version() { return "1.3"; }

    // --- CORE LOGIC ---
    createJSONList(args) { try { JSON.parse(args.STR); latestList = args.STR; } catch (e) { latestList = "Invalid"; } }
    decompileList(args) { try { const obj = JSON.parse(args.JSON); latestList = JSON.stringify(Object.values(obj)); } catch (e) { latestList = "Invalid"; } }
    formatJSON(args) { try { return JSON.stringify(JSON.parse(args.JSON), null, 4); } catch (e) { return "Invalid"; } }
    getLatestList() { return latestList; }

    executeHTML(args) {
      const stage = document.querySelector('[class*="stage_stage-wrapper"]') || document.body;
      let l = document.getElementById('sc-layer');
      if (!l) {
        l = document.createElement('div'); l.id = 'sc-layer';
        l.style = "position:absolute; top:0; left:0; width:100%; height:100%; z-index:1000; pointer-events:none;";
        stage.appendChild(l);
      }
      const d = document.createElement('div'); d.style.pointerEvents = 'auto'; d.innerHTML = args.CODE;
      l.appendChild(d);
      Scratch.vm.runtime.startHats('ScriptifyV13_onHTMLRun');
    }

    executeCSS(args) {
      const s = document.createElement('style'); s.className = 'sc-css'; s.textContent = args.CODE;
      document.head.appendChild(s);
    }

    executeJS(args) { try { new Function(args.CODE)(); } catch (e) {} }
    toggleLayer(args) {
      const l = document.getElementById('sc-layer');
      if (l) l.style.display = (args.STATE === 'hide') ? 'none' : 'block';
    }

    clearAll() {
      const l = document.getElementById('sc-layer'); if (l) l.innerHTML = '';
      document.querySelectorAll('.sc-css').forEach(e => e.remove());
    }

    checkHTML(args) { try { document.createElement('div').innerHTML = args.CODE; return "Valid"; } catch(e) { return "Invalid"; } }

    async fetchURL(args) { 
      try { 
        const r = await fetch(args.URL); 
        lastResponse = await r.text(); 
        Scratch.vm.runtime.startHats('ScriptifyV13_onApiFinish');
      } catch(e) { lastResponse = "Error"; } 
    }
    async getURL(args) { return this.fetchURL(args); }
    async postURL(args) {
      try {
        const r = await fetch(args.URL, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: args.DATA });
        lastResponse = await r.text();
        Scratch.vm.runtime.startHats('ScriptifyV13_onApiFinish');
      } catch(e) { lastResponse = "Error"; }
    }
    lastApiResponse() { return lastResponse; }
    async isValidAPI(args) { try { const r = await fetch(args.URL, {method: 'HEAD'}); return r.ok ? "Valid" : "Invalid"; } catch(e) { return "Invalid"; } }

    saveToFile(args) {
      const blob = new Blob([args.TEXT], {type: 'text/plain'});
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${args.NAME}.txt`;
      a.click();
    }

    async _loadScript(url) { return new Promise(r => { const s = document.createElement('script'); s.src = url; s.onload = r; document.head.appendChild(s); }); }
    async _ensureBabel() { if (!window.Babel) await this._loadScript('https://unpkg.com/@babel/standalone/babel.min.js'); }
    async _initPyodide() { if (pyodide) return pyodide; await this._loadScript('https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js'); pyodide = await window.loadPyodide(); return pyodide; }

    async runPython(args) { 
        const py = await this._initPyodide(); 
        try { await py.runPythonAsync(args.CODE); Scratch.vm.runtime.startHats('ScriptifyV13_onPythonRun'); } catch(e) {} 
    }
    async checkPython(args) { const py = await this._initPyodide(); try { py.runPython(`compile(${JSON.stringify(args.CODE)}, '<string>', 'exec')`); return "Valid"; } catch(e) { return "Invalid"; } }
    async downloadLib(args) { const py = await this._initPyodide(); await py.loadPackage(args.LIB); }

    async executeTS(args) { await this._ensureBabel(); try { eval(window.Babel.transform(args.CODE, { presets: [['typescript', { allExtensions: true }]] }).code); } catch(e){} }
    async executeTSX(args) { await this._ensureBabel(); try { eval(window.Babel.transform(args.CODE, { presets: [['typescript', { isTSX: true, allExtensions: true }], 'react'] }).code); } catch(e){} }
    async checkTS(args) { await this._ensureBabel(); try { window.Babel.transform(args.CODE, { presets: [['typescript', { allExtensions: true }]] }); return "Valid"; } catch(e){ return "Invalid"; } }

    // --- SCRIPTIFY PANEL ---
    loadGUI() {
      if (document.getElementById('sc-panel-root')) return;
      const root = document.createElement('div');
      root.id = 'sc-panel-root';
      root.innerHTML = `
        <style>
          #sc-fab { position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px; background: #3776ab; border-radius: 50%; cursor: pointer; z-index: 10000; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
          #sc-panel { position: fixed; bottom: 90px; right: 20px; width: 300px; height: 420px; background: #111; border: 2px solid #3776ab; border-radius: 12px; display: none; flex-direction: column; z-index: 10000; color: white; font-family: sans-serif; overflow: hidden; }
          .sc-h { background: #3776ab; padding: 12px; font-weight: bold; display: flex; justify-content: space-between; }
          .sc-b { padding: 15px; flex: 1; display: flex; flex-direction: column; gap: 8px; overflow-y: auto; }
          .sc-p-btn { background: #222; border: 1px solid #444; color: white; padding: 10px; border-radius: 6px; cursor: pointer; text-align: left; font-size: 13px; }
          .sc-p-btn:hover { background: #333; border-color: #3776ab; }
        </style>
        <div id="sc-fab"><img src="${BLUE_ICON}" width="30"></div>
        <div id="sc-panel">
          <div class="sc-h">Scriptify Panel v1.3 <span id="sc-c" style="cursor:pointer">&times;</span></div>
          <div class="sc-b">
            <button class="sc-p-btn" id="sc-eruda">📟 Load Eruda Console</button>
            <button class="sc-p-btn" id="sc-zoom">🔍 Workspace Infinite Zoom</button>
            <button class="sc-p-btn" id="sc-neon">🌟 Neon Shadow Blocks</button>
            <button class="sc-p-btn" id="sc-rgb">🌈 RGB Editor Background</button>
            <hr style="border:0; border-top:1px solid #333;">
            <button class="sc-p-btn" id="sc-wipe">✨ Clear Web Layers</button>
          </div>
        </div>
      `;
      document.body.appendChild(root);
      const f = document.getElementById('sc-fab');
      const p = document.getElementById('sc-panel');
      f.onclick = () => p.style.display = p.style.display === 'none' ? 'flex' : 'none';
      document.getElementById('sc-c').onclick = () => p.style.display = 'none';
      
      document.getElementById('sc-eruda').onclick = () => {
        const s = document.createElement('script'); s.src = "//cdn.jsdelivr.net/npm/eruda"; 
        document.body.appendChild(s); s.onload = () => { eruda.init(); eruda.show(); };
      };
      document.getElementById('sc-zoom').onclick = () => {
        const ws = Blockly.getMainWorkspace(); 
        if (ws && ws.options && ws.options.zoomOptions) { 
          ws.options.zoomOptions.minScale = 0.000000001; ws.options.zoomOptions.maxScale = 100; alert("Zoom expanded!"); 
        }
      };
      document.getElementById('sc-neon').onclick = () => {
        const canvas = Blockly.getMainWorkspace().getCanvas();
        canvas.style.setProperty("filter", "drop-shadow(0px 0px 5px white) brightness(1.2)", "important");
      };
      document.getElementById('sc-rgb').onclick = () => {
        let h = 0; setInterval(() => { 
          const el = document.querySelector('.blocklySvg'); if(el) el.style.backgroundColor = 'hsl('+h+',70%,80%)'; h = (h + 5) % 360; 
        }, 100);
      };
      document.getElementById('sc-wipe').onclick = () => this.clearAll();
    }
  }

  Scratch.extensions.register(new Scriptify());
})(Scratch);
