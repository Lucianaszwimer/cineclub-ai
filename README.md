# Cineclub-AI
### Llegó la solución para tus sábados a la noche! 🥳🙌🎬🍿🎥 
### Cineclub es una plataforma que te ayuda a elegir qué pelicula ver entre todas las opciones posibles. ¿Cómo lo hace? A través de un chatbot contruido con inteligencia artifical que te arma una lista de peliculas en base a tus preferencias de género, año de lanzamiento, rating global e idioma original.
### Antes tenías que entrar a cada servicio de streaming, ver que peliculas tienen para ofrecer, filtrarlas por el genero que te guste, seleccionar una entre todas las opciones y buscar que reviews tiene. Ahora todo eso se simplifica con un click!
![alt text](image.png)
### **Problema que resuelve: ¿Qué flujo de trabajo manual automatiza o simplifica?**
Hoy en día con tantas plataformas de streaming, tantas recomendaciones diversas y tanto 
contenido por ver, son muchas las propuestas de películas para ver en tu tiempo libre.
Cineclub viene a resolver esas complicaciones. Unifica todas las peliculas y te muestra aquellas
que cumplen con tus preferencias, ya sea por el género, año de lanzamiento, rating o idioma. Ahora
estas a un click de tener una lista reducida de peliculas que cumplen con tus estándares.

### **Público objetivo: ¿Para quién está diseñado?**
Cineclub esta diseñado para auquellos usuarios amantes del cine que constantemente 
buscan encotrar peliculas nuevas, pero esta especialmente diseñado para los indecisos (como yo je) que tienen miles de recomendaciones pendientes pero no saben decidirse con tantas opciones. 

### **Propuesta de valor: ¿Por qué un usuario lo elegiría frente a hacerlo manualmente?**
Un usuario lo eligiría por sobre hacerlo manualmente porque es más facil elegir una pelicula teniendo todas las opciones en un solo lugar (el chat) y principalmente porque la diferencia de tiempo entre una y otra es abismal. Habiendo tantas plataformas por donde ver peliculas, donde ya de por sí no todas comparten las mismas peliculas y tenes que ir viendo cuales tiene cada una, la busqueda manual pasa a ser una experiencia agotadora que hasta a veces el nivel de agotamiento te saca las ganas de ver una pelicula.

-------------

### **Users Stories**
1) Como cinéfilo interesado en producciones internacionales, quiero **poder pedir películas escribiendo el idioma en español** (ej: "cine japonés" o "películas francesas") para descubrir obras en su versión original sin la necesidad de conocer los códigos técnicos ISO.

    Criterios de aceptación:
    - [ ] El service de la API de TMDB debe interceptar el parámetro original_language.
    - [ ] El sistema debe ser capaz de traducir nombres de idiomas en español (e incluso tolerar tildes como "inglés") a sus equivalentes en inglés requeridos por TMDB.
    - [ ] Debe mapear el nombre del idioma al código ISO de 2 letras correspondiente (ej: "hebreo" -> "he") usando el map.
    - [ ] Si el usuario introduce directamente un código ISO válido de 2 letras, el sistema lo debe procesar sin alterarlo evitando entrar en todo el proceso previamente detallado.
2) Como amante de las películas con más de un género y de la década de los 90, quiero obtener una lista de peliculas que cumplan con **todos** mis criterios para poder disfrutar una pelicula a mi gusto tal cual.

    Criterios de aceptación:
    - [ ] El motor de IA debe ser capaz de extraer múltiples géneros en un array desde un solo mensaje del usuario (ej: si pide "acción y comedia", debe extraer ["accion", "comedia"]).
    - [ ] Cuando el usuario mencione "de la década de los 90", la IA debe interpretar dinámicamente el rango de años y el backend debe filtrar los resultados para que el año de lanzamiento esté estrictamente entre 1990 y 1999 inclusive.
    - [ ] Las películas devueltas por el service de TMDB deben contener todos los géneros solicitados en su listado de genre_ids. No se deben mostrar películas que cumplan con solo uno de los géneros (lógica AND).

3) Como usuario recurrente, quiero que mis conversaciones queden registradas para poder acceder a mensajes viejos.

    Criterios de aceptación:
    - [ ] Cada vez que el usuario envía un mensaje (user) o el bot responde (assistant), la conversación completa debe actualizarse y quedar guardada en el documento correspondiente de la colección ChatSession en MongoDB Compass. 
    - [ ] Si el frontend envía un _sessionId_ válido en la cabecera o cuerpo de la petición, el controlador debe buscar la sesión existente en la base de datos en lugar de crear una nueva.
    - [ ] Al reabrir o refrescar una conversación existente, el componente del frontend (ChatWindow) debe listar cronológicamente todos los mensajes previos guardados en esa sesión.
    - [ ] Si el _sessionId_ que llega desde el frontend tiene un formato corrupto o no se encuentra en la base de datos, el sistema debe crear una sesión limpia automáticamente en lugar de lanzar un error 500 o colgar la app.

------
● ¿Por qué elegiste esas tools/APIs?
● ¿Cómo diseñaste el prompt del agente y qué estrategia de few-shot usás?
● ¿Cómo manejás errores, edge cases y respuestas inesperadas del LLM?
● ¿Qué schema usás para validar outputs estructurados?
● Limitaciones conocidas
● Mejoras futuras planeadas