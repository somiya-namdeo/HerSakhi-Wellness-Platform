"""
ml/cycle_predictor.py
----------------------
ML model for predicting the next menstrual cycle start date
and estimating the fertile / ovulation window.

Algorithm (initial):
  - Simple statistical model: mean + std of past cycle lengths
  - Future: train a time-series model (LSTM / Prophet) on anonymised data

Usage:
    from ml.cycle_predictor import CyclePredictor

    predictor = CyclePredictor(cycle_history)
    next_start = predictor.predict_next_start()
    ovulation  = predictor.predict_ovulation_window()
"""

from datetime import date, timedelta
from typing import List, Optional
import numpy as np


class CyclePredictor:
    """
    Predicts future cycle events based on historical cycle logs.

    Args:
        cycle_lengths: List of observed cycle lengths in days.
        last_period_start: Start date of the most recent period.
    """

    def __init__(self, cycle_lengths: List[int], last_period_start: date):
        self.cycle_lengths = np.array(cycle_lengths, dtype=float)
        self.last_period_start = last_period_start

    # ------------------------------------------------------------------
    # Core statistics
    # ------------------------------------------------------------------

    @property
    def mean_cycle_length(self) -> float:
        """Average cycle length across all logged cycles."""
        return float(np.mean(self.cycle_lengths)) if len(self.cycle_lengths) > 0 else 28.0

    @property
    def std_cycle_length(self) -> float:
        """Standard deviation of cycle lengths (measures regularity)."""
        return float(np.std(self.cycle_lengths)) if len(self.cycle_lengths) > 1 else 0.0

    # ------------------------------------------------------------------
    # Predictions
    # ------------------------------------------------------------------

    def predict_next_start(self) -> date:
        """
        Predict the next period start date.

        Returns:
            Estimated start date of the next period.
        """
        predicted_length = round(self.mean_cycle_length)
        return self.last_period_start + timedelta(days=predicted_length)

    def predict_ovulation_window(self) -> dict:
        """
        Estimate the ovulation day and fertile window.

        Ovulation typically occurs ~14 days before the next period.
        Fertile window spans 5 days before ovulation to 1 day after.

        Returns:
            dict with keys: ovulation_day, fertile_start, fertile_end
        """
        next_start = self.predict_next_start()
        ovulation_day = next_start - timedelta(days=14)
        return {
            "ovulation_day": ovulation_day,
            "fertile_start": ovulation_day - timedelta(days=5),
            "fertile_end": ovulation_day + timedelta(days=1),
        }

    def cycle_regularity_score(self) -> float:
        """
        Return a regularity score between 0 (irregular) and 1 (very regular).
        Based on the coefficient of variation of cycle lengths.
        """
        if self.mean_cycle_length == 0:
            return 0.0
        cv = self.std_cycle_length / self.mean_cycle_length
        # CV < 0.05 → highly regular; CV > 0.20 → irregular
        return max(0.0, 1.0 - (cv / 0.20))
