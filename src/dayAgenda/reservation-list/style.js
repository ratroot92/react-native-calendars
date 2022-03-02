/* eslint-disable prettier/prettier */
/* eslint-disable comma-dangle */
import { StyleSheet } from 'react-native';
import * as defaultStyle from '../../style';
export default function styleConstructor(theme = {}) {
    const appStyle = { ...defaultStyle, ...theme };
    return StyleSheet.create({
        container: {
            flexDirection: 'row',
            marginTop: 2,
            marginBottom: 2,
            height: 90

        },
        innerContainer: {
            flex: 1,
        },
        hourNum: {
            fontWeight: 'bold'
        },
        dayNum: {
            fontSize: 28,
            fontWeight: '200',
            fontFamily: appStyle.textDayFontFamily,
            color: appStyle.agendaDayNumColor
        },
        dayText: {
            fontSize: 14,
            fontWeight: appStyle.textDayFontWeight,
            fontFamily: appStyle.textDayFontFamily,
            color: appStyle.agendaDayTextColor,
            backgroundColor: 'rgba(0,0,0,0)',
            marginTop: -5
        },
        day: {
            width: 63,
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginTop: 32
        },
        today: {
            color: appStyle.agendaTodayColor
        },
        indicator: {
            marginTop: 80
        },
        // @ts-expect-error
        ...(theme['stylesheet.agenda.list'] || {})
    });
}
