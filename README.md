# Cineclub-AI
### Llegó la solución para tus sábados a la noche! 🥳🙌🎬🍿🎥 
### Cineclub es una plataforma que te ayuda a elegir qué pelicula ver entre todas las opciones posibles. ¿Cómo lo hace? A través de un chatbot contruido con inteligencia artifical que te arma una lista de peliculas en base a tus preferencias de género, año de lanzamiento, rating global e idioma original.
### Antes tenías que entrar a cada servicio de streaming, ver que peliculas tienen para ofrecer, filtrarlas por el genero que te guste, seleccionar una entre todas las opciones y buscar que reviews tiene. Ahora todo eso se simplifica con un click!
![alt text](/src/public/image.png)
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



## **Users Stories**
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
   - [ ] El sistema debe agrupar los mensajes de una misma conversación bajo un mismo sessionId usando la lógica de upsert, evitando duplicar documentos en la base de datos por cada interacción y logrando una persistencia única por sesion.
   - [ ] Al registrar la respuesta del asistente, el documento en MongoDB debe guardar tanto el texto plano como el array de objetos de la propiedad movies para conservar las tarjetas de películas recomendadas.
   - [ ] Al ingresar un ID válido, la API de Next.js debe resolver los parámetros de la URL de forma asíncrona y renderizar en la ChatWindow la conversación cronológica completa con sus respectivas MovieCards. Si el usuario ingresa un ID inexistente o incorrecto, el buscador no debe limpiar el chat actual y debe desplegar un mensaje flotante de advertencia indicando que el ID no es válido.
   - [ ] Al enviar un nuevo mensaje dentro de un chat recuperado, el frontend debe heredar el sessionId actual para que los nuevos mensajes se sigan anexando a ese mismo registro en la base de datos.


## Stack Tecnológico

El stack fue seleccionado estratégicamente para garantizar un tipado estricto de punta a punta, baja latencia y una arquitectura altamente escalable:

* **Next.js (App Router):** Framework principal de React. Permite la convivencia de componentes del lado del cliente (`"use client"`) para una UI reactiva con rutas de API asíncronas dinámicas (`/api/chat/[id]`).
* **OpenAI API:** Motor cognitivo de procesamiento de lenguaje natural. Se utiliza este modelo específico debido a su velocidad, eficiencia de costos y compatibilidad nativa con **Outputs Estructurados** en formato JSON.
* **TMDB API:** Fuente externa e indexada para el catálogo de cine. Nos da los títulos, calificaciones reales, idiomas y años de lanzamiento de las películas.
* **MongoDB & Mongoose:** Base de datos NoSQL documental orientada a almacenar el historial conversacional semiestructurado e incremental. Mongoose actúa como el ODM para forzar la validación estricta de esquemas.


## Arquitectura del Sistema

El proyecto implementa una estructura desacoplada basada en la **Separación de Responsabilidades** y el **Patrón Repositorio**, aislando la lógica de datos de la lógica de negocio:

```text
src
├── app/
│   ├── api/
│   │   └── chat/
│   │       ├── [id]/
│   │       │   └── route.ts       # Endpoint GET para historial
│   │       └── route.ts           # Endpoint POST para chat
│   ├── components/
│   │   ├── chatWindow/
│   │   │   └── ChatWindow.tsx 
│   │   ├── header/
│   │   │   └── Header.tsx     
│   │   └── movieCard/  
│   │       └── MovieCard.tsx                 
│   └── page.tsx 
│   └── layout.tsx                  
└── backend/
    ├── controllers/
    │   └── chatController.ts
    ├── db.ts                 # Singleton conexión única MongoDB
    ├── interfaces/
    │   └── chatRepositoryInterface.ts 
    │   └── movieInterface.ts 
    ├── prompts/
    │   └── intentPrompt.ts       
    ├── repositories/
    │   ├── mongoChatRepository.ts 
    │   └── tmdbApiRepository.ts 
    │   └── tmdbLocalRepository.ts     
    └── schemas/
        ├── chatModel.ts           # Esquema Mongoose(ChatSession)
        ├── intentSchema.ts        
        └── movieSchema.ts  
    └── services/
        └── tmdbService.ts  
```

