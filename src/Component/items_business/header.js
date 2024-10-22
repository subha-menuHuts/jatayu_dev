import { responsiveWidth } from "react-native-responsive-dimensions";
import { scale, verticalscale } from "../../Constants/PixelRatio";
import { Image, Text, TouchableOpacity, View, TextInput } from "react-native";
import { Icon } from "react-native-basic-elements";

function BusinessListHeader() {
    return (
        <>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Find Your Perfect</Text>
                    <Text style={styles.headerText}>Business</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: scale(8) }}>
                    <View style={styles.searchContainer}>
                        <View style={styles.searchIconContainer}>
                            <Icon
                                type='Feather'
                                name='search'
                                color='#000000'
                                size={20}
                                style={{ position: 'relative' }}
                            />
                        </View>
                        <TextInput
                            placeholder="Search Here"
                            style={styles.searchInput}
                        />
                    </View>
                    <View

                        style={styles.imageBackground}
                    >
                        <TouchableOpacity>
                            <Icon
                                type="FontAwesome"
                                name="sliders"
                                size={20}
                                color='#FFFFFF'
                            // style={styles.panelImage}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    )
}

const styles = {
    container: {
        padding: scale(8),
    },
    header: {
        height: verticalscale(44),
        // width: responsiveWidth(40),
        marginLeft: scale(6),
    },
    headerText:{
        color: '#000000',
        fontSize: scale(18),
        fontWeight: '400',
        
    },
    searchContainer: {
        width: responsiveWidth(80),
        height: verticalscale(40),
        padding: scale(3),
        borderWidth: 0.9,
        borderColor: '#CCCCCC',
        borderRadius: scale(17),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'red'

    },
    searchIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: scale(5),
    },
    searchInput: {
        width: responsiveWidth(70),
        height: verticalscale(40),
        padding: scale(5),
        position: 'relative',
    },
    imageBackground: {
        height: verticalscale(40),
        width: scale(40),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: scale(2),
        borderRadius: scale(50),
        backgroundColor: '#000000',



    },
    panelImage: {
        // height: verticalscale(20),
        // width: scale(20),
    },
};


export default BusinessListHeader