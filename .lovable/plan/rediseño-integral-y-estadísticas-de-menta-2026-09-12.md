# Rediseño integral y estadísticas de Menta

## Objetivo
Unificar la identidad visual de la portada, acceso, intranet y administración; mejorar la navegación para personas mayores; y ampliar los resultados e historial sin cambiar la estructura de la base de datos.

## Cambios
- Ajustar la paleta a un menta oscuro corporativo común, con contraste accesible en modo claro y negro estricto en modo oscuro.
- Rediseñar la marca sin círculo: hoja más grande dentro de un contenedor tipo píldora, reutilizado en todas las pantallas.
- Corregir alineación de controles superiores y completar el pie con copyright dinámico, Términos y Privacidad.
- Simplificar y justificar el texto principal, reforzar las tres frases indicadas, aclarar bordes de las cuatro áreas y quitar el fondo circular de sus iconos.
- Mover la navegación de Mi Perfil, Ejercicios y Mi Progreso a una franja superior visible y reutilizar los mismos iconos cognitivos dentro de la intranet.
- Mostrar bajo los ejercicios el resultado acumulado de la categoría activa sobre 70 puntos y un mensaje de aliento.
- Ampliar Mi Progreso con historial cronológico: puntaje general, desglose por área y fecha, usando los colores de logro existentes.
- Añadir al panel administrador una tabla comparativa por usuario con puntaje total y porcentajes por área, ordenados por logro.
- Añadir un gráfico anual mensual responsivo. Los registros se agruparán por año y mes al consultarlos; los años anteriores quedarán disponibles como períodos históricos sin alterar ni eliminar datos.

## Detalles técnicos
- Mantener `profiles` y `activity_logs` intactas; toda agregación anual se calculará desde `fecha_ejecucion`.
- Ampliar la consulta administrativa para devolver series mensuales agregadas y aplicar filtros actuales cuando corresponda.
- Reutilizar componentes y tokens semánticos existentes; no duplicar lógica de iconos, colores ni navegación.
- Mantener validación, autenticación y políticas de acceso actuales.

## Verificación
- Comprobar portada, acceso, intranet y administración en escritorio y móvil.
- Probar navegación, modo oscuro, registro de resultados, historial, filtros, tabla comparativa y gráfico anual.
- Confirmar que no haya errores visibles ni regresiones de accesibilidad.
