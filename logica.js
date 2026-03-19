// Definición de clases basadas en Java

class Pokemon {
    constructor(nombre, nivel, tipo) {
        this.nombre = nombre;
        this.nivel = nivel;
        this.tipo = tipo;
    }

    getNombreAtaque() {
        return "un ataque básico";
    }
}

class PokemonAgua extends Pokemon {
    constructor(nombre, nivel, tipo, velocidadNado, puedeBucear) {
        super(nombre, nivel, tipo);
        this.velocidadNado = velocidadNado;
        this.puedeBucear = puedeBucear;
    }

    bombaAgua() {
        return "una potente bomba de agua";
    }

    getNombreAtaque() {
        return this.bombaAgua();
    }
}

class PokemonAire extends Pokemon {
    constructor(nombre, nivel, tipo, rangoVision, velocidadMaxima) {
        super(nombre, nivel, tipo);
        this.rangoVision = rangoVision;
        this.velocidadMaxima = velocidadMaxima;
    }

    crearTornado() {
        return "un poderoso tornado";
    }

    getNombreAtaque() {
        return this.crearTornado();
    }
}

class PokemonTierra extends Pokemon {
    constructor(nombre, nivel, tipo, puntosDefensa, tipoDeRoca) {
        super(nombre, nivel, tipo);
        this.puntosDefensa = puntosDefensa;
        this.tipoDeRoca = tipoDeRoca;
    }

    lanzarRocas() {
        return "un fuerte lanzamiento de rocas";
    }

    getNombreAtaque() {
        return this.lanzarRocas();
    }
}

class PokemonFuego extends Pokemon {
    constructor(nombre, nivel, tipo, temperatura, intensidad) {
        super(nombre, nivel, tipo);
        this.temperatura = temperatura;
        this.intensidad = intensidad;
    }

    llamarada() {
        return "una devastadora llamarada";
    }

    getNombreAtaque() {
        return this.llamarada();
    }
}

class Entrenador {
    constructor(nombreEntrenador, experiencia, medallas, ciudadOrigen, edad, miPokemon) {
        this.nombreEntrenador = nombreEntrenador;
        this.experiencia = experiencia;
        this.medallas = medallas;
        this.ciudadOrigen = ciudadOrigen;
        this.edad = edad;
        this.miPokemon = miPokemon;
    }

    toString() {
        return `Entrenador: ${this.nombreEntrenador} (${this.edad} años) de ${this.ciudadOrigen} | Exp: ${this.experiencia} | Medallas: ${this.medallas}\n Pokemon : ${this.miPokemon.nombre} (${this.miPokemon.tipo})`;
    }
}

class Combate {
    constructor(entrenador1, entrenador2) {
        this.entrenador1 = entrenador1;
        this.entrenador2 = entrenador2;
    }

    iniciarCombate() {
        const pokemon1 = this.entrenador1.miPokemon;
        const pokemon2 = this.entrenador2.miPokemon;

        let resultadoHTML = `
            <h3>--- PRÓXIMO COMBATE ---</h3>
            <p>${pokemon1.nombre} (Nivel ${pokemon1.nivel}) VS ${pokemon2.nombre} (Nivel ${pokemon2.nivel})</p>
            <h3>--- COMIENZA EL COMBATE ---</h3>
        `;

        if (pokemon1.nivel > pokemon2.nivel) {
            resultadoHTML += `<p class="win-text">${pokemon1.nombre} realiza <strong>${pokemon1.getNombreAtaque()}</strong> y gana el combate!</p>`;
            resultadoHTML += `<p class="winner">Ganador: ${this.entrenador1.nombreEntrenador}</p>`;
        } else if (pokemon2.nivel > pokemon1.nivel) {
            resultadoHTML += `<p class="win-text">${pokemon2.nombre} realiza <strong>${pokemon2.getNombreAtaque()}</strong> y gana el combate!</p>`;
            resultadoHTML += `<p class="winner">Ganador: ${this.entrenador2.nombreEntrenador}</p>`;
        } else {
            resultadoHTML += `<p class="tie-text">Tras una dura lucha, ambos Pokémon tienen el mismo nivel y el combate termina en EMPATE.</p>`;
        }

        return resultadoHTML;
    }
}

