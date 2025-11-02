from typing import Tuple, List, Dict
from phonemizer import phonemize
import numpy as np
import string
import re
import logging


logger = logging.getLogger(__name__)
if not logger.handlers:
    handler = logging.FileHandler("./logs/phoneme_analyzer.log", encoding="utf-8")
    handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)


SUBSTITUTION_COSTS = {
    ('d', 't'): 0.35, ('t', 'd'): 0.35, # 'd' и 't' are very similar
    ('z', 's'): 0.45, ('s', 'z'): 0.45, # 'z' и 's' are similar
    ('a', 'a:'): 0.15, ('a:', 'a'): 0.15, # 'a' and 'a:' (á) - basically the same
    ('e', 'e:'): 0.15, ('e:', 'e'): 0.15,
    ('i', 'i:'): 0.15, ('i:', 'i'): 0.15,
    ('o', 'o:'): 0.15, ('o:', 'o'): 0.15,
    ('u', 'u:'): 0.15, ('u:', 'u'): 0.15,
}


class PhonemeService:
    def _phoneme_substitution_cost(self, p1: str, p2: str) -> float:
        if p1 == p2:
            return 0.0
        if p1 == "r" and p2 != "r":
            return 2.0
        
        cost = SUBSTITUTION_COSTS.get((p1, p2))

        return cost if cost is not None else 0.333
    
    def text_to_phonemas(self, text: str, lang: str = "sk") -> List[str]:
        if not text:
            return []
        
        text = text.lower().replace(" ", "")
        text = text.translate(str.maketrans("", "", string.punctuation))

        phoneme_str = phonemize(
            text, language=lang, backend="espeak", strip=True,
            preserve_punctuation=True, with_stress=False
        )

        phonemas = re.findall(r"(tʃ|dʒ|[aeiouyɪɛɔə][ː]?|ʃ|ʒ|ʇ|ɲ|ʎ|[bcdfghjklmnpqrstvwxz])", phoneme_str)
        return phonemas
    
    def calculate_phoneme_distance(self, ref_list: List[str], rec_list: List[str]) -> Tuple[float, List]:
        n, m = len(ref_list), len(rec_list)

        dp = np.zeros((n + 1, m + 1))
        ops = [[[] for _ in range(m + 1)] for _ in range(n + 1)]

        delete_cost: float = 1.2
        insert_cost: float = 1.2

        for i in range(n + 1):
            dp[i][0] = i * delete_cost
            if i > 0: ops[i][0] = ops[i - 1][0] + [("delete", ref_list[i - 1])]

        for j in range(m + 1):
            dp[0][j] = j * insert_cost
            if j > 0: ops[0][j] = ops[0][j - 1] + [("insert", rec_list[j - 1])]

        for i in range(1, n + 1):
            for j in range(1, m + 1):
                sub_cost = self._phoneme_substitution_cost(ref_list[i - 1], rec_list[j - 1])

                cost_del = dp[i - 1][j] + delete_cost
                cost_ins = dp[i][j - 1] + insert_cost
                cost_sub = dp[i - 1][j - 1] + sub_cost

                min_cost = min(cost_del, cost_ins, cost_sub)
                dp[i][j] = min_cost

                if min_cost == cost_sub:
                    op_type = "equal" if sub_cost == 0.0 else "substitute"
                    op_data = (ref_list[i - 1], rec_list[j - 1] if sub_cost > 0.0 else ref_list[i - 1])
                    ops[i][j] = ops[i - 1][j - 1] + [(op_type, op_data)]
                elif min_cost == cost_del:
                    ops[i][j] = ops[i - 1][j] + [("delete", ref_list[i - 1])]
                else:
                    ops[i][j] = ops[i][j - 1] + [("insert", rec_list[j - 1])]

        max_possible_cost: float = max(n * delete_cost, m * insert_cost)
        if max_possible_cost == 0:
            return 100.0, []
        
        total_cost: float = dp[n][m]
        similarity: float = 100 * (1 - (total_cost / max_possible_cost))

        return max(0.0, similarity), ops[n][m]
    
    def format_errors(self, operations: List[Tuple]) -> List[Dict]:
        errors: List[Dict] = []
        for op in operations:
            op_type, op_data = op
            if op_type == "substitute":
                errors.append({"type": "substitutions", "from": op_data[0], "to": op_data[1]})
            elif op_type == "delete":
                errors.append({"type": "deletion", "char": op_data})
            elif op_type == "insert":
                errors.append({"type": "insertion", "char": op_data})
        return errors
    

phoneme_service: PhonemeService = PhonemeService()