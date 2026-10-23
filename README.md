# Premium Effects Registry

Catálogo abierto y **consultable sin conexión** de referencias de efectos visuales para proyectos frontend: WebGL, Three.js, GLSL, movimiento, partículas, glass UI y arte generativo. Pensado para diseñadores, desarrolladores y agentes de código.

> **Estado verificado (23 de octubre de 2026): 11 repositorios públicos y no archivados.** El README anterior afirmaba "50+" y listaba referencias inaccesibles (404) y estrellas históricas; esas cifras no se mantienen sin comprobación. El catálogo crecerá a medida que se verifiquen entradas reales.

## Instalar y consultar

Requiere **Node.js >=18**, no se usan dependencias npm externas ni claves.

```bash
node bin/effects.cjs --help
node bin/effects.cjs --categories
node bin/effects.cjs "liquid metal"
node bin/effects.cjs "GLSL noise" --json
node bin/effects.cjs --category shaders --limit 5
npm run verify
```

La búsqueda funciona sin llamadas a Internet, sin registro y sin recopilar datos. La lista se guarda en `catalog.json` y se valida antes de mostrarse. También puede invocarse con `npm run search -- liquid` o instalarse como paquete local para disponer del comando `effects`.

## Referencias verificadas

| Recurso | Categoría | Repositorio público |
| --- | --- | --- |
| Three.js | 3D y WebGL | `mrdoob/three.js` |
| GSAP | Movimiento | `greensock/GSAP` |
| particles.js | Partículas | `VincentGarreau/particles.js` |
| p5.js | Creative coding | `processing/p5.js` |
| Liquid Logo | Liquid morph | `collidingScopes/liquid-logo` |
| The Book of Shaders | Shaders/GLSL | `patriciogonzalezvivo/thebookofshaders` |
| WebGL Noise | Shaders/GLSL | `ashima/webgl-noise` |
| Vinaal Portfolio | Futuristic UI | `Dark-Vinaal/vinaal_portfolio` |
| MetalFlow | Liquid morph | `Saganaki22/MetalFlow` |
| ASCII Logo Hover | Tipografía | `Thakuma07/ANIOLegacyASCIILogo-HoverAnimation` |
| LiquidGlass Handbook | Glass UI | `jaikrishnavj/LiquidGlass-Handbook` |

**Verificado** significa que el repositorio GitHub era accesible públicamente y no archivado en la fecha indicada. **No significa** que un recurso sea seguro, mantenga una licencia concreta, sea accesible o funcione en todos los navegadores. Antes de usar cualquier implementación, comprueba licencia, compatibilidad, dependencias y seguridad en el origen. Las referencias conservan sus licencias independientes; la licencia MIT del catálogo no se extiende automáticamente a ellas.

## Como usarlo como skill

El archivo raíz `SKILL.md` explica cómo seleccionar efectos, cuándo evitar WebGL innecesario, cómo respetar `prefers-reduced-motion`, y las puertas de validación antes de integrar código externo en un producto. Puedes copiar la carpeta como una skill de Qwen Code, Claude Code u otro agente compatible con ese formato.

## Estructura

```text
premium-effects/
├── SKILL.md                  # Guía de decisión e instrucciones de la skill
├── PROJECT_MASTER_PROMPT.md  # Visión, límites y fases de construcción
├── catalog.json              # 11 referencias verificadas, fuente de verdad
├── src/registry.cjs          # Validación, búsqueda y ranking
├── bin/effects.cjs           # CLI offline (categorías, filtros, JSON)
├── tests/registry.test.cjs   # Regresiones reales del buscador
├── tests/smoke.test.js       # Compatibilidad con test existente
└── package.json              # CLI y comandos verificables
```

## Calidad y mantenimiento

```bash
npm run validate
npm test
npm run verify
npm run build
```

`npm run build` ejecuta validación y tests reales: este catálogo no necesita bundler. La CI debe ejecutar exactamente `npm run verify`, nunca pasar porque faltan scripts.

Para añadir recursos: verifica primero que el GitHub remoto es público/no archivado, revisa licencias y documentación, incluye un `id` único y etiquetas útiles en `catalog.json`, añade pruebas y documenta la fecha de verificación. No copies activos ajenos sin permiso. Los secretos o tokens de GitHub no son necesarios para búsquedas locales.

## Licencia

MIT para **el código y los metadatos de este repositorio**. Proyectos externos conservan derechos/licencias propios.
