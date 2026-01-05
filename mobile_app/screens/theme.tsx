import {DefaultTheme} from "@react-navigation/native";
import {useTheme} from "react-native-paper";

export function useAppTheme() {
    const md3Theme = useTheme();

    return {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: md3Theme.colors.background,
            primary: md3Theme.colors.primary,
            primaryContainer: md3Theme.colors.primaryContainer,
            onPrimary: md3Theme.colors.onPrimary,
            onPrimaryContainer: md3Theme.colors.onPrimaryContainer,
            secondary: md3Theme.colors.secondary,
        },
    };
}