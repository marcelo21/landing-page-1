# Matemática de la Bobina de Rogowski

## 1. Introducción

La bobina de Rogowski es un transductor de corriente basado en la ley de Faraday. Se construye como un solenoide enrollado sobre un núcleo no magnético (μᵣ ≈ 1) en forma de toroide. Al rodear un conductor portador de corriente alterna, la bobina genera una tensión de salida proporcional a la derivada de la corriente (di/dt).

Su principal ventaja frente a los transformadores de corriente convencionales (TC) es la ausencia de saturación magnética, lo que le permite medir corrientes desde miliamperes hasta cientos de kiloamperes sin distorsión.

### 1.1. Constantes Físicas Utilizadas

| Símbolo | Valor                  | Descripción                          |
|---------|------------------------|--------------------------------------|
| μ₀      | 4π × 10⁻⁷ H/m         | Permeabilidad del vacío              |
| ρ_Cu    | 1.72 × 10⁻⁸ Ω·m       | Resistividad del cobre a 20 °C       |

---

## 2. Principio Físico

### 2.1. Ley de Faraday-Lenz

La tensión inducida en la bobina es:

```
V_out(t) = -M · di(t)/dt
```

Para una corriente sinusoidal `i(t) = I_peak · sin(ωt)`:

```
V_out(t) = -M · ω · I_peak · cos(ωt)
```

El valor pico de la tensión de salida es:

```
|V_out_peak| = M · ω · I_rated
```

Donde:
- **M** = Inductancia mutua entre el conductor primario y la bobina [H]
- **ω** = 2πf = Frecuencia angular [rad/s]
- **I_rated** = Corriente nominal pico del conductor primario [A]

### 2.2. Inductancia Mutua Objetivo

Despejando M de la ecuación anterior, dado un voltaje de salida deseado:

```
M = V_out / (ω · I_rated)
```

---

## 3. Geometría del Toroide

La bobina de Rogowski se enrolla sobre un núcleo toroidal con las siguientes dimensiones:

```
            ┌─── D_bobina (diámetro medio del toroide) ───┐
            │                                              │
            ▼                                              ▼
       ┌─────────┐                                  ┌─────────┐
       │  Núcleo │──── r_int ─── Centro ─── r_ext ──│  Núcleo │
       └─────────┘                                  └─────────┘
```

| Parámetro     | Fórmula                          | Descripción                                |
|---------------|----------------------------------|--------------------------------------------|
| D_bobina      | Entrada directa o L_tira / π    | Diámetro medio del toroide                 |
| r_medio       | D_bobina / 2                     | Radio medio del toroide                    |
| r_int         | r_medio - (w / 2)               | Radio interno del toroide                  |
| r_ext         | r_medio + (w / 2)               | Radio externo del toroide                  |

Donde `w` es el espesor (ancho) del núcleo y `h` es la altura del núcleo.

> [!WARNING]
> Se requiere que `w < D_bobina`, de lo contrario el radio interno resultaría negativo, lo que es físicamente imposible.

---

## 4. Cálculo de la Inductancia Mutua (M)

La inductancia mutua depende de la **sección transversal** del núcleo sobre el que se enrolla la bobina. A continuación se presentan las dos geometrías principales.

### 4.1. Sección Transversal Rectangular

Esta es la geometría utilizada en la implementación actual del calculador (ver `useRogowskiLogic.js`).

**Geometría de la sección:**

```
        ◄──── w ────►
    ┌──────────────────┐  ▲
    │                  │  │
    │   Sección del    │  h  (altura)
    │     Núcleo       │  │
    │                  │  │
    └──────────────────┘  ▼
```

**Derivación:**

Para un toroide de N vueltas uniformemente distribuidas con sección rectangular, el campo magnético generado por el conductor primario (Ley de Ampère) a una distancia `r` del centro es:

```
B(r) = μ₀ · I / (2πr)
```

El flujo magnético a través de una espira individual de la sección rectangular (entre r_int y r_ext, con altura h) se obtiene integrando:

