"""
TOST Äquivalenztest - Erweiterte Beispiele
===========================================

Dieses Skript zeigt verschiedene Anwendungsfälle für den TOST-Test,
insbesondere im Kontext von thermischem Komfort und Temperaturmessungen.
"""

import numpy as np
import matplotlib.pyplot as plt
from tost_equivalence_test import (
    tost_independent,
    tost_paired,
    tost_one_sample,
    calculate_epsilon_cohen_d,
    calculate_power_tost
)


def beispiel_thermischer_komfort():
    """
    Beispiel: Vergleich von zwei Klimatisierungssystemen

    Wir möchten zeigen, dass zwei verschiedene Klimatisierungssysteme
    äquivalente Raumtemperaturen erzeugen (innerhalb von ±0.5°C).
    """
    print("\n" + "="*70)
    print("BEISPIEL: Vergleich von Klimatisierungssystemen")
    print("="*70)

    # Simulierte Temperaturmessungen (in °C) für zwei Systeme
    np.random.seed(123)
    system_a = np.random.normal(22.0, 0.8, 50)  # 50 Messungen, Mittelwert 22°C
    system_b = np.random.normal(22.2, 0.9, 50)  # 50 Messungen, Mittelwert 22.2°C

    print(f"\nSystem A: Mittelwert = {np.mean(system_a):.2f}°C, SD = {np.std(system_a, ddof=1):.2f}°C")
    print(f"System B: Mittelwert = {np.mean(system_b):.2f}°C, SD = {np.std(system_b, ddof=1):.2f}°C")

    # TOST mit Äquivalenzgrenzen von ±0.5°C
    result = tost_independent(
        system_a, system_b,
        epsilon_lower=-0.5,
        epsilon_upper=0.5,
        alpha=0.05
    )

    print(result)

    if result.is_equivalent:
        print("✓ Die Systeme sind statistisch äquivalent!")
    else:
        print("✗ Äquivalenz konnte nicht nachgewiesen werden.")

    return result


def beispiel_vorher_nachher_temperatur():
    """
    Beispiel: Vorher-Nachher Vergleich nach Renovierung

    Nach einer Renovierung möchten wir zeigen, dass die Raumtemperatur
    im Wesentlichen gleich geblieben ist (innerhalb von ±0.3°C).
    """
    print("\n" + "="*70)
    print("BEISPIEL: Vorher-Nachher Vergleich (Gepaarte Daten)")
    print("="*70)

    # Simulierte Messungen in verschiedenen Räumen vor und nach Renovierung
    np.random.seed(456)
    raeume = 20
    vorher = np.random.normal(21.5, 1.0, raeume)
    # Nachher: leicht verändert, aber im Wesentlichen gleich
    nachher = vorher + np.random.normal(0.1, 0.3, raeume)

    print(f"\nVorher: Mittelwert = {np.mean(vorher):.2f}°C, SD = {np.std(vorher, ddof=1):.2f}°C")
    print(f"Nachher: Mittelwert = {np.mean(nachher):.2f}°C, SD = {np.std(nachher, ddof=1):.2f}°C")
    print(f"Differenz: Mittelwert = {np.mean(nachher - vorher):.2f}°C")

    # TOST für gepaarte Daten
    result = tost_paired(
        vorher, nachher,
        epsilon_lower=-0.3,
        epsilon_upper=0.3,
        alpha=0.05
    )

    print(result)

    if result.is_equivalent:
        print("✓ Die Temperaturen sind vor und nach der Renovierung äquivalent!")
    else:
        print("✗ Äquivalenz konnte nicht nachgewiesen werden.")

    return result


