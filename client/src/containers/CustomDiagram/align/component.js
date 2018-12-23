// @flow

import React, { Component } from 'react';
import { connect } from "react-redux";
import style from 'styled-components';

import Button from '../../../components/uielements/button';
import type { DiagComponentProps } from 'react-flow-diagram';
import {trimFiles} from '../../../redux/fastqcuploader/trimActions.js';
import {
  store as diagramStore
} from 'react-flow-diagram';
import Form from '../../../components/uielements/form';
//import {store as storeMain} from '../../../redux/store.js';


const FormItem = Form.Item;


/*
 * Presentational
 * ==================================== */

const TaskStyle = style.div`
  background-color: ${props => (props.isTrimCompleted ? 'green' : '#fff')};
  display: flex;
  flex-flow: row nowrap;
  align-items:  center;
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
  isTrimCompleted: boolean,
};
const Task = (props: TaskProps) => (
  <TaskStyle
    width={props.model.width}
    height={props.model.height}
    isTrimCompleted={props.isTrimCompleted}
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
    //console.log(this.state)
    this.state = {
      name: this.props.model.name,
      isTrimCompleted: false,
    };
    this.click= this.click.bind(this)
  }


  click(e){
    e.preventDefault();

    //this.setState({file:e.target.files[0]});
    var test = trimFiles(diagramStore.getState().entity[0]);
    test.then(res => {
        //console.log(res.data.isTrimCompleted);
        if(res.data.isTrimCompleted){
          this.setState({isTrimCompleted: true});
          var file1Name = res.data.file1.replace(".", "_")+'c.html';
          var file2Name = res.data.file2.replace(".", "_")+'c.html';
          //console.log(file1Name);
          window.open("http://localhost:3000/Fastqc/"+file1Name);
          window.open("http://localhost:3000/Fastqc/"+file2Name);
        } else {
          this.setState({isTrimCompleted: false});
        }
    })
  //  console.log(storeMain.getState());

  }

  render() {
    // const {
    //   isTrimCompleted
    // } = this.props;
    return (
      <div>
        <Task
          {...this.props}
          name={this.state.name}
          isTrimCompleted = {this.state.isTrimCompleted}
        />
        <Form>
          <FormItem>
            <Button type="primary" style={{width: 10 + 'em'}} onClick={this.click} >
              Trim
            </Button>
          </FormItem>
        </Form>
      </div>



    );
  }


}

function mapStateToProps(state) {
  return {

  };
}
export default connect(mapStateToProps, {trimFiles})(TaskComponent);
