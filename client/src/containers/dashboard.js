import React, { Component } from 'react';
import LayoutContentWrapper from '../components/utility/layoutWrapper';
import { Steps, Button, message,  Row, Col} from 'antd';
import FormUpload from './Steps/FormUpload';
import FormTrim from './Steps/FormTrim';
import FormAlign from './Steps/FormAlign';


const Step = Steps.Step;

const steps = [{
  title: 'Upload FastQC',
  content: (<FormUpload/>),
}, {
  title: 'Trim',
  content: (<FormTrim/>),
}, {
  title: 'Alignment',
  content: (<FormAlign/>),
}, {
  title: 'Filter',
  content: 'Second-content',
}, {
  title: 'Extract Primary Reads',
  content: 'Second-content',
}, {
  title: 'Add Downsamplings',
  content: 'Second-content',
}, {
  title: 'Methylation Extractor',
  content: 'Second-content',
},{
  title: 'Annotation',
  content: 'Second-content',
}];


export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
     current: 0,
    };
  }
  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }
  render() {
    const { current } = this.state;
    return (
      <LayoutContentWrapper style={{ height: '100vh' }}>

        <Row style={{ width: '100%' }}>
          <Col span={8}>
            <Steps current={current} direction="vertical">
              {steps.map(item => <Step key={item.title} title={item.title} />)}
            </Steps>
          </Col>
          <Col span={16}>
            <div className="steps-content" style={{ height: '70vh' }}>
            {steps[current].content}
            </div>
            <div className="steps-action">
              {
                current < steps.length - 1
                && <Button type="primary" onClick={() => this.next()}>Next</Button>
              }
              {
                current === steps.length - 1
                && <Button type="primary" onClick={() => message.success('Processing complete!')}>Done</Button>
              }
              {
                current > 0
                && (
                <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                  Previous
                </Button>
                )
              }
            </div>
          </Col>

        </Row>
      </LayoutContentWrapper>
    );
  }
}
