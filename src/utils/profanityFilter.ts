// Comprehensive Korean Profanity, Hate Speech, & Forbidden Words Filter

const FORBIDDEN_WORDS: string[] = [
  // General Korean profanity & slurs
  '시발', '씨발', '씨벌', '씨팔', '시팔', '씨바', '시바', '썅', '싯팔', '씨불',
  '개새끼', '개새', '개새키', '새끼', '새키', '개자식', '개새기', '개샛기',
  '존나', '좆나', '존낙', '존마니', '좆마니', '좆', '줏', '좃', '좆같은', '좆같',
  '병신', '뼝신', '빙신', '븅신', '등신', '호구', '호로', '호로새끼', '호로 자식',
  '미친', '미친놈', '미친년', '미친새끼', '미친개',
  '지랄', '지랄염병', '염병', '옘병', '염병할',
  '닥쳐', '아가리', '주둥이', '아구창',
  '꺼져', '꺼져라', '뻐큐', '뼉큐', 'fuck', 'shit', 'bitch', 'bastard', 'asshole',

  // Ilbe / Hate speech / Inappropriate political slurs
  '노무현', '노무', '무현', '운지', '운지천', '노알라', '노체', '노짜',
  '김대중', '슨상님', '절라디언', '홍어', '라도', '전라디언',
  '박정희', '박근혜', '문재인', '문재앙', '재앙', '윤석열', '윤재앙',
  '일베', '일간베스트', '메갈', '메갈리아', '워마드', '페미', '한남', '한남충',
  '갓끈', '틀딱', '틀니', '틀딱충', '맘충', '급식충', '틀니딱딱',
  '자살', '살인', '강간', '성폭행', '섹스', '야동', '성인', '야사',
];

/**
  Normalizes text by stripping spaces, special characters, and numbers
  to catch evasion techniques like "시 발", "노_무_현", "씨1발", etc.
*/
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\s\_\-\.\,\!\@\#\$\%\^\&\*\(\)\=\+\<\>\?\/\:\;\"\'\{\}\[\]\~`0-9]/g, '');
}

export function isProfaneOrForbidden(text: string): boolean {
  if (!text) return false;

  const rawLower = text.toLowerCase().trim();
  const normalized = normalizeText(text);

  for (const word of FORBIDDEN_WORDS) {
    const wordNorm = normalizeText(word);
    if (!wordNorm) continue;

    // Check direct substring in raw or normalized string
    if (rawLower.includes(word) || normalized.includes(wordNorm)) {
      return true;
    }
  }

  return false;
}
