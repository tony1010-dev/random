/* =========================================================
   뭐든지 랜덤 — app.js
   ========================================================= */

/* ---------- utils ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const rnd = n => Math.floor(Math.random() * n);
const pick = a => a[rnd(a.length)];
const pad = (n, l = 2) => String(n).padStart(l, '0');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const tint = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};
const shuffle = arr => {
  const b = arr.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = rnd(i + 1);
    const t = b[i]; b[i] = b[j]; b[j] = t;
  }
  return b;
};
const unique = arr => arr.filter((v, i) => arr.indexOf(v) === i);

/* 샌드박스 iframe·시크릿 모드에서는 localStorage 접근이 예외를 던진다.
   저장이 막히면 메모리에라도 남겨서 카운터가 세션 중에는 정상 동작하게 한다. */
const memStore = Object.create(null);
const store = {
  get(k) {
    try {
      const v = window.localStorage.getItem(k);
      if (v !== null) return v;
    } catch (e) { /* 무시 */ }
    return (k in memStore) ? memStore[k] : null;
  },
  set(k, v) {
    memStore[k] = String(v);
    try { window.localStorage.setItem(k, v); } catch (e) { /* 무시 */ }
  }
};

const setUrl = q => {
  try { window.history.replaceState(null, '', q); } catch (e) { /* 무시 */ }
};

/* =========================================================
   DATA
   ========================================================= */

const MALE = [
  ['Daniel', '대니얼'], ['David', '데이비드'], ['James', '제임스'], ['John', '존'],
  ['Michael', '마이클'], ['Ryan', '라이언'], ['Eric', '에릭'], ['Alex', '알렉스'],
  ['Chris', '크리스'], ['Kevin', '케빈'], ['Jason', '제이슨'], ['Brian', '브라이언'],
  ['Andrew', '앤드루'], ['Nathan', '네이선'], ['Ethan', '이선'], ['Noah', '노아'],
  ['Leo', '레오'], ['Max', '맥스'], ['Sam', '샘'], ['Jack', '잭'],
  ['Oliver', '올리버'], ['Henry', '헨리'], ['Lucas', '루카스'], ['Adam', '애덤'],
  ['Peter', '피터'], ['Tom', '톰'], ['Ben', '벤'], ['Sean', '숀'],
  ['Justin', '저스틴'], ['Brandon', '브랜던'], ['Dylan', '딜런'], ['Aaron', '에런'],
  ['Ian', '이언'], ['Victor', '빅터'], ['Simon', '사이먼'], ['Martin', '마틴'],
  ['Patrick', '패트릭'], ['Dennis', '데니스'], ['Frank', '프랭크'], ['Harry', '해리'],
  ['Oscar', '오스카'], ['Felix', '펠릭스'], ['Miles', '마일스'], ['Cole', '콜'],
  ['Dean', '딘'], ['Joel', '조엘'], ['Kurt', '커트'], ['Liam', '리엄'],
  ['Owen', '오언'], ['Evan', '에번']
];

const FEMALE = [
  ['Emma', '엠마'], ['Olivia', '올리비아'], ['Sophia', '소피아'], ['Grace', '그레이스'],
  ['Chloe', '클로이'], ['Lily', '릴리'], ['Hannah', '해나'], ['Sarah', '세라'],
  ['Jessica', '제시카'], ['Emily', '에밀리'], ['Rachel', '레이철'], ['Claire', '클레어'],
  ['Stella', '스텔라'], ['Mia', '미아'], ['Ella', '엘라'], ['Ava', '에이바'],
  ['Nora', '노라'], ['Julia', '줄리아'], ['Kate', '케이트'], ['Lucy', '루시'],
  ['Ruby', '루비'], ['Alice', '앨리스'], ['Irene', '아이린'], ['Diana', '다이애나'],
  ['Fiona', '피오나'], ['Helen', '헬렌'], ['Jane', '제인'], ['Karen', '캐런'],
  ['Laura', '로라'], ['Megan', '메건'], ['Nancy', '낸시'], ['Sophie', '소피'],
  ['Tina', '티나'], ['Victoria', '빅토리아'], ['Wendy', '웬디'], ['Zoe', '조이'],
  ['Amber', '앰버'], ['Bella', '벨라'], ['Daisy', '데이지'], ['Eva', '에바'],
  ['Hazel', '헤이즐'], ['Ivy', '아이비'], ['Jasmine', '재스민'], ['Kayla', '케일라'],
  ['Luna', '루나'], ['Mila', '밀라'], ['Rose', '로즈'], ['Sienna', '시에나'],
  ['Summer', '서머'], ['Iris', '아이리스']
];

/* ---------- 닉네임 ---------- */
const NICK_KO_A = ['수상한', '졸린', '배고픈', '용감한', '느긋한', '반짝이는', '엉뚱한', '조용한',
  '새벽의', '달빛', '우주', '심야의', '명랑한', '수줍은', '단단한', '보들보들한'];
const NICK_KO_N = ['감자', '고구마', '수달', '판다', '펭귄', '도토리', '붕어빵', '솜사탕',
  '구름', '별똥별', '오소리', '두부', '만두', '토끼', '여우', '너구리',
  '다람쥐', '복숭아', '마카롱', '푸딩', '젤리', '호빵', '라면', '고래'];
const NICK_EN_A = ['sleepy', 'hungry', 'sneaky', 'quiet', 'brave', 'lazy', 'fuzzy', 'neon',
  'cosmic', 'tiny', 'grumpy', 'sunny', 'wild', 'chill', 'lucky', 'spicy'];
const NICK_EN_N = ['potato', 'otter', 'panda', 'noodle', 'toast', 'comet', 'pebble', 'muffin',
  'penguin', 'walnut', 'ghost', 'tiger', 'cloud', 'bean', 'pickle', 'waffle'];

const DOG = {
  ko: ['콩이', '보리', '두부', '모카', '라떼', '초코', '밤이', '솜이', '구름', '호두',
    '깨비', '몽이', '뭉치', '단추', '토리', '뽀삐', '마루', '복실', '감자', '고구마',
    '만두', '찹쌀', '땅콩', '호빵', '치즈', '버터', '송이', '별이', '달이', '콩돌',
    '까미', '점박이', '누렁이', '왕자', '공주', '똘똘이', '쫑이', '덕구', '순돌', '복돌'],
  en: ['Coco', 'Max', 'Bella', 'Lucky', 'Happy', 'Charlie', 'Buddy', 'Daisy', 'Lucy', 'Milo',
    'Rocky', 'Teddy', 'Toby', 'Zoe', 'Luna', 'Peanut', 'Butter', 'Mocha', 'Cookie', 'Simba',
    'Nala', 'Oreo', 'Sunny', 'Dobby', 'Poppy', 'Biscuit', 'Noodle', 'Mango', 'Shadow', 'Bolt']
};

const CAT = {
  ko: ['나비', '호두', '치즈', '모카', '라떼', '구름', '냥이', '미미', '루루', '솜솜',
    '까미', '두부', '젤리', '푸딩', '마카롱', '봉봉', '삐용', '야옹', '츄르', '참치',
    '연어', '멸치', '고등어', '쪼꼬', '바닐라', '카라멜', '크림', '달래', '루나', '루시',
    '미오', '나나', '담요', '이불', '슬리퍼', '박스', '종이', '타로', '모래', '피카'],
  en: ['Luna', 'Mochi', 'Coco', 'Bella', 'Nala', 'Simba', 'Milo', 'Chloe', 'Lily', 'Momo',
    'Yuki', 'Sora', 'Tofu', 'Pudding', 'Jelly', 'Mango', 'Cookie', 'Pepper', 'Shadow', 'Snow',
    'Tiger', 'Pumpkin', 'Latte', 'Bean', 'Olive', 'Cider', 'Nugget', 'Cloud', 'Ash', 'Waffle']
};

const DOG_TIPS = [
  '두 음절 이름이 부르기 가장 좋아요.',
  '산책 중 부르기 쉽게 "이"로 끝나는 이름도 좋아요.',
  '가족 이름과 겹치지 않게 고르면 혼동이 없어요.',
  '훈련 시 짧고 또렷한 이름이 반응이 빨라요.'
];

const CAT_TIPS = [
  '고양이는 높고 부드러운 소리("이", "야")에 잘 반응해요.',
  '간식 이름과 겹치면 부를 때 헷갈려요.',
  '한 글자보다 두 글자 이름이 구분하기 쉬워요.',
  '영어 이름은 "s" 소리가 들어가면 반응이 좋다는 이야기가 있어요.'
];

const LUNCH = {
  '한식': ['김치찌개', '된장찌개', '순두부찌개', '제육볶음', '불고기', '비빔밥', '냉면', '칼국수',
    '돼지국밥', '삼겹살', '갈비탕', '찜닭', '닭갈비', '보쌈', '족발', '부대찌개',
    '감자탕', '한정식', '육개장', '곰탕'],
  '중식': ['짜장면', '짬뽕', '탕수육', '볶음밥', '마라탕', '마라샹궈', '양꼬치', '깐풍기',
    '우육면', '딤섬'],
  '일식': ['초밥', '라멘', '우동', '소바', '가츠동', '규동', '돈카츠', '텐동',
    '회', '오코노미야키'],
  '양식': ['파스타', '스테이크', '햄버거', '샌드위치', '리조또', '피자', '오믈렛', '감바스'],
  '분식': ['김밥', '라면', '떡볶이', '튀김', '쫄면', '돈까스', '우동', '토스트'],
  '아시안': ['쌀국수', '팟타이', '인도커리', '나시고랭', '반미', '분짜', '똠양꿍', '카오팟'],
  '샐러드': ['포케', '샐러드볼', '닭가슴살 정식', '수프', '브런치', '샌드위치 샐러드'],
  '패스트푸드': ['버거', '치킨', '타코', '부리또', '피자', '핫도그']
};

const TEAM_ADJ = ['조용한', '용감한', '빠른', '반짝이는', '느긋한', '단단한', '새벽의', '심야의',
  '수상한', '명랑한', '고요한', '뜨거운', '차가운', '달콤한', '은밀한', '대담한',
  '유쾌한', '진지한', '자유로운', '엉뚱한'];

