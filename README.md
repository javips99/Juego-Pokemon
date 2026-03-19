# 🏟️ Estadio Pokémon: De Java a la Web

¡Bienvenido al Estadio Pokémon! Este proyecto es una evolución visual de una aplicación de consola desarrollada originalmente en **Java**, ahora con integración de la **PokeAPI** para elegir entre los 151 Pokémon originales.

## 🚀 Sobre el Proyecto
Este repositorio demuestra la capacidad de transformar lógica pura de programación orientada a objetos (POO) en una interfaz web interactiva y moderna, conectada a una API REST externa.

### 🛠️ Tecnologías utilizadas
* **Lógica Base:** Java (Clases, Herencia y Polimorfismo).
* **Frontend:** HTML5 & CSS3 (Diseño Glass-morphism).
* **Backend/Lógica Web:** JavaScript ES6.
* **API:** [PokeAPI](https://pokeapi.co/) — datos e imágenes en tiempo real.
* **Despliegue:** GitHub Pages.

## 🎮 Cómo Funciona
1. **Selección de entrenador:** Elige uno de los 3 entrenadores (Ash, Misty o Tom).
2. **Selección de Pokémon:** Elige cualquiera de los 151 Pokémon originales cargados desde la PokeAPI.
3. **Combate:** El sistema compara la velocidad (stat *speed*) de los Pokémon para determinar el ganador.
4. **Resultado:** Se muestra el ganador con el ataque especial según el tipo del Pokémon.

## 📂 Estructura del Código
* `logica.js`: Clases `Pokemon`, `PokemonAgua`, `PokemonFuego`, `PokemonAire`, `PokemonTierra`, `Entrenador`, `Combate` y el servicio `PokeAPIService`.
* `index.html`: Estructura del estadio, zonas de combate y selectores de Pokémon.
* `styles.css`: Estética retro con fuentes de Google Fonts y colores por tipo de Pokémon.

---
*Proyecto realizado como estudiante de 1º de DAW.*
