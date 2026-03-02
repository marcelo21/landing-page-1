# Documento Técnico Base: Estimación de Fuerza de Rotura en Soldadura por Puntos

## 1. Introducción

La soldadura por resistencia por puntos (RSW, por sus siglas en inglés) es un proceso termoeléctrico mediante el cual las superficies de contacto de chapas metálicas se unen por el calor generado por la resistencia al flujo de corriente eléctrica.

En este contexto, la **fuerza de rotura** se define como la carga máxima que la unión soldada puede soportar antes de su separación física bajo condiciones de carga cuasi-estática.

**Alcance del modelo:** El presente documento establece un modelo analítico para la estimación teórica de la fuerza de rotura estática en cizalladura. No arroja un valor exacto, sino una magnitud esperada bajo condiciones nominales.
**Contexto industrial:** Este cálculo es utilizado como línea base teórica para el diseño de utillajes, pre-dimensionamiento de uniones estructurales automotrices/metalmecánicas y como núcleo lógico para el desarrollo de calculadoras de ingeniería.

---

## 2. Modos de Falla en Soldadura por Puntos

El comportamiento mecánico del punto de soldadura depende fundamentalmente del modo de falla bajo carga.

* **Falla por arrancamiento del botón (Plug Failure):** Rotura a través del metal base o de la zona afectada por el calor (ZAC), dejando el botón de soldadura intacto en una de las chapas. **Es el modo de falla deseable y exigido estructuralmente**, ya que garantiza que la soldadura es más resistente que el material base.
* **Falla interfacial (Corte puro):** Separación de las chapas exactamente en el plano de unión, cortando el botón por la mitad. **Indica un defecto de proceso** (falta de fusión, tamaño de botón insuficiente o fragilización metalúrgica).
* **Falla por desgarro de la chapa:** Similar al arrancamiento, pero la grieta se propaga rasgando la chapa a lo largo de la dirección de la carga. Típico en chapas de espesor muy fino sometidas a cizalladura.
* **Falla por peel / tracción (Despegue):** Separación causada por fuerzas perpendiculares al plano de la chapa, provocando la apertura de la unión por los bordes del botón. El punto de soldadura tiene baja resistencia intrínseca a este esfuerzo.

---

## 3. Parámetros Geométricos

La geometría de la unión define el área resistente al esfuerzo mecánico. Se establecen los siguientes parámetros de entrada:

* **$d$**: Diámetro efectivo del botón de soldadura en el plano de interfase (excluyendo la corona o indentación térmica).
* **$t$**: Espesor de la chapa más fina de la unión (o $t_{min}$ para uniones múltiples).
* **$N$**: Número total de chapas apiladas en la unión.
* **$n$**: Número de planos de corte sometidos a cizalladura (generalmente $n = N - 1$).

**Relación empírica aceptada:** Para aceros de bajo carbono, el diámetro nominal mínimo requerido para garantizar una falla por arrancamiento se calcula mediante la relación empírica de Unksov/AWS:

$$ d_{min} = 4 \sqrt{t} $$

*Nota: Para cálculos conservadores en esta calculadora, se asumirá el límite inferior o el diámetro real medido en macrografía.*

---

## 4. Propiedades del Material

La resistencia al corte de la unión depende directamente de la tensión de rotura del material base.

**Materiales típicos aplicables al modelo:**

* Acero bajo carbono (Mild Steel)
* Acero galvanizado
* Aceros de alta resistencia (AHSS, DP, TRIP)
* Aleaciones de Aluminio (Serie 5xxx, 6xxx)

**Variables mecánicas:**

* **$\sigma_{UTS}$**: Resistencia a la tracción última del material base (Ultimate Tensile Strength - UTS), expresada en MPa.
* **$\tau_{corte}$**: Resistencia al corte del material. Según el criterio de von Mises para metales dúctiles, se aproxima mediante la relación:

$$ \tau_{corte} \approx \frac{\sigma_{UTS}}{\sqrt{3}} \approx 0.577 \cdot \sigma_{UTS} $$

---

## 5. Modelo Matemático de Cálculo

El análisis estructural de la unión se centra en determiner la fuerza máxima que puede soportar antes de fallar. Existen dos mecanismos principales de falla competitivos: el arrancamiento del botón (mecanismo deseado) y la cizalladura interfacial del botón (mecanismo no deseado).