// --- PokeAPI Service ---
// Centraliza todas las llamadas a https://pokeapi.co/api/v2/pokemon
const PokeAPIService = {
    BASE_URL: "https://pokeapi.co/api/v2/pokemon",
    cache: {},

    // Mapeo de tipos PokeAPI → tipos del juego
    // El stat "speed" se usa como nivel (rango 5-150, da resultados variados)
    TYPE_MAP: {
        water: "agua",
        fire: "fuego",
        flying: "aire",
        ground: "tierra",
        rock: "tierra"
        // el resto → "normal" (clase base Pokemon)
    },

    async getPokemonList(limit = 151) {
        const res = await fetch(`${this.BASE_URL}?limit=${limit}`);
        if (!res.ok) throw new Error("No se pudo cargar la lista de Pokémon");
        const data = await res.json();
        return data.results; // [{ name, url }]
    },

    async getPokemonData(name) {
        if (this.cache[name]) return this.cache[name];
        const res = await fetch(`${this.BASE_URL}/${name}`);
        if (!res.ok) throw new Error(`No se pudo cargar ${name}`);
        const data = await res.json();
        this.cache[name] = data;
        return data;
    },

    buildPokemonInstance(data) {
        const nombre = data.name.charAt(0).toUpperCase() + data.name.slice(1);
        // nivel = stat speed (da un spread interesante de 5 a 150)
        const getStat = (n) => data.stats.find(s => s.stat.name === n)?.base_stat ?? 50;
        const tipoAPI = data.types[0].type.name;
        const tipoJuego = this.TYPE_MAP[tipoAPI] ?? "normal";
        const sprite = data.sprites?.other?.['official-artwork']?.front_default
                    ?? data.sprites?.front_default;

        let pokemon;
        switch (tipoJuego) {
            case "agua":
                pokemon = new PokemonAgua(nombre, getStat('speed'), tipoJuego,
                    getStat('special-attack'), getStat('special-defense') > 60);
                break;
            case "fuego":
                pokemon = new PokemonFuego(nombre, getStat('speed'), tipoJuego,
                    getStat('special-attack'), getStat('attack'));
                break;
            case "aire":
                pokemon = new PokemonAire(nombre, getStat('speed'), tipoJuego,
                    getStat('special-attack'), getStat('speed'));
                break;
            case "tierra":
                pokemon = new PokemonTierra(nombre, getStat('speed'), tipoJuego,
                    getStat('defense'), tipoAPI);
                break;
            default:
                pokemon = new Pokemon(nombre, getStat('speed'), tipoJuego);
        }
        pokemon.spriteUrl = sprite;
        return pokemon;
    }
};

// Instanciamos los Entrenadores (Pokémon se asigna dinámicamente desde la API)
const ashEntrenador = new Entrenador("Ash", 8, 12, "Pueblo Paleta", 17, null);
const mistyEntrenador = new Entrenador("Misty", 5, 9, "Ciudad Celeste", 15, null);
const tomEntrenador = new Entrenador("Tom", 3, 2, "Pueblo Lavanda", 21, null);

// Diccionario de entrenadores para fácil acceso desde la UI
const entrenadores = {
    "Ash": ashEntrenador,
    "Misty": mistyEntrenador,
    "Tom": tomEntrenador
};

// Estado mutable de la UI: Pokémon seleccionados en cada zona
const appState = {
    pokemon1: null,
    pokemon2: null
};

