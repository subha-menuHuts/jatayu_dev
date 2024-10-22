import {
  fonstSizeDynamic,
  scale,
  verticalscale,
} from '../../Constants/PixelRatio';
import {Icon} from 'react-native-basic-elements';
import {FONTS} from '../../Constants/Fonts';
import {Colors} from '../../Constants/Colors';

import React, {useEffect, useState, useRef} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {showToastMsg, getData, setData} from '../../Service/localStorage';
import {postWithToken, postWithOutToken} from '../../Service/service';
import {useFocusEffect} from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Loader from '../../Component/loader';
import {useNavigation} from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

function About({business_data}) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    baseUrl,
    siteUrl,
    userToken,
    userData,
    selectedLang,
    LangValue,
    deviceToken,
    google_api_key,
    google_auto_complete_country,
  } = useSelector(state => state.common);
  const [viewloader, setLoader] = useState(false);
  const [language, setLanguage] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      setLanguage(LangValue);
    }, [selectedLang]),
  );

  function displayVal(val) {
    if (val === 0) {
      return 'Everyday'; // FRONTLANGUAGES.EVERYDAY;
    }
    if (val === 1) {
      return 'Monday'; // FRONTLANGUAGES.MONDAY;
    }
    if (val === 2) {
      return 'Tuesday'; // FRONTLANGUAGES.TUESDAY;
    }
    if (val === 3) {
      return 'Wednesday'; // FRONTLANGUAGES.WEDNESDAY;
    }
    if (val === 4) {
      return 'Thursday'; // FRONTLANGUAGES.THURSDAY;
    }
    if (val === 5) {
      return 'Friday'; // FRONTLANGUAGES.FRIDAY;
    }
    if (val === 6) {
      return 'Saturday'; // FRONTLANGUAGES.SATURDAY;
    }
    if (val === 7) {
      return 'Sunday'; // FRONTLANGUAGES.SUNDAY;
    }
  }

  const [businessDaysList, setBusinessDays] = useState([]);

  useEffect(() => {
    let businessDaysObject = business_data.schedule.sdays;
    let businessDays = new Array();

    for (let [key, value] of Object.entries(businessDaysObject)) {
      businessDaysObject[key].time1 = true;
      businessDaysObject[key].time2 = true;
      businessDaysObject[key].dayname = displayVal(Number(key));

      if (
        businessDaysObject[key].opens.hour === '00' &&
        businessDaysObject[key].opens.minute === '00' &&
        businessDaysObject[key].closes.hour === '00' &&
        businessDaysObject[key].closes.minute === '00'
      ) {
        businessDaysObject[key].time1 = false;
      }

      if (
        businessDaysObject[key].opens2.hour === '00' &&
        businessDaysObject[key].opens2.minute === '00' &&
        businessDaysObject[key].closes2.hour === '00' &&
        businessDaysObject[key].closes2.minute === '00'
      ) {
        businessDaysObject[key].time2 = false;
      }

      businessDays.push(value);
    }

    setBusinessDays(businessDays);
  }, [business_data]);

  const BusinessHourse = [
    {
      id: 1,
      dayname: 'Monday',
      from: '10:00 - 12:00',
      todate: '12:00 - 22:00',
    },
    {
      id: 2,
      dayname: 'Tuesday',
      from: '10:00 - 12:00',
      todate: '12:00 - 22:00',
    },
    {
      id: 3,
      dayname: 'Wednesday',
      from: '10:00 - 12:00',
      todate: '12:00 - 22:00',
    },
    {
      id: 4,
      dayname: 'Thursday',
      from: '10:00 - 12:00',
      todate: '12:00 - 22:00',
    },
    {
      id: 5,
      dayname: 'Friday',
      from: '10:00 - 12:00',
      todate: '12:00 - 22:00',
    },
    {
      id: 6,
      dayname: 'Saturday  ',
      from: '10:00 - 12:00',
      todate: '12:00 - 22:00',
    },
    {
      id: 7,
      dayname: 'Sunday  ',
      from: '10:00 - 12:00',
      todate: '12:00 - 22:00',
    },
  ];
  return (
    <>
      <View style={[styles.container, {height: responsiveHeight(100)}]}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.contentContainer}>
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Address</Text>
              <Text style={styles.sectionContent}>{business_data.street}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Phone</Text>
              <Text style={styles.sectionContent}>{business_data.phone}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Business Hours</Text>
              <View style={styles.businessHoursContainer}>
                {businessDaysList.length > 0 &&
                  businessDaysList.map((item, index) => (
                    <View key={index} style={styles.businessHoursRow}>
                      <Text style={styles.businessHoursDay}>
                        {item.dayname}
                      </Text>

                      {item.time1 == false && (
                        <Text style={[styles.businessHoursTime]}>
                          {'--:--'}
                        </Text>
                      )}
                      {item.time1 == true && (
                        <Text style={styles.businessHoursTime}>
                          {item.opens.hour}:{item.opens.minute} -
                          {item.closes.hour}:{item.closes.minute}
                        </Text>
                      )}

                      {item.time2 == false && (
                        <Text style={[styles.businessHoursTime]}>
                          {'--:--'}
                        </Text>
                      )}
                      {item.time2 == true && (
                        <Text style={styles.businessHoursTime}>
                          {item.opens2.hour}:{item.opens2.minute} -
                          {item.closes2.hour}:{item.closes2.minute}
                        </Text>
                      )}
                    </View>
                  ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    // height: '100%', // Use flex to fill the height
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: scale(15),
  },
  section: {
    marginBottom: verticalscale(20),
  },
  sectionHeader: {
    fontSize: fonstSizeDynamic(2),
    color: '#000000',
    fontFamily: FONTS.Inter.bold,
  },
  sectionContent: {
    fontSize: fonstSizeDynamic(2),
    color: '#000000',
    fontFamily: FONTS.Inter.regular,
  },
  divider: {
    height: verticalscale(1),
    backgroundColor: '#D9D9D9',
    marginVertical: verticalscale(5),
  },
  businessHoursContainer: {
    marginTop: verticalscale(10),
    marginBottom: responsiveHeight(50),
  },
  businessHoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalscale(10),
  },
  businessHoursDay: {
    fontSize: fonstSizeDynamic(2),
    color: '#000000',
    padding: scale(3),
    width: responsiveWidth(33),
    fontFamily: FONTS.Inter.semibold,
  },
  businessHoursTime: {
    fontSize: fonstSizeDynamic(2),
    color: '#000000',
    fontFamily: FONTS.Inter.regular,
    width: responsiveWidth(33),
  },
});
export default About;
