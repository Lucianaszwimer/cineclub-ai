# Cineclub-AI
### Llegó la solución para tus sábados a la noche! 🥳🙌🎬🍿🎥 
### Cineclub es una plataforma que te ayuda a elegir qué pelicula ver entre todas las opciones posibles. ¿Cómo lo hace? A través de un chatbot contruido con inteligencia artifical que te arma una lista de peliculas en base a tus preferencias de género, año de lanzamiento, rating global e idioma original.
### Antes tenías que entrar a cada servicio de streaming, ver que peliculas tienen para ofrecer, filtrarlas por el genero que te guste, seleccionar una entre todas las opciones y buscar que reviews tiene. Ahora todo eso se simplifica con un click!
https://cineclub-ai.vercel.app/

![alt text](/public/image.png)
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
    - [ ] El motor de IA (IntentAnalysisService) debe extraer el parámetro semántico del idioma bajo la propiedad original_language en el JSON validado por Zod.
    - [ ] El servicio de búsqueda (MovieSearchService) debe interceptar este string y normalizarlo usando cleanText para eliminar mayúsculas y tildes (ej: "Inglés" -> "ingles").
    - [ ] El sistema debe resolver de forma asíncrona a través de una caché interna (ensureCache) el mapeo del idioma en español a su traducción en inglés y, posteriormente, a su código ISO de 2 letras (ej: "frances" -> "french" -> "fr") consultando los diccionarios de configuración de TMDB.
    - [ ] Si el usuario introduce directamente un código ISO válido de 2 letras (ej: "en" o "ja"), el resolvedor lógico de filtros debe identificar su longitud y procesarlo de forma directa hacia la query, esquivando el proceso de traducción en memoria.
2) Como amante de las películas con más de un género y de la década de los 90, quiero obtener una lista de peliculas que cumplan con **todos** mis criterios para poder disfrutar una pelicula a mi gusto tal cual.

    Criterios de aceptación:
    - [ ] El `IntentAnalysisService` debe mapear las intenciones de búsqueda múltiple en un array estricto de strings en la propiedad `genres` (ej: ["Comedy", "Action"]) y extraer modificadores de ordenamiento en la propiedad `sort ('best' o 'worst')`.
    - [ ] El `MovieSearchService` debe transformar el array de nombres de géneros a una cadena de IDs numéricos concatenados por comas (lógica AND de TMDB) usando su mapeo.
    - [ ] El servicio debe inyectar dinámicamente los parámetros resultantes al `TmdbApiRepository` (`with_genres`, `vote_average.gte`, `primary_release_year`).
    - [ ] Tras procesar la respuesta, el servicio debe aplicar ordenamiento programático basado en el parámetro `sort (mejores o peores valoradas)`(de haberlo), segmentar la lista usando la propiedad `limit` si existiese, y auditar el contrato final mediante la validación del esquema `movieArraySchema` de Zod antes de retornar la respuesta..

3) Como usuario recurrente, quiero que mis conversaciones queden registradas para poder acceder a mensajes viejos.

    Criterios de aceptación:
   - [ ] Al iniciar una interacción en el `ChatWindow` sin un identificador activo, el caso de uso del backend (`HandleChatUseCase`) debe autogenerar un ID único mediante `randomUUID()`.
   - [ ] El `ChatRepository` debe implementar una operación atómica de `findOneAndUpdate` con `{ upsert: true, runValidators: true }` hacia MongoDB Atlas, asegurando que los nuevos mensajes (con sus respectivos textos planos, marcas de tiempo y subdocumentos embebidos de MovieEntity) se anexen o actualicen sin duplicar documentos físicos de sesión.
   - [ ] El Frontend (`App.tsx`) debe capturar esta respuesta y guardar de forma síncrona en el LocalStorage del navegador un resumen ligero (`ChatSessionSummary`) que incluya el id, el title autogenerado y la fecha de actualización, permitiendo funciones inmediatas de borrado o renombrado personalizado en el `Sidebar`.
   - [ ] Al ingresar un ID en el buscador del `Header` o seleccionar un elemento del `Sidebar`, el cliente debe realizar una petición asíncrona al endpoint `GET /chat/:id` de NestJS. El backend debe invocar al `GetSessionUseCase` y, en caso de no hallar el registro, disparar una excepción formal de `NotFoundError` controlada por el filtro global, la cual el frontend capturará para desplegar una alerta en pantalla sin destruir el estado del chat actual.


