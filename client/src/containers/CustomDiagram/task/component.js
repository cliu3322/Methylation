// @flow

import React, { Component } from 'react';
import { connect } from "react-redux";
import style from 'styled-components';
import Input from '../../../components/uielements/input';
import type { DiagComponentProps } from 'react-flow-diagram';
import {uploadFile} from '../../../redux/fastqcuploader/actions.js';
import dateformat from 'dateformat';
import Form from '../../../components/uielements/form';


const FormItem = Form.Item;


/*
 * Presentational
 * ==================================== */

const TaskStyle = style.div`
  background-color: ${props => (props.isCompleted ? 'green' : '#fff')};
  display: flex;
  flex-flow: row nowrap;
  align-items: ${props => (props.isEditing ? 'stretch' : 'center')};
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  border-radius: .5rem;
  border: 2px solid #888;
`;

const Name = style.span`
  flex: 1 0;
  padding: .5em;
  font-size: .8rem;
`;

export type TaskProps = DiagComponentProps & {
  name: string,
  isCompleted: boolean,
  FileDetails: [],
};
const Task = (props: TaskProps) => (
  <TaskStyle
    width={props.model.width}
    height={props.model.height}
    isCompleted={props.isCompleted}
  >
    <Name
      style={{ display: 'block' }}
    >
      {props.model.name}
    </Name>
  </TaskStyle>
);

/*
 * Container
 * ==================================== */

type TaskComponentProps = DiagComponentProps;

class TaskComponent extends Component<
  TaskComponentProps
> {

  constructor(props) {
    super(props);
    this.state = {
      FileDetails: [],
      name: this.props.model.name,
      isCompleted: false,
      loaded: 0,
    };
    this.click= this.click.bind(this)
  }

  componentWillReceiveProps(nextProps){
  // console.log("nextProps",nextProps.fileData.data.allFilesDetail); return false;
    let fileData = []
     if (nextProps.fileData) {
      nextProps.fileData.data.allFilesDetail.forEach((element,index) => {
        // console.log("nextProps",element); return false;
        fileData[index] = [element.fileName,element.uploader,dateformat(element.updatedAt, "mmm dd, yyyy")]
      })
     }
    this.setState({FileDetails: fileData})
  }



  click(e){
    this.setState({file:e.target.files[0]});
    var test = uploadFile({file:e.target.files[0]});
    test.then(res => {
        if(res.status === 201){
          //console.log('asdfasd');
          this.setState({isCompleted: true})
        }
        else {
          this.setState({isCompleted: false})
        }
      })

  }

  render() {
    return (
      <div>
        <Task
          {...this.props}
          name={this.state.name}
          isCompleted = {this.state.isCompleted}
        />
        <Form>
          <FormItem>
            <Input placeholder="unavailable choice" type="file" name="filePath" onChange={this.click} style={{width: 10 + 'em'}}/>
          </FormItem>
        </Form>
      </div>



    );
  }


}

function mapStateToProps(state) {
  //const { todos, colors } = state.Todos;
  return {
    fileData: state.fileData
    // todos,
    // colors
  };
}
export default connect(mapStateToProps, {uploadFile})(TaskComponent);
