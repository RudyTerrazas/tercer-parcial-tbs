# Guía del repositorio

## Estructura del proyecto

Este es un sitio educativo estático sobre astronomía. `index.html` contiene las secciones y el contenido; `styles.css`, `journey.css` y `details.css` organizan los estilos base, la experiencia espacial y los ajustes visuales/responsive. `app.js` implementa interacciones, progreso de recorrido, animación del cielo y efectos vinculados al scroll. Los recursos optimizados están en `assets/`; las imágenes de referencia originales se conservan en `imagenes/`.

## Desarrollo local

No hay gestor de paquetes ni proceso de compilación configurado. Desde la raíz del repositorio, inicia un servidor estático con:

```powershell
python -m http.server 8000
```

Abre `http://127.0.0.1:8000/`. Para comprobar sintaxis de JavaScript ejecuta `node --check app.js`. No existe todavía un comando de pruebas automatizadas.

## Estilo y convenciones

Mantén HTML semántico y accesible, CSS organizado por componente/sección y JavaScript sin dependencias innecesarias. Usa dos espacios para la indentación, nombres descriptivos en español para contenido de interfaz y nombres de clase en kebab-case (por ejemplo, `.moon-section`). Conserva los estilos responsive y respeta `prefers-reduced-motion`. Mantén las interacciones utilizables con teclado y controles táctiles.

## Verificación

Al modificar la interfaz, comprueba el sitio en escritorio y móvil, revisa que no aparezca desbordamiento horizontal y prueba navegación, controles interactivos y enlaces. Verifica que imágenes y fuentes se carguen. Ejecuta `node --check app.js` después de cambios en JavaScript; no declares pruebas automatizadas si no se agregaron.

## Commits y solicitudes de cambios

Escribe asuntos de commit breves, enfocados y en modo imperativo, por ejemplo `Improve lunar phase controls`. En una solicitud de cambios describe qué y por qué cambió, enumera las comprobaciones ejecutadas y añade capturas cuando la interfaz sea distinta.

## Configuración y contenido

No incluyas credenciales ni secretos. Para afirmaciones astronómicas, usa fuentes confiables y enlázalas en la página; evita fechas de eventos sin verificar y datos locales no documentados.
