# TOST Äquivalenztest (Two One-Sided Tests)

Ein umfassendes Python-Modul für statistische Äquivalenztests mit dem TOST-Verfahren.

## Übersicht

Dieses Modul implementiert den TOST (Two One-Sided Tests) Äquivalenztest für verschiedene Studiendesigns. Im Gegensatz zu klassischen Hypothesentests, die nach Unterschieden suchen, wird TOST verwendet, um zu zeigen, dass zwei Gruppen **äquivalent** sind (d.h. ihre Unterschiede innerhalb vordefinierter Grenzen liegen).

## Wann sollte TOST verwendet werden?

TOST ist besonders nützlich wenn:

- Sie zeigen möchten, dass zwei Behandlungen/Methoden **äquivalent** sind
- Sie nachweisen möchten, dass ein neues Produkt genauso gut ist wie das Original
- Sie Messungen vor und nach einer Intervention vergleichen möchten
- Sie zeigen möchten, dass ein Messwert innerhalb akzeptabler Grenzen liegt

### Beispiele aus der Praxis:

1. **Thermischer Komfort**: Vergleich zweier Klimatisierungssysteme
2. **Medizin**: Nachweis, dass ein Generikum äquivalent zum Original ist
3. **Qualitätskontrolle**: Prüfung, ob Messungen innerhalb der Toleranzgrenzen liegen
4. **Psychologie**: Vergleich von Testverfahren

## Installation

### Voraussetzungen

```bash
pip install -r requirements.txt
```

Benötigte Pakete:
- numpy
- scipy
- matplotlib (optional, für Visualisierungen)

## Verwendung

### 1. Unabhängige Stichproben

Vergleich zweier unabhängiger Gruppen:

```python
from tost_equivalence_test import tost_independent
import numpy as np

# Beispiel: Zwei Klimatisierungssysteme
system_a = np.array([22.0, 22.1, 21.9, 22.2, 21.8, 22.0])
system_b = np.array([22.1, 22.3, 22.0, 22.2, 21.9, 22.1])

# TOST mit Äquivalenzgrenzen von ±0.5°C
result = tost_independent(
    system_a, system_b,
    epsilon_lower=-0.5,
    epsilon_upper=0.5,
    alpha=0.05
)

print(result)
```

### 2. Gepaarte Stichproben

Vergleich von Messungen vor und nach einer Intervention:

```python
from tost_equivalence_test import tost_paired

# Beispiel: Temperatur vor und nach Renovierung
vorher = np.array([21.5, 21.8, 21.6, 21.7, 21.5])
nachher = np.array([21.6, 21.7, 21.5, 21.8, 21.6])

result = tost_paired(
    vorher, nachher,
    epsilon_lower=-0.3,
    epsilon_upper=0.3,
    alpha=0.05
)

print(result)
```

### 3. Eine Stichprobe gegen Referenzwert

Vergleich einer Stichprobe mit einem Sollwert:

```python
from tost_equivalence_test import tost_one_sample

# Beispiel: Prüfung gegen Sollwert
messungen = np.array([23.1, 23.0, 23.2, 22.9, 23.1])
sollwert = 23.0

result = tost_one_sample(
    messungen,
    mu=sollwert,
    epsilon_lower=-0.5,
    epsilon_upper=0.5,
    alpha=0.05
)

print(result)
```

## Interpretation der Ergebnisse

### Ausgabe des TOSTResult-Objekts:

```
TOST Äquivalenztest Ergebnisse
==================================================
Mittelwertdifferenz: 0.2000
90% Konfidenzintervall: [-0.1500, 0.5500]
Äquivalenzgrenzen: [-0.5000, 0.5000]

Unterer Test (H0: diff ≤ untere Grenze):
  t = 2.1234, p = 0.0234

Oberer Test (H0: diff ≥ obere Grenze):
  t = -1.2345, p = 0.1123

Äquivalenz p-Wert: 0.1123
Freiheitsgrade: 10

Ergebnis: NICHT ÄQUIVALENT (α = 0.05)
==================================================
```

### Wichtige Felder:

