# Matemática de la Bobina de Rogowski

## 1. Introducción

La bobina de Rogowski es un transductor de corriente basado en la ley de Faraday. Se construye como un solenoide enrollado sobre un núcleo no magnético ($\mu_r \approx 1$) en forma de toroide. Al rodear un conductor portador de corriente alterna, la bobina genera una tensión de salida proporcional a la derivada de la corriente ($di/dt$).

Su principal ventaja frente a los transformadores de corriente convencionales (TC) es la ausencia de saturación magnética, lo que le permite medir corrientes desde miliamperes hasta cientos de kiloamperes sin distorsión.

### 1.1. Constantes Físicas Utilizadas

| Símbolo | Valor | Descripción |
|---------|-------|-------------|
| $\mu_0$ | $4\pi \times 10^{-7}$ H/m | Permeabilidad del vacío |
| $\rho_{Cu}$ | $1.72 \times 10^{-8}$ Ω·m | Resistividad del cobre a 20 °C |

---

## 2. Principio Físico

### 2.1. Ley de Faraday-Lenz

La tensión inducida en la bobina es:

$$V_{out}(t) = -M \cdot \frac{di(t)}{dt}$$

Para una corriente sinusoidal $i(t) = I_{peak} \cdot \sin(\omega t)$:

$$V_{out}(t) = -M \cdot \omega \cdot I_{peak} \cdot \cos(\omega t)$$

El valor pico de la tensión de salida es:

$$\left| V_{out,peak} \right| = M \cdot \omega \cdot I_{rated}$$

Donde:
- $M$ = Inductancia mutua entre el conductor primario y la bobina [H]
- $\omega = 2\pi f$ = Frecuencia angular [rad/s]
- $I_{rated}$ = Corriente nominal pico del conductor primario [A]

### 2.2. Inductancia Mutua Objetivo

Despejando $M$ de la ecuación anterior, dado un voltaje de salida deseado:

$$M = \frac{V_{out}}{\omega \cdot I_{rated}}$$

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

| Parámetro | Fórmula | Descripción |
|-----------|---------|-------------|
| $D_{bobina}$ | Entrada directa o $L_{tira} / \pi$ | Diámetro medio del toroide |
| $r_{medio}$ | $D_{bobina} / 2$ | Radio medio del toroide |
| $r_{int}$ | $r_{medio} - w/2$ | Radio interno del toroide |
| $r_{ext}$ | $r_{medio} + w/2$ | Radio externo del toroide |

Donde $w$ es el espesor (ancho) del núcleo y $h$ es la altura del núcleo.

> [!WARNING]
> Se requiere que $w < D_{bobina}$, de lo contrario el radio interno resultaría negativo, lo que es físicamente imposible.

---

## 4. Cálculo de la Inductancia Mutua ($M$)

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

Para un toroide de $N$ vueltas uniformemente distribuidas con sección rectangular, el campo magnético generado por el conductor primario (Ley de Ampère) a una distancia $r$ del centro es:

$$B(r) = \frac{\mu_0 \cdot I}{2\pi r}$$

El flujo magnético a través de una espira individual de la sección rectangular (entre $r_{int}$ y $r_{ext}$, con altura $h$) se obtiene integrando:

$$\Phi = \int_{r_{int}}^{r_{ext}} B(r) \cdot h \; dr = \frac{\mu_0 \cdot I \cdot h}{2\pi} \int_{r_{int}}^{r_{ext}} \frac{dr}{r} = \frac{\mu_0 \cdot I \cdot h}{2\pi} \ln\left(\frac{r_{ext}}{r_{int}}\right)$$

La inductancia mutua total para $N$ espiras es:

$$M = \frac{N \cdot \Phi}{I} = \frac{N \cdot \mu_0 \cdot h \cdot \ln\left(\frac{r_{ext}}{r_{int}}\right)}{2\pi}$$

**Despeje del número de vueltas $N$:**

Dado un valor de $M$ objetivo (calculado a partir de $V_{out}$, $\omega$, e $I_{rated}$):

