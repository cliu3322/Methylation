// @flow

import React, { Component } from 'react';
import { connect } from "react-redux";
import style from 'styled-components';
import Input from '../../../components/uielements/input';
import type { DiagComponentProps } from 'react-flow-diagram';
import {
  store as diagramStore, setEntities
} from 'react-flow-diagram';
import {uploadFile} from '../../../redux/actions/uploadActions.js';
import uploadFastqcActions from '../../../redux/uploadFastqc/actions.js';
import dateformat from 'dateformat';
import Form from '../../../components/uielements/form';
import model from '../model-example';

const FormItem = Form.Item;


/*
 * Presentational
 * ==================================== */

const TaskStyle = style.div`
  background-color: ${props => (props.isCompleted ? 'lawngreen' : 'red')};
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
const {
  changeCompleted
} = uploadFastqcActions;


class TaskComponent extends Component<
  TaskComponentProps
> {

  constructor(props) {
    super(props);
    this.state = {
      FileDetails: [],
      name: this.props.model.name,
      isCompleted: false,
      file1Completed: false,
      file2Completed: false,
      loaded: 0,
    };
    this.click= this.click.bind(this);
    this.uploa2= this.click.bind(this);
    //console.log(changeCompleted)
    //this.upload2= this.upload2.bind(this);
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

    //console.log(e.target.name)
    var uploadResult = uploadFile({file:e.target.files[0]});
    var filename = e.target.name
    uploadResult.then(res => {
        if(res.status === 201){
          //console.log('asdfasd');
          if(filename==='file1'){
            this.setState({file1Completed: true})
            model[0].file1 = res.data.fileName;
            diagramStore.dispatch(setEntities(model));
          }
          if(filename==='file2'){
            this.setState({file2Completed: true})
            model[0].file2 = res.data.fileName;
            diagramStore.dispatch(setEntities(model));
          }
          if(this.state.file1Completed && this.state.file2Completed) {
            model[0].isCompleted = true;
            diagramStore.dispatch(setEntities(model));
            this.setState({isCompleted: true})
            //console.log(diagramStore.getState());

          }
          else {
            this.setState({isCompleted: false})
          }
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
            <Input type="file" name="file1" onChange={this.click} style={{width: 10 + 'em'}}/>
            <Input type="file" name="file2" onChange={this.click} style={{width: 10 + 'em'}}/>
          </FormItem>
        </Form>
      </div>



    );
  }


}

function mapStateToProps(state) {
  //const { todos, colors } = state.Todos;
  //console.log(state)
  return {
    fileData: state.fileData
    // todos,
    // colors
  };
}
export default connect(mapStateToProps, {changeCompleted})(TaskComponent);
