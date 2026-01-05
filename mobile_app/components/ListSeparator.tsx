import {StyleSheet, View} from "react-native";

const ListSeparator = () => {
    return (<View style={styles.separator}/>)
};

const styles = StyleSheet.create({
    separator: {
        height: 8
    }
});

export default ListSeparator;