const TEAM_NOUN = ['고래', '다람쥐', '오소리', '수달', '판다', '펭귄', '여우', '부엉이',
  '고양이', '사자', '호랑이', '너구리', '두루미', '앵무새', '문어', '해파리',
  '별똥별', '은하수', '로켓', '번개', '파도', '등대', '나침반', '원석',
  '연필', '도토리', '솜사탕', '복숭아', '감귤', '선인장'];

const TEAM_ADJ_EN = ['Quiet', 'Brave', 'Swift', 'Neon', 'Cosmic', 'Midnight', 'Golden', 'Silent',
  'Wild', 'Lazy', 'Bold', 'Clever', 'Electric', 'Velvet', 'Lunar', 'Sunny',
  'Foggy', 'Tiny', 'Giant', 'Curious'];

const TEAM_NOUN_EN = ['Whale', 'Otter', 'Falcon', 'Panda', 'Comet', 'Rocket', 'Lantern', 'Compass',
  'Cactus', 'Peach', 'Tiger', 'Fox', 'Owl', 'Penguin', 'Wave', 'Ember',
  'Breeze', 'Maple', 'Cobalt', 'Nova'];

const MAIL_ADJ = ['quiet', 'brave', 'swift', 'neon', 'cosmic', 'golden', 'silent', 'wild',
  'bold', 'clever', 'lunar', 'sunny', 'tiny', 'curious', 'mint', 'coral'];
const MAIL_NOUN = ['otter', 'falcon', 'panda', 'comet', 'rocket', 'lantern', 'compass', 'cactus',
  'tiger', 'fox', 'owl', 'penguin', 'wave', 'ember', 'maple', 'nova'];

const PW_WORDS = ['anchor', 'amber', 'arrow', 'atlas', 'autumn', 'basil', 'beacon', 'berry',
  'birch', 'biscuit', 'blade', 'bloom', 'bolt', 'bottle', 'breeze', 'brick',
  'bridge', 'bronze', 'brook', 'butter', 'cabin', 'cactus', 'camel', 'candle',
  'canvas', 'canyon', 'carbon', 'carpet', 'cedar', 'chalk', 'cherry', 'chess',
  'cider', 'cinnamon', 'citrus', 'clover', 'cobalt', 'cocoa', 'comet', 'copper',
  'coral', 'cotton', 'crane', 'crater', 'crimson', 'crystal', 'daisy', 'dawn',
  'delta', 'denim', 'desert', 'diamond', 'dolphin', 'donkey', 'dragon', 'drift',
  'eagle', 'echo', 'ember', 'engine', 'falcon', 'feather', 'fennel', 'fern',
  'ferry', 'fiddle', 'field', 'flame', 'flint', 'forest', 'fossil', 'fountain',
  'frost', 'galaxy', 'garden', 'ginger', 'glacier', 'glove', 'gold', 'granite',
  'grape', 'gravel', 'harbor', 'hazel', 'heron', 'honey', 'horizon', 'island',
  'ivory', 'jade', 'jasmine', 'jigsaw', 'jungle', 'juniper', 'kettle', 'kiwi',
  'ladder', 'lagoon', 'lantern', 'lavender', 'lemon', 'lily', 'linen', 'lion',
  'lizard', 'lotus', 'lunar', 'magnet', 'mango', 'maple', 'marble', 'meadow',
  'melon', 'meteor', 'mirror', 'mist', 'mocha', 'monkey', 'moss', 'mountain',
  'muffin', 'mustard', 'nectar', 'needle', 'nickel', 'nova', 'nutmeg', 'oasis',
  'ocean', 'olive', 'onion', 'opal', 'orbit', 'orchid', 'otter', 'owl',
  'oyster', 'paddle', 'palm', 'panda', 'paper', 'parrot', 'peach', 'pebble',
  'pecan', 'pelican', 'pepper', 'petal', 'piano', 'pilot', 'pine', 'pixel',
  'planet', 'plum', 'pocket', 'polar', 'pond', 'poppy', 'prairie', 'prism',
  'pumpkin', 'quartz', 'quill', 'rabbit', 'radar', 'raven', 'reef', 'ribbon',
  'river', 'robin', 'rocket', 'rope', 'ruby', 'saddle', 'saffron', 'sage',
  'salmon', 'sapphire', 'satin', 'scarlet', 'shadow', 'shell', 'silver', 'slate',
  'sled', 'smoke', 'snow', 'solar', 'sparrow', 'spice', 'spider', 'spiral',
  'spring', 'spruce', 'squash', 'stone', 'storm', 'sugar', 'summer', 'summit',
  'sunset', 'swallow', 'syrup', 'tabby', 'tangerine', 'teapot', 'temple', 'thistle',
  'thunder', 'tide', 'tiger', 'timber', 'toffee', 'tomato', 'topaz', 'torch',
  'tower', 'trail', 'tulip', 'tundra', 'turtle', 'twilight', 'umbrella', 'valley',
  'vanilla', 'velvet', 'violet', 'wagon', 'walnut', 'wave', 'wheat', 'whisper',
  'willow', 'window', 'winter', 'wolf', 'wonder', 'yellow', 'zephyr', 'zinc'];

const SAMPLE_NAMES = '김지우\n이서준\n박하윤\n최도윤\n정예린\n강민재\n윤서아\n임하준';

const COMPOUND_SURNAME = ['남궁', '황보', '제갈', '선우', '독고', '사공', '서문', '동방'];

/* 자주 쓰는 성씨 표기 (로마자 표기법과 실제 통용 표기가 다른 경우가 많음) */
const SURNAME = {
  '김': 'kim', '이': 'lee', '박': 'park', '최': 'choi', '정': 'jung', '강': 'kang',
  '조': 'cho', '윤': 'yoon', '장': 'jang', '임': 'lim', '한': 'han', '오': 'oh',
  '서': 'seo', '신': 'shin', '권': 'kwon', '황': 'hwang', '안': 'ahn', '송': 'song',
  '전': 'jeon', '홍': 'hong', '유': 'yoo', '고': 'ko', '문': 'moon', '손': 'son',
  '배': 'bae', '백': 'baek', '허': 'heo', '남': 'nam', '심': 'shim', '노': 'noh',
  '하': 'ha', '곽': 'kwak', '성': 'sung', '차': 'cha', '주': 'joo', '우': 'woo',
  '구': 'koo', '민': 'min', '진': 'jin', '나': 'na', '지': 'ji', '엄': 'eom',
  '변': 'byun', '원': 'won', '방': 'bang', '공': 'kong', '현': 'hyun', '함': 'ham',
  '여': 'yeo', '추': 'chu', '도': 'do', '소': 'so', '석': 'seok', '선': 'sun',
  '설': 'seol', '마': 'ma', '길': 'gil', '연': 'yeon', '위': 'wi', '표': 'pyo',
  '명': 'myung', '기': 'ki', '반': 'ban', '라': 'ra', '왕': 'wang', '금': 'keum',
  '옥': 'ok', '육': 'yook', '인': 'in', '맹': 'maeng', '제': 'je', '모': 'mo',
  '탁': 'tak', '국': 'kuk', '어': 'eo', '은': 'eun', '편': 'pyun', '용': 'yong',
  '예': 'ye', '경': 'kyung', '봉': 'bong', '사': 'sa', '부': 'bu',
  '남궁': 'namgung', '황보': 'hwangbo', '제갈': 'jegal', '선우': 'sunwoo',
  '독고': 'dokgo', '사공': 'sagong', '서문': 'seomun', '동방': 'dongbang'
};

/* ---------- 아이스브레이킹 ---------- */
const ICE = {
  light: [
    '최근에 가장 웃겼던 일은 뭐였나요?',
    '인생 최고의 간식은 무엇인가요?',
    '지금 당장 떠날 수 있다면 어디로 가고 싶나요?',
    '최근에 산 물건 중 제일 잘 산 것은?',
    '하루 종일 한 가지만 먹어야 한다면?',
    '가장 좋아하는 계절과 그 이유는?',
    '휴대폰 배터리가 1%일 때 가장 먼저 하는 일은?',
    '이번 주 최고의 순간은 언제였나요?',
    '무인도에 딱 세 가지만 가져갈 수 있다면?',
    '가장 부러운 동물은 무엇인가요?',
    '최애 영화 한 편만 꼽는다면?',
    '노래방 18번은 무슨 노래인가요?',
    '요즘 가장 자주 하는 말은?',
    '아침에 일어나서 제일 먼저 하는 일은?',
    '평생 한 도시에서만 살아야 한다면 어디?',
    '나만의 소소한 행복은 무엇인가요?'
  ],
  mid: [
    '최근에 새로 배운 것은 무엇인가요?',
    '일할 때 가장 집중이 잘 되는 시간대는?',
    '요즘 푹 빠져 있는 것 하나를 소개한다면?',
    '최근에 누군가에게 배운 점이 있나요?',
    '5년 전의 나에게 한마디 한다면?',
    '지금 하는 일에서 가장 재미있는 순간은?',
    '나만의 스트레스 해소법은 무엇인가요?',
    '요즘 고민 중인 작은 결정이 있나요?',
    '요즘 가장 칭찬받고 싶은 부분은?',
    '함께 일하고 싶은 사람의 특징은 무엇인가요?',
    '최근에 본 것 중 오래 기억에 남는 장면은?',
    '올해 꼭 해보고 싶은 작은 목표가 있나요?'
  ],
  deep: [
    '10년 뒤에 어떤 사람이 되어 있고 싶나요?',
    '지금 삶에서 가장 바꾸고 싶은 한 가지는?',
    '실패했던 경험 중 가장 값진 것은 무엇인가요?',
    '누군가에게 꼭 물어보고 싶었던 질문이 있나요?',
    '돈 걱정이 없다면 무엇을 하고 있을까요?',
    '나를 가장 잘 설명하는 단어 세 개는?',
    '최근에 마음이 움직인 순간은 언제였나요?',
    '후배에게 꼭 해주고 싶은 조언은?'
  ]
};