## Justificaciones del desarrollo
El backend se construyó bajo principios de arquitectura limpia, aplicando patrones de diseño de software para desacoplar la lógica, evitar el código espagueti y facilitar la mantenibilidad a largo plazo.

**Separación de Responsabilidades (Arquitectura en Capas)**
Para evitar que una sola función maneje la petición HTTP, hable con la IA, consulte el catálogo y guarde en la base de datos, el flujo se dividió estrictamente en tres capas independientes:
* **Capa del Controlador (`chatController.ts`):** Actúa pura y exclusivamente como el orquestador del flujo. Se encarga de recibir los datos del cliente, coordinar el orden de ejecución (primero clasifica la intención, luego decide si llama al catálogo o al chat de contingencia) y estructurar la respuesta final que vuelve al frontend. No sabe *cómo* se buscan las películas ni *cómo* se guardan los datos.
* **Capa del Servicio (`tmdbApiRepository` / capa de negocio):** Es el especialista del catálogo externo. Su única responsabilidad es procesar los filtros limpios que le envía el controlador, armar la query HTTP para la API de TMDB usando Axios, y transformar la respuesta cruda de la API externa en una entidad de negocio tipada como `Movie[]`.
* **Capa del Repositorio (`mongoChatRepository.ts`):** Es el gestor de la persistencia. Se encarga de la interacción directa con MongoDB a través de Mongoose. Recibe los payloads ordenados y se encarga del almacenamiento atómico, abstrayendo por completo al resto del sistema de las consultas de la base de datos.

**Patrón de Refactorización y Diseño Basado en Contratos:**
Al definir interfaces y contratos antes de codificar la lógica, logramos que los componentes dependan de abstracciones y no de implementaciones concretas. Esto significa que si el día de mañana se decide migrar la persistencia de MongoDB a PostgreSQL o Firebase, basta con crear un nuevo repositorio que respete la interfaz `IChatRepository` e inyectarlo en el controlador. **No se requiere tocar una sola línea de código de la lógica de OpenAI ni del controlador principal.**

**Operación Atómica Upsert Nativa:**
Para solucionar el problema de la fragmentación de hilos (donde el historial se duplicaba o guardaba mensajes de forma aislada), se refactorizó el almacenamiento manual por la instrucción nativa `{ upsert: true }` combinada con el operador `$set` de Mongoose.
Delegamos la validación de existencia al motor de la base de datos. MongoDB decide de forma atómica si reemplaza el array cronológico completo (`messages`) o crea el documento inicial de un solo tiro si el `sessionId` no existía, garantizando la consistencia absoluta de las sesiones de chat.

## Instalaciones previas
### Requisitos Previos
1. Tener instalado **MongoDB** de forma local corriendo en el puerto por defecto (`mongodb://localhost:27017/`) o contar con una URI de **MongoDB Atlas** en la nube.
2. Contar con una cuenta y credenciales activas en las plataformas de desarrolladores de **OpenAI** y **TMDB**.
3. Crear un archivo `.env` en la raíz del proyecto configurado de la siguiente manera:
   ```env
   DATABASE_URL="mongodb://localhost:27017/cineclub"
   OPENAI_API_KEY="tu_api_key_de_openai"
   TMDB_API_KEY="tu_api_key_de_tmdb"
   ```
### Dependencias
**Producción (dependencies)**
+ `axios`: Cliente HTTP para el consumo asíncrono y mapeo de la API externa de TMDB.
+ `openai`: SDK oficial para la comunicación e integración con el modelo gpt-4o-mini.
+ `mongoose`: ODM nativo para la conexión, modelado y persistencia atómica en MongoDB.
+ `zod`: Librería de declaración y validación de esquemas en tiempo de ejecución (análisis de outputs del LLM).
+ `next`: Framework base del entorno de ejecución de la aplicación.
+ `react y react-dom`: Biblioteca de interfaz de usuario.

