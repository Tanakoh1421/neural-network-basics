// 教材独自の模式図。実データ・学習済みモデルの結果ではありません。
let diagramId = 0;
const svg = (title, desc, body, height = 270) => {
 const id = `figure-${++diagramId}`;
 return `<svg viewBox="0 0 760 ${height}" role="img" aria-labelledby="${id}-title ${id}-desc" xmlns="http://www.w3.org/2000/svg"><title id="${id}-title">${title}</title><desc id="${id}-desc">${desc}</desc><defs><marker id="${id}-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8" fill="#536888"/></marker></defs><g font-family="sans-serif" font-size="17" fill="#1a1a1a">${body.replaceAll('ARROW', `${id}-arrow`)}</g></svg>`;
};
const line = (x1,y1,x2,y2,extra='') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#8294af" stroke-width="2" ${extra}/>`;
const arrow = (x1,y1,x2,y2) => line(x1,y1,x2,y2,'marker-end="url(#ARROW)"');
const txt = (x,y,s,extra='') => `<text x="${x}" y="${y}" text-anchor="middle" ${extra}>${s}</text>`;
const box = (x,y,w,h,s,fill='#fff') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${fill}" stroke="#8294af"/>${txt(x+w/2,y+h/2+6,s)}`;
const fig = (label, picture, caption) => `<figure><div class="figure-label">${label}</div>${picture}<figcaption>${caption}</figcaption></figure>`;
function networkDiagram(){
 const layers = [[110,[88,160,232]],[330,[65,125,185,245]],[540,[95,160,225]],[690,[160]]];
 let body='';
 for(let i=0;i<layers.length-1;i++) for(const y of layers[i][1]) for(const z of layers[i+1][1]) body+=line(layers[i][0]+14,y,layers[i+1][0]-14,z,'opacity=".52"');
 layers.forEach(([x,ys],i)=>ys.forEach(y=>body+=`<circle cx="${x}" cy="${y}" r="17" fill="${i===3?'#0031d8':i===0?'#fff':'#e8f1fe'}" stroke="#0031d8" stroke-width="2"/>`));
 body+=txt(110,30,'入力')+txt(435,30,'隠れ層：情報を加工する')+txt(690,30,'出力');
 body+=txt(110,290,'過去の測定値')+txt(435,290,'重み付きの計算 ＋ 活性化関数')+txt(690,290,'翌日の予測');
 return svg('層を通って予測ができるまで','左の入力から、2つの隠れ層を経て、右の出力へ進む。線は重みを持つ接続、丸は計算の単位。実際の入力数は第4章で整理する。',body,320);
}
const neuronDiagram = () => svg('1つのニューロンの計算','2つの入力に、それぞれ重みを掛け、足してバイアスを加え、活性化関数を適用する。',
 box(20,55,125,56,'入力 x₁')+box(20,165,125,56,'入力 x₂')+arrow(145,83,300,119)+arrow(145,193,300,153)+txt(210,74,'× w₁')+txt(210,218,'× w₂')+box(310,100,140,70,'足す ＋ b','#e8f1fe')+arrow(450,135,500,135)+box(510,100,145,70,'活性化関数')+arrow(655,135,725,135)+txt(700,100,'出力 h')+txt(385,215,'まず、重み付きの和')+txt(580,215,'次に、形を変える'),260);
const reluDiagram = () => svg('ReLUのグラフ','横軸は入力z、縦軸は出力h。zが0以下なら0、正ならzをそのまま出す。',
 arrow(110,200,660,200)+arrow(370,230,370,28)+`<path d="M130 200H370L580 48" fill="none" stroke="#0031d8" stroke-width="5"/>`+txt(370,253,'0')+txt(640,230,'入力 z')+txt(420,42,'出力 h')+txt(210,155,'負の値 → 0')+txt(575,110,'正の値 → そのまま'),280);
const trainDiagram = () => svg('学習の4段階','順伝播で予測を計算し、損失を求め、逆伝播で勾配を計算し、最適化手法で重みを更新する。更新した重みで再び予測する。',
 box(15,65,155,88,'① 予測する','#e8f1fe')+arrow(170,109,195,109)+box(205,65,155,88,'② 損失を求める')+arrow(360,109,385,109)+box(395,65,155,88,'③ 勾配を求める')+arrow(550,109,575,109)+box(585,65,155,88,'④ 重みを更新')+`<path d="M665 153V211H92V163" fill="none" stroke="#8294af" stroke-width="2" marker-end="url(#ARROW)"/>`+txt(380,246,'同じ手順を、訓練データで繰り返す'),280);