// --- Lógica de UI (Manejo de DOM) ---
document.addEventListener('DOMContentLoaded', () => {
    const select1 = document.getElementById('entrenador1');
    const select2 = document.getElementById('entrenador2');
    const pokemonSelect1 = document.getElementById('pokemon1');
    const pokemonSelect2 = document.getElementById('pokemon2');
    const spinner1 = document.getElementById('spinner1');
    const spinner2 = document.getElementById('spinner2');
    const btnLuchar = document.getElementById('btn-luchar');
    const panelResultados = document.getElementById('panel-resultados');
    const resultadosContent = document.getElementById('resultados-content');

    // Actualiza la UI visual de un Pokémon en una zona
    const updatePokemonUI = (zone, pokemon) => {
        const img = zone.querySelector('.pokemon-img');
        const nameLabel = zone.querySelector('.pokemon-name');
        const levelLabel = zone.querySelector('.pokemon-level');
        const typeLabel = zone.querySelector('.pokemon-type');

        img.src = pokemon.spriteUrl || '';
        nameLabel.textContent = pokemon.nombre;
        levelLabel.textContent = `Vel: ${pokemon.nivel}`;
        typeLabel.textContent = `Tipo: ${pokemon.tipo.toUpperCase()}`;
        typeLabel.className = `pokemon-type tipo-${pokemon.tipo.toLowerCase()}`;
    };

    // Muestra error en la zona de display
    const showZoneError = (zone, msg) => {
        const nameLabel = zone.querySelector('.pokemon-name');
        nameLabel.textContent = msg;
    };

    // Habilita/deshabilita el botón luchar según el estado
    const updateBtnLuchar = () => {
        btnLuchar.disabled = !(appState.pokemon1 && appState.pokemon2);
    };

    // Carga y muestra un Pokémon al seleccionarlo
    const onPokemonSelect = async (selectEl, spinnerEl, zoneClass, stateKey) => {
        const name = selectEl.value;
        if (!name) return;

        const zone = document.querySelector(`.${zoneClass}`);
        spinnerEl.classList.remove('oculto');

        try {
            const data = await PokeAPIService.getPokemonData(name);
            const pokemon = PokeAPIService.buildPokemonInstance(data);
            appState[stateKey] = pokemon;
            updatePokemonUI(zone, pokemon);
        } catch (e) {
            appState[stateKey] = null;
            showZoneError(zone, "Error al cargar. Prueba otro Pokémon.");
        } finally {
            spinnerEl.classList.add('oculto');
            updateBtnLuchar();
        }
    };

    // Rellena los dos selectores de Pokémon con la lista de la API
    const initPokemonSelects = async () => {
        try {
            const list = await PokeAPIService.getPokemonList(151);

            [pokemonSelect1, pokemonSelect2].forEach(sel => {
                sel.innerHTML = '<option value="">-- Elige un Pokémon --</option>';
                list.forEach(({ name }) => {
                    const opt = document.createElement('option');
                    opt.value = name;
                    opt.textContent = name.charAt(0).toUpperCase() + name.slice(1);
                    sel.appendChild(opt);
                });
                sel.disabled = false;
            });
        } catch (e) {
            [pokemonSelect1, pokemonSelect2].forEach(sel => {
                sel.innerHTML = '<option value="">Error al cargar. Recarga la página.</option>';
            });
        }
    };

    // Listeners de cambio de Pokémon
    pokemonSelect1.addEventListener('change', () =>
        onPokemonSelect(pokemonSelect1, spinner1, 'zona-1', 'pokemon1'));
    pokemonSelect2.addEventListener('change', () =>
        onPokemonSelect(pokemonSelect2, spinner2, 'zona-2', 'pokemon2'));

    // Botón ¡LUCHAR!
    btnLuchar.addEventListener('click', () => {
        if (!appState.pokemon1 || !appState.pokemon2) return;

        const t1 = entrenadores[select1.value];
        const t2 = entrenadores[select2.value];
        t1.miPokemon = appState.pokemon1;
        t2.miPokemon = appState.pokemon2;

        // Activar animaciones de ataque
        document.querySelector('.zona-1 .pokemon-img').classList.add('attack-animation-1');
        document.querySelector('.zona-2 .pokemon-img').classList.add('attack-animation-2');

        setTimeout(() => {
            document.querySelector('.zona-1 .pokemon-img').classList.remove('attack-animation-1');
            document.querySelector('.zona-2 .pokemon-img').classList.remove('attack-animation-2');

            const combate = new Combate(t1, t2);
            resultadosContent.innerHTML = combate.iniciarCombate();
            panelResultados.classList.remove('oculto');
            panelResultados.classList.add('mostrar');
        }, 600);
    });

    // Inicializar: cargar lista de Pokémon desde la API
    updateBtnLuchar();
    initPokemonSelects();
});
