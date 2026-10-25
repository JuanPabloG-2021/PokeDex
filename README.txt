# Arquitectura utilizada

El proyecto organiza la interfaz, la navegación, las llamadas a la API y el formateo de datos en carpetas separadas:

```text
src/
├── components/
│   ├── EmptyState.js
│   └── PokemonCard.js
├── navigation/
│   └── PokedexStack.js
├── screens/
│   ├── PokemonScreen.js
│   └── PokemonDetailScreen.js
├── services/
│   └── PokemonAPI.js
├── themes/
│   └── index.js
└── utils/
    └── pokemonFormatters.js
```

## `components`

- **`EmptyState.js`**: reutiliza la idea del componente `EstadoVacio`, trabajado en clases anteriores, para mostrar mensajes cuando no hay resultados. También utiliza iconos de la librería Ionicons, empleada previamente.
- **`PokemonCard.js`**: adapta la lógica del componente `Card.js` de clases anteriores para mostrar cada Pokémon en la lista. Incluye su imagen, número y nombre.

## `navigation`

- **`PokedexStack.js`**: configura la navegación tipo *stack* entre la lista y el detalle del Pokémon. Este patrón permite abrir la ficha y regresar a la pantalla anterior.

## `screens`

- **`PokemonScreen.js`**: es la pantalla principal. Renderiza la lista paginada e incluye la búsqueda, los estados de carga y el manejo de errores y resultados vacíos.
- **`PokemonDetailScreen.js`**: muestra la ficha del Pokémon y obtiene sus datos mediante el endpoint de búsqueda por nombre o ID, el mismo que se utiliza para buscar desde la pantalla principal.

## `services`

- **`PokemonAPI.js`**: concentra las llamadas de red con `fetch` a la PokéAPI. Incluye los métodos para obtener la lista y buscar un Pokémon por nombre o ID, y prepara los datos necesarios para mostrarlos en la interfaz.

## `themes`

- **`index.js`**: centraliza los colores, el espaciado, los radios de borde y los valores de tipografía utilizados por la aplicación.

## `utils`

- **`pokemonFormatters.js`**: contiene las funciones que convierten la altura de decímetros a metros y el peso de hectogramos a kilogramos. De este modo, el formateo queda separado de la interfaz y de la lógica de red.

## Criterio de numeración

La guía solicita mostrar los números de la lista con tres cifras. En esta implementación se muestran con cuatro para representar de forma uniforme los Pokémon con ID superior a 999, dado que la Pokédex supera actualmente los mil registros.