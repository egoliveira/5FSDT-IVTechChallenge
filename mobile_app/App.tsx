import {MD3LightTheme as DefaultTheme, PaperProvider} from "react-native-paper";
import Navigation from "./navigation/Navigation";
import {Provider} from "react-redux";
import store from "./redux/store";

const theme = {
    ...DefaultTheme,
    "colors": {
        "primary": "rgb(71, 85, 182)",
        "onPrimary": "rgb(255, 255, 255)",
        "primaryContainer": "rgb(223, 224, 255)",
        "onPrimaryContainer": "rgb(0, 13, 95)",
        "secondary": "rgb(95, 98, 0)",
        "onSecondary": "rgb(255, 255, 255)",
        "secondaryContainer": "rgb(229, 234, 93)",
        "onSecondaryContainer": "rgb(28, 29, 0)",
        "tertiary": "rgb(155, 68, 39)",
        "onTertiary": "rgb(255, 255, 255)",
        "tertiaryContainer": "rgb(255, 219, 208)",
        "onTertiaryContainer": "rgb(58, 11, 0)",
        "error": "rgb(186, 26, 26)",
        "onError": "rgb(255, 255, 255)",
        "errorContainer": "rgb(255, 218, 214)",
        "onErrorContainer": "rgb(65, 0, 2)",
        "background": "rgb(255, 251, 255)",
        "onBackground": "rgb(27, 27, 31)",
        "surface": "rgb(255, 251, 255)",
        "onSurface": "rgb(27, 27, 31)",
        "surfaceVariant": "rgb(227, 225, 236)",
        "onSurfaceVariant": "rgb(70, 70, 79)",
        "outline": "rgb(118, 118, 128)",
        "outlineVariant": "rgb(199, 197, 208)",
        "shadow": "rgb(0, 0, 0)",
        "scrim": "rgb(0, 0, 0)",
        "inverseSurface": "rgb(48, 48, 52)",
        "inverseOnSurface": "rgb(243, 240, 244)",
        "inversePrimary": "rgb(187, 195, 255)",
        "elevation": {
            "level0": "transparent",
            "level1": "rgb(246, 243, 251)",
            "level2": "rgb(240, 238, 249)",
            "level3": "rgb(235, 233, 247)",
            "level4": "rgb(233, 231, 246)",
            "level5": "rgb(229, 228, 245)"
        },
        "surfaceDisabled": "rgba(27, 27, 31, 0.12)",
        "onSurfaceDisabled": "rgba(27, 27, 31, 0.38)",
        "backdrop": "rgba(47, 48, 56, 0.4)"
    }
};

if (typeof DOMException === 'undefined') {
    global.DOMException = class DOMException extends Error {
        constructor(message, name) {
            super(message);
            this.name = name || 'DOMException';
        }
    };
}

export default function App() {
    return (
        <Provider store={store}>
            <PaperProvider theme={theme}>
                <Navigation/>
            </PaperProvider>
        </Provider>
    );
}