- **is_equivalent**: `True` wenn Äquivalenz nachgewiesen wurde
- **p_equivalence**: Der p-Wert für Äquivalenz (Maximum der beiden Tests)
- **mean_diff**: Beobachtete Mittelwertdifferenz
- **ci_lower, ci_upper**: Konfidenzintervall
- **equivalence_bounds**: Die definierten Äquivalenzgrenzen

### Entscheidungsregel:

✓ **ÄQUIVALENT** wenn:
- Beide p-Werte (p_lower und p_upper) < α
- Das Konfidenzintervall vollständig innerhalb der Äquivalenzgrenzen liegt

✗ **NICHT ÄQUIVALENT** wenn:
- Mindestens ein p-Wert ≥ α
- Das Konfidenzintervall die Äquivalenzgrenzen überschreitet

## Wahl der Äquivalenzgrenzen

Die Wahl der Äquivalenzgrenzen (ε) ist der wichtigste Schritt beim TOST!

### Methode 1: Absolute Grenzen

Basierend auf praktischer Relevanz:

```python
# Beispiel: Temperatur ±0.5°C ist praktisch irrelevant
epsilon_lower = -0.5
epsilon_upper = 0.5
```

### Methode 2: Cohen's d (Effektstärke)

Basierend auf standardisierter Effektstärke:

```python
from tost_equivalence_test import calculate_epsilon_cohen_d

# d = 0.2 (kleiner Effekt), d = 0.5 (mittlerer Effekt), d = 0.8 (großer Effekt)
pooled_std = 2.0
epsilon_lower, epsilon_upper = calculate_epsilon_cohen_d(d=0.5, pooled_std=pooled_std)
# Gibt (-1.0, 1.0) zurück
```

### Methode 3: Prozent der Standardabweichung

```python
# z.B. ±25% der Standardabweichung
std = np.std(data, ddof=1)
epsilon = 0.25 * std
epsilon_lower, epsilon_upper = -epsilon, epsilon
```

## Power-Analyse und Stichprobengröße

Berechnen Sie die benötigte Stichprobengröße:

```python
from tost_equivalence_test import calculate_power_tost

# Verschiedene Stichprobengrößen testen
for n in [20, 30, 50, 100]:
    power = calculate_power_tost(
        n1=n, n2=n,
        true_diff=0.0,  # Angenommene wahre Differenz
        epsilon_lower=-0.5,
        epsilon_upper=0.5,
        sigma=1.0,  # Erwartete Standardabweichung
        alpha=0.05
    )
    print(f"n={n}: Power={power:.3f}")
```

### Empfohlene Minimalpower: 0.80 (80%)

## Erweiterte Beispiele

Das Modul enthält umfangreiche Beispiele in `tost_examples.py`:

```bash
python tost_examples.py
```

Diese umfassen:
- Vergleich von Klimatisierungssystemen
- Vorher-Nachher-Analysen
- Sollwert-Vergleiche
- Power-Analysen
- Visualisierungen
- Verwendung von Cohen's d

## API-Referenz

### `tost_independent(group1, group2, epsilon_lower, epsilon_upper, alpha=0.05, equal_var=True)`

**Parameter:**
- `group1`: Array der ersten Gruppe
- `group2`: Array der zweiten Gruppe
- `epsilon_lower`: Untere Äquivalenzgrenze (≤ 0)
- `epsilon_upper`: Obere Äquivalenzgrenze (≥ 0)
- `alpha`: Signifikanzniveau (Standard: 0.05)
- `equal_var`: Annahme gleicher Varianzen (Standard: True)

**Returns:** `TOSTResult` Objekt

---

### `tost_paired(group1, group2, epsilon_lower, epsilon_upper, alpha=0.05)`

**Parameter:**
- `group1`: Array der ersten Gruppe
- `group2`: Array der zweiten Gruppe (gleiche Länge)
- `epsilon_lower`: Untere Äquivalenzgrenze
- `epsilon_upper`: Obere Äquivalenzgrenze
- `alpha`: Signifikanzniveau (Standard: 0.05)

**Returns:** `TOSTResult` Objekt

---

### `tost_one_sample(sample, mu, epsilon_lower, epsilon_upper, alpha=0.05)`

