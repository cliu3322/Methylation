// @flow

import React, { Component } from 'react';
import { connect } from "react-redux";
import style from 'styled-components';

import Button from '../../../components/uielements/button';
import type { DiagComponentProps } from 'react-flow-diagram';
import {extractPrimaryReadsFiles} from '../../../redux/actions/extractPrimaryReadsActions.js';
import {
  store as diagramStore, setEntities
} from 'react-flow-diagram';
import Form from '../../../components/uielements/form';
import Spin from '../spin.style';
import model from '../model-example';
//import {store as storeMain} from '../../../redux/store.js';


const FormItem = Form.Item;


/*
 * Presentational
 * ==================================== */

const TaskStyle = style.div`
  background-color: ${props => (props.isExtractPrimaryReads ? 'lawngreen' : 'red')};
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
  isExtractPrimaryReads: boolean,
};
const Task = (props: TaskProps) => (
  <TaskStyle
    width={props.model.width}
    height={props.model.height}
    isExtractPrimaryReads={props.isExtractPrimaryReads}
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
      isExtractPrimaryReads: false,
      isloading:false,
    };
    this.click= this.click.bind(this)
  }


  click(e){
    e.preventDefault();

    //this.setState({file:e.target.files[0]});
    this.setState({isloading: true});
    var test = extractPrimaryReadsFiles(diagramStore.getState().entity[0]);
    test.then(res => {
      this.setState({isloading: false});
      console.log(res.data);
      if(res.data.isExtractPrimaryReads){
        this.setState({isExtractPrimaryReads: true});
         var file1Name = res.data.file1;
        var file2Name = res.data.file2;
        //console.log(file1Name);
        window.open("http://localhost:3000/trimmed_result/"+file1Name);
        window.open("http://localhost:3000/trimmed_result/"+file2Name);

        model[1].isCompleted = true;
        model[1].fqFile1 = res.data.fqFilesName1;
        model[1].fqFile2 = res.data.fqFilesName2;
        diagramStore.dispatch(setEntities(model));

      } else {
        this.setState({isExtractPrimaryReads: false});
      }
    })
  //  console.log(storeMain.getState());

  }

  render() {
    // const {
    //   isExtractPrimaryReads
    // } = this.props;
    return (
      <div>
        <Task
          {...this.props}
          name={this.state.name}
          isExtractPrimaryReads = {this.state.isExtractPrimaryReads}
        />
        <Form>
          <FormItem>
            <Button type="primary" style={{width: 10 + 'em'}} onClick={this.click} disabled={this.state.isloading}>
              Extract
            </Button>
            {this.state.isloading? <Spin></Spin>: null}
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
export default connect(mapStateToProps, {extractPrimaryReadsFiles})(TaskComponent);
