/* eslint-disable prettier/prettier */
import PropTypes from 'prop-types';
import XDate from 'xdate';
import React, { Component, ReactNode } from 'react';
import { StyleProp, ViewStyle, AccessibilityActionEvent } from 'react-native';
import { Theme, Direction } from '../../types';
export interface CalendarHeaderProps {
    month?: XDate;
    addMonth?: (num: number) => void;
    /** Specify theme properties to override specific styles for calendar parts */
    theme?: Theme;
    /** If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday */
    firstDay?: number;
    /** Display loading indicator. Default = false */
    displayLoadingIndicator?: boolean;
    /** Show week numbers. Default = false */
    showWeekNumbers?: boolean;
    /** Month format in the title. Formatting values: http://arshaw.com/xdate/#Formatting */
    monthFormat?: string;
    /**  Hide day names */
    hideDayNames?: boolean;
    /** Hide month navigation arrows */
    hideArrows?: boolean;
    /** Replace default arrows with custom ones (direction can be 'left' or 'right') */
    renderArrow?: (direction: Direction) => ReactNode;
    /** Handler which gets executed when press arrow icon left. It receive a callback can go back month */
    onPressArrowLeft?: (method: () => void, month?: XDate) => void;
    /** Handler which gets executed when press arrow icon right. It receive a callback can go next month */
    onPressArrowRight?: (method: () => void, month?: XDate) => void;
    /** Disable left arrow */
    disableArrowLeft?: boolean;
    /** Disable right arrow */
    disableArrowRight?: boolean;
    /** Apply custom disable color to selected day indexes */
    disabledDaysIndexes?: number[];
    /** Replace default title with custom one. the function receive a date as parameter */
    renderHeader?: (date?: XDate) => ReactNode;
    /** Replace default title with custom element */
    customHeaderTitle?: JSX.Element;
    /** Provide aria-level for calendar heading for proper accessibility when used with web (react-native-web) */
    webAriaLevel?: number;
    testID?: string;
    style?: StyleProp<ViewStyle>;
    accessibilityElementsHidden?: boolean;
    importantForAccessibility?: 'auto' | 'yes' | 'no' | 'no-hide-descendants';
}
declare class CalendarHeader extends Component<CalendarHeaderProps> {
    static displayName: string;
    static propTypes: {
        month: PropTypes.Requireable<XDate>;
        addMonth: PropTypes.Requireable<(...args: any[]) => any>;
        theme: PropTypes.Requireable<object>;
        firstDay: PropTypes.Requireable<number>;
        displayLoadingIndicator: PropTypes.Requireable<boolean>;
        showWeekNumbers: PropTypes.Requireable<boolean>;
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
        monthFormat: string;
        webAriaLevel: number;
    };
    style: any;
    constructor(props: CalendarHeaderProps);
    shouldComponentUpdate(nextProps: CalendarHeaderProps): boolean;
    addMonth: () => void;
    subtractMonth: () => void;
    onPressLeft: () => void;
    onPressRight: () => void;
    renderWeekDays: (this: any, weekDaysNames: any) => any;
    renderHeader: () => React.ReactNode;
    renderArrow(direction: Direction): JSX.Element;
    renderIndicator(): JSX.Element | undefined;
    renderDayNames(): JSX.Element | undefined;
    render(): JSX.Element;
    onAccessibilityAction: (event: AccessibilityActionEvent) => void;
}
export default CalendarHeader;