/* ---------- 오늘 뭐 입지 ---------- */
const OUTFIT = {
  hot: {
    label: '더운 날',
    outer: ['아우터 없이', '얇은 린넨 셔츠', '시어서커 재킷', '얇은 가디건'],
    top: ['반팔 티셔츠', '린넨 셔츠', '반팔 니트', '슬리브리스', '피케 셔츠'],
    bottom: ['린넨 팬츠', '반바지', '얇은 슬랙스', '데님 쇼츠', '쿨링 와이드 팬츠'],
    shoes: ['스니커즈', '샌들', '로퍼', '슬리퍼'],
    acc: ['선글라스', '볼캡', '미니백', '메탈 시계']
  },
  mild: {
    label: '선선한 날',
    outer: ['트렌치코트', '데님 재킷', '가디건', '블루종', '셔츠 재킷'],
    top: ['옥스퍼드 셔츠', '맨투맨', '얇은 니트', '긴팔 티셔츠', '스트라이프 셔츠'],
    bottom: ['슬랙스', '청바지', '치노 팬츠', '와이드 팬츠'],
    shoes: ['스니커즈', '로퍼', '더비 슈즈', '앵클부츠'],
    acc: ['숄더백', '손목시계', '볼캡', '가죽 벨트']
  },
  cold: {
    label: '추운 날',
    outer: ['패딩', '울 코트', '무스탕', '퍼 재킷', '더플코트'],
    top: ['터틀넥 니트', '기모 맨투맨', '두꺼운 니트', '셔츠 + 가디건'],
    bottom: ['기모 슬랙스', '두꺼운 데님', '코듀로이 팬츠', '울 팬츠'],
    shoes: ['부츠', '워커', '기모 스니커즈', '첼시 부츠'],
    acc: ['머플러', '장갑', '비니', '울 숄']
  }
};

/* ---------- 카페 메뉴 ---------- */
const CAFE = {
  '커피': ['아메리카노', '카페라떼', '바닐라라떼', '카푸치노', '플랫화이트', '콜드브루',
    '카라멜마키아토', '카페모카', '아인슈페너', '돌체라떼', '헤이즐넛라떼', '에스프레소'],
  '논커피': ['초코라떼', '딸기라떼', '유자차', '자몽에이드', '레몬에이드', '밀크티',
    '고구마라떼', '쿠키프라페', '요거트스무디', '복숭아 아이스티', '매실차'],
  '티': ['캐모마일', '페퍼민트', '얼그레이', '루이보스', '히비스커스', '녹차', '홍차', '자스민티'],
  '디저트': ['크루아상', '스콘', '티라미수', '치즈케이크', '당근케이크', '마들렌',
    '휘낭시에', '브라우니', '버터 쿠키', '바스크 치즈케이크']
};

/* ---------- 여행지 ---------- */
const TRAVEL = [
  ['강릉', '바다', '커피거리와 경포 바다, 새벽 해돋이까지'],
  ['속초', '바다', '설악산과 청초호, 닭강정은 필수'],
  ['부산', '도시', '해운대와 광안리, 야시장까지 하루가 짧아요'],
  ['여수', '바다', '밤바다와 낭만포차, 돌산대교 야경'],
  ['통영', '바다', '한려수도와 동피랑 벽화마을'],
  ['제주', '바다', '협재 해변과 오름, 한 달 살아도 부족'],
  ['경주', '도시', '천년 고도, 첨성대와 황리단길'],
  ['전주', '도시', '한옥마을과 막걸리 골목'],
  ['춘천', '한적', '남이섬과 닭갈비, 자전거길'],
  ['가평', '산', '북한강과 잣나무 숲, 물놀이까지'],
  ['양양', '바다', '서핑 성지, 죽도 해변'],
  ['평창', '산', '겨울엔 스키, 여름엔 대관령 양떼목장'],
  ['태안', '바다', '꽃지 해수욕장의 낙조'],
  ['보성', '한적', '녹차밭과 율포 해변'],
  ['담양', '한적', '죽녹원과 메타세쿼이아 길'],
  ['순천', '한적', '순천만 갈대밭과 습지'],
  ['안동', '한적', '하회마을과 월영교 야경'],
  ['울릉도', '바다', '배 타고 가는 섬, 독도까지'],
  ['거제', '바다', '외도 보타니아와 바람의 언덕'],
  ['대구', '도시', '김광석 거리와 서문시장'],
  ['수원', '도시', '화성 행궁과 행리단길'],
  ['충주', '한적', '충주호와 수안보 온천'],
  ['부여', '한적', '백제의 숨결, 궁남지 연꽃'],
  ['삼척', '바다', '환선굴과 장호항'],
  ['영월', '산', '동강과 별마로 천문대'],
  ['정선', '산', '병방치 스카이워크와 아리랑'],
  ['군산', '도시', '근대문화거리와 초원사진관'],
  ['포항', '바다', '호미곶 일출과 스페이스워크']
];

/* ---------- 한글 로마자 변환 (개략) ---------- */
const CHO = ['g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h'];
const JUNG = ['a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i'];
const JONG = ['', 'k', 'k', 'ks', 'n', 'nj', 'nh', 't', 'l', 'lk', 'lm', 'lb', 'ls', 'lt', 'lp', 'lh', 'm', 'p', 'ps', 't', 't', 'ng', 't', 't', 'k', 't', 'p', 'h'];

function romanize(str, given) {
  let out = '';
  for (const ch of str) {
    const code = ch.charCodeAt(0);
    if (code < 0xac00 || code > 0xd7a3) {
      if (/[a-zA-Z0-9]/.test(ch)) out += ch.toLowerCase();
      continue;
    }
    const c = code - 0xac00;
    const cho = Math.floor(c / 588);
    const jung = Math.floor((c % 588) / 28);
    const jong = c % 28;
    let ini = CHO[cho];
    let vow = JUNG[jung];

    /* 이름 끝의 'ㅜ/ㅠ'는 실제로 'oo'로 적는 경우가 많음 (지우 → jiwoo) */
    if (given && jong === 0 && (jung === 13 || jung === 17)) {
      if (cho === 11) { ini = jung === 13 ? 'w' : 'y'; vow = 'oo'; }
      else if (jung === 13) { vow = 'oo'; }
    }
    out += ini + vow + JONG[jong];
  }
  return out;
}

function splitName(raw) {
  const t = String(raw || '').trim().replace(/\s+/g, ' ');
  if (!t) return null;

  /* 영문 입력: 마지막 단어를 성으로 본다 (Jiwoo Kim → given Jiwoo / sur Kim) */
  if (/^[A-Za-z .'-]+$/.test(t)) {
    const parts = t.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return {
        sur: parts[parts.length - 1].toLowerCase().replace(/[^a-z]/g, ''),
        given: parts.slice(0, -1).join('').toLowerCase().replace(/[^a-z]/g, ''),
        ko: t
      };
    }
    return { sur: '', given: parts[0].toLowerCase().replace(/[^a-z]/g, ''), ko: t };
  }

  /* 한글 입력: 첫 글자(또는 복성)를 성으로 본다 */
  const name = t.replace(/[^가-힣]/g, '');
  if (!name) return null;
  let surKo, givenKo;
  const two = COMPOUND_SURNAME.find(s => name.startsWith(s));
  if (two && name.length > 2) {
    surKo = name.slice(0, 2);
    givenKo = name.slice(2);
  } else {
    surKo = name.slice(0, 1);
    givenKo = name.slice(1);
  }
  if (!givenKo) return null;
  return {
    sur: SURNAME[surKo] || romanize(surKo, false),
    given: romanize(givenKo, true),
    ko: name
  };
}

/* =========================================================
   GENERATORS
   ========================================================= */

const big = (text, cls = '') => `<div class="big ${cls}" data-copy="${esc(text)}">${esc(text)}</div>`;
const sub = text => `<div class="sub">${text}</div>`;
const list = items => `<div class="res-list">${items.map(i =>
  `<span class="chip-res" data-copy="${esc(i.t)}">${esc(i.t)}${i.n ? `<i>${esc(i.n)}</i>` : ''}</span>`
).join('')}</div>`;

