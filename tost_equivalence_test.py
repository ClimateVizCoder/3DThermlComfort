"""
TOST (Two One-Sided Tests) Äquivalenztest
==========================================

Dieses Modul implementiert den TOST-Äquivalenztest für statistische Analysen.
TOST wird verwendet, um zu zeigen, dass zwei Gruppen äquivalent sind,
anstatt nur zu zeigen, dass sie nicht signifikant unterschiedlich sind.

Author: Claude Code
License: MIT
"""

import numpy as np
from scipy import stats
from typing import Tuple, Optional, Dict
from dataclasses import dataclass


@dataclass
class TOSTResult:
    """
    Ergebnis des TOST Äquivalenztests

    Attributes:
        t_lower: t-Statistik für den unteren Test
        t_upper: t-Statistik für den oberen Test
        p_lower: p-Wert für den unteren Test
        p_upper: p-Wert für den oberen Test
        p_equivalence: p-Wert für Äquivalenz (Maximum der beiden p-Werte)
        degrees_of_freedom: Freiheitsgrade
        mean_diff: Mittelwertdifferenz
        ci_lower: Untere Grenze des Konfidenzintervalls
        ci_upper: Obere Grenze des Konfidenzintervalls
        equivalence_bounds: Tuple der Äquivalenzgrenzen (lower, upper)
        is_equivalent: Boolean, ob Äquivalenz nachgewiesen wurde
        alpha: Signifikanzniveau
    """
    t_lower: float
    t_upper: float
    p_lower: float
    p_upper: float
    p_equivalence: float
    degrees_of_freedom: float
    mean_diff: float
    ci_lower: float
    ci_upper: float
    equivalence_bounds: Tuple[float, float]
    is_equivalent: bool
    alpha: float

    def __str__(self) -> str:
        """Formatierte String-Darstellung der Ergebnisse"""
        result = f"""
TOST Äquivalenztest Ergebnisse
{'='*50}
Mittelwertdifferenz: {self.mean_diff:.4f}
{(1-self.alpha)*100:.0f}% Konfidenzintervall: [{self.ci_lower:.4f}, {self.ci_upper:.4f}]
Äquivalenzgrenzen: [{self.equivalence_bounds[0]:.4f}, {self.equivalence_bounds[1]:.4f}]

Unterer Test (H0: diff ≤ untere Grenze):
  t = {self.t_lower:.4f}, p = {self.p_lower:.4f}

Oberer Test (H0: diff ≥ obere Grenze):
  t = {self.t_upper:.4f}, p = {self.p_upper:.4f}

Äquivalenz p-Wert: {self.p_equivalence:.4f}
Freiheitsgrade: {self.degrees_of_freedom:.0f}

Ergebnis: {'ÄQUIVALENT' if self.is_equivalent else 'NICHT ÄQUIVALENT'} (α = {self.alpha})
{'='*50}
"""
        return result