## Stack Tecnológico

El stack fue seleccionado estratégicamente para garantizar una arquitectura altamente escalable y desacoplada:

* **Frontend (Vite + React):** Entorno de desarrollo muy rápido basado en ESM nativos, garantizando interfaces reactivas, manejo dinámico de estados de carga y renderizado inmediato.
* **Backend (NestJS):** Framework progresivo de Node.js en TypeScript, implementando una arquitectura modular limpia guiada por casos de uso (Domain-Driven Design principles) y el patrón repositorio.
* **OpenAI API:** Motor cognitivo de procesamiento de lenguaje natural. Se utiliza este modelo específico debido a su velocidad, eficiencia de costos y compatibilidad nativa con outputs estructurados en formato JSON.
* **TMDB API:** Fuente externa e indexada para el catálogo de cine. Nos da los títulos, calificaciones reales, idiomas y años de lanzamiento de las películas.
* **MongoDB & Mongoose:** Base de datos NoSQL documental orientada a almacenar el historial conversacional semiestructurado de forma persistente.

## Arquitectura Real del Sistema

El proyecto implementa una separación absoluta de responsabilidades:

```text
src
├── backend/
│   ├── chat/
│   │   ├── controllers/
│   │   │   └── chat.controller.ts        # Orquestador de endpoints HTTP de chat
│   │   ├── dto/
│   │   │   └── chat.dto.ts               # Objetos de Transferencia de Datos de entrada
│   │   ├── interfaces/
│   │   │   └── chat.types.ts             # Contratos y tipos del dominio del chat
│   │   ├── prompts/
│   │   │   └── intent.prompt.ts          # System Prompt aislado con Few-Shots
│   │   ├── repositories/
│   │   │   └── chat.repository.ts        # Abstracción de persistencia de datos
│   │   ├── schemas/
│   │   │   ├── chat.schema.ts            # Esquema de persistencia Mongoose (ChatSession)
│   │   │   └── intent.schema.ts          # Estructura del clasificador de IA
│   │   ├── services/
│   │   │   ├── general-chat.service.ts   # Servicio para intenciones conversacionales libres
│   │   │   └── intent-analysis.service.ts# Servicio experto en análisis semántico con OpenAI
│   │   ├── use-cases/
│   │   │   ├── get-session.usecase.ts    # Caso de uso: Recuperación histórica de hilos
│   │   │   └── handle-chat.usecase.ts     # Caso de uso: Flujo principal del agente cognitivo
│   │   └── chat.module.ts                # Módulo encapsulador de NestJS para Chat
│   ├── common/                           # Capa transversal (Filtros, Pipes, Interceptores)
│   │   ├── errors/ App.error.ts
│   │   ├── filters/ http-exception.filter.ts
│   │   ├── interceptors/ internal-api-key.guard.ts | logging.interceptor.ts
│   │   ├── middlewares/ request-id.middleware.ts
│   │   └── pipes/ zod-validation.pipe.ts # Validación estricta en tiempo de ejecución
│   ├── config/                           # Configuración tipada del entorno (.env)
│   ├── database/                         # Inicialización de Mongoose
│   ├── test/                             # Suites de pruebas del backend
│   └── tmdb/                             # Módulo independiente especialista en el catálogo externo
│       ├── adapters/ tmdb-movie.adapter.ts
│       ├── interfaces/ movie-filters.ts | tmdb.types.ts
│       ├── repositories/ tmdb-api.repository.ts
│       └── services/ movie-search.service.ts
├── frontend/                             # Cliente SPA reactivo independiente
│   ├── components/
│   │   ├── chatWindow/ ChatWindow.tsx    # Interfaz del chat conversacional
│   │   ├── header/ Header.tsx            # Buscador global de sesiones por ID
│   │   ├── movieCard/ MovieCard.tsx      # Renderizado visual enriquecido de films
│   │   └── sidebar/ Sidebar.tsx          # Panel lateral histórico
│   ├── lib/ api.ts                       # Cliente Axios configurado con la URL base
│   └── styles/ globals.css
└── shared/                               # Tipados e interfaces compartidas
    └── types/ chat.ts | movie.ts
```