const GENS = [
  /* ---------------- 1. 영어 이름 ---------------- */
  {
    id: 'en-name',
    cat: '이름',
    icon: '🌤',
    color: '#d7ff5c',
    name: '영어 이름',
    short: '남/여 회사용',
    desc: '출근 첫날 필요한 영어 이름. 남자·여자 구분해서 뽑아드려요. 발음과 음절까지 같이 알려드립니다.',
    btn: '이름 뽑기',
    controls: [
      { type: 'chips', key: 'g', label: '성별', def: 'all', options: [['all', '전체'], ['m', '남자'], ['f', '여자']] },
      { type: 'chips', key: 'n', label: '개수', def: '3', options: [['1', '1개'], ['3', '3개'], ['5', '5개']] }
    ],
    draw(o) {
      const pool = o.g === 'm' ? MALE : o.g === 'f' ? FEMALE : MALE.concat(FEMALE);
      const n = Number(o.n);
      const picks = shuffle(pool).slice(0, n);
      const [en, ko] = picks[0];
      let html = big(en) + sub(`${ko} · ${ko.length}음절 · ${en.length <= 5 ? '짧고 부르기 쉬운 이름' : '존재감 있는 이름'}`);
      if (n > 1) html += list(picks.slice(1).map(p => ({ t: p[0], n: p[1] })));
      html += `<div class="tip">사내 메일 서명에는 이름 + 성 조합(Daniel Kim)으로 쓰는 경우가 많아요.</div>`;
      return html;
    }
  },

  /* ---------------- 2. 닉네임 ---------------- */
  {
    id: 'nickname',
    cat: '이름',
    icon: '🏷',
    color: '#8fd6ff',
    name: '닉네임',
    short: '커뮤니티·게임용',
    desc: '커뮤니티·게임에서 쓸 닉네임을 만들어드립니다. 한글·영어를 섞어서 5개까지 뽑아요.',
    btn: '닉네임 뽑기',
    controls: [
      { type: 'chips', key: 's', label: '스타일', def: 'all', options: [['all', '전체'], ['ko', '한글'], ['en', '영어']] }
    ],
    draw(o) {
      const picks = [];
      const used = new Set();
      let guard = 0;
      while (picks.length < 5 && guard++ < 80) {
        const lang = o.s === 'all' ? (rnd(2) ? 'ko' : 'en') : o.s;
        const a = pick(lang === 'ko' ? NICK_KO_A : NICK_EN_A);
        const b = pick(lang === 'ko' ? NICK_KO_N : NICK_EN_N);
        const n = nickFormat(a, b, lang);
        if (used.has(n)) continue;
        used.add(n);
        picks.push(n);
      }
      return big(picks[0], 'sm') + sub('닉네임 후보 5개') +
        list(picks.slice(1).map(t => ({ t }))) +
        `<div class="tip">이미 쓰는 닉네임이면 뒤 숫자를 바꾸거나 다른 조합으로 다시 뽑아보세요.</div>`;
    }
  },

  /* ---------------- 3. 반려견 이름 ---------------- */
  {
    id: 'dog-name',
    cat: '이름',
    icon: '🐶',
    color: '#ffc44d',
    name: '반려견 이름',
    short: '강아지 이름',
    desc: '부르기 좋은 강아지 이름 모음. 한글·영어 스타일을 골라서 뽑아보세요.',
    btn: '이름 뽑기',
    controls: [
      { type: 'chips', key: 's', label: '스타일', def: 'all', options: [['all', '전체'], ['ko', '한글'], ['en', '영어']] }
    ],
    draw(o) {
      const pool = o.s === 'ko' ? DOG.ko : o.s === 'en' ? DOG.en : DOG.ko.concat(DOG.en);
      const picks = shuffle(pool).slice(0, 5);
      return big(picks[0]) + sub(`강아지 이름 후보 ${picks.length}개`) +
        list(picks.slice(1).map(t => ({ t }))) +
        `<div class="tip">${pick(DOG_TIPS)}</div>`;
    }
  },

  /* ---------------- 3. 반려묘 이름 ---------------- */
  {
    id: 'cat-name',
    cat: '이름',
    icon: '🐱',
    color: '#b79cff',
    name: '반려묘 이름',
    short: '고양이 이름',
    desc: '고양이가 잘 반응하는 이름. 짧고 부드러운 소리를 골라 담았어요.',
    btn: '이름 뽑기',
    controls: [
      { type: 'chips', key: 's', label: '스타일', def: 'all', options: [['all', '전체'], ['ko', '한글'], ['en', '영어']] }
    ],
    draw(o) {
      const pool = o.s === 'ko' ? CAT.ko : o.s === 'en' ? CAT.en : CAT.ko.concat(CAT.en);
      const picks = shuffle(pool).slice(0, 5);
      return big(picks[0]) + sub(`고양이 이름 후보 ${picks.length}개`) +
        list(picks.slice(1).map(t => ({ t }))) +
        `<div class="tip">${pick(CAT_TIPS)}</div>`;
    }
  },

  /* ---------------- 4. 투폰 뒷자리 ---------------- */
  {
    id: 'phone',
    cat: '업무',
    icon: '📱',
    color: '#57c7ff',
    name: '투폰 뒷자리',
    short: '업무용 번호 4자리',
    desc: '업무용 두 번째 폰의 뒷자리 4개를 뽑아드립니다. 기억하기 쉬운 번호부터 남이 못 맞히는 번호까지.',
    btn: '번호 뽑기',
    controls: [
      {
        type: 'chips', key: 's', label: '스타일', def: 'easy',
        options: [['easy', '기억하기 쉬움'], ['random', '완전 랜덤'], ['date', '날짜·기념일'], ['pattern', '반복 패턴']]
      }
    ],
    draw(o) {
      const used = new Set();
      const codes = [];
      let guard = 0;
      while (codes.length < 4 && guard++ < 400) {
        const r = makeCode(o.s);
        if (used.has(r.code)) continue;
        used.add(r.code);
        codes.push(r);
      }
      let html = `<div class="big mono" data-copy="${codes[0].code}">${codes[0].code}</div>` +
        sub(`${codes[0].note} · 뒤 4자리`);
      html += `<div class="res-list">` + codes.slice(1).map(c =>
        `<span class="chip-res" data-copy="${c.code}" style="font-family:'IBM Plex Mono',monospace;letter-spacing:.08em">${c.code}<i>${esc(c.note)}</i></span>`
      ).join('') + `</div>`;
      html += `<div class="tip">앞자리(010-XXXX)는 통신사가 정하니, 바꿀 수 있는 건 뒤 4자리예요.</div>`;
      return html;
    }
  },

  /* ---------------- 5. 비밀번호 ---------------- */
  {
    id: 'password',
    cat: '보안',
    icon: '🔐',
    color: '#4fe0a8',
    name: '비밀번호 생성기',
    short: '강력한 랜덤 암호',
    desc: '길이와 방식을 고르면 바로 만들 수 있어요. 강도(엔트로피)까지 계산해드립니다.',
    btn: '비밀번호 생성',
    controls: [
      { type: 'chips', key: 'mode', label: '방식', def: 'random', options: [['random', '랜덤 문자'], ['words', '단어 조합']] },
      { type: 'chips', key: 'lv', label: '강도', def: 'strong', options: [['base', '기본'], ['strong', '강화'], ['max', '최대']] },
      { type: 'range', key: 'len', label: '길이', min: 8, max: 28, step: 1, def: 16 }
    ],
    draw(o) {
      const len = Number(o.len);
      let pw = '', entropy = 0, label = '';

      if (o.mode === 'words') {
        const sep = pick(['-', '.', '_']);
        const cap = o.lv === 'base' ? 0 : 1;
        const wc = Math.max(3, Math.min(7, Math.round(len / 4)));
        const words = shuffle(PW_WORDS).slice(0, wc)
          .map(w => (cap ? w[0].toUpperCase() + w.slice(1) : w));
        const tail = o.lv === 'max' ? pick(['!', '#', '@', '?']) + (rnd(90) + 10) : String(rnd(90) + 10);
        pw = words.join(sep) + tail;
        entropy = Math.round(wc * Math.log2(PW_WORDS.length) + (o.lv === 'max' ? 12 : 7));
        label = `${wc}개 단어 · ${pw.length}자`;
      } else {
        const U = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        const L = 'abcdefghijkmnpqrstuvwxyz';
        const D = '23456789';
        const S = '!@#$%^&*?-_=+';
        let pool = U + L + D;
        if (o.lv !== 'base') pool += S;
        const must = o.lv === 'base' ? [U, L, D] : o.lv === 'strong' ? [U, L, D, S] : [U, L, D, S, S];
        const chars = must.map(set => pick(set));
        while (chars.length < len) chars.push(pick(pool));
        pw = shuffle(chars).join('');
        entropy = Math.round(len * Math.log2(pool.length));
        label = `${len}자 · ${pool.length}종 문자`;
      }

      const level = entropy >= 85 ? ['매우 강함', '#4fe0a8']
        : entropy >= 55 ? ['강함', '#d7ff5c']
        : entropy >= 35 ? ['보통', '#ffc44d']
        : entropy >= 22 ? ['약함', '#ff6b4a']
        : ['매우 약함', '#ff6b4a'];
      const pct = Math.max(6, Math.min(100, Math.round(entropy / 128 * 100)));

      return `<div class="big mono sm" data-copy="${esc(pw)}" style="letter-spacing:.02em;word-break:break-all">${esc(pw)}</div>` +
        sub(`${label} · 엔트로피 약 ${entropy}비트`) +
        `<div class="meter"><span style="width:${pct}%;background:${level[1]}"></span></div>` +
        `<div class="sub" style="color:${level[1]};font-weight:600">${level[0]}</div>` +
        `<div class="tip">${o.mode === 'words'
          ? '단어 조합은 외우기 쉽습니다. 중요한 계정에는 랜덤 문자 방식을 권장해요.'
          : '가능하면 사이트마다 다른 비밀번호를 쓰세요.'}</div>`;
    }
  },

  /* ---------------- 6. 비밀번호 패턴 ---------------- */
  {
    id: 'pw-pattern',
    cat: '보안',
    icon: '🧩',
    color: '#ff7fb0',
    name: '비밀번호 패턴',
    short: '나만의 규칙 만들기',
    desc: '비밀번호를 통째로 외우는 대신 "규칙"을 외우세요. 사이트마다 달라지는 나만의 패턴을 만들어드립니다.',
    btn: '패턴 만들기',
    controls: [
      { type: 'chips', key: 's', label: '스타일', def: 'all', options: [['all', '전체'], ['animal', '동물'], ['hobby', '취미'], ['sentence', '문장']] }
    ],
    draw(o) {
      const p = makePattern(o.s);
      return `<div class="big sm" data-copy="${esc(p.ex)}" style="max-width:16ch;word-break:break-all">${esc(p.ex)}</div>` +
        sub(`예시 결과 · 엔트로피 약 ${p.bits}비트`) +
        `<div class="card-res" style="flex-direction:column;align-items:flex-start;gap:7px;max-width:540px">` +
        `<div style="font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#5f6674">규칙</div>` +
        `<div style="font-size:13.5px;line-height:1.7;color:#eef1f5">${esc(p.rule)}</div>` +
        `</div>` +
        `<div class="tip">${esc(p.tip)}</div>`;
    }
  },

  /* ---------------- 7. 이메일 아이디 ---------------- */
  {
    id: 'email',
    cat: '업무',
    icon: '✉️',
    color: '#ffc44d',
    name: '사내 이메일 아이디',
    short: '이름으로 ID 만들기',
    desc: '이름을 넣으면 사내 메일 아이디 후보를 만들어드려요. 한글 이름은 자동으로 로마자로 바꿉니다.',
    btn: '아이디 만들기',
    controls: [
      { type: 'text', key: 'name', label: '이름 (한글 또는 영문)', def: '김지우', placeholder: '예) 김지우 / Jiwoo Kim' }
    ],
    draw(o) {
      const info = splitName(o.name) || splitName('김지우');
      const s = info.sur;
      const g = info.given;
      const n = 10 + rnd(89);
      const base = s
        ? [
          { t: `${g}.${s}`, n: '가장 무난한 형식' },
          { t: `${s}${g}`, n: '붙여쓰기' },
          { t: `${g}${s}`, n: '이름 먼저' },
          { t: `${g}.${s[0]}`, n: '성이 이니셜' },
          { t: `${s[0]}${g}`, n: '짧은 아이디' },
          { t: `${g}_${s}`, n: '언더스코어' },
          { t: `${s}.${g}`, n: '성 먼저' },
          { t: `${g}.${s}${n}`, n: '중복일 때 대안' }
        ]
        : [
          { t: g, n: '이름만' },
          { t: `${g}${n}`, n: '숫자 추가' },
          { t: `${g}.${n}`, n: '점 + 숫자' },
          { t: `${g}_${n}`, n: '언더스코어' },
          { t: `${g}${g.length > 4 ? g.slice(0, 4) : g}`, n: '축약형' }
        ];

      const main = `${base[0].t}@company.com`;
      const note = s ? `${info.ko} → ${s} ${g}` : '성이 없어 이름만으로 만들었어요';

      return `<div class="big sm mono" data-copy="${esc(main)}" style="letter-spacing:0">${esc(base[0].t)}<span style="color:#5f6674">@company.com</span></div>` +
        sub(note) +
        `<div class="res-list">` + base.slice(1).map(i =>
          `<span class="chip-res" data-copy="${esc(i.t + '@company.com')}" style="font-family:'IBM Plex Mono',monospace;font-size:13px">${esc(i.t)}<i>${esc(i.n)}</i></span>`
        ).join('') + `</div>` +
        `<div class="tip">로마자 표기는 통용 표기를 따랐어요. 사내 규칙이 있으면 그 형식에 맞는 후보를 고르세요.</div>`;
    }
  },

  /* ---------------- 8. 이메일 주소 ---------------- */
  {
    id: 'email-addr',
    cat: '업무',
    icon: '📧',
    color: '#7dd3fc',
    name: '이메일 주소',
    short: '가입용 주소 추천',
    desc: '이름이나 키워드로 쓸 만한 이메일 주소를 만들어드립니다. 도메인만 고르면 바로 복사할 수 있어요.',
    btn: '주소 만들기',
    controls: [
      { type: 'text', key: 'name', label: '이름 또는 키워드', def: '김지우', placeholder: '예) 김지우 / otter' },
      {
        type: 'chips', key: 'dom', label: '도메인', def: 'gmail.com',
        options: [['gmail.com', 'gmail'], ['naver.com', 'naver'], ['daum.net', 'daum'], ['outlook.com', 'outlook'], ['icloud.com', 'icloud']]
      }
    ],
    draw(o) {
      const info = splitName(o.name);
      let locals;
      let note;

      if (info && info.sur) {
        const g = info.given;
        const s = info.sur;
        locals = [
          `${g}.${s}`,
          `${s}${g}`,
          `${g}_${s}`,
          `${g}${s[0]}`,
          `${g}.${s}${10 + rnd(90)}`
        ];
        note = `${info.ko} → ${s} ${g}`;
      } else if (info && info.given) {
        const g = info.given;
        locals = [g, `${g}${10 + rnd(90)}`, `${g}.${10 + rnd(90)}`, `${g}_${10 + rnd(90)}`];
        note = `키워드 "${g}"로 만든 주소`;
      } else {
        const a = pick(NICK_EN_A);
        const b = pick(NICK_EN_N);
        locals = [`${a}.${b}`, `${a}${b}`, `${a}_${b}`, `${a}${b}${10 + rnd(90)}`];
        note = '키워드가 없어 영단어 조합으로 만들었어요';
      }

      const all = locals.map(l => `${l}@${o.dom}`);
      return `<div class="big sm mono" data-copy="${esc(all[0])}" style="letter-spacing:0;word-break:break-all">${esc(all[0])}</div>` +
        sub(note) +
        `<div class="res-list">` + all.slice(1).map(a =>
          `<span class="chip-res" data-copy="${esc(a)}" style="font-family:'IBM Plex Mono',monospace;font-size:13px">${esc(a)}</span>`
        ).join('') + `</div>` +
        `<div class="tip">실제 가입 가능 여부는 확인하지 않아요. 이미 쓰는 주소면 숫자를 바꿔보세요.</div>`;
    }
  },

  /* ---------------- 9. 팀·프로젝트 이름 ---------------- */
  {
    id: 'team-name',
    cat: '업무',
    icon: '🚩',
    color: '#ff6b4a',
    name: '팀·프로젝트 이름',
    short: 'TF 이름 짓기',
    desc: 'TF, 스쿼드, 사이드 프로젝트 이름이 필요할 때. 한글·영어 스타일과 접미사를 고를 수 있어요.',
    btn: '이름 뽑기',
    controls: [
      { type: 'chips', key: 's', label: '스타일', def: 'ko', options: [['ko', '한글'], ['en', '영어']] },
      { type: 'chips', key: 'sfx', label: '접미사', def: 'team', options: [['team', '팀'], ['project', '프로젝트'], ['tf', 'TF'], ['squad', '스쿼드'], ['crew', '크루'], ['none', '없음']] }
    ],
    draw(o) {
      const SFX = {
        ko: { team: '팀', project: '프로젝트', tf: 'TF', squad: '스쿼드', crew: '크루', none: '' },
        en: { team: 'Team', project: 'Project', tf: 'TF', squad: 'Squad', crew: 'Crew', none: '' }
      };
      const suffix = SFX[o.s][o.sfx];
      const make = () => {
        if (o.s === 'ko') return `${pick(TEAM_ADJ)} ${pick(TEAM_NOUN)}`;
        return `${pick(TEAM_ADJ_EN)} ${pick(TEAM_NOUN_EN)}`;
      };
      const names = unique([make(), make(), make(), make(), make()]).slice(0, 4);
      while (names.length < 4) names.push(make());
      const full = t => suffix ? `${t} ${suffix}` : t;
      return big(full(names[0]), 'sm') + sub('팀 이름 후보') +
        list(names.slice(1).map(t => ({ t: full(t) }))) +
        `<div class="tip">이름이 정해졌다면 슬랙 채널명은 영문 소문자·하이픈으로 줄여보세요.</div>`;
    }
  },

  /* ---------------- 9. 로또 번호 ---------------- */
  {
    id: 'lotto',
    cat: '재미',
    icon: '🎲',
    color: '#d7ff5c',
    name: '로또 번호',
    short: '6/45 자동 5게임',
    desc: '1부터 45까지, 겹치지 않는 6개 번호를 5게임 만들어드립니다. 재미로만 쓰세요.',
    btn: '번호 뽑기',
    controls: [
      { type: 'chips', key: 'n', label: '게임 수', def: '5', options: [['1', '1게임'], ['3', '3게임'], ['5', '5게임']] }
    ],
    draw(o) {
      const n = Number(o.n);
      const letters = ['A', 'B', 'C', 'D', 'E'];
      let html = `<div class="lotto">`;
      for (let i = 0; i < n; i++) {
        const nums = shuffle(Array.from({ length: 45 }, (_, k) => k + 1)).slice(0, 6).sort((a, b) => a - b);
        html += `<div class="lotto-row" data-copy="${nums.join(' ')}"><span class="lbl">${letters[i]}</span><div class="balls">` +
          nums.map(v => `<span class="ball" style="background:${ballColor(v)}">${v}</span>`).join('') +
          `</div></div>`;
      }
      html += `</div><div class="tip">번호는 무작위입니다. 어떤 조합도 당첨 확률이 같아요.</div>`;
      return html;
    }
  },

  /* ---------------- 10. 점심 메뉴 ---------------- */
  {
    id: 'lunch',
    cat: '일상',
    icon: '🍚',
    color: '#4fe0a8',
    name: '점심 메뉴',
    short: '오늘 뭐 먹지',
    desc: '카테고리를 고르면 오늘의 점심을 정해드립니다. 팀 점심 회의가 끝나는 도구.',
    btn: '메뉴 뽑기',
    controls: [
      { type: 'chips', key: 'cats', multi: true, label: '카테고리', def: ['한식', '중식', '일식', '양식', '분식'], options: Object.keys(LUNCH).map(k => [k, k]) }
    ],
    draw(o) {
      const cats = o.cats.length ? o.cats : Object.keys(LUNCH);
      const all = shuffle(cats.reduce((acc, c) => acc.concat(LUNCH[c].map(m => ({ m, c }))), []));
      const first = all[0];
      return big(first.m) + sub(`${first.c} · 후보 ${all.length}개 중`) +
        list(all.slice(1, 4).map(i => ({ t: i.m, n: i.c }))) +
        `<div class="tip">마음에 안 들면 한 번 더 뽑으세요. 세 번 뽑아서 나온 것 중 고르는 것도 방법이에요.</div>`;
    }
  },

  /* ---------------- 11. 제비뽑기·팀 나누기 ---------------- */
  {
    id: 'pick',
    cat: '업무',
    icon: '🎯',
    color: '#57c7ff',
    name: '제비뽑기 · 팀 나누기',
    short: '이름 넣고 뽑기',
    desc: '이름을 줄바꿈으로 넣고 한 명 뽑기, 팀 나누기, 발표 순서 정하기까지 한 번에.',
    btn: '뽑기',
    controls: [
      {
        type: 'chips', key: 'mode', label: '모드', def: 'one',
        options: [['one', '한 명 뽑기'], ['teams', '팀 나누기'], ['order', '순서 정하기']]
      },
      { type: 'range', key: 'teams', label: '팀 수', min: 2, max: 6, step: 1, def: 2 },
      { type: 'area', key: 'names', label: '이름 목록 (한 줄에 하나)', def: SAMPLE_NAMES }
    ],
    draw(o) {
      const names = unique(o.names.split(/[\n,]/).map(s => s.trim()).filter(Boolean));
      if (names.length < 2) return sub('이름을 두 개 이상 넣어주세요.');

      if (o.mode === 'one') {
        const w = pick(names);
        return big(w) + sub(`${names.length}명 중 당첨`) +
          `<div class="tip">다시 뽑으면 결과가 바뀝니다.</div>`;
      }

      if (o.mode === 'order') {
        const order = shuffle(names);
        return sub(`${names.length}명 발표 순서`) +
          `<div class="teams" style="grid-template-columns:repeat(auto-fit,minmax(120px,1fr))">` +
          order.map((n, i) => `<div class="team"><h4>${i + 1}</h4><p>${esc(n)}</p></div>`).join('') +
          `</div>`;
      }

      const count = Math.min(Number(o.teams), names.length);
      const teams = Array.from({ length: count }, () => []);
      shuffle(names).forEach((n, i) => teams[i % count].push(n));
      return sub(`${names.length}명 → ${count}팀`) +
        `<div class="teams">` + teams.map((t, i) =>
          `<div class="team"><h4>${i + 1}팀 · ${t.length}명</h4><p>${t.map(esc).join('<br>')}</p></div>`
        ).join('') + `</div>`;
    }
  },

  /* ---------------- 12. 아이스브레이킹 ---------------- */
  {
    id: 'icebreak',
    cat: '재미',
    icon: '💬',
    color: '#57c7ff',
    name: '아이스브레이킹',
    short: '회의 시작 질문',
    desc: '팀 미팅·워크샵 첫 3분을 채워줄 질문입니다. 한 명씩 돌아가며 답하면 금세 풀립니다.',
    btn: '질문 뽑기',
    controls: [
      { type: 'chips', key: 'lv', label: '분위기', def: 'light', options: [['all', '전체'], ['light', '가볍게'], ['mid', '적당히'], ['deep', '진지하게']] }
    ],
    draw(o) {
      const pool = o.lv === 'all' ? ICE.light.concat(ICE.mid, ICE.deep) : ICE[o.lv];
      const picks = shuffle(pool).slice(0, 4);
      return `<div class="big sm" data-copy="${esc(picks[0])}" style="max-width:18ch;line-height:1.32">${esc(picks[0])}</div>` +
        sub('이 질문으로 시작해 보세요') +
        `<div class="res-list">` + picks.slice(1).map(q =>
          `<span class="chip-res" data-copy="${esc(q)}" style="white-space:normal;text-align:left;max-width:100%;line-height:1.5">${esc(q)}</span>`
        ).join('') + `</div>` +
        `<div class="tip">답이 막히면 "먼저 하실 분?" 대신 손가락으로 지목하면 훨씬 빨라요.</div>`;
    }
  },

  /* ---------------- 13. 랜덤 숫자 ---------------- */
  {
    id: 'number',
    cat: '재미',
    icon: '🔢',
    color: '#d7ff5c',
    name: '랜덤 숫자',
    short: '범위 지정 뽑기',
    desc: '최소·최대만 정하면 그 사이 숫자를 뽑아줍니다. 중복 없이 여러 개도 한 번에.',
    btn: '숫자 뽑기',
    controls: [
      { type: 'text', key: 'min', label: '최소', def: '1', small: true, numeric: true },
      { type: 'text', key: 'max', label: '최대', def: '100', small: true, numeric: true },
      { type: 'chips', key: 'n', label: '개수', def: '1', options: [['1', '1개'], ['3', '3개'], ['5', '5개'], ['10', '10개']] },
      { type: 'chips', key: 'dup', label: '중복', def: 'no', options: [['no', '중복 없이'], ['yes', '중복 허용']] }
    ],
    draw(o) {
      const rawMin = String(o.min).trim();
      const rawMax = String(o.max).trim();
      let min = rawMin === '' ? 1 : Math.ceil(Number(rawMin));
      let max = rawMax === '' ? 100 : Math.floor(Number(rawMax));
      if (!isFinite(min)) min = 1;
      if (!isFinite(max)) max = 100;
      if (max < min) { const t = min; min = max; max = t; }
      const span = max - min + 1;
      const n = Math.min(Number(o.n) || 1, o.dup === 'no' ? span : 99);
      const nums = o.dup === 'no'
        ? sampleUnique(min, max, n)
        : Array.from({ length: n }, () => min + rnd(span));
      return `<div class="nums${n === 1 ? ' xl' : ''}" data-copy="${nums.join(' ')}">` +
        nums.map(v => `<span class="num">${v}</span>`).join('') + `</div>` +
        sub(`${min} ~ ${max} 사이 · ${n}개`) +
        `<div class="tip">최소·최대를 직접 입력하면 바로 반영됩니다.</div>`;
    }
  },

  /* ---------------- 14. 랜덤 색상 ---------------- */
  {
    id: 'color',
    cat: '재미',
    icon: '🎨',
    color: '#ff7fb0',
    name: '랜덤 색상',
    short: 'HEX · 팔레트',
    desc: '오늘 쓸 색을 뽑아드립니다. 메인 컬러와 어울리는 조합 4가지까지 같이 나옵니다.',
    btn: '색 뽑기',
    controls: [
      { type: 'chips', key: 'tone', label: '톤', def: 'any', options: [['any', '아무거나'], ['soft', '파스텔'], ['deep', '딥'], ['vivid', '비비드']] }
    ],
    draw(o) {
      const c = randColor(o.tone);
      const main = c.hex;
      const mates = [
        hsl2hex((c.h + 28) % 360, c.s, clamp(c.l + 12)),
        hsl2hex((c.h + 330) % 360, c.s, clamp(c.l - 10)),
        hsl2hex((c.h + 180) % 360, c.s, clamp(c.l + 4)),
        hsl2hex((c.h + 150) % 360, Math.max(20, c.s - 20), clamp(c.l + 22))
      ];
      const rgb = hexToRgb(main);
      return `<div class="swatch-main" style="background:${main};color:${readable(main)}" data-copy="${main}">${main.toUpperCase()}</div>` +
        `<div class="palette">` + mates.map(m =>
          `<div class="sw" style="background:${m};color:${readable(m)}" data-copy="${m}">${m.toUpperCase()}</div>`
        ).join('') + `</div>` +
        sub(`RGB ${rgb.r}, ${rgb.g}, ${rgb.b} · HSL ${Math.round(c.h)}°, ${c.s}%, ${c.l}%`) +
        `<div class="tip">복사 버튼을 누르면 메인 컬러와 팔레트 4색이 함께 복사됩니다.</div>`;
    }
  },

  /* ---------------- 15. 오늘 뭐 입지 ---------------- */
  {
    id: 'outfit',
    cat: '일상',
    icon: '👕',
    color: '#4fe0a8',
    name: '오늘 뭐 입지',
    short: '코디 조합 뽑기',
    desc: '날씨만 고르면 오늘 입을 옷 조합을 정해드립니다. 아침 고민 5초 컷.',
    btn: '코디 뽑기',
    controls: [
      { type: 'chips', key: 'w', label: '날씨', def: 'mild', options: [['hot', '더워요'], ['mild', '선선해요'], ['cold', '추워요']] }
    ],
    draw(o) {
      const s = OUTFIT[o.w];
      const outer = pick(s.outer);
      const top = pick(s.top);
      const bottom = pick(s.bottom);
      const shoes = pick(s.shoes);
      const acc = pick(s.acc);
      const copy = `상의 ${top} / 하의 ${bottom} / 아우터 ${outer} / 신발 ${shoes} / 소품 ${acc}`;
      return `<div class="big sm" data-copy="${esc(copy)}" style="max-width:18ch">${esc(top)} + ${esc(bottom)}</div>` +
        sub(`${s.label} 추천 조합`) +
        `<div class="look">` + [['아우터', outer], ['신발', shoes], ['소품', acc]].map(([k, v]) =>
          `<div class="look-row"><span class="k">${k}</span><span class="v">${esc(v)}</span></div>`
        ).join('') + `</div>` +
        `<div class="tip">레이어링하면 실내외 온도차에 대응하기 좋아요.</div>`;
    }
  },

  /* ---------------- 16. 카페 메뉴 ---------------- */
  {
    id: 'cafe',
    cat: '일상',
    icon: '☕️',
    color: '#c8a06a',
    name: '카페 메뉴',
    short: '오늘 뭐 마시지',
    desc: '카테고리를 고르면 오늘의 음료를 정해드립니다. 디저트까지 같이 뽑아보세요.',
    btn: '메뉴 뽑기',
    controls: [
      { type: 'chips', key: 'cats', multi: true, label: '카테고리', def: ['커피', '논커피'], options: Object.keys(CAFE).map(k => [k, k]) }
    ],
    draw(o) {
      const cats = o.cats.length ? o.cats : Object.keys(CAFE);
      const all = shuffle(cats.reduce((acc, c) => acc.concat(CAFE[c].map(m => ({ m, c }))), []));
      const f = all[0];
      return big(f.m) + sub(`${f.c} · 후보 ${all.length}개 중`) +
        list(all.slice(1, 4).map(i => ({ t: i.m, n: i.c }))) +
        `<div class="tip">디저트도 필요하면 카테고리를 함께 선택해 보세요.</div>`;
    }
  },

  /* ---------------- 17. 여행지 추천 ---------------- */
  {
    id: 'travel',
    cat: '일상',
    icon: '🧭',
    color: '#ffc44d',
    name: '여행지 추천',
    short: '주말에 어디 갈까',
    desc: '이번 주말 갈 곳을 정해드립니다. 테마를 고르면 취향에 맞게 뽑아요.',
    btn: '여행지 뽑기',
    controls: [
      { type: 'chips', key: 't', label: '테마', def: 'all', options: [['all', '전체'], ['바다', '바다'], ['산', '산'], ['도시', '도시'], ['한적', '한적']] }
    ],
    draw(o) {
      const pool = o.t === 'all' ? TRAVEL : TRAVEL.filter(x => x[1] === o.t);
      const picks = shuffle(pool).slice(0, 3);
      const [name, tag, desc] = picks[0];
      return big(name) + sub(`${tag} · ${esc(desc)}`) +
        list(picks.slice(1).map(p => ({ t: p[0], n: p[1] }))) +
        `<div class="tip">당일치기면 왕복 4시간 이내, 1박이면 6시간 이내가 적당해요.</div>`;
    }
  }
];