$$\boxed{N = \frac{2\pi \cdot M}{\mu_0 \cdot h \cdot \ln\left(\frac{r_{ext}}{r_{int}}\right)}}$$

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
- $a$ = Radio de la sección circular del núcleo [m]
- $R$ = Radio medio del toroide (equivalente a $r_{medio}$) [m]

**Derivación:**

Para un toroide con sección circular se necesita integrar el flujo a lo largo del área circular. El campo magnético sigue siendo:

$$B(r) = \frac{\mu_0 \cdot I}{2\pi r}$$

El flujo para una espira se calcula integrando sobre el área circular de la sección. Usando coordenadas polares centradas en la sección $(\rho, \varphi)$, donde $r = R + \rho \cos\varphi$:

$$\Phi = \iint B(r) \; dA = \int_0^{2\pi} \int_0^{a} \frac{\mu_0 \cdot I}{2\pi \left(R + \rho \cos\varphi\right)} \; \rho \; d\rho \; d\varphi$$

Esta integral tiene solución analítica conocida:

$$\Phi = \mu_0 \cdot I \cdot \left(R - \sqrt{R^2 - a^2}\right)$$

La inductancia mutua para $N$ vueltas es:

$$M = N \cdot \frac{\Phi}{I} = N \cdot \mu_0 \cdot \left(R - \sqrt{R^2 - a^2}\right)$$

**Aproximación para $a \ll R$ (caso práctico habitual):**

Cuando el radio de la sección $a$ es mucho menor que el radio del toroide $R$ (que es el caso típico en bobinas Rogowski industriales), se puede usar una expansión de Taylor:

$$R - \sqrt{R^2 - a^2} \approx \frac{a^2}{2R}$$

Lo que simplifica la inductancia mutua a:

$$M \approx \frac{N \cdot \mu_0 \cdot a^2}{2R}$$

Y el área de la sección circular es $A = \pi a^2$, por lo que equivalentemente:

$$M \approx \frac{N \cdot \mu_0 \cdot A}{2\pi R}$$

**Despeje del número de vueltas $N$ (aproximación):**

$$\boxed{N = \frac{2\pi R \cdot M}{\mu_0 \cdot \pi \cdot a^2} = \frac{2R \cdot M}{\mu_0 \cdot a^2}}$$

> [!IMPORTANT]
> La aproximación $M \approx \frac{N \mu_0 a^2}{2R}$ tiene un error menor al 1% cuando $a/R < 0.3$, lo que cubre la mayoría de diseños industriales.

---

## 5. Comparación entre Secciones

| Aspecto | Rectangular | Circular |
|---------|-------------|----------|
| **Fórmula exacta de $M$** | $\dfrac{N \mu_0 h \ln(r_{ext}/r_{int})}{2\pi}$ | $N \mu_0 \left(R - \sqrt{R^2-a^2}\right)$ |
| **Fórmula aproximada** | N/A (ya es exacta) | $\dfrac{N \mu_0 a^2}{2R}$ cuando $a \ll R$ |
| **Parámetros clave** | Altura $h$, radio int/ext | Radio de sección $a$, radio toroide $R$ |
| **Fabricación** | Núcleos laminados o extruidos | Tubos flexibles cilíndricos |
| **Uso típico** | Bobinas rígidas de alta precisión | Bobinas flexibles o modulares |
| **Sensibilidad** | Controlada por $h$ y $r_{ext}/r_{int}$ | Controlada por $a^2/R$ |

---

## 6. Cálculos Complementarios

### 6.1. Viabilidad de Fabricación (Factor de Llenado)

El factor de llenado indica qué porcentaje del perímetro interno del toroide está ocupado por el cobre:

$$P_{int} = 2\pi \cdot r_{int}$$

$$L_{ocupada} = N \cdot d_{hilo}$$

$$F_{llenado}(\%) = \frac{L_{ocupada}}{P_{int}} \times 100$$

La bobina es **viable** si $F_{llenado} \leq 100\%$. Valores superiores indican que las vueltas no caben en una sola capa.

### 6.2. Paso de Bobinado y Gap

$$\text{Paso} = \frac{P_{int}}{N} \quad [m]$$

