// @flow

import React, { Component } from 'react';
import { connect } from "react-redux";
import style from 'styled-components';

import Button from '../../../components/uielements/button';
import type { DiagComponentProps } from 'react-flow-diagram';
import {trimFiles} from '../../../redux/fastqcuploader/trimActions.js';

import Form from '../../../components/uielements/form';


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
    console.log(this.state)
    this.state = {
      name: this.props.model.name,
      isTrimCompleted: false,
    };
    this.click= this.click.bind(this)
  }


  click(e){
    //this.setState({file:e.target.files[0]});
    var test = trimFiles({file:e.target.files[0]});
    test.then(res => {
        if(res.status === 201){
          //console.log('asdfasd');
          this.setState({isTrimCompleted: true})
        }
        else {
          this.setState({isTrimCompleted: false})
        }
      })

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
            <Button onClick={this.click} style={{width: 10 + 'em'}}/>
          </FormItem>
        </Form>
      </div>



    );
  }


}

function mapStateToProps(state) {
  //console.log(state);
  return {

  };
}
export default connect(mapStateToProps, {trimFiles})(TaskComponent);
