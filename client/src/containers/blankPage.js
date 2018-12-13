import React, { Component } from 'react';
import LayoutContentWrapper from '../components/utility/layoutWrapper';

import CustomDiagram from './CustomDiagram';

export default class extends Component {
  render() {
    return (
      <LayoutContentWrapper style={{ height: '100vh' }}>
          <CustomDiagram />

      </LayoutContentWrapper>
    );
  }
}
