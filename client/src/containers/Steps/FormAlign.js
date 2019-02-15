import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Button, message } from 'antd';
import {alignFiles} from '../../redux/actions/alignActions.js';


const FormItem = Form.Item;


class FormAlignment extends Component {


  constructor(props) {
    super(props);
    this.state = {
      alignCompleted:false,
    };

    this.click = this.click.bind(this);
  }



  click(e){
    e.preventDefault();
    var result = alignFiles({file1:'test1',file2:'test2'});
    result.then(res => {
      if (res.data.err) {
        console.log(res)
        message.error(res.data.err);
      }
      else {
        this.setState({alignCompleted: true});
        //console.log(res.data);
        if(res.data.isTrimCompleted){
          this.setState({isTrimCompleted: true});
          var file1Name = res.data.file1;
          var file2Name = res.data.file2;
          //console.log(file1Name);
          window.open("http://localhost:9000/result/trimmed_result/"+file1Name);
          window.open("http://localhost:9000/result/trimmed_result/"+file2Name);

        } else {
          this.setState({isTrimCompleted: false});
        }
      }


    })
  //  console.log(storeMain.getState());

  }


  render() {
    const {file1completed, file2completed} = this.state

    return (
      <Form >
        <FormItem label="Start to trim" validateStatus="success">
          <Button type="primary" onClick={this.click} disabled={this.state.isloading}>
            Align
          </Button>
        </FormItem>
      </Form>
    );
  }
}

function mapStateToProps(state) {

  return {

  };
}

const WrappedFormAlignment = Form.create()(FormAlignment);
export default connect(mapStateToProps,{  } )(WrappedFormAlignment);
