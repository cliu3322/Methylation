import React, { Component } from 'react';
import LayoutContentWrapper from '../components/utility/layoutWrapper';
import LayoutContent from '../components/utility/layoutContent';
import CustomDiagram from './CustomDiagram';

export default class extends Component {
  render() {
    return (
      <LayoutContentWrapper style={{ height: '1000vh' }}>
          <CustomDiagram />

      </LayoutContentWrapper>
    );
  }
}
