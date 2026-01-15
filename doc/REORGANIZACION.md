# Reorganización Profesional del Proyecto Xinocore

## Cambios Realizados

### 1. Archivos CSS Renombrados

| Nombre Anterior | Nombre Nuevo | Descripción |
|----------------|--------------|-------------|
| `styles-clean.css` | `main.css` | Estilos base principales |
| `animations-enhanced.css` | `core.animations.css` | Animaciones del núcleo |
| `epic-effects.css` | `core.effects.css` | Efectos visuales del núcleo |
| `whatsapp-modal.css` | `components.whatsapp.css` | Componente WhatsApp |

### 2. Archivos JavaScript Renombrados

| Nombre Anterior | Nombre Nuevo | Descripción |
|----------------|--------------|-------------|
| `script.js` | `main.js` | Script principal |
| `animations.js` | `core.animations.js` | Animaciones del núcleo |
| `epic-optimized.js` | `core.effects.js` | Efectos del núcleo |
| `whatsapp-modal.js` | `components.whatsapp.js` | Componente WhatsApp |
| `projects.json` | `data.projects.json` | Datos de proyectos |

### 3. Nuevo Archivo de Configuración

**`assets/js/config.js`** - Sistema de configuración global

#### Características:
- Control centralizado de configuraciones
- Sistema de logging condicional
- Modo desarrollo/producción
- Desactivación automática de console logs en producción

#### Uso:

```javascript
// Para activar logs en desarrollo
XinocoreConfig.development = true;

// Para desactivar logs en producción (por defecto)
XinocoreConfig.development = false;

// Usar logging condicional en tus scripts
devLog('Este mensaje solo aparece en desarrollo');
devWarn('Esta advertencia solo aparece en desarrollo');
devError('Este error solo aparece en desarrollo');
```

### 4. Estructura de Carpetas Actualizada

```
rebreand/
├── assets/
│   ├── css/
│   │   ├── main.css                    # Estilos base
│   │   ├── core.animations.css         # Animaciones
│   │   ├── core.effects.css            # Efectos
│   │   └── components.whatsapp.css     # Componentes
│   └── js/
│       ├── config.js                   # ⭐ NUEVO - Configuración
│       ├── main.js                     # Script principal
│       ├── core.animations.js          # Animaciones
│       ├── core.effects.js             # Efectos
│       ├── components.whatsapp.js      # Componentes
│       └── data.projects.json          # Datos
├── index.html
├── portafolio.html
└── REORGANIZACION.md
```

## Convención de Nombres

### Patrón Adoptado:
- **main.*** - Archivos principales
- **core.*** - Funcionalidades del núcleo
- **components.*** - Componentes reutilizables
- **data.*** - Archivos de datos

### Ventajas:
✅ Nombres más descriptivos y profesionales
✅ Fácil identificación del propósito de cada archivo
✅ Mejor organización y escalabilidad
✅ Convención estándar de la industria

## Control de Logs

### Modo Producción (Predeterminado)
Los console logs están **DESACTIVADOS** por defecto:

```javascript
XinocoreConfig.development = false;
```

### Modo Desarrollo
Para activar logs durante desarrollo, cambia en `config.js`:

```javascript
XinocoreConfig.development = true;
```

### Funciones Helper Disponibles
- `devLog(...)` - Reemplaza console.log
- `devWarn(...)` - Reemplaza console.warn
- `devError(...)` - Reemplaza console.error

## Archivos Actualizados

Los siguientes archivos HTML fueron actualizados con las nuevas referencias:
- ✅ `index.html`
- ✅ `portafolio.html`

## Compatibilidad

✅ Todos los archivos mantienen su funcionalidad original
✅ Las referencias en HTML han sido actualizadas
✅ Cache busting versioning mantenido (`?v=3.0`)
✅ Orden de carga optimizado (config.js se carga primero)

---

**Fecha de reorganización:** Noviembre 2, 2025
**Proyecto:** Xinocore - Desarrollo Web
**Versión:** 3.0
