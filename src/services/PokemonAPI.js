const BASE_URL = 'https://pokeapi.co/api/v2/';

export async function getPokemonList({ limit = 20, offset = 0 } = {}) {
    const response = await fetch(
        `${BASE_URL}pokemon?limit=${limit}&offset=${offset}`
    );

    if (!response.ok) {
        throw new Error(`Error al consultar PokéAPI (${response.status})`);
    }

    const data = await response.json();
    const results = data.results.map(({ name, url }) => {
        const id = url.match(/\/pokemon\/(\d+)\/?$/)?.[1];

        if (!id) {
            throw new Error(`No se pudo obtener el ID del Pokémon "${name}"`);
        }

        return { id, name, url };
    });

    return {
        count: data.count,
        next: data.next,
        previous: data.previous,
        results,
    };
}

export async function getPokemonByNameOrId(searchTerm) {
    const normalizedSearch = String(searchTerm ?? '').trim().toLowerCase();

    if (!normalizedSearch) {
        throw new Error('Escribe un nombre o número de Pokémon.');
    }

    const response = await fetch(
        `${BASE_URL}pokemon/${encodeURIComponent(normalizedSearch)}`
    );

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('No se encontró ese Pokémon.');
        }

        throw new Error(`Error al consultar PokéAPI (${response.status})`);
    }

    const data = await response.json();

    return {
        id: String(data.id),
        name: data.name,
        url: `${BASE_URL}pokemon/${data.id}/`,
        height: data.height,
        weight: data.weight,
        types: data.types.map(({ slot, type }) => ({
            slot,
            name: type.name,
        })),
        stats: data.stats.map(({ base_stat: baseStat, stat }) => ({
            baseStat,
            name: stat.name,
        })),
        artworkUrl: data.sprites.other?.['official-artwork']?.front_default ?? null,
    };
}