def beispiel_sollwert_vergleich():
    """
    Beispiel: Vergleich mit Sollwert

    Wir möchten zeigen, dass die gemessene Temperatur äquivalent zum
    Sollwert von 23°C ist (innerhalb von ±0.5°C).
    """
    print("\n" + "="*70)
    print("BEISPIEL: Vergleich mit Sollwert")
    print("="*70)

    # Simulierte Temperaturmessungen
    np.random.seed(789)
    sollwert = 23.0
    messungen = np.random.normal(23.1, 0.4, 30)

    print(f"\nSollwert: {sollwert}°C")
    print(f"Messungen: Mittelwert = {np.mean(messungen):.2f}°C, SD = {np.std(messungen, ddof=1):.2f}°C")

    # TOST für eine Stichprobe
    result = tost_one_sample(
        messungen,
        mu=sollwert,
        epsilon_lower=-0.5,
        epsilon_upper=0.5,
        alpha=0.05
    )

    print(result)

    if result.is_equivalent:
        print("✓ Die Temperatur ist äquivalent zum Sollwert!")
    else:
        print("✗ Äquivalenz konnte nicht nachgewiesen werden.")

    return result


def beispiel_power_analyse():
    """
    Beispiel: Power-Analyse für Studienplanung

    Wie viele Messungen benötigen wir, um Äquivalenz nachzuweisen?
    """
    print("\n" + "="*70)
    print("BEISPIEL: Power-Analyse")
    print("="*70)

    # Parameter
    epsilon = 0.5  # Äquivalenzgrenze
    sigma = 1.0    # Erwartete Standardabweichung
    true_diff = 0.0  # Angenommene wahre Differenz (perfekte Äquivalenz)
    alpha = 0.05

    # Verschiedene Stichprobengrößen testen
    sample_sizes = [10, 20, 30, 50, 100, 200]
    powers = []

    print(f"\nParameter:")
    print(f"  Äquivalenzgrenzen: ±{epsilon}°C")
    print(f"  Standardabweichung: {sigma}°C")
    print(f"  Wahre Differenz: {true_diff}°C")
    print(f"  Alpha: {alpha}")
    print(f"\nPower-Analyse:")
    print(f"{'n pro Gruppe':<15} {'Power':<10}")
    print("-" * 25)

    for n in sample_sizes:
        power = calculate_power_tost(
            n1=n, n2=n,
            true_diff=true_diff,
            epsilon_lower=-epsilon,
            epsilon_upper=epsilon,
            sigma=sigma,
            alpha=alpha
        )
        powers.append(power)
        print(f"{n:<15} {power:.4f}")

    # Empfehlung
    target_power = 0.80
    for i, (n, power) in enumerate(zip(sample_sizes, powers)):
        if power >= target_power:
            print(f"\n✓ Empfehlung: Mindestens {n} Messungen pro Gruppe für {target_power*100:.0f}% Power")
            break
    else:
        print(f"\n⚠ Mehr als {sample_sizes[-1]} Messungen pro Gruppe benötigt für {target_power*100:.0f}% Power")

    return sample_sizes, powers


def beispiel_cohens_d():
    """
    Beispiel: Verwendung von Cohen's d zur Bestimmung der Äquivalenzgrenzen

    Anstatt absolute Grenzen zu verwenden, können wir Äquivalenz basierend
    auf einer Effektstärke definieren (z.B. d = 0.5 für mittleren Effekt).
    """
    print("\n" + "="*70)
    print("BEISPIEL: Äquivalenzgrenzen basierend auf Cohen's d")
    print("="*70)

    # Simulierte Daten
    np.random.seed(321)
    group1 = np.random.normal(22.0, 2.0, 40)
    group2 = np.random.normal(22.3, 2.1, 40)

    # Gepoolte Standardabweichung berechnen
    n1, n2 = len(group1), len(group2)
    var1, var2 = np.var(group1, ddof=1), np.var(group2, ddof=1)
    pooled_std = np.sqrt(((n1-1)*var1 + (n2-1)*var2) / (n1+n2-2))

    # Äquivalenzgrenzen für kleine Effektstärke (d = 0.5)
    cohen_d = 0.5
    epsilon_lower, epsilon_upper = calculate_epsilon_cohen_d(cohen_d, pooled_std)

    print(f"\nGepoolte Standardabweichung: {pooled_std:.2f}°C")
    print(f"Cohen's d: {cohen_d}")
    print(f"Äquivalenzgrenzen: [{epsilon_lower:.2f}, {epsilon_upper:.2f}]°C")

    # TOST durchführen
    result = tost_independent(
        group1, group2,
        epsilon_lower=epsilon_lower,
        epsilon_upper=epsilon_upper,
        alpha=0.05
    )

    print(result)

    return result


