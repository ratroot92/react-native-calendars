import PropTypes from 'prop-types';
import { Component } from 'react';
import { Theme, DayState, MarkingTypes, DateData } from '../../../types';
import { MarkingProps } from '../marking';
export interface BasicDayProps {
    state?: DayState;
    /** The marking object */
    marking?: MarkingProps;
    /** Date marking style [simple/period/multi-dot/multi-period]. Default = 'simple' */
    markingType?: MarkingTypes;
    /** Theme object */
    theme?: Theme;
    /** onPress callback */
    onPress?: (date?: DateData) => void;
    /** onLongPress callback */
    onLongPress?: (date?: DateData) => void;
    /** The date to return from press callbacks */
    date?: DateData;
    /** Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates*/
    disableAllTouchEventsForDisabledDays?: boolean;
    /** Disable all touch events for inactive days. can be override with disableTouchEvent in markedDates*/
    disableAllTouchEventsForInactiveDays?: boolean;
    /** Test ID*/
    testID?: string;
    /** Accessibility label */
    accessibilityLabel?: string;
}
export default class BasicDay extends Component<BasicDayProps> {
    static displayName: string;
    static propTypes: {
        state: PropTypes.Requireable<string>;
        marking: PropTypes.Requireable<any>;
        markingType: PropTypes.Requireable<import("../marking").Markings>;
        theme: PropTypes.Requireable<object>;
        onPress: PropTypes.Requireable<(...args: any[]) => any>;
        onLongPress: PropTypes.Requireable<(...args: any[]) => any>;
        date: PropTypes.Requireable<object>;
        disableAllTouchEventsForDisabledDays: PropTypes.Requireable<boolean>;
        disableAllTouchEventsForInactiveDays: PropTypes.Requireable<boolean>;
    };
    style: any;
    shouldComponentUpdate(nextProps: BasicDayProps): boolean;
    onPress: () => void;
    onLongPress: () => void;
    get marking(): MarkingProps;
    shouldDisableTouchEvent(): boolean;
    isSelected(): boolean;
    isDisabled(): boolean;
    isInactive(): boolean | undefined;
    isToday(): boolean;
    isMultiDot(): boolean;
    isMultiPeriod(): boolean;
    isCustom(): boolean;
    getContainerStyle(): object[];
    getTextStyle(): object[];
    renderMarking(): JSX.Element;
    renderText(): JSX.Element;
    renderContent(): JSX.Element;
    renderContainer(): JSX.Element;
    renderPeriodsContainer(): JSX.Element;
    render(): JSX.Element;
}