**El objetivo de diseño es garantizar el arrancamiento del botón (Pull-Out)**, asegurando que la soldadura sea más resistente que la chapa base. Por tanto, el cálculo prioriza la resistencia al arrancamiento como criterio de diseño, validándolo contra la resistencia al corte.

### 5.1 Fuerza de Arrancamiento (Pull-Out Force) - Criterio Principal

Representa la fuerza necesaria para desgarrar la chapa alrededor del perímetro del botón de soldadura (falla tipo "Plug"). El esfuerzo se transfiere al material base a lo largo de la circunferencia del punto.

**Fórmula de cálculo:**

$$ F_{PO} = (\pi \cdot d) \cdot t \cdot \tau_{corte} $$

Donde:
*   $\pi \cdot d$: Perímetro del botón de soldadura (longitud efectiva de la línea de desgarro).
*   $t$: Espesor de la chapa solicitada (espesor efectivo resistiendo el desgarro perímetro).
*   $\tau_{corte}$: Resistencia al corte del material base en la Zona Afectada por el Calor (ZAC).

### 5.2 Fuerza de Cizalladura (Shear Force) - Criterio de Validación

Representa la fuerza necesaria para cizallar el botón de soldadura a través de su plano medio (interfase). Este cálculo sirve como validación: si este valor es menor que la fuerza de arrancamiento, el punto es defectuoso (diámetro insuficiente).

**Fórmula de cálculo:**

$$ F_{cizalla} = \frac{\pi \cdot d^2}{4} \cdot \tau_{corte} $$

Donde:
*   $\frac{\pi \cdot d^2}{4}$: Área transversal sólida del botón de soldadura.

### 5.3 Determinación de la Fuerza de Rotura Teórica

La capacidad de carga teórica de la unión está limitada por el mecanismo de falla más débil ("el eslabón más débil").

$$ F_{base} = \min(F_{PO}, F_{cizalla}) $$

*   Si **$F_{cizalla} < F_{PO}$**: Predice **Falla Interfacial**. El diámetro es insuficiente para desarrollar la resistencia plena de la chapa.
*   Si **$F_{PO} < F_{cizalla}$**: Predice **Arrancamiento de Botón**. El diseño es correcto y limitado por el espesor de la chapa.

### 5.4 Consideración de Múltiples Planos

En uniones de más de dos chapas ($N > 2$), la fuerza total teórica asume una distribución de carga. Siguiendo la lógica del eslabón más débil, si el arrancamiento es el modo dominante, fallará la chapa más solicitada. Si es cizalladura, se suman las resistencias de los planos de corte. Para simplificación conservadora en este modelo:

$$ F_{total} = F_{base} \cdot n $$

---

## 6. Factores Correctivos

El modelo teórico puro sobreestima la fuerza de rotura real debido a imperfecciones del proceso y condiciones de carga asimétricas. Se introducen coeficientes empíricos ($\eta$) adimensionales.

| Factor | Símbolo | Rango Típico | Descripción y Justificación Física |
| --- | --- | --- | --- |
| **Calidad del botón** | $\eta_{c}$ | 0.7 – 1.0 | Penaliza la presencia de porosidad interna, microfisuras o expulsión de material (proyecciones) que reducen el área efectiva real. |
| **Desalineación** | $\eta_{a}$ | 0.8 – 1.0 | Corrige la introducción de momentos flectores parásitos debido a cargas no perfectamente coplanares al eje longitudinal de cizalladura. |
| **Modo Peel** | $\eta_{p}$ | 0.2 – 0.5 | Reduce drásticamente la capacidad de carga si la componente de tracción fuera del plano (peel) es significativa. La concentración de tensiones en la entalla es severa. |
| **Proceso** | $\eta_{proc}$ | 0.8 – 0.95 | Factor de seguridad por desgaste de electrodos, variaciones de presión neumática o derivas en la corriente de soldadura no detectadas. |

**Ecuación de Fuerza Real Estimada:**

$$ F_{real} = F_{total} \cdot (\eta_{c} \cdot \eta_{a} \cdot \eta_{p} \cdot \eta_{proc}) $$