```
Φ = ∫[r_int → r_ext] B(r) · h · dr
  = (μ₀ · I · h) / (2π) · ∫[r_int → r_ext] dr/r
  = (μ₀ · I · h) / (2π) · ln(r_ext / r_int)
```

La inductancia mutua total para N espiras es:

```
M = N · Φ / I = (N · μ₀ · h · ln(r_ext / r_int)) / (2π)
```

**Despeje del número de vueltas N:**

Dado un valor de M objetivo (calculado a partir de V_out, ω, e I_rated):

```
N = (2π · M) / (μ₀ · h · ln(r_ext / r_int))
```

> [!NOTE]
> Esta es exactamente la fórmula implementada en `useRogowskiLogic.js` (líneas 90-96).

---

### 4.2. Sección Transversal Circular

Esta geometría se emplea cuando el núcleo es una varilla cilíndrica flexible (por ejemplo, un tubo de silicona o material similar) curvada en forma de toroide.

**Geometría de la sección:**

```
          ◄── 2a ──►
           ╭──────╮       ▲
          ╱        ╲      │
         │  Centro  │     2a  (diámetro = 2·radio de la sección)
          ╲        ╱      │
           ╰──────╯       ▼
           
       Centro de la sección a distancia R del eje del toroide
```

Donde:
- **a** = Radio de la sección circular del núcleo [m]
- **R** = Radio medio del toroide (equivalente a r_medio) [m]

**Derivación:**

Para un toroide con sección circular se necesita integrar el flujo a lo largo del área circular. El campo magnético sigue siendo:

```
B(r) = μ₀ · I / (2πr)
```

El flujo para una espira se calcula integrando sobre el área circular de la sección. Usando coordenadas polares centradas en la sección (ρ, φ), donde `r = R + ρ·cos(φ)`:

```
Φ = ∫∫ B(r) · dA
  = ∫[0 → 2π] ∫[0 → a] (μ₀ · I) / (2π · (R + ρ·cos(φ))) · ρ · dρ · dφ
```

Esta integral tiene solución analítica conocida:

```
Φ = μ₀ · I · (R - √(R² - a²))
```

La inductancia mutua para N vueltas es:

```
M = N · (Φ / I) = N · μ₀ · (R - √(R² - a²))
```

**Aproximación para a << R (caso práctico habitual):**

Cuando el radio de la sección `a` es mucho menor que el radio del toroide `R` (que es el caso típico en bobinas Rogowski industriales), se puede usar una expansión de Taylor:

```
R - √(R² - a²) ≈ a² / (2R)
```

Lo que simplifica la inductancia mutua a:

```
M ≈ N · μ₀ · a² / (2R)
```

Y el área de la sección circular es `A = π · a²`, por lo que equivalentemente:

```
M ≈ (N · μ₀ · A) / (2π · R)
```

**Despeje del número de vueltas N (aproximación):**

```
N = (2π · R · M) / (μ₀ · A)
  = (2π · R · M) / (μ₀ · π · a²)
```

> [!IMPORTANT]
> La aproximación `M ≈ N·μ₀·a²/(2R)` tiene un error menor al 1% cuando `a/R < 0.3`, lo que cubre la mayoría de diseños industriales.

---

## 5. Comparación entre Secciones

| Aspecto                  | Rectangular                                  | Circular                                         |
|--------------------------|----------------------------------------------|--------------------------------------------------|
| **Fórmula exacta de M** | `N·μ₀·h·ln(r_ext/r_int) / (2π)`             | `N·μ₀·(R - √(R²-a²))`                           |
| **Fórmula aproximada**  | N/A (ya es exacta para sección rectangular)  | `N·μ₀·a² / (2R)` cuando `a << R`                |
| **Parámetros clave**    | Altura `h`, radio int/ext                    | Radio de sección `a`, radio toroide `R`          |
| **Fabricación**          | Núcleos laminados o extruidos               | Tubos flexibles cilíndricos                      |
| **Uso típico**           | Bobinas rígidas de alta precisión           | Bobinas flexibles o modulares                    |
| **Sensibilidad**         | Controlada por h y ratio r_ext/r_int         | Controlada por a²/R                              |

---

## 6. Cálculos Complementarios

