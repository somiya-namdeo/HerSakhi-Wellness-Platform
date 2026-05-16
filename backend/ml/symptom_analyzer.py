"""
ml/symptom_analyzer.py
-----------------------
Analyses menstrual symptom patterns to surface trends and anomalies.

Capabilities (planned):
  - Most frequent symptoms per cycle phase
  - Symptom severity trends over time
  - Anomaly detection for unusual symptom clusters

Usage:
    from ml.symptom_analyzer import SymptomAnalyzer

    analyzer = SymptomAnalyzer(symptom_logs)
    top_symptoms = analyzer.top_symptoms(n=5)
    trend        = analyzer.symptom_trend("cramps")
"""

from typing import List, Dict, Optional
from collections import Counter
import pandas as pd


class SymptomAnalyzer:
    """
    Analyses symptom data from cycle logs.

    Args:
        symptom_logs: List of dicts, each with keys:
                      'date' (str YYYY-MM-DD), 'symptoms' (List[str]),
                      'cycle_phase' (str, optional).
    """

    def __init__(self, symptom_logs: List[Dict]):
        self.logs = symptom_logs
        # Flatten all symptoms into a single list for frequency analysis
        self._all_symptoms: List[str] = [
            symptom
            for log in symptom_logs
            for symptom in log.get("symptoms", [])
        ]

    def top_symptoms(self, n: int = 5) -> List[str]:
        """Return the *n* most frequently reported symptoms."""
        counter = Counter(self._all_symptoms)
        return [symptom for symptom, _ in counter.most_common(n)]

    def symptom_frequency(self) -> Dict[str, int]:
        """Return a frequency map of all reported symptoms."""
        return dict(Counter(self._all_symptoms))

    def symptom_trend(self, symptom: str) -> str:
        """
        Determine whether a specific symptom is becoming more or less frequent.

        Returns:
            'increasing', 'decreasing', or 'stable'
        """
        # Split logs into first half and second half
        mid = len(self.logs) // 2
        first_half = sum(
            1 for log in self.logs[:mid] if symptom in log.get("symptoms", [])
        )
        second_half = sum(
            1 for log in self.logs[mid:] if symptom in log.get("symptoms", [])
        )

        if second_half > first_half:
            return "increasing"
        elif second_half < first_half:
            return "decreasing"
        return "stable"

    def phase_symptom_map(self) -> Dict[str, List[str]]:
        """
        Group symptoms by cycle phase (e.g. follicular, ovulatory, luteal, menstrual).

        Returns:
            dict mapping phase name → list of symptoms reported during that phase
        """
        phase_map: Dict[str, List[str]] = {}
        for log in self.logs:
            phase = log.get("cycle_phase", "unknown")
            symptoms = log.get("symptoms", [])
            phase_map.setdefault(phase, []).extend(symptoms)
        return phase_map