## Justificaciones del desarrollo
El backend y el frontend se estructuraron bajo principios de arquitectura limpia y patrones de diseño empresariales para desacoplar componentes y garantizar la resiliencia del sistema:

### 1. Inyección de Módulos Asíncronos (`DatabaseModule`)
Para evitar conexiones en frío o bloqueos en hilos de ejecución durante el inicio de la aplicación, la base de datos implementa el patrón **`forRootAsync`**. La inicialización de Mongoose inyecta dinámicamente el `AppConfigService`, leyendo las credenciales de `DATABASE_URL` y asilando el catálogo bajo el espacio de nombres de la base de datos `cineclub`, garantizando que el servidor NestJS solo se declare "Listo" si la conexión con MongoDB es exitosa.

### 2. Patrón Adaptador (`TmdbMovieAdapter`)
La API externa de TMDB devuelve esquemas mutables que pueden romper los contratos de datos del Frontend. Para mitigar esto, se implementó el **Patrón Adaptador**. La clase `TmdbMovieAdapter` encapsula la mutación del tipado de infraestructura externo (`TmdbMovieResult`) y lo mapeo de forma pura a la entidad limpia de nuestro dominio (`Movie`), abstrayendo detalles como la extracción del año a través del split del string de la fecha (`release_date`) y controlando los edge cases con valores por defecto y géneros de fallback.

### 3. Optimización de Memoria y Cache Warming en Catálogos (`MovieSearchService`)
Para evitar realizar peticiones HTTP reiteradas e ineficientes a los endpoints estáticos de géneros e idiomas de TMDB en cada interacción del chat, el servicio implementa una estrategia de **Calentamiento de Caché Asíncrona (`ensureCache`)**. Mediante `Promise.all`, la primera petición del usuario gatilla la descarga paralela de configuraciones, estructurando mapas bidireccionales en memoria (`Map<string, number>`). Las búsquedas subsecuentes resuelven filtros idiomáticos complejos (como traducir castellano o inglés a sus ISOs nativos como 'es' o 'en') de forma instantánea a velocidad de memoria $O(1)$.

### 4. Cañerías de Validación Desacopladas (`ZodValidationPipe`)
En lugar de validar los datos dentro de los controladores o casos de uso, se encapsuló la validación en la frontera del framework de NestJS utilizando **Pipes personalizados**. `ZodValidationPipe` actúa como una aduana interceptora HTTP: ejecuta un `safeParse` asíncrono y, si el payload no cumple las condiciones estructurales de entrada, interrumpe el flujo arrojando una excepción de dominio (`ValidationError`) con la estructura flatten de los errores, protegiendo las capas internas del negocio de datos corruptos.

### 5. Frontend Híbrido: Persistencia Local y Sincronización de Sesiones (`App.tsx`)
El cliente implementa una arquitectura reactiva que balancea la eficiencia local con la persistencia en la nube.
* **Caché en el Cliente (`LocalStorage`):** Almacena y ordena cronológicamente resúmenes ligeros (`ChatSessionSummary`) de hasta 40 sesiones para montar la interfaz de forma inmediata, permitiendo operaciones rápidas de renombrado (`handleRenameSession`), borrado (`handleDeleteSession`) y limpieza total sin latencia de red.
* **Sincronización por Demanda:** Cuando el usuario selecciona una sesión del historial, el frontend dispara llamadas asíncronas dirigidas al backend (`/chat/${id}`) recuperando el array cronológico completo de mensajes y tarjetas de películas desde MongoDB Atlas de manera transparente, controlando de manera óptima los estados visuales de carga (`isLoadingSession`).