### 6.1. Viabilidad de Fabricación (Factor de Llenado)

El factor de llenado indica qué porcentaje del perímetro interno del toroide está ocupado por el cobre:

```
Perímetro_interno = 2π · r_int
Longitud_ocupada  = N · d_hilo
Factor_llenado(%) = (Longitud_ocupada / Perímetro_interno) × 100
```

La bobina es **viable** si `Factor_llenado ≤ 100%`. Valores superiores indican que las vueltas no caben en una sola capa.

### 6.2. Paso de Bobinado y Gap

```
Paso = Perímetro_interno / N       [m]
Gap  = Paso - d_hilo               [m]
```

El gap debe ser **positivo** y **uniforme** para minimizar la sensibilidad a campos magnéticos externos.

### 6.3. Longitud Total de Hilo

```
Perímetro_sección_núcleo = 2 · (h + w)               [rectangular]
                         = 2π · a                      [circular]

L_bobinado = N × Perímetro_sección_núcleo × Factor_doblado
L_retorno  = π × D_bobina                            (hilo de retorno central)
L_total    = L_bobinado + L_retorno
```

Se utiliza un **Factor_doblado ≈ 1.05** para compensar la curvatura del toroide.

### 6.4. Resistencia DC del Bobinado

```
A_hilo = π × (d_hilo / 2)²
R_dc   = ρ_Cu × L_total / A_hilo            [Ω]
```

---

## 7. Validación Numérica

A continuación se valida la fórmula rectangular con los parámetros por defecto del calculador:

### Datos de Entrada

| Parámetro            | Valor     | Unidad |
|----------------------|-----------|--------|
| V_out_target         | 142.0     | mV     |
| I_rated              | 1000      | A      |
| Frecuencia           | 60        | Hz     |
| D_bobina             | 181.43    | mm     |
| Altura núcleo (h)    | 20.0      | mm     |
| Espesor núcleo (w)   | 6.0       | mm     |
| Diámetro hilo        | 0.203     | mm     |

### Paso a Paso

**1. Frecuencia angular:**
```
ω = 2π × 60 = 376.99 rad/s
```

**2. Inductancia mutua necesaria:**
```
M = V_out / (ω × I_rated) = 0.142 / (376.99 × 1000) = 3.767 × 10⁻⁷ H ≈ 376.7 nH
```

**3. Geometría del toroide:**
```
r_medio = 181.43 / 2 = 90.715 mm = 0.090715 m
r_int   = 90.715 - 3.0 = 87.715 mm = 0.087715 m
r_ext   = 90.715 + 3.0 = 93.715 mm = 0.093715 m
```

**4. Término logarítmico:**
```
ln(r_ext / r_int) = ln(93.715 / 87.715) = ln(1.06839) = 0.06613
```

**5. Número de vueltas:**
```
N = (2π × M) / (μ₀ × h × ln(r_ext / r_int))
  = (2π × 3.767×10⁻⁷) / (4π×10⁻⁷ × 0.020 × 0.06613)
  = 2.367×10⁻⁶ / 1.662×10⁻⁹
  ≈ 1424 vueltas
```

**6. Viabilidad:**
```
Perímetro_interno = 2π × 0.087715 = 0.55117 m = 551.17 mm
Longitud_ocupada  = 1424 × 0.203 = 289.07 mm
Factor_llenado    = 289.07 / 551.17 × 100 = 52.4%  ✅ Viable
```

> [!TIP]
> Estos resultados coinciden con los generados por el calculador web (`useRogowskiLogic.js`), validando la correcta implementación de las formulas.

---

## 8. Referencias

1. **Rogowski, W. & Steinhaus, W.** (1912). *Die Messung der magnetischen Spannung*. Archiv für Elektrotechnik.
2. **Ward, D.A. & Exon, J.L.T.** (1993). *Using Rogowski coils for transient current measurements*. Engineering Science and Education Journal.
3. **Implementación del calculador**: [useRogowskiLogic.js](file:///d:/_PROYECTOS_/_WEB_/landing-page-1/src/components/rogowski-calculator/useRogowskiLogic.js)
