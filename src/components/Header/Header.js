import React, { Component } from 'react';
import { Tabs } from 'antd';
import PropTypes from 'prop-types';
import './Header.css';

export default class Header extends Component {
  static defaultProps = {
    changeTab: () => {},
  };

  static propTypes = {
    changeTab: PropTypes.func,
  };

  render() {
    const { changeTab } = this.props;
    const { TabPane } = Tabs;
    return (
      <Tabs defaultActiveKey="1" centered onChange={changeTab}>
        <TabPane tab="Поиск" key="1" />
        <TabPane tab="Оцененные фильмы" key="2" />
      </Tabs>
    );
  }
}