/* ---------- helpers used by generators ---------- */

function ballColor(v) {
  if (v <= 10) return '#f5c542';
  if (v <= 20) return '#4a9df0';
  if (v <= 30) return '#ef5350';
  if (v <= 40) return '#7b8794';
  return '#4caf7d';
}

const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));

function nickFormat(a, b, lang) {
  const style = rnd(4);
  if (lang === 'ko') {
    if (style === 0) return `${a} ${b}`;
    if (style === 1) return `${a}${b}`;
    if (style === 2) return `${a}_${b}`;
    return `${a}${b}${10 + rnd(90)}`;
  }
  const A = a[0].toUpperCase() + a.slice(1);
  const B = b[0].toUpperCase() + b.slice(1);
  if (style === 0) return `${A} ${B}`;
  if (style === 1) return `${a}${b}`;
  if (style === 2) return `${a}_${b}`;
  return `${a}${b}${10 + rnd(90)}`;
}

function sampleUnique(min, max, n) {
  const span = max - min + 1;
  if (span <= 6000) return shuffle(Array.from({ length: span }, (_, i) => min + i)).slice(0, n);
  const set = new Set();
  while (set.size < n) set.add(min + rnd(span));
  return Array.from(set);
}

function hsl2hex(h, s, l) {
  const S = s / 100;
  const L = l / 100;
  const k = n => (n + h / 30) % 12;
  const a = S * Math.min(L, 1 - L);
  const f = n => L - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const to = x => Math.round(255 * x).toString(16).padStart(2, '0');
  return '#' + to(f(0)) + to(f(8)) + to(f(4));
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function readable(hex) {
  const { r, g, b } = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) > 150 ? '#0a0b0d' : '#ffffff';
}

