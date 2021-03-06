import PropTypes from 'prop-types';
import XDate from 'xdate';
import React, {Component} from 'react';
import {
  Animated,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {DateData, AgendaSchedule} from '../types';
import {CalendarListProps} from '../calendar-list';
import ReservationList, {ReservationListProps} from './reservation-list';
export declare type AgendaProps = CalendarListProps &
  ReservationListProps & {
    /** the list of items that have to be displayed in agenda. If you want to render item as empty date
    the value of date key kas to be an empty array []. If there exists no value for date key it is
    considered that the date in question is not yet loaded */
    items?: AgendaSchedule;
    /** callback that gets called when items for a certain month should be loaded (month became visible) */
    loadItemsForMonth?: (data: DateData) => void;
    /** callback that fires when the calendar is opened or closed */
    onCalendarToggled?: (enabled: boolean) => void;
    /** callback that gets called when day changes while scrolling agenda list */
    onDayChange?: (data: DateData) => void;
    /** specify how agenda knob should look like */
    renderKnob?: () => JSX.Element;
    /** initially selected day */
    selected?: string;
    /** Hide knob button. Default = false */
    hideKnob?: boolean;
    /** Whether the knob should always be visible (when hideKnob = false) */
    showClosingKnob?: boolean;
  };
declare type State = {
  scrollY: Animated.Value;
  calendarIsReady: boolean;
  calendarScrollable: boolean;
  firstReservationLoad: boolean;
  selectedDay: XDate;
  topDay: XDate;
};
/**
 * @description: Agenda component
 * @extends: CalendarList
 * @extendslink: docs/CalendarList
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/agenda.js
 * @gif: https://github.com/wix/react-native-calendars/blob/master/demo/assets/agenda.gif
 */
export default class Agenda extends Component<AgendaProps, State> {
  static displayName: string;
  static propTypes: {
    items: PropTypes.Requireable<object>;
    style: PropTypes.Requireable<number | object>;
    loadItemsForMonth: PropTypes.Requireable<(...args: any[]) => any>;
    onCalendarToggled: PropTypes.Requireable<(...args: any[]) => any>;
    onDayChange: PropTypes.Requireable<(...args: any[]) => any>;
    renderKnob: PropTypes.Requireable<(...args: any[]) => any>;
    selected: PropTypes.Requireable<any>;
    hideKnob: PropTypes.Requireable<boolean>;
    showClosingKnob: PropTypes.Requireable<boolean>;
    selectedDay: PropTypes.Requireable<XDate>;
    topDay: PropTypes.Requireable<XDate>;
    showOnlySelectedDayItems: PropTypes.Requireable<boolean>;
    renderEmptyData: PropTypes.Requireable<(...args: any[]) => any>;
    onScroll: PropTypes.Requireable<(...args: any[]) => any>;
    onScrollBeginDrag: PropTypes.Requireable<(...args: any[]) => any>;
    onScrollEndDrag: PropTypes.Requireable<(...args: any[]) => any>;
    onMomentumScrollBegin: PropTypes.Requireable<(...args: any[]) => any>;
    onMomentumScrollEnd: PropTypes.Requireable<(...args: any[]) => any>;
    refreshControl: PropTypes.Requireable<PropTypes.ReactElementLike>;
    refreshing: PropTypes.Requireable<boolean>;
    onRefresh: PropTypes.Requireable<(...args: any[]) => any>;
    date: PropTypes.Requireable<any>;
    item: PropTypes.Requireable<any>;
    theme: PropTypes.Requireable<object>;
    rowHasChanged: PropTypes.Requireable<(...args: any[]) => any>;
    renderDay: PropTypes.Requireable<(...args: any[]) => any>;
    renderItem: PropTypes.Requireable<(...args: any[]) => any>;
    renderEmptyDate: PropTypes.Requireable<(...args: any[]) => any>;
    pastScrollRange: PropTypes.Requireable<number>;
    futureScrollRange: PropTypes.Requireable<number>;
    calendarWidth: PropTypes.Requireable<number>;
    calendarHeight: PropTypes.Requireable<number>;
    calendarStyle: PropTypes.Requireable<number | object>;
    staticHeader: PropTypes.Requireable<boolean>;
    showScrollIndicator: PropTypes.Requireable<boolean>;
    animateScroll: PropTypes.Requireable<boolean>;
    scrollEnabled: PropTypes.Requireable<boolean>;
    scrollsToTop: PropTypes.Requireable<boolean>;
    pagingEnabled: PropTypes.Requireable<boolean>;
    horizontal: PropTypes.Requireable<boolean>;
    keyboardShouldPersistTaps: PropTypes.Requireable<string>;
    keyExtractor: PropTypes.Requireable<(...args: any[]) => any>;
    onEndReachedThreshold: PropTypes.Requireable<number>;
    onEndReached: PropTypes.Requireable<(...args: any[]) => any>;
    firstDay: PropTypes.Requireable<number>;
    displayLoadingIndicator: PropTypes.Requireable<boolean>;
    showWeekNumbers: PropTypes.Requireable<boolean>;
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
    markingType: PropTypes.Requireable<
      import('../calendar/day/marking').Markings
    >;
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
  private style;
  private viewHeight;
  private viewWidth;
  private scrollTimeout?;
  private headerState;
  private currentMonth;
  private knobTracker;
  private _isMounted;
  private scrollPad;
  private calendar;
  private knob;
  list: React.RefObject<ReservationList>;
  constructor(props: AgendaProps);
  componentDidMount(): void;
  componentWillUnmount(): void;
  componentDidUpdate(prevProps: AgendaProps): void;
  static getDerivedStateFromProps(nextProps: AgendaProps): {
    firstReservationLoad: boolean;
  } | null;
  calendarOffset(): number;
  initialScrollPadPosition: () => number;
  setScrollPadPosition: (y: number, animated: boolean) => void;
  toggleCalendarPosition: (open: boolean) => void;
  enableCalendarScrolling(enable?: boolean): void;
  loadReservations(props: AgendaProps): void;
  onDayPress: (d: DateData) => void;
  chooseDay(d: DateData, optimisticScroll: boolean): void;
  generateMarkings: (
    this: any,
    selectedDay: any,
    markedDates: any,
    items: any,
  ) => any;
  onScrollPadLayout: () => void;
  onCalendarListLayout: () => void;
  onLayout: (event: LayoutChangeEvent) => void;
  onTouchStart: () => void;
  onTouchEnd: () => void;
  onStartDrag: () => void;
  onSnapAfterDrag: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onVisibleMonthsChange: (months: DateData[]) => void;
  onDayChange: (day: XDate) => void;
  renderReservations(): JSX.Element;
  renderCalendarList(): JSX.Element;
  renderKnob(): JSX.Element | null;
  renderWeekDaysNames: (weekDaysNames: string[]) => JSX.Element[];
  renderWeekNumbersSpace: () => false | JSX.Element | undefined;
  render(): JSX.Element;
}
export {};
