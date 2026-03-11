(function(S) {
    'use strict';
    if (!S.extensions.unsandboxed) throw new Error('Avisk must run unsandboxed.');

    const AVISK_ICON = "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMGEwYTBhIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMTBiOTgxIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHJ4PSIzMCIgZmlsbD0idXJsKCNncmFkKSIvPjxwYXRoIGQ9Ik02Ni42IDQ0LjJjLS40LTYuNi01LjgtMTEuOC0xMi41LTExLjgtNS4zIDAtOS44IDMuMy0xMS42IDgtLjctLjItMS41LS4zLTIuMy0uMy00LjggMC04LjcgMy45LTguNyA4LjcgMCAuNS4xIDEgLjIgMS41QzI3LjMgNTEuNSAyNCA1NS40IDI0IDYwYzAgNS41IDQuNSAxMCAxMCAxMGgzMmM1LjUgMCAxMC00LjUgMTAtMTAgMC01LjItNC05LjQtOS40LTkuOHoiIGZpbGw9IiMxMGI5ODEiLz48L3N2Zz4=";

    class AviskDev {
        constructor() {
            this.currentTab = 'editor';
            this.tempCSS = sessionStorage.getItem('avisk_temp_css') || "";
            this.audioCtx = null;
        }

        playPremiumSound() {
            if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const ctx = this.audioCtx;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            // Subtle, high-end "tick" sound
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.08);

            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        }

        getInfo() {
            return {
                id: 'AviskDev', name: 'Avisk Client', blockIconURI: AVISK_ICON, color1: '#10b981', color2: '#0a0a0a',
                blocks: [ { opcode: 'loadClient', blockType: S.BlockType.BUTTON, text: 'Load Avisk Client' } ]
            };
        }

        loadClient() {
            if (document.getElementById('avisk-intro')) return;

            if(!document.getElementById('avisk-vfx-max')) {
                const style = document.createElement('style');
                style.id = 'avisk-vfx-max';
                style.innerHTML = `
                    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&family=Fira+Code:wght@400;600&display=swap');
                    @keyframes aviskBgPan { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
                    @keyframes aviskNeonPulse { 0% { box-shadow: 0 0 10px #10b98144, inset 0 0 10px #10b98144; } 50% { box-shadow: 0 0 30px #10b981aa, inset 0 0 20px #10b98188; } 100% { box-shadow: 0 0 10px #10b98144, inset 0 0 10px #10b98144; } }
                    @keyframes aviskSpin { 100% { transform: rotate(360deg); } }
                    
                    /* Panel Styling */
                    .avisk-panel-max { background: linear-gradient(-45deg, #051910, #0a0a0a, #022c16, #000000); background-size: 300% 300%; animation: aviskBgPan 12s ease infinite, aviskNeonPulse 4s infinite alternate; backdrop-filter: blur(20px); border: 2px solid #10b981; box-shadow: 0 20px 50px rgba(0,0,0,0.9); font-family: 'Orbitron', sans-serif; }
                    
                    /* Universal Buttons */
                    .avisk-btn-max { background: linear-gradient(90deg, #0a0a0a, #052e16); color: #10b981; border: 1px solid #10b981; padding: 10px; border-radius: 8px; cursor: pointer; transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1); font-family: 'Orbitron', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
                    .avisk-btn-max:hover { background: linear-gradient(90deg, #10b981, #059669); color: #000; box-shadow: 0 0 20px #10b981; transform: translateY(-2px); }
                    .avisk-btn-max:active { transform: translateY(1px); box-shadow: 0 0 5px #10b981; }
                    
                    /* Text Input */
                    .avisk-input-max { font-family: 'Fira Code', monospace; background: rgba(0, 0, 0, 0.7); color: #10b981; border: 1px solid #10b98155; border-radius: 8px; padding: 12px; transition: all 0.3s ease; box-shadow: inset 0 0 10px rgba(0,0,0,0.8); }
                    .avisk-input-max:focus { outline: none; border-color: #10b981; box-shadow: 0 0 15px rgba(16, 185, 129, 0.4), inset 0 0 10px rgba(16, 185, 129, 0.2); }
                    
                    /* Scrollbars */
                    #avisk-panel-content::-webkit-scrollbar, .avisk-input-max::-webkit-scrollbar { width: 8px; }
                    #avisk-panel-content::-webkit-scrollbar-track, .avisk-input-max::-webkit-scrollbar-track { background: #000; border-radius: 4px; }
                    #avisk-panel-content::-webkit-scrollbar-thumb, .avisk-input-max::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #052e16, #10b981); border-radius: 4px; border: 1px solid #000; }

                    /* Premium FAB Styling */
                    .avisk-fab-wrapper { position: fixed; bottom: 30px; right: 30px; width: 68px; height: 68px; z-index: 999998; cursor: pointer; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
                    .avisk-fab-ring { position: absolute; inset: -4px; border: 2px dashed #10b981; border-radius: 50%; opacity: 0.4; animation: aviskSpin 10s linear infinite; transition: all 0.3s ease; pointer-events: none; }
                    .avisk-fab-core { width: 100%; height: 100%; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                    .avisk-fab-wrapper:hover .avisk-fab-ring { opacity: 1; animation: aviskSpin 3s linear infinite; box-shadow: 0 0 15px #10b981; }
                    .avisk-fab-wrapper:hover .avisk-fab-core { transform: scale(1.08); }
                    .avisk-fab-wrapper:active .avisk-fab-core { transform: scale(0.9); }
                `;
                document.head.appendChild(style);
            }

            const over = document.createElement('div');
            over.id = 'avisk-intro';
            over.style.cssText = `position:fixed;top:0;left:0;width:100vw;height:100vh;background:#0a0a0a;z-index:999999;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:opacity 0.8s ease;`;
            over.innerHTML = `<img src="${AVISK_ICON}" style="width:140px;opacity:0;transition:1s cubic-bezier(0.2, 0.8, 0.2, 1); transform: scale(0.8); filter: drop-shadow(0 0 20px #10b981);"/><h1 style="font-family:'Orbitron', sans-serif;color:#10b981;margin-top:25px;opacity:0;transition:1s ease;text-shadow: 0 0 15px #10b981, 0 0 30px #059669; letter-spacing: 3px;">AVISK CLIENT V1.3</h1>`;
            document.body.appendChild(over);

            setTimeout(() => { over.children[0].style.opacity = '1'; over.children[0].style.transform = 'scale(1)'; }, 100);
            setTimeout(() => { over.children[1].style.opacity = '1'; }, 700);
            setTimeout(() => { over.style.opacity = '0'; }, 2600);
            setTimeout(() => { over.remove(); this.createFAB(); }, 3400);
        }

        createFAB() {
            if (document.getElementById('avisk-fab-container')) return;
            
            const wrapper = document.createElement('div');
            wrapper.id = 'avisk-fab-container';
            wrapper.className = 'avisk-fab-wrapper';
            
            wrapper.innerHTML = `
                <div class="avisk-fab-ring"></div>
                <div class="avisk-panel-max avisk-fab-core">
                    <img src="${AVISK_ICON}" style="width:36px;height:36px;pointer-events:none; filter: drop-shadow(0 0 5px #10b981);"/>
                </div>
            `;
            
            wrapper.onclick = () => {
                this.playPremiumSound();
                this.togglePanel();
            };
            document.body.appendChild(wrapper);
        }

        togglePanel() {
            let p = document.getElementById('avisk-panel');
            if (p) { 
                p.style.opacity = '0'; 
                p.style.transform = 'translateY(40px) scale(0.95)'; 
                setTimeout(()=>p.remove(), 300); 
                return; 
            }
            
            p = document.createElement('div');
            p.id = 'avisk-panel';
            p.className = 'avisk-panel-max';
            p.style.cssText = `position:fixed;bottom:120px;right:30px;width:380px;border-radius:16px;padding:0;z-index:999998;color:white;display:flex;flex-direction:column;opacity:0;transform:translateY(40px) scale(0.95);transition:all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); overflow:hidden;`;
            document.body.appendChild(p);
            
            requestAnimationFrame(() => { p.style.opacity = '1'; p.style.transform = 'translateY(0) scale(1)'; });
            this.renderPanel();
        }

        renderPanel() {
            const p = document.getElementById('avisk-panel');
            if(!p) return;

            let content = `
                <div style="display:flex;background:rgba(0,0,0,0.8);border-bottom:2px solid #10b981;">
                    <button id="tab-editor" style="flex:1;background:${this.currentTab==='editor'?'linear-gradient(180deg, #10b98133, transparent)':'transparent'};color:${this.currentTab==='editor'?'#10b981':'#555'};border:none;padding:15px;cursor:pointer;font-family:'Orbitron', sans-serif;font-weight:700;letter-spacing:1px;transition:0.3s;text-shadow:${this.currentTab==='editor'?'0 0 10px #10b981':'none'};">EDITOR</button>
                    <button id="tab-saved" style="flex:1;background:${this.currentTab==='saved'?'linear-gradient(180deg, #10b98133, transparent)':'transparent'};color:${this.currentTab==='saved'?'#10b981':'#555'};border:none;border-left:1px solid #10b98155;padding:15px;cursor:pointer;font-family:'Orbitron', sans-serif;font-weight:700;letter-spacing:1px;transition:0.3s;text-shadow:${this.currentTab==='saved'?'0 0 10px #10b981':'none'};">PRESETS</button>
                </div>
                <div id="avisk-panel-content" style="padding:20px; display:flex; flex-direction:column; gap:15px; max-height: 400px; overflow-y: auto;">
            `;

            if (this.currentTab === 'editor') {
                content += `
                    <textarea class="avisk-input-max" id="avisk-css-input" placeholder="/* Drop your CSS here */" style="width:100%;height:180px;resize:vertical;box-sizing:border-box;">${this.tempCSS}</textarea>
                    <div style="display:flex;gap:10px;">
                        <button class="avisk-btn-max" id="avisk-apply" style="flex:2;">APPLY</button>
                        <button class="avisk-btn-max" id="avisk-save" style="flex:1;border-color:#3b82f6;color:#3b82f6;text-shadow:0 0 5px #3b82f6;">SAVE</button>
                        <button class="avisk-btn-max" id="avisk-clear" style="flex:0.5;border-color:#ef4444;color:#ef4444;text-shadow:0 0 5px #ef4444;">CLEAR</button>
                    </div>
                `;
            } else {
                const savedItems = JSON.parse(localStorage.getItem('avisk_saved_css') || '[]');
                if(savedItems.length === 0) {
                    content += `<div style="text-align:center;color:#10b98155;font-family:'Fira Code', monospace;padding:30px 0;">[ NO DATA FOUND ]</div>`;
                } else {
                    savedItems.forEach((item, i) => {
                        content += `
                            <div style="background:linear-gradient(90deg, rgba(10,10,10,0.9), rgba(5,46,22,0.9));border:1px solid #10b981;border-radius:8px;padding:12px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 4px 10px rgba(0,0,0,0.5);">
                                <span style="font-family:'Fira Code', monospace;color:#10b981;font-size:13px;text-shadow:0 0 5px #10b981;">Preset #${i+1}</span>
                                <div style="display:flex;gap:8px;">
                                    <button class="avisk-btn-max load-btn" data-index="${i}" style="padding:6px 12px;font-size:10px;">LOAD</button>
                                    <button class="avisk-btn-max del-btn" data-index="${i}" style="padding:6px 10px;font-size:10px;border-color:#ef4444;color:#ef4444;text-shadow:0 0 5px #ef4444;">DEL</button>
                                </div>
                            </div>
                        `;
                    });
                }
            }

            p.innerHTML = content + `</div>`;
            this.attachEvents();
        }

        attachEvents() {
            document.getElementById('tab-editor').onclick = () => { this.playPremiumSound(); this.currentTab = 'editor'; this.renderPanel(); };
            document.getElementById('tab-saved').onclick = () => { this.playPremiumSound(); this.currentTab = 'saved'; this.renderPanel(); };

            if (this.currentTab === 'editor') {
                const input = document.getElementById('avisk-css-input');
                input.oninput = () => { this.tempCSS = input.value; sessionStorage.setItem('avisk_temp_css', this.tempCSS); };
                
                document.getElementById('avisk-apply').onclick = () => {
                    this.playPremiumSound();
                    let s = document.getElementById('avisk-styles') || document.createElement('style');
                    s.id = 'avisk-styles'; s.textContent = input.value; document.head.appendChild(s);
                };
                
                document.getElementById('avisk-clear').onclick = () => {
                    this.playPremiumSound();
                    const s = document.getElementById('avisk-styles'); if (s) s.remove();
                    input.value = ""; this.tempCSS = ""; sessionStorage.removeItem('avisk_temp_css');
                };
                
                document.getElementById('avisk-save').onclick = () => {
                    this.playPremiumSound();
                    if(!input.value.trim()) return;
                    const saved = JSON.parse(localStorage.getItem('avisk_saved_css') || '[]');
                    saved.push(input.value); localStorage.setItem('avisk_saved_css', JSON.stringify(saved));
                    this.currentTab = 'saved'; this.renderPanel();
                };
            } else {
                document.querySelectorAll('.load-btn').forEach(btn => btn.onclick = (e) => {
                    this.playPremiumSound();
                    const idx = e.target.getAttribute('data-index');
                    this.tempCSS = JSON.parse(localStorage.getItem('avisk_saved_css'))[idx];
                    sessionStorage.setItem('avisk_temp_css', this.tempCSS);
                    this.currentTab = 'editor'; this.renderPanel();
                });
                
                document.querySelectorAll('.del-btn').forEach(btn => btn.onclick = (e) => {
                    this.playPremiumSound();
                    const idx = e.target.getAttribute('data-index');
                    const saved = JSON.parse(localStorage.getItem('avisk_saved_css'));
                    saved.splice(idx, 1); localStorage.setItem('avisk_saved_css', JSON.stringify(saved));
                    this.renderPanel();
                });
            }
        }
    }
    S.extensions.register(new AviskDev());
})(Scratch);
