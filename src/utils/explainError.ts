// Plain-language explanations for common Python/JS error types, shown
// alongside (never instead of) the raw error message -- keeping the real
// traceback visible is intentional so learners aren't caught off guard when
// they move on to Jupyter/Colab/real dev tools later.
const ERROR_EXPLANATIONS: Record<string, string> = {
  SyntaxError: '코드의 문법이 잘못됐어요. 괄호나 따옴표가 안 닫혔거나, 콜론(:)이 빠졌거나, 오타가 있는지 확인해 보세요.',
  IndentationError: '들여쓰기가 맞지 않아요. if, for, def, while 같은 블록 안의 코드는 앞에 공백을 일정하게 맞춰야 해요.',
  TabError: '탭과 스페이스가 섞여서 들여쓰기가 꼬였어요. 한 가지 방식(보통 스페이스 4칸)으로 통일해 보세요.',
  NameError: '아직 만들어지지 않았거나 오타가 난 변수/함수 이름을 사용했어요. 철자가 맞는지, 먼저 값을 저장했는지 확인해 보세요.',
  TypeError: '자료형이 맞지 않는 연산을 시도했어요. 예를 들어 문자열과 숫자를 그냥 더하면 이 오류가 나요. str()이나 int() 같은 형변환이 필요할 수 있어요.',
  ValueError: '값 자체는 맞는 자료형이지만 원하는 형태가 아니에요. 예를 들어 int("abc")처럼 숫자로 바꿀 수 없는 문자열을 변환하려 할 때 발생해요.',
  IndexError: '리스트나 문자열의 범위를 벗어난 위치(인덱스)에 접근했어요. len()으로 길이를 먼저 확인해 보세요.',
  KeyError: '딕셔너리에 존재하지 않는 키에 접근했어요. 키 이름의 철자가 맞는지 확인해 보세요.',
  ZeroDivisionError: '숫자를 0으로 나누려고 했어요. 나누는 값이 0이 되지 않는지 확인해 보세요.',
  AttributeError: '그 객체가 갖고 있지 않은 메서드나 속성을 사용하려고 했어요. 오타가 없는지, 자료형이 맞는지 확인해 보세요.',
  ModuleNotFoundError: '불러오려는 모듈(라이브러리)을 찾을 수 없어요. import 문의 이름이 맞는지 확인해 보세요.',
  ImportError: '모듈을 불러오는 데 실패했어요. import 문을 확인해 보세요.',
  UnboundLocalError: '변수에 값을 저장하기 전에 먼저 사용하려고 했어요. 사용하기 전에 값을 먼저 대입했는지 확인해 보세요.',
  RecursionError: '함수가 자기 자신을 너무 많이 반복해서 호출했어요 (무한 재귀 가능성). 종료 조건이 있는지 확인해 보세요.',
  StopIteration: '반복 가능한 값에서 더 이상 꺼낼 항목이 없어요.',
  OverflowError: '계산 결과가 너무 커서 표현할 수 있는 범위를 넘었어요.',
  FileNotFoundError: '찾으려는 파일이 없어요.',
  // JS
  ReferenceError: '아직 선언되지 않았거나 범위(scope) 밖에 있는 변수를 사용했어요. 변수 이름의 철자와 선언 위치를 확인해 보세요.',
  RangeError: '허용된 범위를 벗어난 값을 사용했어요.',
  EvalError: 'eval() 사용과 관련된 오류예요.',
  URIError: 'URI 관련 함수에 잘못된 값을 전달했어요.',
};

// Both Python tracebacks and JS error strings end with a "SomeError: message"
// line -- extract the LAST such match (the actual raised error, not one
// mentioned earlier in a chained traceback) and look up its explanation.
export function explainError(rawError: string | null | undefined): string | null {
  if (!rawError) return null;
  const matches = Array.from(rawError.matchAll(/^([A-Za-z][A-Za-z0-9_]*(?:Error|Exception)):/gm));
  if (matches.length === 0) return null;
  const errorType = matches[matches.length - 1][1];
  return ERROR_EXPLANATIONS[errorType] || null;
}
