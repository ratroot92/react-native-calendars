import PropTypes from 'prop-types';
import XDate from 'xdate';
import React, { Component } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import { DateData, Theme } from '../types';
import CalendarHeader, { CalendarHeaderProps } from './header';
import { DayProps } from './day/index';
import { MarkingProps } from './day/marking';
declare type MarkedDatesType = {
    [key: string]: MarkingProps;
};
export interface CalendarProps extends CalendarHeaderProps, DayProps {
    /** Specify theme properties to override specific styles for calendar parts */
    theme?: Theme;
    /** If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday */
    firstDay?: number;
    /** Display loading indicator */
    displayLoadingIndicator?: boolean;
    /** Show week numbers */
    showWeekNumbers?: boolean;
    /** Specify style for calendar container element */
    style?: StyleProp<ViewStyle>;
    /** Initially visible month */
    current?: string;
    /** Initially visible month. If changed will initialize the calendar to this value */
    initialDate?: string;
    /** Minimum date that can be selected, dates before minDate will be grayed out */
    minDate?: string;
    /** Maximum date that can be selected, dates after maxDate will be grayed out */
    maxDate?: string;
    /** Collection of dates that have to be marked */
    markedDates?: MarkedDatesType;
    /** Do not show days of other months in month page */
    hideExtraDays?: boolean;
    /** Always show six weeks on each month (only when hideExtraDays = false) */
    showSixWeeks?: boolean;
    /** Handler which gets executed on day press */
    onDayPress?: (date: DateData) => void;
    /** Handler which gets executed on day long press */
    onDayLongPress?: (date: DateData) => void;
    /** Handler which gets executed when month changes in calendar */
    onMonthChange?: (date: DateData) => void;
    /** Handler which gets executed when visible month changes in calendar */
    onVisibleMonthsChange?: (months: DateData[]) => void;
    /** Disables changing month when click on days of other months (when hideExtraDays is false) */
    disableMonthChange?: boolean;
    /** Enable the option to swipe between months */
    enableSwipeMonths?: boolean;
    /** Disable days by default */
    disabledByDefault?: boolean;
    /** Style passed to the header */
    headerStyle?: ViewStyle;
    /** Allow rendering a totally custom header */
    customHeader?: any;
    /** Allow selection of dates before minDate or after maxDate */
    allowSelectionOutOfRange?: boolean;
}
interface State {
    prevInitialDate?: string;
    currentMonth: any;
}
/**
 * @description: Calendar component
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/calendars.js
 * @gif: https://github.com/wix/react-native-calendars/blob/master/demo/assets/calendar.gif
 */
declare class Calendar extends Component<CalendarProps, State> {
    static displayName: string;
    static propTypes: {
        theme: PropTypes.Requireable<object>;
        firstDay: PropTypes.Requireable<number>;
        displayLoadingIndicator: PropTypes.Requireable<boolean>;
        showWeekNumbers: PropTypes.Requireable<boolean>;
        style: PropTypes.Requireable<number | object>;
        current: PropTypes.Requireable<string>;
        initialDate: PropTypes.Requireable<string>;
        minDate: PropTypes.Requireable<string>;
        maxDate: PropTypes.Requireable<string>;
        markedDates: PropTypes.Requireable<object>;
        hideExtraDays: PropTypes.Requireable<boolean>;
        showSixWeeks: PropTypes.Requireable<boolean>;
        onDayPress: PropTypes.Requireable<(...args: any[]) => any>;
        onDayLongPress: PropTypes.Requireable<(...args: any[]) => any>;
        onMonthChange: PropTypes.Requireable<(...args: any[]) => any>;
        onVisibleMonthsChange: PropTypes.Requireable<(...args: any[]) => any>;
        disableMonthChange: PropTypes.Requireable<boolean>;
        enableSwipeMonths: PropTypes.Requireable<boolean>;
        disabledByDefault: PropTypes.Requireable<boolean>;
        headerStyle: PropTypes.Requireable<number | object>;
        customHeader: PropTypes.Requireable<any>;
        allowSelectionOutOfRange: PropTypes.Requireable<boolean>;
        day: PropTypes.Requireable<object>;
        dayComponent: PropTypes.Requireable<any>;
        onLongPress: PropTypes.Requireable<(...args: any[]) => any>;
        onPress: PropTypes.Requireable<(...args: any[]) => any>;
        state: PropTypes.Requireable<string>;
        marking: PropTypes.Requireable<any>;
        markingType: PropTypes.Requireable<import("./day/marking").Markings>;
        disableAllTouchEventsForDisabledDays: PropTypes.Requireable<boolean>;
        disableAllTouchEventsForInactiveDays: PropTypes.Requireable<boolean>;
        month: PropTypes.Requireable<XDate>;
        addMonth: PropTypes.Requireable<(...args: any[]) => any>;
        monthFormat: PropTypes.Requireable<string>;
        hideDayNames: PropTypes.Requireable<boolean>;
        hideArrows: PropTypes.Requireable<boolean>;
        renderArrow: PropTypes.Requireable<(...args: any[]) => any>;
        onPressArrowLeft: PropTypes.Requireable<(...args: any[]) => any>;
        onPressArrowRight: PropTypes.Requireable<(...args: any[]) => any>;
        disableArrowLeft: PropTypes.Requireable<boolean>;
        disableArrowRight: PropTypes.Requireable<boolean>;
        disabledDaysIndexes: PropTypes.Requireable<(number | null | undefined)[]>;
        renderHeader: PropTypes.Requireable<any>;
        customHeaderTitle: PropTypes.Requireable<any>;
        webAriaLevel: PropTypes.Requireable<number>;
    };
    static defaultProps: {
        enableSwipeMonths: boolean;
    };
    state: {
        prevInitialDate: string | undefined;
        currentMonth: any;
    };
    style: any;
    header: React.RefObject<CalendarHeader>;
    static getDerivedStateFromProps(nextProps: CalendarProps, prevState: State): {
        prevInitialDate: string;
        currentMonth: any;
    } | null;
    addMonth: (count: number) => void;
    updateMonth: (day: any) => void;
    handleDayInteraction(date: DateData, interaction?: (date: DateData) => void): void;
    pressDay: (date?: DateData | undefined) => void;
    longPressDay: (date?: DateData | undefined) => void;
    swipeProps: {
        onSwipe: (direction: string) => void;
    };
    onSwipe: (gestureName: string) => void;
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
    renderWeekNumber: (this: any, weekNumber: any) => JSX.Element;
    renderDay(day: XDate, id: number): JSX.Element;
    renderWeek(days: XDate[], id: number): JSX.Element;
    renderMonth(): JSX.Element;
    renderHeader(): JSX.Element;
    render(): JSX.Element;
}
export default Calendar;