**Desarrollo (devDependencies)**
+ `typescript`: Entorno de tipado estricto para el frontend y backend.
+ `@types/node, @types/react, @types/mongoose`: Tipados estricto del ecosistema.
+ `tailwindcss`: Framework de estilos CSS para el diseño visual de la interfaz.
+ `jest (o tu suite configurada)`: Motor para la ejecución de pruebas automatizadas.

## Comandos de ejecución
Una vez ejecutado npm run dev, la aplicación estará disponible de forma local en tu navegador ingresando a http://localhost:3000.
````
#1. Instalar todas las dependencias y tipos de TypeScript estrictos
npm install
#2. Levantar el entorno de desarrollo local
npm run dev
#3. Ejecutar la serie de testeos unitarios aislados para controladores y repositorios
npm run test:unitario
````

## Prompt del agente y Few-shots
El archivo `intentPrompt.ts` contiene instrucciones estrictas que aíslan al agente del rol de chat tradicional en la primera fase.
Para asegurar que el modelo entienda cómo mapear el lenguaje informal a filtros estructurados de base de datos, se le inyectan ejemplos estáticos de entrada y salida dentro del system prompt:

Ejemplo inyectado al LLM:

_User: "Recomendame comedias de los 80 con puntuación mayor a 7"_.   
_AI Output: {"intent": "search_movies", "confidence": 0.99, "extractedParameters": {"genres": ["Comedy"], "year": 1980, "rating": 7.0}}_

Esto garantiza que el modelo aumente su tasa de credibilidad a 1 y devuelva exactamente los nombres de propiedades que nuestro backend espera consumir.

## Schema de validacion de output
* **Validaciones de Zod**: El `intentAnalysisSchema` valida la respuesta estructurada del LLM antes de procesar filtros:

```
export const intentAnalysisSchema = z.object({
  intent: z.enum(['search_movies', 'general_chat']),
  confidence: z.number(),
  extractedParameters: z.object({
    title: z.string().optional(),
    genres: z.array(z.string()).optional(),
    year: z.number().optional(),
    rating: z.number().optional(),
    limit: z.number().optional()
  }).optional()
});
```
* **Validación de Persistencia (Mongoose)**: 
El `ChatSessionSchema` valida que el documento posea de manera estricta la propiedad única de sesión (`sessionId: String`) mapeada en el esquema, resolviendo fallos críticos de integridad.

## Limitaciones
La API externa que utilizamos nos traía los idiomas escritos en inglés, cosa que obligaba al usuario a mandar el idioma en inglés. Para solucionar eso, hardcodeamos la traducción de español a ingles de los idiomas más frecuentes para que al ingresarse el filtro este lo traduzca al ingles y de ahí pueda continuar con la búsqueda de la pelicula.

## Mejoras futuras
[ ] **Watchlist:** Que cada `MovieCard` tenga un ícono de estrella que cuando el usuario lo presione, esa película se guarde en una lista del perfil del usuario. 

[ ] **Calificación propia:** Que el usuario pueda calificar las peliculas que vio y también en base a eso se podría mejorar el algoritmo del agente logrando que haga recomendaciones más acorde al usuario y más personalizadas.

[ ] **Barra con historial:** Que en el constado del chat se encuentre el historial de sesiones del usuario, asi se simplifica la acción de buscar chat por ID.

[ ] **Inicio de sesión:** Para poder implementar las funcionalidades previamente mencionadas, habría que permitirle al usuario registrarse y que dentro de `Usuario` se guarden las sesiones, la lista de peliculas a ver (Watchlist) y las preferencias.

## Capturas de pantalla