def tost_independent(group1: np.ndarray,
                     group2: np.ndarray,
                     epsilon_lower: float,
                     epsilon_upper: float,
                     alpha: float = 0.05,
                     equal_var: bool = True) -> TOSTResult:
    """
    TOST für unabhängige Stichproben (Two-Sample TOST)

    Testet, ob die Differenz zwischen zwei unabhängigen Gruppen innerhalb
    der spezifizierten Äquivalenzgrenzen liegt.

    Args:
        group1: Array der ersten Gruppe
        group2: Array der zweiten Gruppe
        epsilon_lower: Untere Äquivalenzgrenze (negativ oder 0)
        epsilon_upper: Obere Äquivalenzgrenze (positiv oder 0)
        alpha: Signifikanzniveau (Standard: 0.05)
        equal_var: Annahme gleicher Varianzen (Standard: True)

    Returns:
        TOSTResult Objekt mit allen Testergebnissen

    Beispiel:
        >>> gruppe1 = np.array([5.1, 5.3, 5.0, 5.2, 5.1])
        >>> gruppe2 = np.array([5.0, 5.2, 4.9, 5.1, 5.0])
        >>> result = tost_independent(gruppe1, gruppe2, -0.5, 0.5)
        >>> print(result)
    """
    group1 = np.asarray(group1)
    group2 = np.asarray(group2)

    # Statistiken berechnen
    n1, n2 = len(group1), len(group2)
    mean1, mean2 = np.mean(group1), np.mean(group2)
    var1, var2 = np.var(group1, ddof=1), np.var(group2, ddof=1)
    mean_diff = mean1 - mean2

    # Standardfehler berechnen
    if equal_var:
        # Pooled variance
        df = n1 + n2 - 2
        pooled_var = ((n1 - 1) * var1 + (n2 - 1) * var2) / df
        se = np.sqrt(pooled_var * (1/n1 + 1/n2))
    else:
        # Welch's t-test approach
        se = np.sqrt(var1/n1 + var2/n2)
        # Welch-Satterthwaite degrees of freedom
        df = (var1/n1 + var2/n2)**2 / ((var1/n1)**2/(n1-1) + (var2/n2)**2/(n2-1))

    # TOST durchführen
    # Unterer Test: H0: mean_diff <= epsilon_lower, H1: mean_diff > epsilon_lower
    t_lower = (mean_diff - epsilon_lower) / se
    p_lower = 1 - stats.t.cdf(t_lower, df)

    # Oberer Test: H0: mean_diff >= epsilon_upper, H1: mean_diff < epsilon_upper
    t_upper = (mean_diff - epsilon_upper) / se
    p_upper = stats.t.cdf(t_upper, df)

    # Äquivalenz p-Wert ist das Maximum der beiden p-Werte
    p_equivalence = max(p_lower, p_upper)

    # Konfidenzintervall (1-2*alpha für TOST)
    t_crit = stats.t.ppf(1 - alpha, df)
    ci_lower = mean_diff - t_crit * se
    ci_upper = mean_diff + t_crit * se

    # Äquivalenz wird nachgewiesen, wenn beide p-Werte < alpha sind
    is_equivalent = p_equivalence < alpha

    return TOSTResult(
        t_lower=t_lower,
        t_upper=t_upper,
        p_lower=p_lower,
        p_upper=p_upper,
        p_equivalence=p_equivalence,
        degrees_of_freedom=df,
        mean_diff=mean_diff,
        ci_lower=ci_lower,
        ci_upper=ci_upper,
        equivalence_bounds=(epsilon_lower, epsilon_upper),
        is_equivalent=is_equivalent,
        alpha=alpha
    )


def tost_paired(group1: np.ndarray,
                group2: np.ndarray,
                epsilon_lower: float,
                epsilon_upper: float,
                alpha: float = 0.05) -> TOSTResult:
    """
    TOST für gepaarte Stichproben (Paired TOST)

    Testet, ob die Differenz zwischen zwei gepaarten Gruppen innerhalb
    der spezifizierten Äquivalenzgrenzen liegt.

    Args:
        group1: Array der ersten Gruppe
        group2: Array der zweiten Gruppe (gleiche Länge wie group1)
        epsilon_lower: Untere Äquivalenzgrenze (negativ oder 0)
        epsilon_upper: Obere Äquivalenzgrenze (positiv oder 0)
        alpha: Signifikanzniveau (Standard: 0.05)

    Returns:
        TOSTResult Objekt mit allen Testergebnissen

    Beispiel:
        >>> vorher = np.array([20.5, 21.0, 20.8, 21.2, 20.9])
        >>> nachher = np.array([20.4, 20.9, 20.7, 21.1, 20.8])
        >>> result = tost_paired(vorher, nachher, -0.5, 0.5)
        >>> print(result)
    """
    group1 = np.asarray(group1)
    group2 = np.asarray(group2)

    if len(group1) != len(group2):
        raise ValueError("Gepaarte Stichproben müssen die gleiche Länge haben")

    # Differenzen berechnen
    differences = group1 - group2
    n = len(differences)
    mean_diff = np.mean(differences)
    std_diff = np.std(differences, ddof=1)
    se = std_diff / np.sqrt(n)
    df = n - 1

    # TOST durchführen
    # Unterer Test: H0: mean_diff <= epsilon_lower, H1: mean_diff > epsilon_lower
    t_lower = (mean_diff - epsilon_lower) / se
    p_lower = 1 - stats.t.cdf(t_lower, df)

    # Oberer Test: H0: mean_diff >= epsilon_upper, H1: mean_diff < epsilon_upper
    t_upper = (mean_diff - epsilon_upper) / se
    p_upper = stats.t.cdf(t_upper, df)

    # Äquivalenz p-Wert ist das Maximum der beiden p-Werte
    p_equivalence = max(p_lower, p_upper)

    # Konfidenzintervall (1-2*alpha für TOST)
    t_crit = stats.t.ppf(1 - alpha, df)
    ci_lower = mean_diff - t_crit * se
    ci_upper = mean_diff + t_crit * se

    # Äquivalenz wird nachgewiesen, wenn beide p-Werte < alpha sind
    is_equivalent = p_equivalence < alpha

    return TOSTResult(
        t_lower=t_lower,
        t_upper=t_upper,
        p_lower=p_lower,
        p_upper=p_upper,
        p_equivalence=p_equivalence,
        degrees_of_freedom=df,
        mean_diff=mean_diff,
        ci_lower=ci_lower,
        ci_upper=ci_upper,
        equivalence_bounds=(epsilon_lower, epsilon_upper),
        is_equivalent=is_equivalent,
        alpha=alpha
    )


