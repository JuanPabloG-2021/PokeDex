import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../themes';

export default function PokemonCard({ pokemon, onPress }) {
    const [failedImage, setFailedImage] = useState(false);
    const number = String(pokemon.id).padStart(4, '0');

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${pokemon.name}, número ${number}`}
            onPress={onPress}
            style={({ pressed }) => [
                styles.card,
                pressed && styles.pressed,
            ]}
        >
            {failedImage ? (
                <View style={styles.alternativeImage}>
                    <Text style={styles.initial}>
                        {pokemon.name.charAt(0).toUpperCase()}
                    </Text>
                </View>
            ) : (
                <Image
                    source={{
                        uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
                    }}
                    style={styles.image}
                    resizeMode="contain"
                    onError={() => setFailedImage(true)}
                />
            )}
            <View style={styles.details}>
                <Text style={styles.number}>#{number}</Text>
                <Text numberOfLines={1} style={styles.name}>
                    {pokemon.name}
                </Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        elevation: 2,
        flex: 1,
        marginBottom: spacing.md,
        marginHorizontal: spacing.xs,
        overflow: 'hidden',
        padding: spacing.md,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12,
        shadowRadius: 3,
    },
    pressed: {
        opacity: 0.75,
    },
    image: {
        height: 120,
        width: '100%',
    },
    alternativeImage: {
        alignItems: 'center',
        backgroundColor: colors.surfaceMuted,
        borderRadius: radius.sm,
        height: 120,
        justifyContent: 'center',
        width: '100%',
    },
    initial: {
        color: colors.textPlaceholder,
        fontSize: typography.fontSize.large,
        fontWeight: typography.fontWeight.bold,
    },
    details: {
        alignItems: 'center',
        paddingTop: spacing.sm,
        width: '100%',
    },
    number: {
        color: colors.textSubtle,
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.semibold,
    },
    name: {
        color: colors.text,
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        textTransform: 'capitalize',
    },
});
