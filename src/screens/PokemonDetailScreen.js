import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { getPokemonByNameOrId } from '../services/PokemonAPI';
import {
    formatDecimetersToMeters,
    formatHectogramsToKilograms,
} from '../utils/pokemonFormatters';
import { colors, radius, spacing, typography } from '../themes';

const MAX_BASE_STAT = 255;

export default function PokemonDetailScreen({ navigation, route }) {
    const pokemonId = route.params?.pokemonId;
    const [pokemon, setPokemon] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);

    useEffect(() => {
        let isActive = true;

        async function loadPokemon() {
            if (!pokemonId) {
                setLoadError('No se indicó qué Pokémon mostrar.');
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setLoadError(null);

            try {
                const details = await getPokemonByNameOrId(pokemonId);
                if (isActive) {
                    setPokemon(details);
                }
            } catch (error) {
                if (isActive) {
                    const message =
                        error instanceof Error
                            ? error.message
                            : 'No se pudo cargar el detalle del Pokémon.';
                    setLoadError(message);
                    console.error('Error loading Pokémon details:', error);
                }
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        }

        loadPokemon();
        return () => {
            isActive = false;
        };
    }, [pokemonId]);

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.statusText}>Cargando Pokémon...</Text>
            </View>
        );
    }

    if (loadError || !pokemon) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>
                    {loadError || 'No se pudo cargar el Pokémon.'}
                </Text>
                <Pressable
                    accessibilityRole="button"
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Text style={styles.backButtonText}>Volver</Text>
                </Pressable>
            </View>
        );
    }

    const artwork = pokemon.artworkUrl;

    return (
        <ScrollView
            contentContainerStyle={styles.content}
            style={styles.screen}
        >
            <View style={styles.hero}>
                <Text style={styles.number}>N.º {pokemon.id.padStart(4, '0')}</Text>
                {artwork ? (
                    <Image
                        accessibilityLabel={`Ilustración de ${pokemon.name}`}
                        source={{ uri: artwork }}
                        resizeMode="contain"
                        style={styles.artwork}
                    />
                ) : (
                    <View style={[styles.artwork, styles.artworkFallback]}>
                        <Text style={styles.fallbackLetter}>
                            {pokemon.name.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                )}
                <Text style={styles.name}>{pokemon.name}</Text>
                <View style={styles.types}>
                    {pokemon.types.map(({ slot, name: typeName }) => (
                        <View
                            key={`${slot}-${typeName}`}
                            style={[
                                styles.typeBadge,
                                {
                                    backgroundColor:
                                        colors.types[typeName] || colors.typeFallback,
                                },
                            ]}
                        >
                            <Text style={styles.typeText}>{typeName}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.measurements}>
                <View style={styles.measurement}>
                    <Text style={styles.measurementValue}>
                        {formatDecimetersToMeters(pokemon.height)}
                    </Text>
                    <Text style={styles.measurementLabel}>Altura</Text>
                </View>
                <View style={styles.measurementDivider} />
                <View style={styles.measurement}>
                    <Text style={styles.measurementValue}>
                        {formatHectogramsToKilograms(pokemon.weight)}
                    </Text>
                    <Text style={styles.measurementLabel}>Peso</Text>
                </View>
            </View>

            <View style={styles.statsSection}>
                <Text style={styles.sectionTitle}>Estadísticas base</Text>
                {pokemon.stats.map(({ baseStat, name: statName }) => {
                    const statProgress = Math.min(
                        Math.max((baseStat / MAX_BASE_STAT) * 100, 0),
                        100
                    );
                    const statLabel = statName
                        .replace(/-/g, ' ')
                        .replace(/\b\w/g, (letter) => letter.toUpperCase());

                    return (
                        <View key={statName} style={styles.statRow}>
                            <Text style={styles.statName}>{statLabel}</Text>
                            <Text style={styles.statValue}>{baseStat}</Text>
                            <View
                                accessibilityLabel={`${statLabel}: ${baseStat} de ${MAX_BASE_STAT}`}
                                accessibilityRole="progressbar"
                                accessibilityValue={{
                                    min: 0,
                                    max: MAX_BASE_STAT,
                                    now: baseStat,
                                }}
                                style={styles.statTrack}
                            >
                                <View
                                    style={[
                                        styles.statFill,
                                        { width: `${statProgress}%` },
                                    ]}
                                />
                            </View>
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: spacing.xl,
        paddingBottom: spacing.xxxl,
    },
    centered: {
        alignItems: 'center',
        backgroundColor: colors.background,
        flex: 1,
        justifyContent: 'center',
        padding: spacing.xxl,
    },
    statusText: {
        color: colors.textSecondary,
        marginTop: spacing.md,
    },
    errorText: {
        color: colors.error,
        marginBottom: spacing.lg,
        textAlign: 'center',
    },
    backButton: {
        alignItems: 'center',
        backgroundColor: colors.primary,
        borderRadius: radius.sm,
        paddingHorizontal: spacing.lgPlus,
        paddingVertical: spacing.smPlus,
    },
    backButtonText: {
        color: colors.white,
        fontWeight: typography.fontWeight.semibold,
    },
    hero: {
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: radius.xl,
        padding: spacing.xl,
    },
    number: {
        alignSelf: 'flex-end',
        color: colors.textSubtle,
        fontWeight: typography.fontWeight.semibold,
    },
    artwork: {
        height: 220,
        width: '100%',
    },
    artworkFallback: {
        alignItems: 'center',
        backgroundColor: colors.surfaceMuted,
        justifyContent: 'center',
    },
    fallbackLetter: {
        color: colors.textPlaceholder,
        fontSize: typography.fontSize.hero,
        fontWeight: typography.fontWeight.bold,
    },
    name: {
        color: colors.text,
        fontSize: typography.fontSize.title,
        fontWeight: typography.fontWeight.bold,
        marginTop: spacing.xs,
        textTransform: 'capitalize',
    },
    types: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        justifyContent: 'center',
        marginTop: spacing.md,
    },
    typeBadge: {
        borderRadius: radius.lg,
        minWidth: 76,
        paddingHorizontal: spacing.mdPlus,
        paddingVertical: spacing.smTight,
    },
    typeText: {
        color: colors.white,
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.bold,
        textAlign: 'center',
        textTransform: 'capitalize',
        textShadowColor: colors.textShadow,
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    measurements: {
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: spacing.lg,
        paddingVertical: spacing.lgPlus,
    },
    measurement: {
        alignItems: 'center',
        flex: 1,
    },
    measurementValue: {
        color: colors.text,
        fontSize: typography.fontSize.xxxl,
        fontWeight: typography.fontWeight.bold,
    },
    measurementLabel: {
        color: colors.textSubtle,
        fontSize: typography.fontSize.sm,
        marginTop: spacing.xs,
    },
    measurementDivider: {
        backgroundColor: colors.border,
        height: 36,
        width: 1,
    },
    statsSection: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        marginTop: spacing.lg,
        padding: spacing.lgPlus,
    },
    sectionTitle: {
        color: colors.text,
        fontSize: typography.fontSize.xxl,
        fontWeight: typography.fontWeight.bold,
        marginBottom: spacing.lg,
    },
    statRow: {
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: spacing.mdPlus,
    },
    statName: {
        color: colors.textSecondary,
        flex: 1,
        fontSize: typography.fontSize.sm,
        textTransform: 'capitalize',
    },
    statValue: {
        color: colors.text,
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.bold,
        textAlign: 'right',
        width: 36,
    },
    statTrack: {
        backgroundColor: colors.borderMuted,
        borderRadius: radius.xs,
        height: 8,
        marginTop: spacing.smTight,
        overflow: 'hidden',
        width: '100%',
    },
    statFill: {
        backgroundColor: colors.primary,
        borderRadius: radius.xs,
        height: '100%',
    },
});
