import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Button, message } from 'antd';
import {trimFiles} from '../../redux/actions/trimActions.js';
import SocketIOClient from 'socket.io-client';


const FormItem = Form.Item;


class FormTrim extends Component {


  constructor(props) {
    super(props);
    this.state = {
      trimCompleted:false,
    };

    this.click = this.click.bind(this);


  }



  click(e){
    this.socket = SocketIOClient(`http://localhost:4000`);
    this.socket.emit('init', {
      senderId: 'trimaaaa',
    });
    this.socket.on('trim', message => {
      console.log('trim',message)
    });


    e.preventDefault();
    var result = trimFiles({file1:'test1.fastq',file2:'test2.fastq'});
    result.then(res => {
      console.log(res)

      this.setState({trimCompleted: true});
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



    })
  //  console.log(storeMain.getState());

  }


  render() {
    const {file1completed, file2completed} = this.state

    return (
      <Form >
        <FormItem label="Start to trim" validateStatus="success">
          <Button type="primary" onClick={this.click} disabled={this.state.isloading}>
            Trim
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

const WrappedFormTrim = Form.create()(FormTrim);
export default connect(mapStateToProps,{  } )(WrappedFormTrim);
