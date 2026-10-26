# PROJECT MASTER PROMPT — premium-effects

## Identidad y contexto
Repositorio **Premium Effects Registry**: selección y búsqueda local de proyectos públicos de efectos visuales para producto creativo/frontend. No es una biblioteca que copie código ajeno ni un motor de generación. Es una guía + catálogo indexable + CLI sin APIs de pago. Respetar naturaleza de herramienta para agentes Qwen/Claude y desarrolladores.

## Estado de origen leído 2026-10-23
- README citaba "50+" enlaces/estrellas, pero SKILL.md faltaba físicamente y muchos enlaces referidos en README devolvían 404. No repetir cifras no verificadas.
- Se verificaron 11 repositorios públicos/no archivados desde GitHub metadata; fuente `catalog.json`.
- No existía búsqueda ejecutable de ese catálogo; los tests previos eran triviales.
- `package.json` declaraba `"type":"skill"` (no es tipo de módulo Node válido) y scripts reales inexistentes.

## Visión de máximo potencial útil
- Catálogo categorizado, **verificable, versionado y con procedencia**; filtros por objetivos visuales, coste de GPU, accesibilidad y licencias.
- Herramienta de búsqueda sin conectores ni red en tiempo de consulta; respuesta con URL original y límites.
- Ingesta futura de fuentes con validación de 404, redirección, licencia y mantenimiento, pero nunca copiar o instalar código automáticamente.
- UX CLI, JSON y skill reutilizable, tests completos y CI reproducible.
- Investigación constante de visuales (liquid metal, WebGL, shaders, tipografía, motion) priorizando solución pequeña y medible.

## Recursos recomendados
- `node:test`: tests sin dependencias ni facturación.
- `node:fs`, CommonJS CLI: consultar catálogo offline en Windows/Linux.
- GitHub repository metadata: verificar URL/canonical/archived con permiso, *solo en tareas de mantenimiento*, no durante búsqueda.
- Web Vitals, DevTools, Lighthouse y Motion Media Query: validar efectos antes de adoptarlos en productos reales.
- Recursos externos de catálogo: licencias independientes, no incluidos como código vendorizado.

## Roadmap
1. **Ahora**: crear SKILL.md real, catálogo inicial de URLs verificadas, CLI de búsqueda, tests y CI que ejecute pruebas reales; actualizar claims.
2. **Después**: filtros por perf/licencia y fuentes, importación con verificador real, versiones de recursos, HTML accesible para explorar visualmente.
3. **Después**: ejemplos seguros de efectos con comparador low/medium/high GPU, reduced-motion y regresiones de captura.
4. **Lanzamiento**: publicar solo resultados verificados, documentar atribución y limitaciones; conservar soporte offline.

## Loop operativo para cada agente
Lee producto/código, verifica enlaces desde origen público, identifica feature útil, añade código y tests en rama y ejecuta pruebas locales. Comprueba commit/readback/diff/CI con pasos reales. No confundir un job que falla sin pasos con un test ejecutado. En caso de bloqueo mantener PR draft y registrar pruebas pendientes. No crear otro repositorio, no gastar, no publicar material privado, no cambiar marca ni separadores arbitrariamente. El máximo no es cantidad ficticia sino uso fiable.
