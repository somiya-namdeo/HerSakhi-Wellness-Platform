"""
ml/symptom_analyzer.py
-----------------------
Analyses menstrual symptom patterns to surface trends, anomalies, and non-diagnostic risk flags.
"""

from typing import List, Dict, Tuple
from collections import Counter
import math

class SymptomAnalyzer:
    """
    Analyses symptom and wellness data from cycle logs.
    """

    def __init__(self, cycle_logs: List[Dict]):
        self.logs = cycle_logs
        
        # Flatten symptoms
        self._all_symptoms: List[str] = []
        self._pain_levels: List[int] = []
        self._moods: List[str] = []
        self._flow_intensities: List[str] = []
        
        for log in self.logs:
            # Symptoms
            symptoms = log.get("symptoms") or []
            if isinstance(symptoms, list):
                self._all_symptoms.extend([s.lower().strip() for s in symptoms])
            elif isinstance(symptoms, str):
                self._all_symptoms.extend([s.strip().lower() for s in symptoms.split(",") if s.strip()])
                
            # Pain
            try:
                pain = int(log.get("pain_level", 0))
                if pain > 0:
                    self._pain_levels.append(pain)
            except (ValueError, TypeError):
                pass
                
            # Mood
            mood = log.get("mood")
            if mood:
                self._moods.append(mood.lower().strip())
                
            # Flow
            flow = log.get("flow_intensity")
            if flow:
                self._flow_intensities.append(flow.lower().strip())

    def get_most_common_symptom(self) -> str:
        if not self._all_symptoms:
            return ""
        return Counter(self._all_symptoms).most_common(1)[0][0]

    def get_symptom_frequency(self) -> Dict[str, int]:
        return dict(Counter(self._all_symptoms))

    def get_average_pain_level(self) -> float:
        if not self._pain_levels:
            return 0.0
        return sum(self._pain_levels) / len(self._pain_levels)

    def get_high_pain_days_count(self) -> int:
        return sum(1 for p in self._pain_levels if p >= 7)

    def get_mood_pattern(self) -> str:
        if not self._moods:
            return "Stable"
        most_common = Counter(self._moods).most_common(1)[0][0]
        return most_common.capitalize()

    def generate_risk_flags(self, cycle_regularity: str = "Regular") -> List[str]:
        """
        Generates non-diagnostic flags based on symptoms, pain, flow, and mood.
        """
        flags = []
        symptom_counts = self.get_symptom_frequency()
        
        # 1. Frequent high pain
        high_pain_days = self.get_high_pain_days_count()
        if high_pain_days >= 3:
            flags.append("Frequent high pain detected (3+ days of severity 7+)")
            
        # 2. Repeated fatigue
        fatigue_count = symptom_counts.get("fatigue", 0) + symptom_counts.get("exhaustion", 0)
        if fatigue_count >= 3:
            flags.append("Repeated fatigue reported across multiple logs")
            
        # 3. Heavy flow with high pain
        heavy_flow_count = sum(1 for f in self._flow_intensities if f in ["heavy", "very heavy"])
        if heavy_flow_count >= 2 and high_pain_days >= 2:
            flags.append("Heavy flow correlating with high pain levels")
            
        # 4. Recurring mood swings
        mood_swing_count = symptom_counts.get("mood swings", 0) + self._moods.count("anxious") + self._moods.count("sad")
        if mood_swing_count >= 3:
            flags.append("Recurring mood fluctuations or emotional stress detected")
            
        # 5. Irregular cycle pattern
        if cycle_regularity == "Irregular":
            flags.append("Irregular cycle pattern identified from historical data")
            
        return flags

    def get_full_analysis(self, cycle_regularity: str = "Regular") -> Dict:
        """
        Returns all analysis metrics in a structured dictionary.
        """
        return {
            "most_common_symptom": self.get_most_common_symptom(),
            "symptom_frequency": self.get_symptom_frequency(),
            "average_pain_level": round(self.get_average_pain_level(), 1),
            "high_pain_days_count": self.get_high_pain_days_count(),
            "mood_pattern": self.get_mood_pattern(),
            "risk_flags": self.generate_risk_flags(cycle_regularity)
        }
