// Lightweight anti-cheat check derived directly from each problem's own
// constraints (the ones already shown on the problem screen) -- if a
// constraint names a specific technique (`for`, `len()`, ...) as required or
// forbidden, the submitted code is checked for it too, not just the printed
// output. Only covers problems whose constraints name an unambiguous code
// keyword/call -- most problems only constrain variable names or literal
// values, which this intentionally leaves unchecked.
export const requiredKeywords: Record<string, string[]> = {
  "basic_part2_q4": ["len("],
  "basic_part2_q8": ["upper("],
  "basic_part2_q9": ["replace("],
  "basic_part2_q10": ["split("],
  "basic_part3_q8": ["and"],
  "basic_part3_q9": ["or"],
  "basic_part3_q10": ["not"],
  "intermediate_part4_q1": ["if"],
  "intermediate_part4_q3": ["%", "else", "if"],
  "intermediate_part4_q6": ["elif", "else", "if"],
  "intermediate_part5_q5": ["append("],
  "intermediate_part5_q6": ["remove("],
  "intermediate_part5_q8": ["len("],
  "intermediate_part5_q9": ["sort("],
  "intermediate_part5_q10": ["in"],
  "intermediate_part6_q5": ["len("],
  "intermediate_part6_q6": ["in"],
  "advanced_part7_q1": ["range("],
  "advanced_part7_q2": ["for"],
  "advanced_part7_q3": ["for"],
  "advanced_part7_q5": ["for"],
  "advanced_part7_q6": ["range("],
  "advanced_part7_q8": ["%"],
  "advanced_part7_q10": ["for"],
  "advanced_part8_q3": ["return"],
  "advanced_part9_q5": ["del"],
  "advanced_part9_q6": ["keys("],
  "advanced_part9_q7": ["values("],
  "advanced_part9_q8": ["items("],
  "numpy_q1": ["np.array("],
  "lambda_q1": ["list("],
  "algorithm_q4": ["set(", "sorted("],
};

export const forbiddenKeywords: Record<string, string[]> = {
  "advanced_part7_q10": ["sum("],
  "algo_recursion_power": ["**"],
};