$$\text{Gap} = \text{Paso} - d_{hilo} \quad [m]$$

El gap debe ser **positivo** y **uniforme** para minimizar la sensibilidad a campos magnéticos externos.

### 6.3. Longitud Total de Hilo

Perímetro de la sección del núcleo según tipo:

$$P_{sección} = \begin{cases} 2(h + w) & \text{rectangular} \\ 2\pi a & \text{circular} \end{cases}$$

$$L_{bobinado} = N \times P_{sección} \times k_{doblado}$$

$$L_{retorno} = \pi \cdot D_{bobina} \quad \text{(hilo de retorno central)}$$

$$L_{total} = L_{bobinado} + L_{retorno}$$

Se utiliza un **$k_{doblado} \approx 1.05$** para compensar la curvatura del toroide.

### 6.4. Resistencia DC del Bobinado

$$A_{hilo} = \pi \left(\frac{d_{hilo}}{2}\right)^2$$

$$R_{DC} = \frac{\rho_{Cu} \cdot L_{total}}{A_{hilo}} \quad [\Omega]$$

---

## 7. Validación Numérica

A continuación se valida la fórmula rectangular con los parámetros por defecto del calculador:

### Datos de Entrada

| Parámetro | Valor | Unidad |
|-----------|-------|--------|
| $V_{out,target}$ | 142.0 | mV |
| $I_{rated}$ | 1000 | A |
| $f$ | 60 | Hz |
| $D_{bobina}$ | 181.43 | mm |
| $h$ (altura núcleo) | 20.0 | mm |
| $w$ (espesor núcleo) | 6.0 | mm |
| $d_{hilo}$ | 0.203 | mm |

### Paso a Paso

**1. Frecuencia angular:**

$$\omega = 2\pi \times 60 = 376.99 \; \text{rad/s}$$

**2. Inductancia mutua necesaria:**

$$M = \frac{V_{out}}{\omega \cdot I_{rated}} = \frac{0.142}{376.99 \times 1000} = 3.767 \times 10^{-7} \; \text{H} \approx 376.7 \; \text{nH}$$

**3. Geometría del toroide:**

$$r_{medio} = \frac{181.43}{2} = 90.715 \; \text{mm} = 0.090715 \; \text{m}$$

$$r_{int} = 90.715 - 3.0 = 87.715 \; \text{mm} = 0.087715 \; \text{m}$$

$$r_{ext} = 90.715 + 3.0 = 93.715 \; \text{mm} = 0.093715 \; \text{m}$$

**4. Término logarítmico:**

$$\ln\left(\frac{r_{ext}}{r_{int}}\right) = \ln\left(\frac{93.715}{87.715}\right) = \ln(1.06839) = 0.06613$$

**5. Número de vueltas:**

$$N = \frac{2\pi \times 3.767 \times 10^{-7}}{4\pi \times 10^{-7} \times 0.020 \times 0.06613} = \frac{2.367 \times 10^{-6}}{1.662 \times 10^{-9}} \approx 1424 \; \text{vueltas}$$

**6. Viabilidad:**

$$P_{int} = 2\pi \times 0.087715 = 0.55117 \; \text{m} = 551.17 \; \text{mm}$$

$$L_{ocupada} = 1424 \times 0.203 = 289.07 \; \text{mm}$$

$$F_{llenado} = \frac{289.07}{551.17} \times 100 = 52.4\% \quad \checkmark \; \text{Viable}$$

> [!TIP]
> Estos resultados coinciden con los generados por el calculador web (`useRogowskiLogic.js`), validando la correcta implementación de las fórmulas.

---

## 8. Referencias

1. **Rogowski, W. & Steinhaus, W.** (1912). *Die Messung der magnetischen Spannung*. Archiv für Elektrotechnik.
2. **Ward, D.A. & Exon, J.L.T.** (1993). *Using Rogowski coils for transient current measurements*. Engineering Science and Education Journal.
3. **Implementación del calculador**: [useRogowskiLogic.js](file:///d:/_PROYECTOS_/_WEB_/landing-page-1/src/components/rogowski-calculator/useRogowskiLogic.js)
