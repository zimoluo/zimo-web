# Appendix — theme corpus analysis

Every `components/theme/config/*.ts` decoded to OKLCh. Generated from the working tree at
`99bc5793`. This is the empirical basis for F-11, F-12, ADR-002, and ADR-003.

`L` and `relC` columns are ordered `primary → saturated → pastel → light`.
`relC` is chroma as a fraction of `Cmax(L, h)`. Hue is the chroma-weighted circular mean;
`—` means achromatic (all four roles below C = 0.012). `mono` is whether lightness is
monotone across the four roles.

| theme | scheme | hue | torsion | L (pri→lgt) | relC (pri→lgt) | mono |
| --- | --- | --- | --- | --- | --- | --- |
| `about` | light | 239° | 11.8° | 0.391 0.500 0.901 0.977 | 0.93 0.99 0.94 1.00 | ✓ |
| `aquarium` | light | 233° | 6.8° | 0.441 0.559 0.714 0.899 | 0.35 0.47 0.35 0.28 | ✓ |
| `autumnal` | dark | 74° | 134.9° | 0.964 0.904 0.620 0.769 | 1.00 0.15 0.70 0.71 | ✗ |
| `bewitched` | light | 280° | 20.2° | 0.265 0.385 0.791 0.928 | 0.98 0.98 0.91 0.92 | ✓ |
| `birthday` | light | 360° | 20.8° | 0.408 0.525 0.899 0.971 | 0.88 0.94 0.87 0.79 | ✓ |
| `birthday19` | dark | 257° | 9.7° | 0.945 0.793 0.457 0.345 | 0.56 0.68 0.56 0.66 | ✓ |
| `birthday20` | light | 147° | 5.1° | 0.381 0.603 0.838 0.979 | 0.65 0.60 0.21 0.71 | ✓ |
| `birthdayGeneric` | *generative — not statically parseable* | | | | | |
| `blog` | light | 324° | 6.0° | 0.401 0.518 0.903 0.977 | 0.86 0.93 0.97 1.00 | ✓ |
| `bubbles` | light | 255° | 15.2° | 0.383 0.488 0.890 0.972 | 0.82 0.94 0.94 1.00 | ✓ |
| `celebration` | dark | 247° | 6.3° | 0.948 0.864 0.475 0.373 | 0.48 0.59 0.40 0.43 | ✓ |
| `cherry` | light | 356° | 24.8° | 0.387 0.551 0.849 0.957 | 0.96 0.94 0.98 1.00 | ✓ |
| `christmas` | light | — | — | 0.413 0.546 0.903 0.981 | 0.92 0.87 0.87 0.69 | ✓ |
| `crimson` | light | — | — | 0.345 0.464 0.832 0.955 | 0.85 0.57 0.25 0.33 | ✓ |
| `cubistic` | dark | — | — | 0.973 0.870 0.643 0.600 | 0.00 0.00 0.00 0.00 | ✓ |
| `defaultEditor` | light | 239° | 11.8° | 0.391 0.500 0.901 0.977 | 0.93 0.99 0.94 1.00 | ✓ |
| `dusk` | dark | 5° | 55.5° | 0.972 0.852 0.701 0.569 | 1.00 0.82 0.53 0.58 | ✓ |
| `eep` | light | 161° | 8.7° | 0.446 0.659 0.910 0.968 | 0.95 0.96 0.47 0.53 | ✓ |
| `energize` | dark | 311° | 16.7° | 0.946 0.786 0.526 0.447 | 1.00 0.81 0.94 0.97 | ✓ |
| `eventide` | dark | 269° | 5.8° | 0.959 0.749 0.539 0.372 | 1.00 0.55 0.42 0.38 | ✓ |
| `gallery` | dark | — | — | 0.994 0.885 0.676 0.640 | 0.00 0.00 0.00 0.00 | ✓ |
| `gallery3D` | light | — | — | 0.318 0.492 0.729 0.955 | 0.04 0.10 0.09 0.46 | ✓ |
| `glitter` | dark | — | — | 0.985 0.967 0.551 0.446 | 0.22 0.19 0.09 0.17 | ✓ |
| `gold` | light | 82° | 20.1° | 0.439 0.649 0.851 0.978 | 0.90 0.98 0.68 0.87 | ✓ |
| `grass` | dark | — | — | 0.996 0.917 0.689 0.557 | 1.00 0.31 0.87 0.92 | ✓ |
| `halloween` | dark | — | — | 0.992 0.806 0.625 0.603 | 1.00 1.00 0.94 0.84 | ✓ |
| `home` | light | — | — | 0.309 0.371 0.922 0.985 | 0.00 0.00 0.00 0.00 | ✓ |
| `lollipop` | light | 356° | 12.0° | 0.380 0.526 0.851 0.948 | 0.94 0.70 0.44 0.47 | ✓ |
| `marina` | dark | 149° | 18.9° | 0.993 0.939 0.680 0.676 | 1.00 1.00 0.61 0.41 | ✓ |
| `meadowland` | light | 238° | 9.0° | 0.369 0.540 0.856 0.952 | 0.87 0.90 0.51 0.68 | ✓ |
| `memories` | dark | 303° | 8.4° | 0.973 0.757 0.586 0.469 | 1.00 0.89 0.62 0.65 | ✓ |
| `midnight` | dark | — | — | 0.985 0.967 0.551 0.446 | 0.22 0.19 0.09 0.17 | ✓ |
| `mori` | light | 121° | 12.7° | 0.446 0.609 0.886 0.946 | 0.81 0.84 0.61 0.32 | ✓ |
| `murk` | dark | 205° | 3.6° | 0.963 0.863 0.657 0.525 | 0.35 0.37 0.80 0.86 | ✓ |
| `oasis` | light | 174° | 7.4° | 0.483 0.713 0.925 0.967 | 0.98 0.97 0.66 1.00 | ✓ |
| `penumbra` | dark | — | — | 0.952 0.818 0.529 0.428 | 0.06 0.09 0.13 0.11 | ✓ |
| `perpetuity` | dark | — | — | 0.981 0.891 0.685 0.628 | 1.00 0.75 0.84 0.91 | ✓ |
| `photos` | light | 46° | 35.5° | 0.408 0.553 0.901 0.980 | 0.87 0.97 0.97 1.00 | ✓ |
| `pixelland` | dark | — | — | 0.990 0.883 0.720 0.590 | 1.00 1.00 0.84 0.96 | ✓ |
| `plainBlack` | dark | — | — | 0.967 0.770 0.431 0.226 | 0.00 0.00 0.00 0.00 | ✓ |
| `plainDark` | dark | — | — | 0.988 0.851 0.521 0.402 | 0.00 0.00 0.00 0.00 | ✓ |
| `plainGray` | dark | — | — | 0.994 0.901 0.683 0.633 | 0.00 0.00 0.00 0.00 | ✓ |
| `plainLight` | light | — | — | 0.309 0.464 0.870 0.985 | 0.00 0.00 0.00 0.00 | ✓ |
| `planetoid` | dark | 137° | 9.4° | 0.971 0.793 0.503 0.303 | 0.48 0.57 0.72 0.71 | ✓ |
| `projects` | light | 184° | 8.0° | 0.386 0.511 0.910 0.984 | 0.88 0.96 0.67 0.63 | ✓ |
| `rainbow` | light | — | — | 0.372 0.499 0.968 0.984 | 0.29 0.22 0.43 0.44 | ✓ |
| `scintillating` | light | 2° | 14.4° | 0.367 0.525 0.872 0.949 | 1.00 1.00 1.00 1.00 | ✓ |
| `sky` | light | 224° | 6.1° | 0.403 0.542 0.771 0.942 | 0.93 0.91 0.60 1.00 | ✓ |
| `spookfest` | dark | 230° | 8.1° | 0.955 0.830 0.607 0.525 | 0.54 0.54 0.88 0.95 | ✓ |
| `springField` | dark | 96° | 12.4° | 0.996 0.961 0.867 0.827 | 1.00 1.00 0.98 1.00 | ✓ |
| `stars` | dark | — | — | 0.987 0.940 0.571 0.297 | 1.00 0.75 0.79 0.65 | ✓ |
| `storm` | dark | — | — | 0.949 0.883 0.560 0.448 | 0.11 0.15 0.37 0.36 | ✓ |
| `underwater` | dark | 211° | 20.0° | 0.969 0.891 0.708 0.559 | 0.61 0.64 0.98 0.97 | ✓ |
| `unity` | light | — | — | 0.364 0.556 0.792 0.970 | 0.88 0.93 0.71 0.60 | ✓ |
| `velvet` | dark | 316° | 4.0° | 0.911 0.752 0.545 0.367 | 0.35 0.42 0.52 0.57 | ✓ |
| `verdant` | dark | 188° | 87.3° | 0.984 0.838 0.737 0.563 | 1.00 0.31 0.48 0.53 | ✓ |
| `vibrant` | dark | 2° | 291.6° | 0.963 0.852 0.614 0.518 | 0.34 0.56 0.87 0.92 | ✓ |
| `vitreous` | dark | 283° | 9.1° | 0.966 0.794 0.623 0.527 | 1.00 1.00 0.87 0.86 | ✓ |
| `whiteout` | light | 267° | 6.6° | 0.382 0.576 0.760 0.964 | 0.23 0.22 0.37 0.83 | ✓ |

