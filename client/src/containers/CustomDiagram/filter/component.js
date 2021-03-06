// @flow

import React, { Component } from 'react';
import { connect } from "react-redux";
import style from 'styled-components';

import Button from '../../../components/uielements/button';
import type { DiagComponentProps } from 'react-flow-diagram';
import {alignFiles} from '../../../redux/actions/alignActions.js';
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
  background-color: ${props => (props.isFilterCompleted ? 'green' : '#fff')};
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
  isFilterCompleted: boolean,
};
const Task = (props: TaskProps) => (
  <TaskStyle
    width={props.model.width}
    height={props.model.height}
    isFilterCompleted={props.isFilterCompleted}
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
      isFilterCompleted: false,
    };
    this.click= this.click.bind(this)
  }


  click(e){
    e.preventDefault();

    //this.setState({file:e.target.files[0]});
    console.log(diagramStore.getState().entity[1])
    // var test = alignFiles(diagramStore.getState().entity[1]);
    // test.then(res => {
    //     console.log(res);
    //     if(res.data.isFilterCompleted){
    //       this.setState({isFilterCompleted: true});
    //
    //     } else {
    //       this.setState({isFilterCompleted: false});
    //     }
    // })
    this.setState({isFilterCompleted: true});
  }

  render() {
    // const {
    //   isFilterCompleted
    // } = this.props;
    return (
      <div>
        <Task
          {...this.props}
          name={this.state.name}
          isFilterCompleted = {this.state.isFilterCompleted}
        />
        <Form>
          <FormItem>
            <Button type="primary" style={{width: 10 + 'em'}} onClick={this.click} >
              Align
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
export default connect(mapStateToProps, {alignFiles})(TaskComponent);
