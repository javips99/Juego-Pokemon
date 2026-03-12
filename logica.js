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

// Instanciamos los Pokémon copiando los datos de Java
const sandshrew = new PokemonTierra("Sandshrew", 70, "tierra", 114, "Granito");
const charizard = new PokemonAire("Charizard", 52, "aire", 300, 120);
const squirtle = new PokemonAgua("Squirtle", 52, "agua", 82, true);

// Instanciamos los Entrenadores copiando los datos de Java
const ashEntrenador = new Entrenador("Ash", 8, 12, "Pueblo Paleta", 17, charizard);
const mistyEntrenador = new Entrenador("Misty", 5, 9, "Ciudad Celeste", 15, sandshrew);
const tomEntrenador = new Entrenador("Tom", 3, 2, "Pueblo Lavanda", 21, squirtle);

// Diccionario de entrenadores para fácil acceso desde la UI
const entrenadores = {
    "Ash": ashEntrenador,
    "Misty": mistyEntrenador,
    "Tom": tomEntrenador
};

// Diccionario de imágenes de Pokémon (usando sprites/artwork oficiales libres de PokeAPI)
const pokemonImages = {
    "Sandshrew": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/27.png",
    "Charizard": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
    "Squirtle": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png"
};

// Lógica de UI (Manejo de DOM)
document.addEventListener('DOMContentLoaded', () => {
    const select1 = document.getElementById('entrenador1');
    const select2 = document.getElementById('entrenador2');

    // Función para actualizar la UI visual de un entrenador/pokemon
    const updateTrainerUI = (selectElement, zoneClass) => {
        const trainerName = selectElement.value;
        const trainer = entrenadores[trainerName];
        const pokemon = trainer.miPokemon;

        const zone = document.querySelector(`.${zoneClass}`);
        const img = zone.querySelector('.pokemon-img');
        const nameLabel = zone.querySelector('.pokemon-name');
        const levelLabel = zone.querySelector('.pokemon-level');
        const typeLabel = zone.querySelector('.pokemon-type');

        // Actualizamos la información mostrada
        img.src = pokemonImages[pokemon.nombre];
        nameLabel.textContent = pokemon.nombre;
        levelLabel.textContent = `Nivel: ${pokemon.nivel}`;
        typeLabel.textContent = `Tipo: ${pokemon.tipo.toUpperCase()}`;

        // Asignamos clase según tipo para el color
        typeLabel.className = `pokemon-type tipo-${pokemon.tipo.toLowerCase()}`;
    };

    // Listeners del cambio de Entrenador en los Selects
    select1.addEventListener('change', () => updateTrainerUI(select1, 'zona-1'));
    select2.addEventListener('change', () => updateTrainerUI(select2, 'zona-2'));

    // Inicializar UI al cargar la página
    updateTrainerUI(select1, 'zona-1');
    updateTrainerUI(select2, 'zona-2');

    // Configuración Botón ¡LUCHAR!
    const btnLuchar = document.getElementById('btn-luchar');
    const panelResultados = document.getElementById('panel-resultados');
    const resultadosContent = document.getElementById('resultados-content');

    btnLuchar.addEventListener('click', () => {
        const t1 = entrenadores[select1.value];
        const t2 = entrenadores[select2.value];

        // Activar animaciones de ataque (choque central)
        document.querySelector('.zona-1 .pokemon-img').classList.add('attack-animation-1');
        document.querySelector('.zona-2 .pokemon-img').classList.add('attack-animation-2');

        // Esperar a que acabe la animación (600ms) y resolver el combate
        setTimeout(() => {
            document.querySelector('.zona-1 .pokemon-img').classList.remove('attack-animation-1');
            document.querySelector('.zona-2 .pokemon-img').classList.remove('attack-animation-2');

            const combate = new Combate(t1, t2);
            resultadosContent.innerHTML = combate.iniciarCombate();
            panelResultados.classList.remove('oculto');
            panelResultados.classList.add('mostrar');
        }, 600);
    });
});
