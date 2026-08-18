// Auto-generated jupyter notebook docs file
export interface DocCell {
  id: string;
  type: 'markdown' | 'code';
  content: string;
}

export interface DocChapter {
  id: string;
  filename: string;
  title: string;
  cells: DocCell[];
}

export const docChapters: DocChapter[] = [
  {
    "id": "0_________ipynb",
    "filename": "0. 변수_문자열.ipynb",
    "title": "변수_문자열",
    "cells": [
      {
        "id": "0_________ipynb_cell_0",
        "type": "markdown",
        "content": "# 복습하기\n\n## 1. Google Colab 단축키\n\n| 단축키 | 기능 |\n|---|---|\n| `Shift + Enter` | 셀 실행 후 다음 셀 이동 |\n| `Ctrl + Enter` | 현재 셀만 실행 |\n| `Alt + Enter` | 실행 후 아래에 새 셀 추가 |\n| `Ctrl + M` → `B` | 아래에 새 셀 추가 |\n| `Ctrl + M` → `A` | 위에 새 셀 추가 |\n| `Ctrl + M` → `D` | 현재 셀 삭제 |\n| `Ctrl + M` → `M` | 텍스트 셀로 변경 |\n| `Ctrl + M` → `Y` | 코드 셀로 변경 |\n\n> 가장 많이 사용하는 단축키는 `Shift + Enter`입니다.\n\n---\n\n## 2. 변수\n\n변수는 **값에 붙이는 이름**입니다.\n\n```python\nname = \"찬희\"\nage = 20\n\nprint(name)\nprint(age)\n```\n\n`=`는 같다는 뜻이 아니라 **오른쪽 값을 왼쪽 변수에 저장**한다는 뜻입니다.\n\n### 자료형\n\n| 자료형 | 의미 | 예시 |\n|---|---|---|\n| `int` | 정수 | `10` |\n| `float` | 실수 | `3.14` |\n| `str` | 문자열 | `\"Python\"` |\n| `bool` | 참/거짓 | `True`, `False` |\n\n```python\nage = 20\n\nprint(type(age))\n```\n\n파이썬은 저장하는 값에 따라 자료형이 자동으로 결정되는 **동적 자료형 언어**입니다.\n\n```python\nx = 10\nprint(type(x))\n\nx = \"Python\"\nprint(type(x))\n```\n\n---\n\n## 3. 변수 값 변경\n\n변수에는 새로운 값을 다시 저장할 수 있습니다.\n\n```python\nscore = 80\nscore = 90\n\nprint(score)\n```\n\n기존 값을 이용해서 변경할 수도 있습니다.\n\n```python\nscore = 90\nscore = score + 5\n\nprint(score)  # 95\n```\n\n---\n\n## 4. 문자열\n\n문자열은 **글자들의 묶음**이며 따옴표로 감싸서 만듭니다.\n\n```python\nname = \"Python\"\nmessage = \"안녕하세요\"\n\nprint(name)\nprint(message)\n```\n\n### 문자열 연결\n\n`+`를 사용하면 문자열을 이어 붙일 수 있습니다.\n\n```python\nfirst = \"Hello\"\nsecond = \"Python\"\n\nprint(first + \" \" + second)\n```\n\n문자열을 반복할 때는 `*`를 사용합니다.\n\n```python\nprint(\"파이팅! \" * 3)\n```\n\n---\n\n## 5. 인덱싱\n\n인덱싱은 문자열에서 **한 글자**를 가져오는 방법입니다.\n\n```python\nword = \"PYTHON\"\n\nprint(word[0])   # P\nprint(word[2])   # T\nprint(word[-1])  # N\n```\n\n- 첫 번째 글자는 `0`\n- 두 번째 글자는 `1`\n- `-1`은 마지막 글자\n\n```text\nP  Y  T  H  O  N\n0  1  2  3  4  5\n\n-6 -5 -4 -3 -2 -1\n```\n\n---\n\n## 6. 슬라이싱\n\n슬라이싱은 문자열에서 **여러 글자**를 범위로 가져오는 방법입니다.\n\n```python\nword = \"PYTHON\"\n\nprint(word[0:3])  # PYT\nprint(word[2:5])  # THO\nprint(word[:3])   # PYT\nprint(word[3:])   # HON\n```\n\n형식:\n\n```python\n문자열[시작:끝]\n```\n\n> 시작 위치는 포함하고, **끝 위치는 포함하지 않습니다.**\n\n예:\n\n```python\ntext = \"Python\"\n\nprint(text[0:3])  # Pyt\n```\n\n`0`, `1`, `2`번 글자까지만 가져옵니다.\n\n---\n\n## 7. 자주 사용하는 문자열 기능\n\n| 기능 | 사용법 |\n|---|---|\n| 글자 수 | `len(text)` |\n| 대문자 변경 | `text.upper()` |\n| 소문자 변경 | `text.lower()` |\n| 양쪽 공백 제거 | `text.strip()` |\n| 문자열 변경 | `text.replace()` |\n| 문자열 나누기 | `text.split()` |\n\n```python\ntext = \"  Python  \"\n\nprint(len(text))\nprint(text.strip())\nprint(text.upper())\nprint(text.lower())\n```\n\n---\n\n## 8. f-string\n\nf-string은 **문자열 안에 변수 값을 넣을 때** 사용합니다.\n\n```python\nname = \"찬희\"\nscore = 90\n\nprint(f\"{name}님의 점수는 {score}점입니다.\")\n```\n\n계산식도 넣을 수 있습니다.\n\n```python\nscore = 90\n\nprint(f\"10점 추가하면 {score + 10}점입니다.\")\n```\n\n---\n\n## 9. 빠른 복습 문제\n\n### 문제 1\n\n출력 결과는 무엇일까요?\n\n```python\nage = 20\nage = age + 1\n\nprint(age)\n```\n\n### 문제 2\n\n출력 결과는 무엇일까요?\n\n```python\nword = \"Python\"\n\nprint(word[0])\nprint(word[-1])\n```\n\n### 문제 3\n\n출력 결과는 무엇일까요?\n\n```python\nword = \"Python\"\n\nprint(word[0:3])\n```\n\n### 문제 4\n\n빈칸을 채워보세요.\n\n```python\nname = \"찬희\"\nscore = 95\n\nprint(____________________)\n```\n\n출력 결과:\n\n```text\n찬희님의 점수는 95점입니다.\n```\n\n---\n\n## 핵심 정리\n\n- 변수 = **값에 이름 붙이기**\n- `=` = **값 저장**\n- `type()` = **자료형 확인**\n- 문자열 = **따옴표로 감싼 글자**\n- 인덱싱 = **한 글자 가져오기**\n- 슬라이싱 = **여러 글자 가져오기**\n- 문자열의 첫 번째 위치 = `0`\n- `[시작:끝]`에서 **끝 번호는 포함하지 않음**\n- f-string = **문자열 안에 변수 넣기**\n- Colab 셀 실행 = `Shift + Enter`"
      }
    ]
  },
  {
    "id": "1_________ipynb",
    "filename": "1. 연산자 정리.ipynb",
    "title": "연산자 정리",
    "cells": [
      {
        "id": "1_________ipynb_cell_0",
        "type": "markdown",
        "content": "# 파이썬 연산자 정리\n\n## 1. 연산자란?\n\n연산자는 **값을 계산하거나, 비교하거나, 조건을 판단할 때 사용하는 기호**입니다.\n\n## 2. 산술 연산자\n\n| 연산자 | 의미 | 예시 | 결과 |\n|---|---|---|---:|\n| `+` | 더하기 | `3 + 2` | `5` |\n| `-` | 빼기 | `5 - 2` | `3` |\n| `*` | 곱하기 | `4 * 3` | `12` |\n| `/` | 나누기 | `10 / 2` | `5.0` |\n| `//` | 몫 | `10 // 3` | `3` |\n| `%` | 나머지 | `10 % 3` | `1` |\n| `**` | 거듭제곱 | `2 ** 3` | `8` |\n\n## 3. 비교 연산자\n\n| 연산자 | 의미 | 예시 | 결과 |\n|---|---|---|---|\n| `==` | 같다 | `3 == 3` | `True` |\n| `!=` | 다르다 | `3 != 2` | `True` |\n| `>` | 크다 | `5 > 3` | `True` |\n| `<` | 작다 | `2 < 4` | `True` |\n| `>=` | 크거나 같다 | `5 >= 5` | `True` |\n| `<=` | 작거나 같다 | `3 <= 2` | `False` |\n\n## 4. 논리 연산자\n\n- `and` : 둘 다 참일 때 참\n- `or` : 하나라도 참이면 참\n- `not` : 참과 거짓 반대로"
      }
    ]
  },
  {
    "id": "2_________ipynb",
    "filename": "2. 조건문 정리.ipynb",
    "title": "조건문 정리",
    "cells": [
      {
        "id": "2_________ipynb_cell_0",
        "type": "markdown",
        "content": "# 파이썬 조건문 정리\n\n## 1. if문 기본\n\n```python\nscore = 85\n\nif score >= 90:\n    print(\"A학점\")\nelif score >= 80:\n    print(\"B학점\")\nelse:\n    print(\"C학점\")\n```"
      }
    ]
  },
  {
    "id": "3_1_________ipynb",
    "filename": "3-1. 리스트 정리.ipynb",
    "title": "리스트 정리",
    "cells": [
      {
        "id": "3_1_________ipynb_cell_0",
        "type": "markdown",
        "content": "# 파이썬 리스트 정리\n\n```python\nfruits = [\"사과\", \"바나나\", \"포도\"]\nfruits.append(\"수박\")\nprint(fruits[0]) # 사과\nprint(len(fruits)) # 4\n```"
      }
    ]
  },
  {
    "id": "3_2________ipynb",
    "filename": "3-2. 튜플 정리.ipynb",
    "title": "튜플 정리",
    "cells": [
      {
        "id": "3_2________ipynb_cell_0",
        "type": "markdown",
        "content": "# 파이썬 튜플 정리\n\n```python\npoint = (3, 5)\nprint(point[0]) # 3\n```"
      }
    ]
  },
  {
    "id": "4_________ipynb",
    "filename": "4. 반복문 정리.ipynb",
    "title": "반복문 정리",
    "cells": [
      {
        "id": "4_________ipynb_cell_0",
        "type": "markdown",
        "content": "# 파이썬 반복문 정리\n\n```python\nfor i in range(1, 6):\n    print(i)\n\ncount = 0\nwhile count < 3:\n    print(\"반복 중\")\n    count += 1\n```"
      }
    ]
  },
  {
    "id": "5__________ipynb",
    "filename": "5. 딕셔너리 정리.ipynb",
    "title": "딕셔너리 정리",
    "cells": [
      {
        "id": "5__________ipynb_cell_0",
        "type": "markdown",
        "content": "# 파이썬 딕셔너리 정리\n\n```python\nstudent = {\"이름\": \"홍길동\", \"나이\": 20}\nstudent[\"학과\"] = \"인공지능\"\nprint(student[\"이름\"])\n```"
      }
    ]
  },
  {
    "id": "6________ipynb",
    "filename": "6. 함수 정리.ipynb",
    "title": "함수 정리",
    "cells": [
      {
        "id": "6________ipynb_cell_0",
        "type": "markdown",
        "content": "# 파이썬 함수 정리\n\n```python\ndef add(a, b):\n    return a + b\n\nprint(add(3, 5))\n```"
      }
    ]
  },
  {
    "id": "7_matplotlib_txt",
    "filename": "Matplotlib.txt",
    "title": "Matplotlib 시각화 기초",
    "cells": [
      {
        "id": "7_matplotlib_txt_cell_0",
        "type": "markdown",
        "content": "# 파이썬 Matplotlib 기초\n\n```python\nimport matplotlib.pyplot as plt\n\nx = [1, 2, 3, 4]\ny = [10, 20, 30, 40]\n\nplt.plot(x, y)\nplt.title(\"선 그래프 예제\")\nplt.show()\n```"
      }
    ]
  },
  {
    "id": "8_numpy_txt",
    "filename": "NumPy.txt",
    "title": "NumPy 수치계산 기초",
    "cells": [
      {
        "id": "8_numpy_txt_cell_0",
        "type": "markdown",
        "content": "# 파이썬 NumPy 기초\n\n```python\nimport numpy as np\n\narr = np.array([1, 2, 3, 4, 5])\nprint(arr + 10)\nprint(arr.mean())\n```"
      }
    ]
  },
  {
    "id": "9_pandas_txt",
    "filename": "Pandas.txt",
    "title": "Pandas 데이터분석 기초",
    "cells": [
      {
        "id": "9_pandas_txt_cell_0",
        "type": "markdown",
        "content": "# 파이썬 Pandas 기초\n\n```python\nimport pandas as pd\n\ndata = {\"이름\": [\"김철수\", \"이영희\"], \"점수\": [90, 85]}\ndf = pd.DataFrame(data)\nprint(df)\n```"
      }
    ]
  },
  {
    "id": "10_algorithm_patterns",
    "filename": "10. 알고리즘 패턴 총정리.ipynb",
    "title": "알고리즘 패턴 대백과",
    "cells": [
      {
        "id": "10_algorithm_patterns_cell_0",
        "type": "markdown",
        "content": "# 🚀 파이썬 코딩테스트 핵심 알고리즘 8가지 패턴 대백과\n\n알고리즘 문제 풀이에 꼭 필요한 **8가지 핵심 알고리즘 문제 유형과 파이썬 실전 풀이 코드** 총정리 가이드입니다.\n\n---\n\n## 1. 완전 탐색 & 콤비네이션 (Brute Force & Combinatorics)\n\n모든 가능한 경우의 수를 하나씩 탐색하는 방법입니다.\n\n### 💡 핵심 모듈: `itertools`\n- `permutations(arr, r)`: 순열 (순서 고려)\n- `combinations(arr, r)`: 조합 (순서 무관)\n\n```python\nimport itertools\n\ndata = ['A', 'B', 'C']\nprint(\"순열:\", list(itertools.permutations(data, 2)))\nprint(\"조합:\", list(itertools.combinations(data, 2)))\n```\n\n---\n\n## 2. 투 포인터 (Two Pointers) & 슬라이딩 윈도우\n\n1차원 배열에서 두 개의 인덱스(포인터)를 움직이며 조건에 맞는 구간을 탐색합니다. 시간 복잡도를 `O(N^2)`에서 `O(N)`으로 단축시킵니다.\n\n```python\ndef two_sum(arr, target):\n    left, right = 0, len(arr) - 1\n    while left < right:\n        current_sum = arr[left] + arr[right]\n        if current_sum == target:\n            return (arr[left], arr[right])\n        elif current_sum < target:\n            left += 1\n        else:\n            right -= 1\n    return None\n\nnumbers = [1, 3, 5, 7, 9, 11]\nprint(\"합이 12가 되는 쌍:\", two_sum(numbers, 12))\n```\n\n---\n\n## 3. 그리디 알고리즘 (Greedy)\n\n매 순간 가장 최선의 선택을 하여 전체 최적해를 구하는 탐욕법입니다.\n\n```python\ndef min_coins(change):\n    coins = [500, 100, 50, 10]\n    count = 0\n    for coin in coins:\n        count += change // coin\n        change %= coin\n    return count\n\nprint(\"1260원 거스름돈 동전 수:\", min_coins(1260))\n```\n\n---\n\n## 4. 이진 탐색 (Binary Search)\n\n정렬된 배열에서 탐색 범위를 절반씩 줄여가며 `O(log N)` 시간에 원하는 데이터를 찾습니다.\n\n```python\nimport bisect\n\narr = [10, 20, 30, 40, 50, 60, 70]\nidx = bisect.bisect_left(arr, 30)\nprint(\"30의 인덱스:\", idx)\n```\n\n---\n\n## 5. DFS & BFS (깊이 우선 / 너비 우선 탐색)\n\n그래프 및 2차원 미로 격자 탐색의 핵심입니다.\n- **DFS**: 한 경로를 끝까지 탐색 (재귀/스택)\n- **BFS**: 시작점에서 넓게 탐색하며 최단거리 탐색 (`collections.deque` 사용)\n\n```python\nfrom collections import deque\n\ndef bfs(graph, start):\n    visited = set([start])\n    queue = deque([start])\n    result = []\n    while queue:\n        node = queue.popleft()\n        result.append(node)\n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)\n    return result\n\ngraph = {'A': ['B', 'C'], 'B': ['A', 'D'], 'C': ['A'], 'D': ['B']}\nprint(\"BFS 순회:\", bfs(graph, 'A'))\n```\n\n---\n\n## 6. 동적 계획법 (Dynamic Programming / DP)\n\n작은 하위 문제 계산 결과를 메모아이제이션(Memoization) 테이블에 저장하여 중복 계산을 방지합니다.\n\n```python\ndef fibo_dp(n):\n    dp = [0] * (n + 1)\n    dp[1], dp[2] = 1, 1\n    for i in range(3, n + 1):\n        dp[i] = dp[i-1] + dp[i-2]\n    return dp[n]\n\nprint(\"피보나치 50번째 항:\", fibo_dp(50))\n```\n\n---\n\n## 7. 핵심 자료구조: 스택, 큐, 힙 (Heap)\n\n- **Stack**: `append()`, `pop()`\n- **Queue**: `collections.deque` (`popleft()`)\n- **Heap**: `import heapq` (`heappush()`, `heappop()`)\n\n```python\nimport heapq\n\nheap = []\nheapq.heappush(heap, 40)\nheapq.heappush(heap, 10)\nheapq.heappush(heap, 30)\nprint(\"최소 힙 최소값:\", heapq.heappop(heap))\n```\n\n---\n\n## 8. 파이썬 실전 다중 조건 정렬 (Custom Sorting)\n\n```python\nstudents = [(\"김철수\", 90, 85), (\"이영희\", 90, 95), (\"박민수\", 80, 100)]\nsorted_students = sorted(students, key=lambda x: (-x[1], -x[2]))\nprint(\"정렬 결과:\", sorted_students)\n```\n\n---\n\n## 💡 핵심 요약\n\n| 알고리즘 종류 | 주요 용도 | 파이썬 키워드 |\n|---|---|---|\n| 완전 탐색 | 경우의 수 검사 | `itertools` |\n| 투 포인터 | 연속 구간 탐색 | `left, right` |\n| 그리디 | 동전, 회의실 배정 | `sort()` |\n| 이진 탐색 | 대용량 검색 | `bisect` |\n| DFS / BFS | 그래프, 미로 최단거리 | `deque` |\n| DP | 피보나치, 배낭 문제 | `dp = [0] * (N + 1)` |\n| 힙 (Heap) | 우선순위 큐 | `heapq` |"
      }
    ]
  }
];