def tost_one_sample(sample: np.ndarray,
                    mu: float,
                    epsilon_lower: float,
                    epsilon_upper: float,
                    alpha: float = 0.05) -> TOSTResult:
    """
    TOST für eine Stichprobe gegen einen Referenzwert

    Testet, ob die Differenz zwischen dem Stichprobenmittelwert und einem
    Referenzwert innerhalb der spezifizierten Äquivalenzgrenzen liegt.

    Args:
        sample: Array der Stichprobendaten
        mu: Referenzwert (Populationsmittelwert)
        epsilon_lower: Untere Äquivalenzgrenze (negativ oder 0)
        epsilon_upper: Obere Äquivalenzgrenze (positiv oder 0)
        alpha: Signifikanzniveau (Standard: 0.05)

    Returns:
        TOSTResult Objekt mit allen Testergebnissen

    Beispiel:
        >>> daten = np.array([98.6, 98.8, 98.4, 98.7, 98.5])
        >>> result = tost_one_sample(daten, mu=98.6, epsilon_lower=-0.5, epsilon_upper=0.5)
        >>> print(result)
    """
    sample = np.asarray(sample)

    # Statistiken berechnen
    n = len(sample)
    mean_sample = np.mean(sample)
    std_sample = np.std(sample, ddof=1)
    se = std_sample / np.sqrt(n)
    mean_diff = mean_sample - mu
    df = n - 1

    # TOST durchführen
    # Unterer Test: H0: (mean - mu) <= epsilon_lower, H1: (mean - mu) > epsilon_lower
    t_lower = (mean_diff - epsilon_lower) / se
    p_lower = 1 - stats.t.cdf(t_lower, df)

    # Oberer Test: H0: (mean - mu) >= epsilon_upper, H1: (mean - mu) < epsilon_upper
    t_upper = (mean_diff - epsilon_upper) / se
    p_upper = stats.t.cdf(t_upper, df)

    # Äquivalenz p-Wert ist das Maximum der beiden p-Werte
    p_equivalence = max(p_lower, p_upper)

    # Konfidenzintervall (1-2*alpha für TOST)
    t_crit = stats.t.ppf(1 - alpha, df)
    ci_lower = mean_diff - t_crit * se
    ci_upper = mean_diff + t_crit * se

    # Äquivalenz wird nachgewiesen, wenn beide p-Werte < alpha sind
    is_equivalent = p_equivalence < alpha

    return TOSTResult(
        t_lower=t_lower,
        t_upper=t_upper,
        p_lower=p_lower,
        p_upper=p_upper,
        p_equivalence=p_equivalence,
        degrees_of_freedom=df,
        mean_diff=mean_diff,
        ci_lower=ci_lower,
        ci_upper=ci_upper,
        equivalence_bounds=(epsilon_lower, epsilon_upper),
        is_equivalent=is_equivalent,
        alpha=alpha
    )