---

## 7. Criterios de Aceptación

Para que un punto de soldadura sea validado estructuralmente, debe cumplir:

1. **Diámetro mínimo:** $d \geq 4 \sqrt{t}$ (para aceros estándar).
2. **Modo de falla:** Obligatorio *arrancamiento de botón* (Plug Failure) en ensayo destructivo (cincelado o tracción).
3. **Relación Teórica/Práctica:** La fuerza medida en laboratorio debe ser $\geq$ a la calculada (asumiendo factores $\eta \approx 1$ para condiciones ideales).

---

## 8. Criterios de Falla (Rechazo)

El modelo asume un defecto crítico en la unión si se prevé o constata:

* **Diámetro insuficiente:** $d < 3.5 \sqrt{t}$ (alta probabilidad de falla interfacial prematura).
* **Falla interfacial:** Cualquier evidencia de cizalladura a través del plano de interfase sin desgarro de material base.
* **Dispersión:** Una variación mayor al **15%** entre los resultados teóricos y la media de ensayos mecánicos en un lote continuo.
* **Incompatibilidad de carga:** Cargas predominantes de fatiga o tracción en la dirección del espesor (Z), donde este modelo pierde total validez.

---

## 9. Límites de Validez del Modelo

El uso de este modelo matemático está estrictamente confinado bajo los siguientes límites explícitos:

* **No válido para cargas dinámicas ni cálculos de fatiga.** El modelo es puramente estático.
* **No válido para esfuerzos donde domine el modo "Peel"** (tracción pura en el botón).
* **No sustituye al ensayo destructivo.** Funciona como herramienta de diseño y predicción, no como validación final de aseguramiento de calidad.
* Es altamente sensible a la metalurgia; aceros martensíticos o con tratamientos térmicos post-soldadura requieren caracterización local del valor de $\tau_{corte}$ en la ZAC, ya que la relación empírica $\tau \approx 0.577 \sigma_{UTS}$ puede no cumplirse por fragilización.

---

## 10. Advertencias Técnicas

> ⚠️ **ADVERTENCIA DE INGENIERÍA:** > Este modelo proporciona una estimación teórica analítica del límite de rotura estático bajo condiciones ideales controladas. No debe emplearse como única justificación para la reducción de puntos de soldadura en estructuras de seguridad crítica (ej. crash-tests automotrices) sin la validación experimental mediante ensayos físico-mecánicos destructivos normalizados.

---

## 11. Referencias Técnicas

El marco conceptual de este documento se alinea con las directrices y estándares de la industria, específicamente:

* **AWS D8.1 / D8.1M:** *Specification for Automotive Weld Quality—Resistance Spot Welding of Steel.*
* **ISO 10447:** *Resistance welding — Testing of welds — Peel and chisel testing of resistance spot and projection welds.*
* **SAE J400 / J1188:** *Estándares de prácticas recomendadas para ensayos mecánicos en uniones soldadas automotrices.*

---

## 12. Directrices de Implementación de Software (Calculadora)

Como responsable de convertir este modelo matemático en un componente interactivo de software (Calculadora de Fuerza de Rotura), tené en cuenta los siguientes lineamientos arquitectónicos para asegurar la mantenibilidad y facilidad de uso:

*   **Lenguaje y Entorno:** Se utilizará **Python** por su robustez en cálculo numérico. Para la interfaz gráfica (GUI), se priorizará el uso de **Tkinter** (biblioteca estándar) o **CustomTkinter** para una apariencia moderna sin dependencias complejas.
*   **Arquitectura (MVC):** Desacoplar estrictamente la lógica de negocio de la interfaz.
    *   **Modelo:** Encapsular ecuaciones y lógica matemática (clases `Material`, `Geometria`, `Calculadora`) en módulos independientes.
    *   **Vista:** La interfaz solo debe encargarse de la captura de datos y visualización de resultados, sin lógica de cálculo incrustada.
*   **Manejo de Datos:** Utilizar `dataclasses` para estructurar los parámetros de entrada y matrices de factores $\eta$.
*   **Validación:** Implementar validaciones de entrada robustas (evitar números negativos, espesores cero) directamente en los callbacks de la interfaz antes de invocar al modelo matemático.

---