const windowDiagram = () => svg('過去7日間から翌日を予測','1日目から7日目の室温・湿度・電力量を入力し、8日目の電力量を予測する。1日ずらすと、2日目から8日目が入力、9日目が目標になる。',
 Array.from({length:9},(_,i)=>box(16+i*82,55,72,50,`${i+1}日目`,i<7?'#e8f1fe':'#fff')).join('')+
 `<path d="M20 119V135H579V119" fill="none" stroke="#0031d8" stroke-width="3"/>`+txt(295,164,'入力：7日 × 3項目')+arrow(592,135,660,135)+txt(658,164,'目標：8日目')+
 `<path d="M102 200V216H661V200" fill="none" stroke="#006e54" stroke-width="3"/>`+txt(380,246,'次のサンプル：入力を1日ずらす')+arrow(673,216,737,216),275);
const rnnDiagram = () => svg('RNNを時間方向に展開した図','各時点で同じ処理を使い、現在の入力と前の隠れ状態から新しい隠れ状態を作る。最後の隠れ状態から翌日を予測する例。',
 box(100,115,130,65,'同じ処理 f','#e8f1fe')+box(310,115,130,65,'同じ処理 f','#e8f1fe')+box(520,115,130,65,'同じ処理 f','#e8f1fe')+arrow(30,147,90,147)+txt(50,120,'h₀')+arrow(230,147,300,147)+txt(265,120,'h₁')+arrow(440,147,510,147)+txt(475,120,'h₂')+arrow(650,147,730,147)+txt(698,120,'h₃')+arrow(165,242,165,190)+arrow(375,242,375,190)+arrow(585,242,585,190)+txt(165,270,'1日目 x₁')+txt(375,270,'2日目 x₂')+txt(585,270,'3日目 x₃')+arrow(585,105,585,65)+txt(585,42,'翌日の予測へ'),300);
const attentionDiagram = () => svg('Attentionによる情報の参照','ある時点の表現が、各時点の表現を重み付けして混ぜる概念図。図の重みは説明用で、実データの分析結果ではない。',
 box(45,190,130,55,'1日目の表現')+box(235,190,130,55,'2日目の表現')+box(425,190,130,55,'3日目の表現')+arrow(110,180,355,90)+arrow(300,180,370,90)+arrow(490,180,390,90)+box(275,30,210,55,'重み付けして混ぜる','#e8f1fe')+txt(180,112,'0.2')+txt(310,145,'0.3')+txt(475,112,'0.5')+txt(650,128,'参照する割合を')+txt(650,155,'入力に応じて変える'),280);
const splitDiagram = () => svg('時間に沿ったデータ分割','左から過去、未来の順。訓練期間で重みを学習し、その後の検証期間で設定を選び、最後のテスト期間で最終評価する。',
 box(25,65,350,82,'訓練：重みを学習','#e8f1fe')+box(385,65,180,82,'検証：設定を選ぶ','#eef5ee')+box(575,65,160,82,'テスト：最終評価','#fff5db')+arrow(30,215,725,215)+txt(65,249,'過去')+txt(685,249,'未来'),270);
const lossDiagram = () => svg('過学習の模式図','横軸は学習の進行、縦軸は損失。訓練損失は下がり続けるが、検証損失は途中から上がる。検証損失が小さい付近を候補としてモデルを選ぶ。',
 arrow(80,245,710,245)+arrow(80,245,80,25)+txt(60,35,'損失')+txt(650,280,'学習の進行')+
 `<path d="M100 50C200 130 260 190 360 208S560 230 675 232" fill="none" stroke="#0031d8" stroke-width="4"/><path d="M100 70C205 140 285 188 390 184S555 125 675 65" fill="none" stroke="#9b4f00" stroke-width="4" stroke-dasharray="9 5"/>`+
 txt(580,213,'訓練損失','fill="#0031d8"')+txt(590,80,'検証損失','fill="#9b4f00"')+line(365,160,365,243,'stroke-dasharray="4 4"')+txt(350,140,'候補となる時点'),300);
