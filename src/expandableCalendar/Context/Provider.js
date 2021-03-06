import PropTypes from 'prop-types';
import XDate from 'xdate';
import React, { Component } from 'react';
import { StyleSheet, Animated, TouchableOpacity, View } from 'react-native';
import { toMarkingFormat } from '../../interface';
import styleConstructor from '../style';
import CalendarContext from '.';
import Presenter from './Presenter';
import { UpdateSources } from '../commons';
const TOP_POSITION = 65;
/**
 * @description: Calendar context provider component
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/expandableCalendar.js
 */
class CalendarProvider extends Component {
    static displayName = 'CalendarProvider';
    static propTypes = {
        date: PropTypes.any.isRequired,
        onDateChanged: PropTypes.func,
        onMonthChange: PropTypes.func,
        showTodayButton: PropTypes.bool,
        todayBottomMargin: PropTypes.number,
        todayButtonStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
        disabledOpacity: PropTypes.number
    };
    style = styleConstructor(this.props.theme);
    presenter = new Presenter();
    state = {
        prevDate: this.getDate(this.props.date),
        date: this.getDate(this.props.date),
        updateSource: UpdateSources.CALENDAR_INIT,
        buttonY: new Animated.Value(this.props.todayBottomMargin ? -this.props.todayBottomMargin : -TOP_POSITION),
        buttonIcon: this.presenter.getButtonIcon(this.getDate(this.props.date), this.props.showTodayButton),
        disabled: false,
        opacity: new Animated.Value(1)
    };
    componentDidUpdate(prevProps) {
        if (this.props.date && prevProps.date !== this.props.date) {
            this.setDate(this.props.date, UpdateSources.PROP_UPDATE);
        }
    }
    getDate(date) {
        return date || toMarkingFormat(new XDate());
    }
    getProviderContextValue = () => {
        return {
            setDate: this.setDate,
            date: this.state.date,
            prevDate: this.state.prevDate,
            updateSource: this.state.updateSource,
            setDisabled: this.setDisabled
        };
    };
    setDate = (date, updateSource) => {
        const { setDate } = this.presenter;
        const updateState = (buttonIcon) => {
            this.setState({ date, prevDate: this.state.date, updateSource, buttonIcon }, () => {
                this.animateTodayButton(date);
            });
        };
        setDate(this.props, date, this.state.date, updateState, updateSource);
    };
    setDisabled = (disabled) => {
        const { setDisabled } = this.presenter;
        const { showTodayButton = false } = this.props;
        const updateState = (disabled) => {
            this.setState({ disabled });
            this.animateOpacity(disabled);
        };
        setDisabled(showTodayButton, disabled, this.state.disabled, updateState);
    };
    animateTodayButton(date) {
        const { shouldAnimateTodayButton, getPositionAnimation } = this.presenter;
        if (shouldAnimateTodayButton(this.props)) {
            const animationData = getPositionAnimation(date, this.props.todayBottomMargin);
            Animated.spring(this.state.buttonY, {
                ...animationData
            }).start();
        }
    }
    animateOpacity(disabled) {
        const { shouldAnimateOpacity, getOpacityAnimation } = this.presenter;
        if (shouldAnimateOpacity(this.props)) {
            const animationData = getOpacityAnimation(this.props, disabled);
            Animated.timing(this.state.opacity, {
                ...animationData
            }).start();
        }
    }
    onTodayPress = () => {
        const today = this.presenter.getTodayDate();
        this.setDate(today, UpdateSources.TODAY_PRESS);
    };
    renderTodayButton() {
        const { disabled, opacity, buttonY, buttonIcon } = this.state;
        const { getTodayFormatted } = this.presenter;
        const today = getTodayFormatted();
        return (<Animated.View style={[this.style.todayButtonContainer, { transform: [{ translateY: buttonY }] }]}>
        <TouchableOpacity style={[this.style.todayButton, this.props.todayButtonStyle]} onPress={this.onTodayPress} disabled={disabled}>
          <Animated.Image style={[this.style.todayButtonImage, { opacity }]} source={buttonIcon}/>
          <Animated.Text allowFontScaling={false} style={[this.style.todayButtonText, { opacity }]}>
            {today}
          </Animated.Text>
        </TouchableOpacity>
      </Animated.View>);
    }
    render() {
        return (<CalendarContext.Provider value={this.getProviderContextValue()}>
        <View style={[styles.container, this.props.style]}>{this.props.children}</View>
        {this.props.showTodayButton && this.renderTodayButton()}
      </CalendarContext.Provider>);
    }
}
export default CalendarProvider;
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
