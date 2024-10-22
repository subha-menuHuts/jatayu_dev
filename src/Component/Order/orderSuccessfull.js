import { responsiveScreenHeight, responsiveScreenWidth } from "react-native-responsive-dimensions";
import { moderartescale, scale, verticalscale } from "../../Constants/PixelRatio";
import { ScrollView } from "react-native-gesture-handler";
import { View, Text, Image, StyleSheet } from "react-native";
import { Icon } from "react-native-basic-elements";
import { FONTS } from "../../Constants/Fonts";

function OrderSucssDetails() {
    return (
        <>
            <ScrollView style={styles.container}>

                {/* <ScrollView style={styles.scrollView}> */}
                <View style={styles.thankYouContainer}>
                    <Image
                        style={styles.checkedImage}
                        source={require('../../assets/dynamic/checked.png')}
                    />
                    <Text style={styles.thankYouText}>
                        Thank You Your order has {"\n"}
                        Summited Successfully
                    </Text>

                </View>
                <View style={styles.orderDetailsContainer}>
                    <View style={styles.orderSummary}>
                        <View style={styles.orderSummaryRow}>
                            <Text style={styles.orderSummaryText}>Order Number</Text>
                            <Text style={styles.orderSummaryText}>#31650</Text>
                        </View>
                        <View style={styles.orderSummaryRow}>
                            <Text style={styles.orderSummaryText}>Date</Text>
                            <Text style={styles.orderSummaryText}>#2024-06-10 12:13:36</Text>
                        </View>
                        <View style={styles.orderSummaryRow}>
                            <Text style={styles.orderSummaryText}>Total</Text>
                            <Text style={styles.orderSummaryText}>Rs 1260.00</Text>
                        </View>
                        <View style={styles.orderSummaryRow}>
                            <Text style={styles.orderSummaryText}>Payment Method</Text>
                            <Text style={[styles.orderSummaryText, styles.paymentMethod]}>cash</Text>
                        </View>
                        {/* Item List */}
                        <View style={styles.itemRow}>
                            <View style={styles.itemInfo}>

                                <Text style={styles.itemName}>Chicken biryani</Text>
                            </View>
                            <View style={styles.itemPriceContainer}>
                                <Text style={styles.itemQuantity}>2</Text>
                                <Text style={styles.itemPrice}>260.00</Text>
                            </View>
                        </View>
                        <View style={styles.itemRow}>
                            <View style={styles.itemInfo}>

                                <Text style={styles.itemName}>Chicken biryani</Text>
                            </View>
                            <View style={styles.itemPriceContainer}>
                                <Text style={styles.itemQuantity}>2</Text>
                                <Text style={styles.itemPrice}>260.00</Text>
                            </View>
                        </View>
                        {/* End of Item List */}
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryText}>Subtotal</Text>
                            <Text style={styles.summaryText}>Rs : 1260.00</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryText}>Service Charge</Text>
                            <Text style={styles.summaryText}>Rs : 50.00</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryText}>Total</Text>
                            <Text style={styles.summaryText}>Rs: 1310.00</Text>
                        </View>
                    </View>
                </View>
                {/* User Address Details */}
                <View style={styles.addressContainer}>
                    <View style={styles.addressContent}>
                        <Text style={styles.addressTitle}>Billing Address</Text>
                        <View style={styles.addressRow}>
                            <Icon
                                type='Feather'
                                name="user"
                                color='#000000'
                                size={15}
                            />
                            <Text style={styles.addressText}>Jhon Deo</Text>
                        </View>
                        <View style={styles.addressRow}>
                            <Icon
                                type='EvilIcon'
                                name="location"
                                color='#000000'
                                size={15}
                            />
                            <Text style={styles.addressText}>Danlop</Text>
                        </View>
                        <View style={styles.addressRow}>
                            <Icon
                                type='EvilIcon'
                                name="location"
                                color='#000000'
                                size={15}
                            />
                            <Text style={styles.addressText}>Danlop bus stand near govt office</Text>
                        </View>
                        <View style={styles.addressRow}>
                            <Icon
                                type='Ionicon'
                                name="call-outline"
                                color='#000000'
                                size={15}
                            />    
                             <Text style={[styles.addressText, styles.addressPhone]}>985421214</Text>
                        </View>
                        <View style={styles.addressRow}>
                            <Icon
                                type='Entypo'
                                name="mail"
                                color='#000000'
                                size={15}
                            />
                            <Text style={[styles.addressText, styles.addressEmail]}>jhondeo@mail.com</Text>
                        </View>
                    </View>
                </View>
                {/* </ScrollView> */}
            </ScrollView>

        </>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF0F5',
        height: responsiveScreenHeight(100),
        width: responsiveScreenWidth(100),
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    thankYouContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: moderartescale(20),
        backgroundColor: '#FFFFFF',
    },
    checkedImage: {
        width: scale(77),
        height: scale(77),
    },
    thankYouText: {
        fontSize: moderartescale(16),
        padding: moderartescale(10),
        color: '#000000',
        textAlign: 'center',
        fontFamily:FONTS.Inter.regular
    },
    orderDetailsContainer: {
        padding: moderartescale(10),
        backgroundColor: '#FFFFFF',
    },
    orderSummary: {
        padding: moderartescale(18),
        borderWidth: moderartescale(2),
        borderColor: '#F00049',
        borderRadius: moderartescale(10),
    },
    orderSummaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: moderartescale(10),
    },
    orderSummaryText: {
        fontSize: moderartescale(14),
        color: '#333333',
        fontFamily:FONTS.Inter.regular
    },
    paymentMethod: {
        color: '#F00049',
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: moderartescale(2),
        borderBottomColor: '#D9D9D9',
        paddingVertical: moderartescale(10),
    },
    itemInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemImage: {
        width: scale(37),
        height: verticalscale(34),
    },
    itemName: {
        fontSize: moderartescale(14),
        color: '#000000',
        marginLeft: moderartescale(10),
        fontFamily:FONTS.Inter.regular
    },
    itemPriceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: scale(100),
        paddingHorizontal: moderartescale(15),
    },
    itemQuantity: {
        fontSize: moderartescale(14),
        color: '#000000',
        fontFamily:FONTS.Inter.regular

    },
    itemPrice: {
        fontSize: moderartescale(14),
        color: '#000000',
        fontFamily:FONTS.Inter.regular

    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: moderartescale(7),
    },
    summaryText: {
        fontSize: moderartescale(14),
        color: '#333333',
    },
    addressContainer: {
        backgroundColor: '#FFFFFF',
        marginTop: moderartescale(10),
    },
    addressContent: {
        padding: moderartescale(18),
    },
    addressTitle: {
        fontSize: moderartescale(14),
        color: '#000000',
        fontFamily:FONTS.Inter.medium
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: moderartescale(10),
    },
    addressIcon: {
        width: scale(11),
        height: scale(11),
    },
    addressText: {
        fontSize: moderartescale(14),
        color: '#000000',
        marginLeft: moderartescale(10),
        fontFamily:FONTS.Inter.regular
    },
    addressPhone: {
        color: '#F00049',
    },
    addressEmail: {
        color: '#F00049',
    },
});

export default OrderSucssDetails