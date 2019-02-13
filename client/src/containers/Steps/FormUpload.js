import React, { Component } from 'react';
import { connect } from 'react-redux';
import { message, Input, Form, Progress, Row, Col } from 'antd';
import {uploadFile1} from '../../redux/steps/uploadActions1.js';
import {uploadFile2} from '../../redux/steps/uploadActions2.js';


const FormItem = Form.Item;


class FormUpload extends Component {


  constructor(props) {
    super(props);
    this.state = {
      file1completed:false,
      file2completed:false
    };

    this.click1 = this.click1.bind(this);
    this.click2 = this.click2.bind(this);
  }




  click1(e){

    var filename = e.target.name
    var uploadResult = uploadFile1(e.target);

    uploadResult.then(res => {
        if(res.status === 201){
          message.success('This is a message of success');
          this.setState({file1completed: true})
        }
        else {
          message.error('This is a message of error');
        }
      })
  }

  click2(e){

    var filename = e.target.name
    var uploadResult = uploadFile2(e.target);

    uploadResult.then(res => {
        if(res.status === 201){
          message.success('This is a message of success');
          this.setState({file2completed: true})
        }
        else {
          message.error('This is a message of error');
        }
      })
  }


  render() {
    const {file1completed, file2completed} = this.state

    return (
      <Form >
        <FormItem label="Your 1st FastQ File" validateStatus="success">
          <Row gutter={16}>
            <Col span={12}>
              <Input type="file" name="file1" onChange={this.click1} accept=".fastq"/>
            </Col>
            <Col span={1}>
              {file1completed ? <img src="check.png" alt="Smiley face" height="37" width="37"/> : null}
            </Col>
          </Row>
        </FormItem>
        <FormItem label="Your 2nd FastQ File">
          <Row gutter={16}>
            <Col span={12}>
              <Input type="file" name="file2" onChange={this.click2} accept=".fastq"/>
            </Col>
            <Col span={1}>
              {file2completed ? <img src="check.png" alt="Smiley face" height="37" width="37"/> : null}
            </Col>
          </Row>
        </FormItem>
      </Form>
    );
  }
}

function mapStateToProps(state) {

  return {

  };
}

const WrappedFormUpload = Form.create()(FormUpload);
export default connect(mapStateToProps,{  } )(WrappedFormUpload);
