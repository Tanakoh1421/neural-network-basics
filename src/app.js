'use strict';
(() => {
 const key='neural-network-basics.progress.v1';
 const pages=[...lessons,{id:'glossary',title:'用語集',sub:'分からない言葉を検索'},{id:'sources',title:'出典と、この教材について',sub:'学習範囲・参考資料'}];
 const ids=pages.map(p=>p.id);
 let state={version:1,chapter:'overview',completed:[]};
 let saveMessage='このブラウザに自動保存します。';
 let stored=false;
 try{
  const raw=localStorage.getItem(key);
  if(raw){const v=JSON.parse(raw);if(v&&v.version===1){state.chapter=ids.includes(v.chapter)?v.chapter:'overview';state.completed=Array.isArray(v.completed)?[...new Set(v.completed.filter(id=>lessons.some(l=>l.id===id)))]:[];stored=true;}}
 }catch{saveMessage='保存データを読めませんでした。現在の学習は利用できます。';}
 const root=document.querySelector('#lesson-root');
 root.innerHTML=lessons.map((l,i)=>`<section class="lesson" id="page-${l.id}" hidden aria-labelledby="heading-${l.id}"><div class="chapter-meta"><span>CHAPTER ${String(i+1).padStart(2,'0')} / 06</span><span class="time">${l.time}</span></div><h1 id="heading-${l.id}">${l.headline}</h1><p class="lead">${l.lead}</p>${l.body}<div class="chapter-end"><div class="end-top">${i?`<a class="prev-link" href="#${lessons[i-1].id}">← 前の章</a>`:''}<button class="complete-button" data-complete="${l.id}" aria-pressed="false">この章を読了にする</button><a class="primary" href="#${i<5?lessons[i+1].id:'glossary'}">${i<5?'次の章へ':'用語集へ'} <span aria-hidden="true">→</span></a></div><p class="completion-note">読了は自分用の記録です。いつでも取り消せます。</p></div></section>`).join('')+
 `<section class="lesson" id="page-glossary" hidden aria-labelledby="heading-glossary"><div class="chapter-meta">REFERENCE / 01</div><h1 id="heading-glossary">発表の途中で、<br>言葉を見返す。</h1><p class="lead">日本語・英語・略語で検索できます。詳しく読み直したいときは、各用語の「本文で復習する」から戻りましょう。</p><label class="search-label" for="glossary-search">用語を検索</label><input class="search-input" id="glossary-search" type="search" placeholder="例：LSTM、勾配、バッチ" autocomplete="off"><p class="search-count" id="search-count" role="status"></p><div id="glossary-items">${glossary.map(([name,alias,desc,chapter])=>`<article class="glossary-item"><h2>${name}</h2><p class="alias">${alias}</p><p>${desc}</p><a href="#${chapter}">本文で復習する →</a></article>`).join('')}</div><p id="search-empty" hidden>該当する用語がありません。短い言葉や、別の表記で検索してください。</p></section>`+
 `<section class="lesson" id="page-sources" hidden aria-labelledby="heading-sources"><div class="chapter-meta">REFERENCE / 02</div><h1 id="heading-sources">出典と、<br>この教材について。</h1><p class="lead">研究ゼミでモデルと実験の流れを理解するための、最初の一冊として作成しました。</p><h2>前提と範囲</h2><p>線形代数・微分・確率統計は履修済みでも、記憶が曖昧な読者を想定しています。図解と文章で読み進め、数式は折りたたみの補足で確認できます。証明・実装・各モデルの詳細な導出は範囲に含めていません。</p><p>読み時間は目安です。全6章の後に用語集を置き、ゼミの前後に必要な部分へ戻れる構成にしました。</p><h2>例と図について</h2><p>共通例の室温・湿度・電力量、計算中の値、結果表、学習曲線、Attentionの割合は、すべて教材独自の架空例です。実データや実験結果ではありません。図は考え方を伝えるための模式図で、モデルの全演算を再現したものではありません。</p><h2>参考資料</h2><p>以下の教科書・公式チュートリアル・原論文を参照し、日本語で独自に構成・説明しました。リンク先はオンライン資料です。確認日：2026年11月5日。</p><ol class="source-list">${sources.map(s=>`<li><a href="${s[2]}" target="_blank" rel="noopener noreferrer">${s[1]}</a><p>${s[3]}</p><p class="print-source-url">${s[2]}</p></li>`).join('')}</ol><h2>デザインと保存</h2><p>デジタル庁デザインシステムの考え方を参照した、教材用の独自HTML/CSSです。公式コンポーネントのそのままの組み込みや、完全準拠の認証を表すものではありません。</p><p>最後に開いた章と読了した章を、利用できる場合はこのブラウザのlocalStorageに保存します。保存できなくても教材を読むことはできます。外部への送信・ログイン・端末間同期はありません。</p><p>ファイルを直接開く場合の保存はブラウザに依存します。同じファイルの場所・同じブラウザで利用してください。プライベートブラウズ、ブラウザのデータ削除、ファイルの移動で記録を失う場合があります。本文と図には外部フォントやライブラリへの依存がなく、オフラインで利用できます。</p></section>`;
 const nav=document.querySelector('#chapter-nav');
 nav.innerHTML=pages.map((l,i)=>`${i===6?'<div class="nav-divider" aria-hidden="true"></div>':''}<a href="#${l.id}" data-page="${l.id}"><span class="nav-number">${i<6?String(i+1).padStart(2,'0'):'＋'}</span><span><span class="nav-title">${l.title}</span><small>${l.sub}</small></span><span class="nav-check" aria-label="読了"></span></a>`).join('');
 function save(){try{localStorage.setItem(key,JSON.stringify(state));saveMessage='最後の章と読了記録を保存しました。';}catch{saveMessage='保存できません。この画面では学習できます。';}document.querySelector('#save-status').textContent=saveMessage;}
 function refreshProgress(){
  document.querySelector('#progress').value=state.completed.length;
  document.querySelector('#progress-text').textContent=`${state.completed.length} / 6`;
  document.querySelectorAll('[data-complete]').forEach(b=>{const done=state.completed.includes(b.dataset.complete);b.setAttribute('aria-pressed',String(done));b.textContent=done?'読了済み ✓（取り消す）':'この章を読了にする';});
  nav.querySelectorAll('a').forEach(a=>{const mark=a.querySelector('.nav-check');const done=state.completed.includes(a.dataset.page);mark.textContent=done?'✓':'';mark.hidden=!done;});
 }
 function show(id,focus=false){
  if(!ids.includes(id))id='overview';
  state.chapter=id;
  document.querySelectorAll('section.lesson').forEach(s=>s.hidden=s.id!==`page-${id}`);
  nav.querySelectorAll('a').forEach(a=>{if(a.dataset.page===id)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  const page=pages.find(p=>p.id===id);document.title=`${page.title} — ニューラルネットの基礎`;
  save();refreshProgress();
  if(focus){document.querySelector('#main').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}
 }
 root.addEventListener('click',e=>{const button=e.target.closest('[data-complete]');if(!button)return;const id=button.dataset.complete;state.completed=state.completed.includes(id)?state.completed.filter(x=>x!==id):[...state.completed,id];save();refreshProgress();});
 window.addEventListener('hashchange',()=>{if(location.hash==='#main')return;show(location.hash.slice(1),true);});
 const search=document.querySelector('#glossary-search');
 const norm=s=>s.normalize('NFKC').toLocaleLowerCase('ja');
 function filter(){const q=norm(search.value.trim());let count=0;root.querySelectorAll('.glossary-item').forEach((article,i)=>{const match=norm(glossary[i].slice(0,3).join(' ')).includes(q);article.hidden=!match;if(match)count++;});document.querySelector('#search-count').textContent=`${count} / ${glossary.length}語を表示`;document.querySelector('#search-empty').hidden=count!==0;}
 search.addEventListener('input',filter);filter();
 // 印刷時は、閉じた補足と検索で隠れた用語もすべて含める。
 let closed=[];
 function restorePrint(){closed.forEach(d=>d.open=false);closed=[];}
 window.addEventListener('beforeprint',()=>{closed=[...root.querySelectorAll('details:not([open])')];closed.forEach(d=>d.open=true);});
 window.addEventListener('afterprint',restorePrint);
 document.querySelector('#print').addEventListener('click',()=>{try{window.print();}finally{restorePrint();}});
 const initial=location.hash.slice(1);
 show(ids.includes(initial)?initial:(stored?state.chapter:'overview'));
})();