function randColor(tone) {
  const h = rnd(360);
  let s, l;
  if (tone === 'soft') { s = 55 + rnd(20); l = 74 + rnd(12); }
  else if (tone === 'deep') { s = 45 + rnd(25); l = 26 + rnd(12); }
  else if (tone === 'vivid') { s = 75 + rnd(20); l = 48 + rnd(10); }
  else { s = 55 + rnd(30); l = 45 + rnd(20); }
  return { h, s, l, hex: hsl2hex(h, s, l) };
}

function makeCode(style) {
  if (style === 'random') {
    let c;
    do {
      c = pad(rnd(10000), 4);
    } while (
      /^(\d)\1{3}$/.test(c) ||
      ['0123', '1234', '2345', '3456', '4567', '5678', '6789', '9876', '8765'].includes(c)
    );
    return { code: c, note: pick(['겹치지 않는 조합', '눈에 띄지 않는 번호', '추측이 어려운 번호']) };
  }

  if (style === 'date') {
    const m = 1 + rnd(12);
    const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
    const d = 1 + rnd(days);
    return { code: pad(m) + pad(d), note: `${m}월 ${d}일` };
  }

  if (style === 'pattern') {
    const a = rnd(10);
    let b = rnd(10);
    while (b === a) b = rnd(10);
    const shapes = [
      [`${a}${b}${a}${b}`, 'ABAB 반복'],
      [`${a}${a}${b}${b}`, 'AABB 반복'],
      [`${a}${b}${b}${a}`, 'ABBA 거울'],
      [`${a}${a}${a}${b}`, 'AAA + 하나']
    ];
    const s = pick(shapes);
    return { code: s[0], note: s[1] };
  }

  // easy
  const kind = pick(['abab', 'aabb', 'asc', 'even', 'round', 'year']);
  if (kind === 'abab') {
    const a = 1 + rnd(9);
    let b = 1 + rnd(9);
    while (b === a) b = 1 + rnd(9);
    return { code: `${a}${b}${a}${b}`, note: '두 숫자 반복' };
  }
  if (kind === 'aabb') {
    const a = 1 + rnd(9);
    let b = 1 + rnd(9);
    while (b === a) b = 1 + rnd(9);
    return { code: `${a}${a}${b}${b}`, note: '쌍으로 반복' };
  }
  if (kind === 'asc') {
    const s = 1 + rnd(6);
    return { code: `${s}${s + 1}${s + 2}${s + 3}`, note: '연속 숫자 (추측은 쉬움)' };
  }
  if (kind === 'even') {
    const s = pick([1, 3]);
    return { code: `${s}${s + 2}${s + 4}${s + 6}`, note: '같은 간격 숫자' };
  }
  if (kind === 'round') {
    const a = 1 + rnd(9);
    return { code: `${a}000`, note: '0이 세 개' };
  }
  const y = 1970 + rnd(56);
  return { code: String(y), note: '연도처럼' };
}

