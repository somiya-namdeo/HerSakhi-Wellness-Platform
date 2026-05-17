"""
ml/recommendation_engine.py
----------------------------
Generates personalised wellness recommendations based on cycle phase,
symptom history, mood, and pain levels.
"""

from typing import List, Dict

# ---------------------------------------------------------------------------
# Phase-specific knowledge base
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
    "cramps": "Heat therapy, gentle stretching, and hydration can alleviate cramps.",
    "headache": "Stay hydrated and try peppermint oil on your temples.",
    "fatigue": "Prioritize rest, eat iron-rich foods, and aim for adequate sleep.",
    "bloating": "Avoid carbonated drinks and eat smaller, more frequent meals.",
    "mood swings": "Journaling, breathwork, and complex carbs can help stabilize mood swings.",
    "acne": "Reduce dairy intake and increase zinc-rich foods.",
    "breast tenderness": "Wear a supportive bra and reduce caffeine consumption.",
    "heavy flow": "Focus on hydration, iron-rich foods, and consistently tracking your bleeding.",
}


class RecommendationEngine:
    """
    Generates personalised wellness tips based on cycle phase, symptoms, mood, and pain.
    """

    def __init__(self, cycle_phase: str, top_symptoms: List[str] = None, 
                 mood_pattern: str = None, average_pain: float = 0.0, 
                 high_pain_days: int = 0, flow_intensities: List[str] = None):
        self.cycle_phase = cycle_phase.lower() if cycle_phase else "menstrual"
        self.top_symptoms = [s.lower() for s in (top_symptoms or [])]
        self.mood_pattern = mood_pattern.lower() if mood_pattern else ""
        self.average_pain = average_pain
        self.high_pain_days = high_pain_days
        self.flow_intensities = [f.lower() for f in (flow_intensities or [])]

    def get_structured_recommendations(self) -> List[str]:
        """
        Return a flattened list of personalized recommendation strings.
        """
        recommendations = []

        # 1. Symptom-based recommendations
        for symptom, tip in SYMPTOM_TIPS.items():
            if symptom in self.top_symptoms:
                recommendations.append(tip)
                
        # 2. Pain-based recommendations (Medically safe)
        if self.high_pain_days >= 2 or self.average_pain >= 7:
            recommendations.append("High pain levels detected. Please consult a doctor if pain is severe or recurrent.")
        elif self.average_pain >= 4:
            recommendations.append("Moderate pain detected. Over-the-counter pain relief and rest may help. Track to see if it persists.")

        # 3. Mood-based recommendations
        if self.mood_pattern in ["anxious", "sad", "stressed"]:
            recommendations.append("Noticeable emotional shifts. Consider mindfulness, light exercise, or talking to a friend.")

        # 4. Flow-based recommendations
        if any(f in ["heavy", "very heavy"] for f in self.flow_intensities):
            recommendations.append(SYMPTOM_TIPS["heavy flow"])
            
        # 5. Phase-based fallbacks if list is too short
        if len(recommendations) < 3:
            phase_base = PHASE_RECOMMENDATIONS.get(self.cycle_phase, PHASE_RECOMMENDATIONS["menstrual"])
            recommendations.extend(phase_base.get("nutrition", [])[:1])
            recommendations.extend(phase_base.get("mental_health", [])[:1])

        # Deduplicate while preserving order
        seen = set()
        unique_recs = []
        for rec in recommendations:
            if rec not in seen:
                unique_recs.append(rec)
                seen.add(rec)
                
        return unique_recs
