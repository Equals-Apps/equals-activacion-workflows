# Panel de Triggers

Panel interno de Equals11 (Boring Holding) para correr workflows de n8n manualmente vía webhook, sin entrar a la UI de n8n.

## Language

**Correr (un workflow)**:
Acción de ejecutar un workflow de n8n desde el panel, vía webhook.
_Avoid_: Disparar, ejecutar, lanzar

**Trigger**:
El botón/acción del panel que corre un workflow. Se usa en inglés, sin traducir.
_Avoid_: Disparador, gatillo, activador

### Organización

**Boring Holding**:
La holding matriz. Dueña de las distintas entidades/proyectos operativos que corren bajo el panel (Equals11, Tekton, y futuras).

**Equals11**:
Entidad operativa bajo Boring Holding. Único scope de v1 de este panel — todos los workflows de esta versión son de Equals11.

**Tekton**:
Otra entidad operativa bajo Boring Holding, fuera de scope de v1. Candidata a sumarse en versiones futuras del panel.

### Workflows

**New P&L creation**:
Nombre oficial y único del workflow de v1, tal como aparece en n8n. Se usa el mismo nombre en inglés en la conversación diaria — no tiene apodo en español.

### Ambientes

**Sandbox**:
Ambiente donde se corren los workflows con datos que imitan documentos reales, para validar que el workflow y el código funcionan antes de pasarlo a producción. No tiene efecto sobre datos reales del negocio.

**Producción**:
Ambiente donde corren los workflows ya validados en sandbox, con datos y efectos reales sobre el negocio. Un workflow pasa de sandbox a producción una vez que se comprobó que funciona bien.