## Instalaciones previas
### Requisitos previos
* **Node.js:** Versión v20.19+ o v22.12+ (Requisito estricto del motor de desarrollo de Vite para el uso de eventos personalizados nativos de JavaScript).
* **Base de Datos:** Instancia activa de **MongoDB** local (corriendo en el puerto por defecto `27017`) o un clúster de producción en **MongoDB Atlas**.
* **Integraciones Externas:** Claves válidas en las consolas de desarrolladores de **OpenAI** y **The Movie Database (TMDB)**.

### Variables de Entorno (.env)
Creá un archivo `.env` en la raíz del proyecto configurado de la siguiente manera:
```env
DATABASE_URL="mongodb://localhost:27017/cineclub"
OPENAI_API_KEY="tu_api_key_de_openai"
TMDB_API_KEY="tu_api_key_de_tmdb"

# Puertos y Orígenes locales
NEST_PORT=3002
VITE_API_BASE_URL=http://localhost:3002
   ```

### Dependencias y librerías utilizadas
**Producción (`dependencies`)**
* **`@nestjs/common` & `@nestjs/core`**: Núcleo del framework progresivo para estructurar el backend modular mediante inyección de dependencias nativa.
* **`@nestjs/mongoose` & `mongoose`**: Conectores y Modeladores de Objetos de Dominio (ODM) para interactuar de manera fluida y asíncrona con MongoDB Atlas.
* **`openai`**: SDK oficial para orquestar las llamadas cognitivas, gestionar contextos e implementar Structured Outputs con el modelo `gpt-4o-mini`.
* **`axios`**: Cliente HTTP basado en promesas encargado de consumir los endpoints indexados del catálogo de películas de TMDB.
* **`zod`**: Motor de declaración y tipado en tiempo de ejecución utilizado para auditar las intenciones extraídas por la Inteligencia Artificial.
* **`class-validator` & `class-transformer`**: Librerías utilizadas para la validación estricta de payloads entrantes en los DTOs mediante decoradores antes de tocar los controladores.
* **`react` & `react-dom`**: Librería base para la declaración e interactividad del panel del chat y las interfaces dinámicas del cliente.
* **`lucide-react`**: Set de iconos optimizados e ilustrativos para enriquecer la botonera y las tarjetas visuales del frontend.
* **`concurrently`**: Utilidad de terminal que permite iniciar en paralelo las instancias de Vite y NestJS con un comando unificado (`npm run dev:full`).

**Desarrollo (`devDependencies`)**
* **`typescript` & `@types/*`**: Configuración del compilador y tipado estricto estático de datos para mitigar bugs en desarrollo en todo el árbol de directorios.
* **`vite` & `@vitejs/plugin-react`**: Entorno de empaquetado y servidor de desarrollo instantáneo del cliente frontend.
* **`tsx`**: Ejecutor de tiempo de ejecución de TypeScript ultrarrápido con soporte nativo de Hot-Reload (`watch`) para el servidor NestJS sin compilaciones intermedias pesadas.
* **`tailwindcss` & `@tailwindcss/vite`**: Motor de estilos CSS v4 integrado a través del pipeline nativo de Vite, permitiendo compilaciones fluidas y diseño de UI responsivo basado en clases de utilidad.
* **`eslint`**: Analizador estático encargado de auditar la prolijidad del código y asegurar buenas prácticas de ingeniería en el desarrollo.

## Comandos de ejecución
Una vez ejecutado npm run dev, la aplicación estará disponible de forma local en tu navegador ingresando a http://localhost:5173.
````
# 1.Instalar el árbol completo de dependencias y tipados de TypeScript
npm install

# 2.Levantar el ecosistema Fullstack en paralelo (Frontend + Backend)
npm run dev:full

# 3.Levantar componentes individuales (En terminales separadas si es necesario)
npm run dev       # Enciende Servidor Frontend (Vite)
npm run dev:nest  # Enciende Servidor Backend (NestJS + Tsx Watch)

# 4. Correr la suite completa de pruebas automatizadas
npm run test
````

