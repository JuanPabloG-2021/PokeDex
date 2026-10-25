import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
    TextInput,
} from 'react-native';
import PokemonCard from '../components/PokemonCard';
import EmptyState from '../components/EmptyState';
import {
    getPokemonByNameOrId,
    getPokemonList,
} from '../services/PokemonAPI';
import { colors, radius, spacing, typography } from '../themes';

const PAGE_SIZE = 20;

export default function PokemonScreen({navigation}) {
    const insets = useSafeAreaInsets();
    const [searchTerm, setSearchTerm] = useState('');
    const [pokemonList, setPokemonList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [loadError, setLoadError] = useState(null);
    const [loadMoreError, setLoadMoreError] = useState(null);
    const [searchError, setSearchError] = useState(null);
    const [hasMore, setHasMore] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const offsetRef = useRef(0);
    const hasMoreRef = useRef(false);
    const isLoadingRef = useRef(false);

    const loadPage = useCallback(async (offset, append) => {
        if (isLoadingRef.current || (append && !hasMoreRef.current)) {
            return;
        }

        isLoadingRef.current = true;
        if (append) {
            setIsLoadingMore(true);
            setLoadMoreError(null);
        } else {
            setIsLoading(true);
            setLoadError(null);
        }

        try {
            const page = await getPokemonList({
                limit: PAGE_SIZE,
                offset,
            });

            setPokemonList((current) =>
                append ? [...current, ...page.results] : page.results
            );
            offsetRef.current = offset + page.results.length;
            hasMoreRef.current = Boolean(page.next);
            setHasMore(hasMoreRef.current);
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : 'No se pudo cargar la lista de Pokémon.';

            if (append) {
                setLoadMoreError(message);
            } else {
                setLoadError(message);
            }
            console.error('Error loading Pokémon:', err);
        } finally {
            isLoadingRef.current = false;
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        let isActive = true;
        Promise.resolve().then(() => {
            if (isActive) {
                loadPage(0, false);
            }
        });

        return () => {
            isActive = false;
        };
    }, [loadPage]);

    const handleSearch = useCallback(async () => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        if (!normalizedSearch) {
            setSearchError('Escribe un nombre o número de Pokémon.');
            return;
        }

        if (isLoadingRef.current) {
            return;
        }

        isLoadingRef.current = true;
        setIsSearching(true);
        setSearchError(null);
        setLoadMoreError(null);

        try {
            const foundPokemon = await getPokemonByNameOrId(normalizedSearch);
            setPokemonList([foundPokemon]);
            hasMoreRef.current = false;
            setHasMore(false);
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : 'No se pudo completar la búsqueda.';

            setPokemonList([]);
            hasMoreRef.current = false;
            setHasMore(false);
            setSearchError(message);
            console.error('Error searching Pokémon:', err);
        } finally {
            isLoadingRef.current = false;
            setIsSearching(false);
        }
    }, [searchTerm]);

    const handleClearSearch = useCallback(() => {
        setSearchTerm('');
        setSearchError(null);
        setLoadMoreError(null);
        offsetRef.current = 0;
        hasMoreRef.current = false;
        setHasMore(false);
        loadPage(0, false);
    }, [loadPage]);

    const loadMore = useCallback(() => {
        if (!loadMoreError && hasMoreRef.current) {
            loadPage(offsetRef.current, true);
        }
    }, [loadPage, loadMoreError]);

    const renderFooter = () => {
        if (isLoadingMore) {
            return (
                <View style={styles.footer}>
                    <ActivityIndicator />
                    <Text style={styles.loadingText}>Cargando más Pokémon...</Text>
                </View>
            );
        }

        if (loadMoreError) {
            return (
                <View style={styles.footer}>
                    <Text style={styles.errorText}>{loadMoreError}</Text>
                    <Pressable
                        accessibilityRole="button"
                        onPress={() => loadPage(offsetRef.current, true)}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Reintentar</Text>
                    </Pressable>
                </View>
            );
        }

        return null;
    };

    if (loadError && pokemonList.length === 0) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{loadError}</Text>
                <Pressable
                    accessibilityRole="button"
                    onPress={() => loadPage(0, false)}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Reintentar</Text>
                </Pressable>
            </View>
        );
    }

    if (isLoading && pokemonList.length === 0) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Cargando Pokémon...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
            <Text style={styles.title}>Pokédex Explorer</Text>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={24} color={colors.textPrimary} />
                <TextInput
                    style={styles.input}
                    value={searchTerm}
                    onChangeText={(value) => {
                        setSearchTerm(value);
                        setSearchError(null);
                    }}
                    onSubmitEditing={handleSearch}
                    placeholder="Busca por nombre o número..."
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="off"
                    returnKeyType="search"
                    editable={!isSearching && !isLoading && !isLoadingMore}
                />
                {searchTerm.length > 0 && (
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Limpiar búsqueda"
                        disabled={isSearching || isLoading || isLoadingMore}
                        onPress={handleClearSearch}
                    >
                        <Ionicons name="close-circle" color={colors.textPrimary} size={24} />
                    </Pressable>
                )}
            </View>
            <Pressable
                accessibilityRole="button"
                disabled={isSearching || isLoading || isLoadingMore}
                onPress={handleSearch}
                style={[
                    styles.searchButton,
                    (isSearching || isLoading || isLoadingMore) &&
                        styles.disabledButton,
                ]}
            >
                {isSearching ? (
                    <ActivityIndicator color={colors.white} />
                ) : (
                    <Text style={styles.buttonText}>Buscar</Text>
                )}
            </Pressable>
            {searchError && pokemonList.length > 0 && (
                <Text accessibilityLiveRegion="polite" style={styles.errorText}>
                    {searchError}
                </Text>
            )}
            <FlatList
                data={pokemonList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <PokemonCard 
                        pokemon={item} 
                        onPress={() =>
                            navigation.navigate('PokemonDetail', {
                                pokemonId: item.id,
                            })
                        }
                    />
                )}
                numColumns={2}
                columnWrapperStyle={pokemonList.length > 1 ? styles.row : undefined}
                contentContainerStyle={styles.list}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={() => (
                    <EmptyState
                        icon="search"
                        title={searchError ? 'Sin resultados' : 'No se encontraron Pokémon'}
                        message={
                            searchError || 'Intenta con otro nombre o número de Pokémon.'
                        }
                    />
                )}
            />
            {hasMore && (
                <Text accessibilityLiveRegion="polite" style={styles.progress}>
                    {pokemonList.length} Pokémon cargados
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: spacing.md,
    },
    title: {
        color: colors.text,
        fontSize: typography.fontSize.display,
        fontWeight: typography.fontWeight.bold,
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.sm,
    },
    list: {
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.md,
    },
    row: {
        justifyContent: 'space-between',
    },
    centered: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        padding: spacing.xxl,
    },
    loadingText: {
        color: colors.textSecondary,
        marginTop: spacing.md,
    },
    errorText: {
        color: colors.error,
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    button: {
        alignItems: 'center',
        backgroundColor: colors.primary,
        borderRadius: radius.sm,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.smPlus,
    },
    searchButton: {
        alignItems: 'center',
        backgroundColor: colors.primary,
        borderRadius: radius.xs,
        justifyContent: 'center',
        marginHorizontal: spacing.md,
        marginBottom: spacing.sm,
        minHeight: 44,
        paddingHorizontal: spacing.xxl,
    },
    disabledButton: {
        opacity: 0.65,
    },
    buttonText: {
        color: colors.white,
        fontWeight: typography.fontWeight.semibold,
    },
    footer: {
        alignItems: 'center',
        padding: spacing.lg,
    },
    progress: {
        color: colors.textMuted,
        paddingBottom: spacing.sm,
        textAlign: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.lg,
        backgroundColor: colors.surface,
        borderRadius: radius.sm,
        paddingHorizontal: spacing.xxl,
        height: 46,
        marginTop: spacing.sm,
        marginBottom: spacing.sm,
        borderWidth: 0.5,
        borderColor: colors.border,
    },
    input: {
        flex: 1,
        fontSize: typography.fontSize.md,
        color: colors.textPrimary,
        paddingVertical: 0,
    },
});