def visualisierung_beispiel():
    """
    Visualisierung der TOST-Ergebnisse
    """
    print("\n" + "="*70)
    print("BEISPIEL: Visualisierung")
    print("="*70)

    try:
        # Simulierte Daten
        np.random.seed(42)
        group1 = np.random.normal(22.0, 1.5, 50)
        group2 = np.random.normal(22.3, 1.5, 50)

        # TOST durchführen
        epsilon = 1.0
        result = tost_independent(
            group1, group2,
            epsilon_lower=-epsilon,
            epsilon_upper=epsilon,
            alpha=0.05
        )

        # Visualisierung erstellen
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

        # Plot 1: Boxplots der beiden Gruppen
        ax1.boxplot([group1, group2], labels=['System A', 'System B'])
        ax1.set_ylabel('Temperatur (°C)')
        ax1.set_title('Temperaturverteilungen')
        ax1.grid(True, alpha=0.3)

        # Plot 2: Konfidenzintervall und Äquivalenzgrenzen
        ax2.axhline(y=0, color='black', linestyle='-', linewidth=0.5)
        ax2.axhline(y=epsilon, color='red', linestyle='--', linewidth=2, label='Obere Äquivalenzgrenze')
        ax2.axhline(y=-epsilon, color='red', linestyle='--', linewidth=2, label='Untere Äquivalenzgrenze')

        # Mittlere Differenz und Konfidenzintervall
        ax2.plot([1], [result.mean_diff], 'bo', markersize=10, label='Mittlere Differenz')
        ax2.errorbar([1], [result.mean_diff],
                    yerr=[[result.mean_diff - result.ci_lower],
                          [result.ci_upper - result.mean_diff]],
                    fmt='none', color='blue', capsize=10, linewidth=2,
                    label=f'{(1-result.alpha)*100:.0f}% Konfidenzintervall')

        ax2.set_xlim(0.5, 1.5)
        ax2.set_xticks([])
        ax2.set_ylabel('Temperaturdifferenz (°C)')
        ax2.set_title('TOST Äquivalenztest')
        ax2.legend()
        ax2.grid(True, alpha=0.3)

        # Äquivalenz-Status als Text
        status = "ÄQUIVALENT" if result.is_equivalent else "NICHT ÄQUIVALENT"
        color = "green" if result.is_equivalent else "red"
        ax2.text(1, result.ci_upper + 0.3, status,
                ha='center', fontsize=12, fontweight='bold', color=color)

        plt.tight_layout()
        plt.savefig('tost_visualization.png', dpi=150, bbox_inches='tight')
        print("\n✓ Visualisierung wurde als 'tost_visualization.png' gespeichert")

        # Optional: Plot anzeigen (auskommentieren wenn keine GUI verfügbar)
        # plt.show()

        plt.close()

    except Exception as e:
        print(f"\n⚠ Visualisierung konnte nicht erstellt werden: {e}")
        print("  (Matplotlib wird für die Visualisierung benötigt)")


def hauptprogramm():
    """
    Führt alle Beispiele aus
    """
    print("\n" + "="*70)
    print("TOST ÄQUIVALENZTEST - BEISPIELSAMMLUNG")
    print("="*70)
    print("\nDiese Beispiele demonstrieren verschiedene Anwendungsfälle")
    print("des TOST-Äquivalenztests im Kontext thermischer Komfortmessungen.")

    # Alle Beispiele ausführen
    beispiel_thermischer_komfort()
    beispiel_vorher_nachher_temperatur()
    beispiel_sollwert_vergleich()
    beispiel_power_analyse()
    beispiel_cohens_d()
    visualisierung_beispiel()

    print("\n" + "="*70)
    print("ALLE BEISPIELE ABGESCHLOSSEN")
    print("="*70)


if __name__ == "__main__":
    hauptprogramm()