## Prompt del agente y Few-shots
El archivo `intentPrompt.ts` contiene instrucciones estrictas que aíslan al agente del rol de chat tradicional en la primera fase.
A través de técnicas de **Few-Shot Learning**, se proveen pares de ejemplos estructurados de interacciones humanas y mapeos esperados. Esto entrena al modelo para abstraer ambigüedades idiomáticas (ej: "recomendame algo de terror que no sea viejo") y transformarlas en filtros deterministas entendibles por el backend, tales como rangos numéricos de años, listados específicos de géneros mapeados e intenciones delimitadas (`search_movies` o `general_chat`).

Ejemplo inyectado al LLM:

_User: "Recomendame comedias de los 80 con puntuación mayor a 7"_.   
_AI Output: {"intent": "search_movies", "confidence": 0.99, "extractedParameters": {"genres": ["Comedy"], "year": 1980, "rating": 7.0}}_

Esto garantiza que el modelo aumente su tasa de credibilidad a 1 y devuelva exactamente los nombres de propiedades que nuestro backend espera consumir.

## Schema de validacion de output
* **Validaciones de Zod**: El `intentAnalysisSchema` de Zod valida estructuralmente la respuesta que devuelve OpenAI. Si el modelo alucina propiedades inválidas o deforma los tipos de datos, el parser interrumpe el flujo y lanza un `ValidationError` antes de golpear los servicios internos:

```
export const intentAnalysisSchema = z.object({
  intent: z.enum(['search_movies', 'general_chat']),
  confidence: z.number().min(0).max(1),
  extractedParameters: z.object({
    title: z.string().optional(),
    genres: z.array(z.string()).optional(),
    year: z.number().optional(),
    rating: z.number().optional(),
    original_language: z.string().optional(),
    limit: z.number().int().positive().optional(),
    sort: z.enum(['worst', 'best']).optional()
  }),
  explanation: z.string()
});
```
* **Validación de Persistencia (Mongoose)**: 
Una vez resuelta la lógica de negocio, los esquemas de Mongoose garantizan la integridad y normalización de los documentos de las conversaciones almacenados en la base de datos:
   * `MovieEntity`: Fuerza un esquema estricto embebido sin identificador propio (_id: false). Valida tipos estrictos (title como String, genres como un array indexado de cadenas de texto, y un rango numérico rígido para valoraciones con min: 0, max: 10).

  * `ChatMessageEntity`: Controla el rol de los emisores restringiendo el campo a un enumerador exacto ('user' | 'assistant' | 'system'), encapsulando las colecciones de películas opcionales resultantes de la búsqueda y automatizando la estampa de tiempo (createdAt).

  * `ChatSessionEntity`: Asegura el índice único del identificador conversacional (sessionId) aplicando técnicas de saneamiento de datos (trim: true) para agilizar las indexaciones y consultas cronológicas del cliente.

## Limitaciones
La API externa que utilizamos nos traía los idiomas escritos en inglés, cosa que obligaba al usuario a mandar el idioma en inglés. Para solucionar eso, hardcodeamos la traducción de español a ingles de los idiomas más frecuentes para que al ingresarse el filtro este lo traduzca al ingles y de ahí pueda continuar con la búsqueda de la pelicula.

## Mejoras futuras
[ ] **Watchlist:** Que cada `MovieCard` tenga un ícono de estrella que cuando el usuario lo presione, esa película se guarde en una lista del perfil del usuario. 

[ ] **Calificación propia:** Que el usuario pueda calificar las peliculas que vio y también en base a eso se podría mejorar el algoritmo del agente logrando que haga recomendaciones más acorde al usuario y más personalizadas.

[ ] **Actualizacion de BD:** Cuando se borra la sesion del chat en el front, que tambien se borre en la base de datos.

[ ] **Inicio de sesión:** Para poder implementar las funcionalidades previamente mencionadas, habría que permitirle al usuario registrarse y que dentro de `Usuario` se guarden las sesiones, la lista de peliculas a ver (Watchlist) y las preferencias.

## Capturas de pantalla
![alt text](</public/screen-cineclub.png>)

## Bonus
* **Test Unitarios**
* **Uso de archivo prompt para el razonamiento del agente**