function makePattern(style) {
  const animals = ['otter', 'falcon', 'panda', 'tiger', 'whale', 'koala', 'penguin', 'lynx'];
  const hobbies = ['coffee', 'tennis', 'guitar', 'hiking', 'movie', 'piano', 'reading', 'running'];
  const sym = ['!', '#', '@', '?', '$'];

  const kinds = [];
  kinds.push(() => {
    const w = pick(animals);
    const mm = pad(1 + rnd(12));
    const dd = pad(1 + rnd(28));
    return {
      rule: '좋아하는 동물 영단어 + 기념일 4자리 + 기호',
      ex: `${w}${mm}${dd}${pick(sym)}`,
      bits: 62,
      tip: '기념일은 본인만 아는 날짜가 좋아요. 생일은 너무 뻔합니다.'
    };
  });
  kinds.push(() => {
    const w = pick(hobbies);
    const n = 10 + rnd(90);
    return {
      rule: '취미 영단어 + 좋아하는 숫자 2자리 + 기호',
      ex: `${w}${n}${pick(sym)}${pick(sym)}`,
      bits: 58,
      tip: '사이트마다 기호만 바꾸는 식으로 응용할 수 있어요.'
    };
  });
  kinds.push(() => {
    const words = shuffle(['I', 'love', 'morning', 'coffee', 'and', 'walk', 'every', 'day']).slice(0, 4);
    const initials = words.map(w => w[0].toUpperCase()).join('');
    const y = 2018 + rnd(8);
    return {
      rule: '기억나는 문장의 영단어 첫 글자 + 연도 + 기호',
      ex: `${initials}${y}${pick(sym)}`,
      bits: 64,
      tip: '문장은 매일 보는 것(좋아하는 가사 첫 줄)이 기억에 오래 남아요.'
    };
  });
  kinds.push(() => {
    const a = pick(TEAM_ADJ_EN).toLowerCase();
    const b = pick(TEAM_NOUN_EN).toLowerCase();
    return {
      rule: '형용사 + 명사 조합 + 숫자',
      ex: `${a}${b[0].toUpperCase() + b.slice(1)}${10 + rnd(90)}`,
      bits: 55,
      tip: '두 단어가 만드는 그림이 있을수록 잘 외워집니다.'
    };
  });

  let pool = kinds;
  if (style === 'animal') pool = [kinds[0], kinds[3]];
  if (style === 'hobby') pool = [kinds[1], kinds[3]];
  if (style === 'sentence') pool = [kinds[2], kinds[3]];

  return pick(pool)();
}

/* =========================================================
   APP
   ========================================================= */

const state = { gid: GENS[0].id, opts: {} };
const history = {};
const timers = [];

GENS.forEach(g => {
  const o = {};
  g.controls.forEach(c => { o[c.key] = c.def; });
  state.opts[g.id] = o;
});

const navEl = $('#nav');
const panelEl = $('#panel');
const toastEl = $('#toast');