def calculate_epsilon_cohen_d(d: float, pooled_std: float) -> Tuple[float, float]:
    """
    Berechnet Äquivalenzgrenzen basierend auf Cohen's d

    Args:
        d: Cohen's d Effektstärke (z.B. 0.5 für mittleren Effekt)
        pooled_std: Gepoolte Standardabweichung

    Returns:
        Tuple (epsilon_lower, epsilon_upper)

    Beispiel:
        >>> epsilon_lower, epsilon_upper = calculate_epsilon_cohen_d(0.5, 10.0)
        >>> # Gibt (-5.0, 5.0) zurück
    """
    epsilon = d * pooled_std
    return (-epsilon, epsilon)


def calculate_power_tost(n1: int,
                        n2: int,
                        true_diff: float,
                        epsilon_lower: float,
                        epsilon_upper: float,
                        sigma: float,
                        alpha: float = 0.05) -> float:
    """
    Approximative Power-Berechnung für TOST

    Args:
        n1: Stichprobengröße Gruppe 1
        n2: Stichprobengröße Gruppe 2
        true_diff: Wahre Mittelwertdifferenz
        epsilon_lower: Untere Äquivalenzgrenze
        epsilon_upper: Obere Äquivalenzgrenze
        sigma: Standardabweichung
        alpha: Signifikanzniveau

    Returns:
        Geschätzte Power (0 bis 1)
    """
    se = sigma * np.sqrt(1/n1 + 1/n2)
    df = n1 + n2 - 2
    t_crit = stats.t.ppf(1 - alpha, df)

    # Noncentrality parameters
    ncp_lower = (true_diff - epsilon_lower) / se
    ncp_upper = (epsilon_upper - true_diff) / se

    # Power für beide Tests
    power_lower = 1 - stats.nct.cdf(t_crit, df, ncp_lower)
    power_upper = stats.nct.cdf(-t_crit, df, ncp_upper)

    # Gesamtpower ist das Minimum der beiden
    return min(power_lower, power_upper)


if __name__ == "__main__":
    # Beispiel 1: Unabhängige Stichproben
    print("=" * 60)
    print("Beispiel 1: Unabhängige Stichproben")
    print("=" * 60)

    np.random.seed(42)
    group1 = np.random.normal(20, 2, 30)
    group2 = np.random.normal(20.3, 2, 30)

    result = tost_independent(group1, group2,
                             epsilon_lower=-1.0,
                             epsilon_upper=1.0,
                             alpha=0.05)
    print(result)

    # Beispiel 2: Gepaarte Stichproben
    print("\n" + "=" * 60)
    print("Beispiel 2: Gepaarte Stichproben")
    print("=" * 60)

    vorher = np.array([23.5, 24.1, 23.8, 24.0, 23.7, 24.2, 23.9])
    nachher = np.array([23.4, 24.0, 23.6, 23.9, 23.6, 24.1, 23.8])

    result = tost_paired(vorher, nachher,
                        epsilon_lower=-0.5,
                        epsilon_upper=0.5,
                        alpha=0.05)
    print(result)

    # Beispiel 3: Eine Stichprobe
    print("\n" + "=" * 60)
    print("Beispiel 3: Eine Stichprobe gegen Referenzwert")
    print("=" * 60)

    sample = np.array([21.2, 21.5, 21.1, 21.4, 21.3, 21.6, 21.2])
    result = tost_one_sample(sample, mu=21.0,
                            epsilon_lower=-0.5,
                            epsilon_upper=0.5,
                            alpha=0.05)
    print(result)

    # Beispiel 4: Power-Berechnung
    print("\n" + "=" * 60)
    print("Beispiel 4: Power-Berechnung")
    print("=" * 60)

    power = calculate_power_tost(n1=30, n2=30,
                                true_diff=0.0,
                                epsilon_lower=-1.0,
                                epsilon_upper=1.0,
                                sigma=2.0,
                                alpha=0.05)
    print(f"Geschätzte Power für TOST: {power:.4f}")