## Summary

| metric | value |
| --- | --- |
| theme configs | 59 |
| statically parseable | 58 |
| dark scheme | 31 |
| light scheme | 27 |
| fully achromatic (all four roles C < 0.012) | 7 |
| partly neutral (some role C < 0.012) | 14 |
| fully chromatic | 37 |
| monotone lightness | 57 / 58 |
| hue torsion p50 (fully chromatic only) | 11.8° |
| hue torsion p75 | 20.0° |
| hue torsion p90 | 35.5° |
| hue torsion max | 291.6° |

## Reading the table

**Monotone lightness in 57 of 58 themes** is the finding that justifies the tone-ladder
model: the existing corpus already *is* a set of lightness ladders with per-role
deviations. The engine in T2 describes this corpus rather than imposing on it.

**Torsion p50 of 11.8°** shows most themes are single-hue with a slight drift. The four
outliers above 55° (`vibrant` 292°, `autumnal` 135°, `verdant` 87°, `dusk` 56°) are
deliberately polychrome and use per-stop hue overrides — which is the correct outcome:
a polychrome theme should look polychrome in its source.

**relC frequently at or near 1.00 for the extreme roles** is why ADR-003 rejects a
tapered chroma envelope. At `L = 0.977` the ceiling is `C = 0.017`, so relC 1.00 is a
barely-tinted white — the intended effect, which a taper would gray out.