function todayKey() {
  const d = new Date();
  return `rs_count_${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

function bumpCount() {
  const k = todayKey();
  const v = Number(store.get(k) || 0) + 1;
  store.set(k, String(v));
  const el = $('#count');
  if (el) el.textContent = v;
}

const CAT_ORDER = ['이름', '일상', '업무', '보안', '재미'];

function buildNav() {
  const cats = CAT_ORDER.filter(c => GENS.some(g => g.cat === c));
  GENS.forEach(g => { if (!cats.includes(g.cat)) cats.push(g.cat); });
  navEl.innerHTML = cats.map(c => {
    const items = GENS.filter(g => g.cat === c);
    return `<div class="nav-label">${c}</div>` + items.map(g => `
      <button class="nav-item${g.id === state.gid ? ' on' : ''}" data-id="${g.id}" type="button">
        <span class="ico" style="background:${tint(g.color, .14)}">${g.icon}</span>
        <span class="txt"><b>${g.name}</b><i>${g.short}</i></span>
      </button>`).join('');
  }).join('');
}

function updateNavFade() {
  if (!navEl) return;
  const hidden = navEl.scrollHeight - navEl.clientHeight - navEl.scrollTop > 4;
  navEl.classList.toggle('more', hidden);
}

function ctrlHTML(g, o) {
  return g.controls.map(c => {
    if (c.type === 'chips') {
      const cur = o[c.key];
      const isOn = v => c.multi ? (Array.isArray(cur) && cur.includes(v)) : String(cur) === String(v);
      return `<div class="ctrl">
        <label>${c.label}</label>
        <div class="chips" data-key="${c.key}" data-multi="${c.multi ? 1 : 0}">
          ${c.options.map(([v, t]) =>
            `<button class="chip${isOn(v) ? ' on' : ''}" type="button" data-val="${esc(v)}">${t}</button>`
          ).join('')}
        </div>
      </div>`;
    }
    if (c.type === 'range') {
      return `<div class="ctrl">
        <label>${c.label}</label>
        <div class="range-row">
          <input type="range" data-key="${c.key}" min="${c.min}" max="${c.max}" step="${c.step}" value="${o[c.key]}">
          <span class="range-val" data-out="${c.key}">${o[c.key]}</span>
        </div>
      </div>`;
    }
    if (c.type === 'text') {
      return `<div class="ctrl${c.small ? ' tight' : ' grow'}">
        <label>${c.label}</label>
        <input type="text" data-key="${c.key}" value="${esc(o[c.key])}" placeholder="${esc(c.placeholder || '')}"${c.numeric ? ' inputmode="numeric"' : ''}>
      </div>`;
    }
    if (c.type === 'area') {
      return `<div class="ctrl grow">
        <label>${c.label}</label>
        <textarea data-key="${c.key}" rows="6" placeholder="예) 김지우">${esc(o[c.key])}</textarea>
      </div>`;
    }
    return '';
  }).join('');
}

function renderPanel(silent) {
  const g = GENS.find(x => x.id === state.gid);
  const o = state.opts[g.id];
  panelEl.innerHTML = `
    <div class="eyebrow">${g.cat}</div>
    <h1>${g.name}</h1>
    <p class="desc">${g.desc}</p>
    <div class="stage"><div class="stage-inner" id="stage-inner"></div></div>
    <div class="actions">
      <button class="draw-btn" id="drawBtn" type="button">${g.btn}</button>
      <button class="copy-btn" id="copyBtn" type="button" title="결과 복사">⧉</button>
    </div>
    <div class="controls">${ctrlHTML(g, o)}</div>
    <div class="history" id="history"></div>
    <div class="more" id="more"></div>
  `;
  draw(silent === true);
  renderHistory();
  renderMore();
  updateNavFade();
}

function renderMore() {
  const el = $('#more');
  if (!el) return;
  const pool = shuffle(GENS.filter(g => g.id !== state.gid));
  const others = [];
  const usedCats = new Set();
  for (const g of pool) {
    if (others.length >= 3) break;
    if (usedCats.has(g.cat)) continue;
    others.push(g);
    usedCats.add(g.cat);
  }
  for (const g of pool) {
    if (others.length >= 3) break;
    if (!others.includes(g)) others.push(g);
  }
  el.innerHTML = `<div class="more-label">다른 뽑기도 있어요</div>
    <div class="more-grid">${others.map(g => `
      <button class="more-card" type="button" data-go="${g.id}">
        <span class="ico" style="background:${tint(g.color, .14)}">${g.icon}</span>
        <span class="txt"><b>${g.name}</b><i>${g.short}</i></span>
        <span class="arrow">→</span>
      </button>`).join('')}</div>`;
}

function draw(silent) {
  const g = GENS.find(x => x.id === state.gid);
  const o = state.opts[g.id];
  const inner = $('#stage-inner');
  if (!inner) return;

  timers.forEach(t => clearInterval(t));
  timers.length = 0;

  let html = '';
  try {
    html = g.draw(o);
  } catch (err) {
    console.error(err);
    html = sub('생성 중 문제가 발생했어요. 옵션을 바꿔 다시 시도해 주세요.');
  }
  inner.innerHTML = html;

  const nodes = $$('.big, .res-list, .lotto, .teams, .card-res, .sub, .meter', inner);
  nodes.forEach((el, i) => {
    const delay = Math.min(i * 40, 240);
    el.classList.add('reveal');
    el.style.animationDelay = delay + 'ms';
    /* 애니메이션이 실행되지 않는 환경에서도 결과가 보이도록 안전장치 */
    setTimeout(() => {
      el.classList.remove('reveal');
      el.style.animationDelay = '';
    }, delay + 700);
  });

  const firstBig = inner.querySelector('.big');
  if (firstBig) {
    const text = firstBig.textContent.trim();
    if (text.length <= 18) {
      firstBig.classList.remove('reveal');
      scramble(firstBig, text);
    }
  }

  if (!silent) {
    bumpCount();
    const copyEl = inner.querySelector('[data-copy]');
    const summary = copyEl ? copyEl.getAttribute('data-copy').trim().replace(/\s+/g, ' ').slice(0, 16) : '';
    if (summary) {
      history[g.id] = [summary].concat(history[g.id] || []).slice(0, 5);
      renderHistory();
    }
  }
}

function scramble(el, text) {
  const glyphs = '가나다라마바사아자차카타파하0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const chars = text.split('');
  let frame = 0;
  const total = 8;
  const id = setInterval(() => {
    frame++;
    if (frame >= total) {
      clearInterval(id);
      el.textContent = text;
      return;
    }
    el.textContent = chars.map(c => (c === ' ' || c === '.' || c === '-' || c === '_' || c === '@') ? c : glyphs[rnd(glyphs.length)]).join('');
  }, 34);
  timers.push(id);
}

function renderHistory() {
  const el = $('#history');
  if (!el) return;
  const items = history[state.gid] || [];
  if (!items.length) {
    el.innerHTML = '';
    el.style.display = 'none';
    return;
  }
  el.style.display = '';
  el.innerHTML = `<span class="hl">최근</span>` +
    items.map(t => `<span class="h-chip">${esc(t)}</span>`).join('');
}

function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toastEl.classList.remove('show'), 1600);
}

function copyResult() {
  const nodes = $$('#stage-inner [data-copy]');
  const text = nodes.length
    ? nodes.map(n => n.getAttribute('data-copy')).join('\n')
    : ($('#stage-inner') || {}).textContent || '';
  if (!text.trim()) return;

  const done = () => toast('복사했어요');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text.trim()).then(done).catch(() => fallbackCopy(text.trim(), done));
  } else {
    fallbackCopy(text.trim(), done);
  }
}

function fallbackCopy(text, done) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); done(); } catch (e) { toast('복사에 실패했어요'); }
  document.body.removeChild(ta);
}

/* ---------- events ---------- */

navEl.addEventListener('scroll', updateNavFade);
window.addEventListener('resize', updateNavFade);

navEl.addEventListener('click', e => {
  const btn = e.target.closest('.nav-item');
  if (!btn) return;
  if (btn.dataset.id === state.gid) return;
  setActive(btn.dataset.id, true);
  renderPanel();
  if (window.innerWidth <= 900) {
    panelEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

panelEl.addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (chip) {
    const wrap = chip.closest('.chips');
    const key = wrap.dataset.key;
    const multi = wrap.dataset.multi === '1';
    const val = chip.dataset.val;
    const o = state.opts[state.gid];

    if (multi) {
      const arr = Array.isArray(o[key]) ? o[key].slice() : [];
      const i = arr.indexOf(val);
      if (i >= 0) {
        if (arr.length === 1) { toast('최소 하나는 골라야 해요'); return; }
        arr.splice(i, 1);
      } else {
        arr.push(val);
      }
      o[key] = arr;
      $$('.chip', wrap).forEach(c => c.classList.toggle('on', arr.includes(c.dataset.val)));
    } else {
      o[key] = val;
      $$('.chip', wrap).forEach(c => c.classList.toggle('on', c === chip));
    }
    draw(false);
    return;
  }

  if (e.target.closest('#drawBtn')) { draw(false); return; }
  if (e.target.closest('#copyBtn')) { copyResult(); return; }

  const go = e.target.closest('[data-go]');
  if (go) {
    setActive(go.dataset.go, true);
    renderPanel();
    panelEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

panelEl.addEventListener('input', e => {
  const t = e.target;
  if (t.matches('input[type="range"]')) {
    const key = t.dataset.key;
    state.opts[state.gid][key] = Number(t.value);
    const out = panelEl.querySelector(`[data-out="${key}"]`);
    if (out) out.textContent = t.value;
    draw(true);   /* 드래그 중에는 카운트/기록하지 않음 */
    return;
  }
  if (t.matches('input[type="text"], textarea')) {
    state.opts[state.gid][t.dataset.key] = t.value;
  }
});

panelEl.addEventListener('change', e => {
  const t = e.target;
  if (t.matches('input[type="range"]')) {
    draw(false);
    return;
  }
  if (t.matches('input[type="text"], textarea')) {
    state.opts[state.gid][t.dataset.key] = t.value;
    draw(false);
  }
});

$('#lucky').addEventListener('click', () => {
  const others = GENS.filter(g => g.id !== state.gid);
  const g = pick(others);
  setActive(g.id, true);
  renderPanel();
  toast(`${g.name} 뽑아봤어요`);
});

document.addEventListener('keydown', e => {
  const tag = (e.target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea') return;

  const cmd = e.metaKey || e.ctrlKey;

  /* 선택된 텍스트가 없을 때만 결과 복사로 가로챈다 */
  if (cmd && (e.key === 'c' || e.key === 'C')) {
    if (String(window.getSelection() || '').trim()) return;
    e.preventDefault();
    copyResult();
    return;
  }
  if (cmd || e.altKey) return;

  if (e.code === 'Space' || e.key === 'Enter') {
    e.preventDefault();
    draw(false);
  }
});

function setActive(id, updateUrl) {
  state.gid = id;
  $$('.nav-item', navEl).forEach(n => n.classList.toggle('on', n.dataset.id === id));
  if (updateUrl) setUrl('?g=' + encodeURIComponent(id));
}

/* ---------- boot ---------- */

const IS_MAC = /Mac|iPhone|iPad|iPod/i.test((navigator.platform || '') + ' ' + (navigator.userAgent || ''));

const keysEl = document.getElementById('keys');
if (keysEl) {
  keysEl.innerHTML = '<kbd>Space</kbd> 다시 뽑기 · ' +
    (IS_MAC ? '<kbd>⌘</kbd> <kbd>C</kbd>' : '<kbd>Ctrl</kbd> + <kbd>C</kbd>') + ' 복사';
}

const genCountEl = document.getElementById('gen-count');
if (genCountEl) genCountEl.textContent = GENS.length;

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

try {
  const wanted = new URLSearchParams(location.search).get('g');
  if (wanted && GENS.some(g => g.id === wanted)) state.gid = wanted;

  buildNav();
  renderPanel(true);

  const c = $('#count');
  if (c) c.textContent = store.get(todayKey()) || 0;
} catch (err) {
  console.error(err);
  const p = document.getElementById('panel');
  if (p && !p.innerHTML.trim()) {
    p.innerHTML = '<p class="desc">화면을 준비하지 못했어요. 페이지를 새로고침해 주세요.</p>';
  }
}
