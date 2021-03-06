import PropTypes from 'prop-types';
import XDate from 'xdate';
import memoize from 'memoize-one';
import React, {Component} from 'react';
import {
  Text,
  View,
  Dimensions,
  Animated,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {extractComponentProps} from '../componentUpdater';
import {parseDate, xdateToData, toMarkingFormat} from '../interface';
import {weekDayNames, sameDate, sameMonth} from '../dateutils';
// @ts-expect-error
import {AGENDA_CALENDAR_KNOB} from '../testIDs';
import {VelocityTracker} from '../velocityTracker';
import {getCalendarDateString} from '../services';
import styleConstructor from './style';
import CalendarList from '../calendar-list';
import ReservationList from './reservation-list';
import CalendarStrip from 'react-native-calendar-strip';
import {addDays, format} from 'date-fns';
import moment from 'moment';
const HEADER_HEIGHT = 104;
const KNOB_HEIGHT = 24;
/**
 * @description: Agenda component
 * @extends: CalendarList
 * @extendslink: docs/CalendarList
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/agenda.js
 * @gif: https://github.com/wix/react-native-calendars/blob/master/demo/assets/agenda.gif
 */

const DayStrip = props => {
  const [ref, setRef] = React.useState(null);
  // const [scrollToIndex, setScrollToIndex] = React.useState(0);
  const [dataSourceCords, setDataSorceCords] = React.useState([]);

  const current = new Date(props.selected);
  var monthFirstDay = moment(
    new Date(current.getFullYear(), current.getMonth(), 1),
  );
  var monthLastDay = moment(
    new Date(current.getFullYear(), current.getMonth() + 1, 0),
  );
  const diffTime = Math.abs(monthLastDay - monthFirstDay);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  let daysOfMonth = [];
  for (let i = 0; i < diffDays; i++) {
    daysOfMonth.push(addDays(new Date(monthFirstDay), i + 1));
  }

  React.useEffect(() => {}, [dataSourceCords]);

  return (
    <View
      style={{
        flexDirection: 'row',
        flex: 1,
        backgroundColor: '#EBF7FD',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ScrollView
        ref={ref => {
          setRef(ref);
        }}
        contentContainerStyle={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        showsHorizontalScrollIndicator={false}
        horizontal={true}>
        {daysOfMonth.map((day, key) => (
          <TouchableOpacity
            key={key + day}
            onPress={scrollToIndex => {
              props.onDayPress(moment(day).format('YYYY-MM-DD'));
              if (key < dataSourceCords.length) {
                ref.scrollTo({
                  x: dataSourceCords[key - 3] + 30, // set to middle
                  animated: true,
                });
              }
            }}
            onLayout={event => {
              const layout = event.nativeEvent.layout;
              dataSourceCords[key] = layout.x;
              setDataSorceCords([...dataSourceCords]);
              if (moment(day).format('YYYY-MM-DD') === props.selected) {
                // setScrollToIndex(key);
                ref.scrollTo({
                  x: dataSourceCords[key - 3] + 30, // set to middle
                  y: layout.y,
                  animated: true,
                });
              }
            }}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 3,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
                marginLeft: 5,
                marginRight: 5,
                width: 50,
                height: 70,
                backgroundColor:
                  moment(day).format('YYYY-MM-DD') === props.selected
                    ? '#7F55C2'
                    : '#fff',
              }}>
              <Text
                style={{
                  color:
                    moment(day).format('YYYY-MM-DD') === props.selected
                      ? '#fff'
                      : '#000',
                }}>
                {format(day, 'EE')}
              </Text>
              <Text
                style={{
                  color:
                    moment(day).format('YYYY-MM-DD') === props.selected
                      ? '#fff'
                      : '#000',
                  fontWeight: 'bold',
                }}>
                {moment(day).format('DD')}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default class Agenda extends Component {
  static displayName = 'Agenda';
  static propTypes = {
    ...CalendarList.propTypes,
    ...ReservationList.propTypes,
    items: PropTypes.object,
    style: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
      PropTypes.number,
    ]),
    loadItemsForMonth: PropTypes.func,
    onCalendarToggled: PropTypes.func,
    onDayChange: PropTypes.func,
    renderKnob: PropTypes.func,
    selected: PropTypes.any,
    hideKnob: PropTypes.bool,
    showClosingKnob: PropTypes.bool,
  };
  style;
  viewHeight;
  viewWidth;
  scrollTimeout;
  headerState;
  currentMonth;
  knobTracker;
  _isMounted;
  scrollPad = React.createRef();
  calendar = React.createRef();
  knob = React.createRef();
  list = React.createRef();
  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);
    const windowSize = Dimensions.get('window');
    this.viewHeight = windowSize.height;
    this.viewWidth = windowSize.width;
    this.scrollTimeout = undefined;
    this.headerState = 'idle';
    this.state = {
      scrollY: new Animated.Value(0),
      calendarIsReady: false,
      calendarScrollable: false,
      firstReservationLoad: false,
      selectedDay: parseDate(props.selected) || new XDate(true),
      topDay: parseDate(props.selected) || new XDate(true),
    };
    this.currentMonth = this.state.selectedDay.clone();
    this.knobTracker = new VelocityTracker();
    this.state.scrollY.addListener(({value}) => this.knobTracker.add(value));
  }
  componentDidMount() {
    this._isMounted = true;
    this.loadReservations(this.props);
  }
  componentWillUnmount() {
    this._isMounted = false;
    this.state.scrollY.removeAllListeners();
  }
  componentDidUpdate(prevProps) {
    if (
      !sameDate(parseDate(this.props.selected), parseDate(prevProps.selected))
    ) {
      this.setState({selectedDay: parseDate(this.props.selected)});
    } else if (!prevProps.items) {
      this.loadReservations(this.props);
    }
  }
  static getDerivedStateFromProps(nextProps) {
    if (nextProps.items) {
      return {firstReservationLoad: false};
    }
    return null;
  }
  calendarOffset() {
    return 96 - this.viewHeight / 2;
  }
  initialScrollPadPosition = () => {
    return Math.max(0, this.viewHeight - HEADER_HEIGHT);
  };
  setScrollPadPosition = (y, animated) => {
    if (this.scrollPad?.current?.scrollTo) {
      this.scrollPad.current.scrollTo({x: 0, y, animated});
    } else {
      // Support for RN O.61 (Expo 37)
      this.scrollPad?.current?.getNode().scrollTo({x: 0, y, animated});
    }
  };
  toggleCalendarPosition = open => {
    const maxY = this.initialScrollPadPosition();
    this.setScrollPadPosition(open ? 0 : maxY, true);
    this.enableCalendarScrolling(open);
  };
  enableCalendarScrolling(enable = true) {
    this.setState({calendarScrollable: enable});
    this.props.onCalendarToggled?.(enable);
    // Enlarge calendarOffset here as a workaround on iOS to force repaint.
    // Otherwise the month after current one or before current one remains invisible.
    // The problem is caused by overflow: 'hidden' style, which we need for dragging
    // to be performant.
    // Another working solution for this bug would be to set removeClippedSubviews={false}
    // in CalendarList listView, but that might impact performance when scrolling
    // month list in expanded CalendarList.
    // Further info https://github.com/facebook/react-native/issues/1831
    this.calendar?.current?.scrollToDay(
      this.state.selectedDay,
      this.calendarOffset() + 1,
      true,
    );
  }
  loadReservations(props) {
    if (
      (!props.items || !Object.keys(props.items).length) &&
      !this.state.firstReservationLoad
    ) {
      this.setState({firstReservationLoad: true}, () => {
        this.props.loadItemsForMonth?.(xdateToData(this.state.selectedDay));
      });
    }
  }
  onDayPress = d => {
    this.chooseDay(d, !this.state.calendarScrollable);
  };
  chooseDay(d, optimisticScroll) {
    const day = parseDate(d);
    this.setState({
      calendarScrollable: false,
      selectedDay: day.clone(),
    });
    this.props.onCalendarToggled?.(false);
    if (!optimisticScroll) {
      this.setState({topDay: day.clone()});
    }
    this.setScrollPadPosition(this.initialScrollPadPosition(), true);
    this.calendar?.current?.scrollToDay(day, this.calendarOffset(), true);
    this.props.loadItemsForMonth?.(xdateToData(day));
    this.props.onDayPress?.(xdateToData(day));
  }
  generateMarkings = memoize((selectedDay, markedDates, items) => {
    if (!markedDates) {
      markedDates = {};
      if (items) {
        Object.keys(items).forEach(key => {
          if (items[key] && items[key].length) {
            markedDates[key] = {marked: true};
          }
        });
      }
    }
    const key = toMarkingFormat(selectedDay);
    return {
      ...markedDates,
      [key]: {...(markedDates[key] || {}), ...{selected: true}},
    };
  });
  onScrollPadLayout = () => {
    // When user touches knob, the actual component that receives touch events is a ScrollView.
    // It needs to be scrolled to the bottom, so that when user moves finger downwards,
    // scroll position actually changes (it would stay at 0, when scrolled to the top).
    this.setScrollPadPosition(this.initialScrollPadPosition(), false);
    // delay rendering calendar in full height because otherwise it still flickers sometimes
    setTimeout(() => this.setState({calendarIsReady: true}), 0);
  };
  onCalendarListLayout = () => {
    this.calendar?.current?.scrollToDay(
      this.state.selectedDay.clone(),
      this.calendarOffset(),
      false,
    );
  };
  onLayout = event => {
    this.viewHeight = event.nativeEvent.layout.height;
    this.viewWidth = event.nativeEvent.layout.width;
    this.forceUpdate();
  };
  onTouchStart = () => {
    this.headerState = 'touched';
    this.knob?.current?.setNativeProps({style: {opacity: 0.5}});
  };
  onTouchEnd = () => {
    this.knob?.current?.setNativeProps({style: {opacity: 1}});
    if (this.headerState === 'touched') {
      const isOpen = this.state.calendarScrollable;
      this.toggleCalendarPosition(!isOpen);
    }
    this.headerState = 'idle';
  };
  onStartDrag = () => {
    this.headerState = 'dragged';
    this.knobTracker.reset();
  };
  onSnapAfterDrag = e => {
    // on Android onTouchEnd is not called if dragging was started
    this.onTouchEnd();
    const currentY = e.nativeEvent.contentOffset.y;
    this.knobTracker.add(currentY);
    const projectedY = currentY + this.knobTracker.estimateSpeed() * 250; /*ms*/
    const maxY = this.initialScrollPadPosition();
    const snapY = projectedY > maxY / 2 ? maxY : 0;
    this.setScrollPadPosition(snapY, true);
    this.enableCalendarScrolling(snapY === 0);
  };
  onVisibleMonthsChange = months => {
    this.props.onVisibleMonthsChange?.(months);
    if (this.props.items && !this.state.firstReservationLoad) {
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
      }
      this.scrollTimeout = setTimeout(() => {
        if (this._isMounted) {
          this.props.loadItemsForMonth?.(months[0]);
        }
      }, 200);
    }
  };
  onDayChange = day => {
    const withAnimation = sameMonth(day, this.state.selectedDay);
    this.calendar?.current?.scrollToDay(
      day,
      this.calendarOffset(),
      withAnimation,
    );
    this.setState({selectedDay: day});
    this.props.onDayChange?.(xdateToData(day));
  };
  renderReservations() {
    const reservationListProps = extractComponentProps(
      ReservationList,
      this.props,
    );
    return (
      <ReservationList
        {...reservationListProps}
        ref={this.list}
        selectedDay={this.state.selectedDay}
        topDay={this.state.topDay}
        onDayChange={this.onDayChange}
      />
    );
  }
  renderCalendarList() {
    const {markedDates, items} = this.props;
    const shouldHideExtraDays = this.state.calendarScrollable
      ? this.props.hideExtraDays
      : false;
    const calendarListProps = extractComponentProps(CalendarList, this.props);
    return <DayStrip {...this.props} />;
    // return (
    //   <CalendarList
    //     {...calendarListProps}
    //     ref={this.calendar}
    //     current={getCalendarDateString(this.currentMonth.toString())}
    //     markedDates={this.generateMarkings(
    //       this.state.selectedDay,
    //       markedDates,
    //       items,
    //     )}
    //     calendarWidth={this.viewWidth}
    //     scrollEnabled={this.state.calendarScrollable}
    //     hideExtraDays={shouldHideExtraDays}
    //     onLayout={this.onCalendarListLayout}
    //     onDayPress={this.onDayPress}
    //     onVisibleMonthsChange={this.onVisibleMonthsChange}
    //   />
    // );
  }
  renderKnob() {
    const {showClosingKnob, hideKnob, renderKnob} = this.props;
    let knob = <View style={this.style.knobContainer} />;
    if (!hideKnob) {
      const knobView = renderKnob ? (
        renderKnob()
      ) : (
        <View style={this.style.knob} />
      );
      knob =
        !this.state.calendarScrollable || showClosingKnob ? (
          <View style={this.style.knobContainer}>
            <View ref={this.knob}>{knobView}</View>
          </View>
        ) : null;
    }
    return knob;
  }
  renderWeekDaysNames = memoize(weekDaysNames => {
    return weekDaysNames.map((day, index) => (
      <Text
        key={day + index}
        style={this.style.weekday}
        allowFontScaling={false}
        numberOfLines={1}>
        {day}
      </Text>
    ));
  });
  renderWeekNumbersSpace = () => {
    return this.props.showWeekNumbers && <View style={this.style.weekday} />;
  };
  render() {
    const {firstDay, hideKnob, style, testID} = this.props;
    const weekDaysNames = weekDayNames(firstDay);
    const agendaHeight = this.initialScrollPadPosition();
    const weekdaysStyle = [
      this.style.weekdays,
      {
        opacity: this.state.scrollY.interpolate({
          inputRange: [agendaHeight - HEADER_HEIGHT, agendaHeight],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        }),
        transform: [
          {
            translateY: this.state.scrollY.interpolate({
              inputRange: [
                Math.max(0, agendaHeight - HEADER_HEIGHT),
                agendaHeight,
              ],
              outputRange: [-HEADER_HEIGHT, 0],
              extrapolate: 'clamp',
            }),
          },
        ],
      },
    ];
    const headerTranslate = this.state.scrollY.interpolate({
      inputRange: [0, agendaHeight],
      outputRange: [agendaHeight, 0],
      extrapolate: 'clamp',
    });
    const contentTranslate = this.state.scrollY.interpolate({
      inputRange: [0, agendaHeight],
      outputRange: [0, agendaHeight / 2],
      extrapolate: 'clamp',
    });
    const headerStyle = [
      this.style.header,
      {
        bottom: agendaHeight,
        transform: [{translateY: headerTranslate}],
      },
    ];
    if (!this.state.calendarIsReady) {
      // limit header height until everything is setup for calendar dragging
      headerStyle.push({height: 0});
      // fill header with appStyle.calendarBackground background to reduce flickering
      weekdaysStyle.push({height: HEADER_HEIGHT});
    }
    const openCalendarScrollPadPosition =
      !hideKnob && this.state.calendarScrollable && this.props.showClosingKnob
        ? agendaHeight + HEADER_HEIGHT
        : 0;
    const shouldAllowDragging = !hideKnob && !this.state.calendarScrollable;
    const scrollPadPosition =
      (shouldAllowDragging ? HEADER_HEIGHT : openCalendarScrollPadPosition) -
      KNOB_HEIGHT;
    const scrollPadStyle = {
      height: KNOB_HEIGHT,
      top: scrollPadPosition,
    };
    return (
      <View
        testID={testID}
        onLayout={this.onLayout}
        style={[style, this.style.container]}>
        <View style={this.style.reservations}>{this.renderReservations()}</View>
        <Animated.View style={headerStyle}>
          <Animated.View
            style={[
              this.style.animatedContainer,
              {transform: [{translateY: contentTranslate}]},
            ]}>
            {this.renderCalendarList()}
          </Animated.View>
          {/* {this.renderKnob()} */}
        </Animated.View>
        {/* <Animated.View style={weekdaysStyle}>
          {this.renderWeekNumbersSpace()}
          {this.renderWeekDaysNames(weekDaysNames)}
        </Animated.View> */}
        <Animated.ScrollView
          ref={this.scrollPad}
          style={[this.style.scrollPadStyle, scrollPadStyle]}
          overScrollMode="never"
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={8}
          scrollsToTop={false}
          onTouchStart={this.onTouchStart}
          onTouchEnd={this.onTouchEnd}
          onScrollBeginDrag={this.onStartDrag}
          onScrollEndDrag={this.onSnapAfterDrag}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],
            {useNativeDriver: true},
          )}>
          <View
            testID={AGENDA_CALENDAR_KNOB}
            style={{height: agendaHeight + KNOB_HEIGHT}}
            onLayout={this.onScrollPadLayout}
          />
        </Animated.ScrollView>
      </View>
    );
  }
}