**Parameter:**
- `sample`: Array der Stichprobendaten
- `mu`: Referenzwert
- `epsilon_lower`: Untere Äquivalenzgrenze
- `epsilon_upper`: Obere Äquivalenzgrenze
- `alpha`: Signifikanzniveau (Standard: 0.05)

**Returns:** `TOSTResult` Objekt

---

### `calculate_epsilon_cohen_d(d, pooled_std)`

Berechnet Äquivalenzgrenzen basierend auf Cohen's d.

**Parameter:**
- `d`: Cohen's d Effektstärke
- `pooled_std`: Gepoolte Standardabweichung

**Returns:** Tuple `(epsilon_lower, epsilon_upper)`

---

### `calculate_power_tost(n1, n2, true_diff, epsilon_lower, epsilon_upper, sigma, alpha=0.05)`

Berechnet die statistische Power.

**Parameter:**
- `n1`: Stichprobengröße Gruppe 1
- `n2`: Stichprobengröße Gruppe 2
- `true_diff`: Angenommene wahre Differenz
- `epsilon_lower`: Untere Äquivalenzgrenze
- `epsilon_upper`: Obere Äquivalenzgrenze
- `sigma`: Standardabweichung
- `alpha`: Signifikanzniveau

**Returns:** Power (0 bis 1)

## Theoretischer Hintergrund

### TOST Prinzip

TOST besteht aus zwei simultanen Einseitigen Tests:

1. **Unterer Test**: H₀: μ₁ - μ₂ ≤ ε_lower vs. H₁: μ₁ - μ₂ > ε_lower
2. **Oberer Test**: H₀: μ₁ - μ₂ ≥ ε_upper vs. H₁: μ₁ - μ₂ < ε_upper

Äquivalenz wird nachgewiesen, wenn **beide** Nullhypothesen verworfen werden.

### Konfidenzintervall-Ansatz

Äquivalent: Das (1-2α)×100% Konfidenzintervall liegt vollständig innerhalb [ε_lower, ε_upper].

Für α = 0.05 → 90% Konfidenzintervall

### TOST vs. Klassischer t-Test

| Klassischer t-Test | TOST |
|-------------------|------|
| H₀: μ₁ = μ₂ | H₀: μ₁ - μ₂ ≤ ε_lower **oder** μ₁ - μ₂ ≥ ε_upper |
| H₁: μ₁ ≠ μ₂ | H₁: ε_lower < μ₁ - μ₂ < ε_upper |
| Sucht nach Unterschieden | Sucht nach Äquivalenz |
| p < α → signifikanter Unterschied | p < α → signifikante Äquivalenz |

## Häufige Fehler

❌ **FALSCH**: Nicht-signifikanter t-Test = Äquivalenz
- Ein p-Wert > 0.05 bedeutet nur "kein Beweis für einen Unterschied"
- Es ist KEIN Beweis für Äquivalenz!

✅ **RICHTIG**: TOST verwenden um Äquivalenz nachzuweisen

---

❌ **FALSCH**: Zu große Äquivalenzgrenzen wählen
- Wenn ε zu groß ist, wird fast alles als äquivalent nachgewiesen

✅ **RICHTIG**: Äquivalenzgrenzen basierend auf praktischer Relevanz wählen

---

❌ **FALSCH**: Zu kleine Stichprobengröße
- TOST braucht ausreichend Power

✅ **RICHTIG**: Power-Analyse durchführen

## Referenzen

1. Schuirmann, D. J. (1987). A comparison of the two one-sided tests procedure and the power approach for assessing the equivalence of average bioavailability. *Journal of Pharmacokinetics and Biopharmaceutics*, 15(6), 657-680.

2. Lakens, D. (2017). Equivalence Tests: A Practical Primer for t Tests, Correlations, and Meta-Analyses. *Social Psychological and Personality Science*, 8(4), 355-362.

3. Walker, E., & Nowacki, A. S. (2011). Understanding equivalence and noninferiority testing. *Journal of General Internal Medicine*, 26(2), 192-196.

## Lizenz

MIT License

## Autor

Erstellt mit Claude Code
