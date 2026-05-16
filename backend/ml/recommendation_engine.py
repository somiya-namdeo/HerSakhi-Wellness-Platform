"""
ml/recommendation_engine.py
----------------------------
Generates personalised wellness recommendations based on cycle phase,
symptom history, and user preferences.

Recommendation categories:
  - Nutrition     : foods to eat/avoid per cycle phase
  - Exercise      : workout intensity suggestions
  - Sleep         : rest recommendations
  - Mental health : stress management and self-care tips

Usage:
    from ml.recommendation_engine import RecommendationEngine

    engine = RecommendationEngine(cycle_phase="luteal", top_symptoms=["cramps", "fatigue"])
    tips = engine.get_recommendations()
"""

from typing import List, Dict

# ---------------------------------------------------------------------------
# Phase-specific knowledge base (rule-based fallback)
# ---------------------------------------------------------------------------
PHASE_RECOMMENDATIONS: Dict[str, Dict[str, List[str]]] = {
    "menstrual": {
        "nutrition": [
            "Eat iron-rich foods like lentils, spinach, and tofu.",
            "Stay hydrated — aim for at least 2 litres of water.",
            "Warm ginger tea can help reduce cramping.",
        ],
        "exercise": [
            "Light yoga or stretching is ideal.",
            "Short walks can boost mood and reduce bloating.",
            "Avoid high-intensity training if energy is low.",
        ],
        "sleep": [
            "Prioritise 8–9 hours of sleep during your period.",
            "A heating pad before bed can ease discomfort.",
        ],
        "mental_health": [
            "Journaling can help process emotions during this phase.",
            "Be gentle with yourself — rest is productive.",
        ],
    },
    "follicular": {
        "nutrition": [
            "Focus on lean proteins and complex carbs for energy.",
            "Fermented foods support gut health and oestrogen metabolism.",
        ],
        "exercise": [
            "Great phase for high-intensity workouts and strength training.",
            "Try new activities — energy levels are climbing.",
        ],
        "sleep": [
            "Aim for 7–8 hours; your body is primed for activity.",
        ],
        "mental_health": [
            "Good time for planning and tackling creative projects.",
            "Social activities feel more natural — embrace connection.",
        ],
    },
    "ovulatory": {
        "nutrition": [
            "Eat antioxidant-rich foods to support egg health.",
            "Include zinc-rich foods: pumpkin seeds, chickpeas.",
        ],
        "exercise": [
            "Peak energy — great for cardio and team sports.",
        ],
        "sleep": [
            "Maintain consistent sleep to support hormone balance.",
        ],
        "mental_health": [
            "Communication and collaboration feel effortless now.",
            "Schedule important meetings or presentations.",
        ],
    },
    "luteal": {
        "nutrition": [
            "Magnesium-rich foods (dark chocolate, nuts) reduce PMS.",
            "Reduce caffeine and salt to minimise bloating.",
            "Complex carbs help stabilise mood and serotonin levels.",
        ],
        "exercise": [
            "Moderate exercise is beneficial — avoid overexertion.",
            "Pilates and swimming are gentle on a sensitive body.",
        ],
        "sleep": [
            "Progesterone may make you sleepier — honour that.",
            "Limit screen time before bed to improve sleep quality.",
        ],
        "mental_health": [
            "Introspection is natural in this phase — use it wisely.",
            "Limit decision-making when you feel overwhelmed.",
        ],
    },
}

# Symptom-specific additions
SYMPTOM_TIPS: Dict[str, str] = {
    "cramps": "Apply a warm compress to the lower abdomen for 15–20 minutes.",
    "headache": "Stay hydrated and try peppermint oil on your temples.",
    "fatigue": "Short 20-minute naps can restore energy without disrupting sleep.",
    "bloating": "Avoid carbonated drinks and eat smaller, more frequent meals.",
    "mood swings": "Breathwork (4-7-8 breathing) can quickly calm emotional surges.",
    "acne": "Reduce dairy intake and increase zinc-rich foods.",
    "breast tenderness": "Wear a supportive bra and reduce caffeine consumption.",
}


class RecommendationEngine:
    """
    Generates personalised wellness tips based on cycle phase and symptoms.

    Args:
        cycle_phase:   One of 'menstrual', 'follicular', 'ovulatory', 'luteal'.
        top_symptoms:  List of symptoms currently reported by the user.
    """

    def __init__(self, cycle_phase: str, top_symptoms: List[str] = None):
        self.cycle_phase = cycle_phase.lower() if cycle_phase else "menstrual"
        self.top_symptoms = top_symptoms or []

    def get_recommendations(self) -> Dict[str, List[str]]:
        """
        Return a dict of recommendations grouped by category.

        Includes phase-based tips + symptom-specific additions.
        """
        base = PHASE_RECOMMENDATIONS.get(
            self.cycle_phase, PHASE_RECOMMENDATIONS["menstrual"]
        )
        # Deep copy to avoid mutating the knowledge base
        recommendations = {k: list(v) for k, v in base.items()}

        # Append symptom-specific tips to the relevant category
        symptom_additions = [
            SYMPTOM_TIPS[symptom]
            for symptom in self.top_symptoms
            if symptom in SYMPTOM_TIPS
        ]
        if symptom_additions:
            recommendations.setdefault("symptom_care", []).extend(symptom_additions)

        return recommendations

    def get_flat_tips(self) -> List[str]:
        """Return all tips as a flat list (useful for AI prompt context)."""
        recs = self.get_recommendations()
        return [tip for tips in recs.values() for tip in tips]
