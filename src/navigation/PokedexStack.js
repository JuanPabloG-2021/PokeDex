import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PokemonDetailScreen from "../screens/PokemonDetailScreen";
import PokemonScreen from "../screens/PokemonScreen";

const Stack = createNativeStackNavigator();

export default function PokedexStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen 
                name="PokemonScreen" 
                component={PokemonScreen} 
                options={{
                    title: 'Pokedex', 
                    headerShown: false
                    }}
            />
            <Stack.Screen 
                name="PokemonDetail" 
                component={PokemonDetailScreen} 
                options={{
                    title: 'Detalle del Pokémon', 
                    headerShown: true,
                    headerBackTitle: 'Volver a la lista',
                    }}
            />
        </Stack.Navigator>
    )
}