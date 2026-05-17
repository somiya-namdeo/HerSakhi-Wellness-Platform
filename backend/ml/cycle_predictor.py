"""
ml/cycle_predictor.py
----------------------
ML-ready statistical model for predicting the next menstrual cycle start date
and estimating the fertile / ovulation window based on historical data.
"""

from datetime import date, datetime, timedelta
from typing import List, Dict, Tuple
import math

class CyclePredictor:
    """
    Predicts future cycle events based on onboarding data and historical cycle logs.
    """

    def __init__(self, cycle_logs: List[Dict], onboarding_data: Dict):
        self.cycle_logs = cycle_logs
        self.onboarding_data = onboarding_data
        
        self.period_starts = self._detect_period_starts()
        self.cycle_lengths = self._calculate_cycle_lengths()
        
        # Last period start fallback chain:
        # 1. Last detected period from logs
        # 2. Onboarding last_period_date
        # 3. Today (fallback)
        self.last_period_start = self._determine_last_period_start()

    # Symptom keywords that indicate menstruation
    MENSTRUAL_SYMPTOMS = {"cramps", "bloating", "heavy flow", "spotting", "period pain"}

    def _detect_period_starts(self) -> List[date]:
        """
        Extracts valid period start dates from cycle_logs.
        Groups consecutive logs (gap <= 2 days) into a single period event.
        Detects period logs via flow_intensity OR menstrual symptoms.
        Returns a chronologically sorted list of period start dates.
        Also populates self.period_lengths and self.period_events (start, end, length).
        """
        flow_logs = []
        for log in self.cycle_logs:
            is_period_log = False

            # Condition 1: flow_intensity is set
            if log.get("flow_intensity"):
                is_period_log = True

            # Condition 2: symptoms contain menstrual indicators
            if not is_period_log:
                symptoms = log.get("symptoms") or []
                if isinstance(symptoms, str):
                    # Handle comma-separated string if needed
                    symptoms = [s.strip().lower() for s in symptoms.split(",")]
                elif isinstance(symptoms, list):
                    symptoms = [str(s).lower() for s in symptoms]
                if any(s in self.MENSTRUAL_SYMPTOMS for s in symptoms):
                    is_period_log = True

            if is_period_log:
                try:
                    log_date = datetime.strptime(log["log_date"], "%Y-%m-%d").date()
                    flow_logs.append(log_date)
                except (ValueError, TypeError, KeyError):
                    continue

        if not flow_logs:
            self.period_lengths = []
            self.period_events = []
            return []

        # Sort chronologically and deduplicate
        flow_logs = sorted(set(flow_logs))

        # Group into period events using > 2 day gap as new cycle boundary
        period_events = []  # List of (start, end) tuples
        current_start = flow_logs[0]
        current_end = flow_logs[0]

        for current_day in flow_logs[1:]:
            gap = (current_day - current_end).days
            if gap <= 2:
                # Same period — extend end
                current_end = current_day
            else:
                # Gap > 2 days → new period cycle
                period_events.append((current_start, current_end))
                current_start = current_day
                current_end = current_day

        # Append the final period event
        period_events.append((current_start, current_end))

        self.period_events = period_events
        self.period_lengths = [(end - start).days + 1 for start, end in period_events]

        return [start for start, _ in period_events]


    def _calculate_cycle_lengths(self) -> List[int]:
        """
        Computes differences between consecutive period starts.
        """
        if len(self.period_starts) < 2:
            return []
            
        lengths = []
        for i in range(1, len(self.period_starts)):
            diff = (self.period_starts[i] - self.period_starts[i-1]).days
            # Filter out wildly improbable cycle lengths just in case of bad data
            if 15 <= diff <= 90:
                lengths.append(diff)
        return lengths

    def _determine_last_period_start(self) -> date:
        if self.period_starts:
            return self.period_starts[-1]
            
        onboarding_last = self.onboarding_data.get("last_period_date")
        if onboarding_last:
            try:
                return datetime.strptime(onboarding_last, "%Y-%m-%d").date()
            except (ValueError, TypeError):
                pass
                
        return date.today()

    def get_predicted_cycle_length(self) -> int:
        """
        Calculates the average cycle length from history.
        Fallbacks to onboarding average, then to 28.
        """
        if self.cycle_lengths:
            return int(round(sum(self.cycle_lengths) / len(self.cycle_lengths)))
            
        onboarding_avg = self.onboarding_data.get("average_cycle_length")
        if onboarding_avg:
            try:
                return int(onboarding_avg)
            except (ValueError, TypeError):
                pass
                
        return 28

    def get_predicted_period_length(self) -> int:
        """
        Returns the most recent detected period length as the best estimate.
        If the detected length is < 2 (e.g. only a single log day), it is considered
        unreliable and we fall back to the default of 5 days.

        Note: The onboarding schema does not capture period_duration, so we use
        5 as the medically standard default fallback.
        """
        if hasattr(self, 'period_lengths') and self.period_lengths:
            latest = int(self.period_lengths[-1])
            if latest >= 2:
                return latest
            # Single-day log is unreliable — fall through to default

        # Standard default: most cycles have a 4–7 day period
        return 5



    def analyze_regularity(self) -> Tuple[str, int]:
        """
        Analyzes the variation in cycle lengths.
        Returns a tuple of (regularity_string, regularity_score).
        """
        if len(self.cycle_lengths) < 2:
            # Need at least 3 periods (2 cycle lengths) to measure variation
            return "Analyzing historical logs...", 80
            
        min_len = min(self.cycle_lengths)
        max_len = max(self.cycle_lengths)
        variation = max_len - min_len
        
        if variation <= 3:
            return "Regular", 95
        elif variation <= 7:
            return "Slightly Irregular", 75
        else:
            return "Irregular", 50

    def calculate_confidence(self, regularity_string: str) -> int:
        """
        Generates a confidence score based on the amount of historical data.
        """
        num_cycles = len(self.cycle_lengths)
        
        if num_cycles == 0:
            return 70  # Only 1 period start or onboarding data
        elif num_cycles in [1, 2]:
            return 80  # 2-3 periods (1-2 cycle lengths)
            
        # 4+ periods (3+ cycle lengths)
        if regularity_string == "Regular":
            return 95
        elif regularity_string == "Slightly Irregular":
            return 85
        else:
            return 75

    def generate_prediction_metrics(self) -> Dict:
        """
        Calculates all prediction metrics required by the service.
        """
        predicted_cycle_length = self.get_predicted_cycle_length()
        period_length = self.get_predicted_period_length()

        # Next period starts from the last known period start + predicted cycle length
        next_period_date = self.last_period_start + timedelta(days=predicted_cycle_length)

        # Predicted next period's start and end based on period_length
        period_start = next_period_date
        period_end = next_period_date + timedelta(days=period_length - 1)

        ovulation_date = next_period_date - timedelta(days=14)
        fertile_window_start = ovulation_date - timedelta(days=5)
        fertile_window_end = ovulation_date + timedelta(days=1)

        # Regularity and confidence
        cycle_regularity, regularity_score = self.analyze_regularity()
        confidence_score = self.calculate_confidence(cycle_regularity)

        return {
            "predicted_cycle_length": predicted_cycle_length,
            "period_length": period_length,
            "next_period_date": next_period_date,
            "period_start": period_start,
            "period_end": period_end,
            "ovulation_date": ovulation_date,
            "fertile_window_start": fertile_window_start,
            "fertile_window_end": fertile_window_end,
            "cycle_regularity": cycle_regularity,
            "regularity_score": regularity_score,
            "confidence_score": confidence_score
        }

