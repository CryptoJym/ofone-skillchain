# Confidence Model

OfOne uses ordinal confidence with explicit basis. It avoids fake decimal precision.

Every strong claim and decision rendering should identify:

- provenance strength
- source independence
- recency
- mechanism fit
- contradiction load
- hidden-variable risk
- adversarial risk
- adapter fit

Confidence levels:

- `low`: weak evidence, high uncertainty, disputed dependency, or adapter mismatch.
- `medium`: plausible support with meaningful gaps or hidden-variable risk.
- `high`: strong provenance, clear mechanism fit, low contradiction load, and review thresholds satisfied.

Confidence is not finality. Update triggers still define when the map must patch or rerun.
