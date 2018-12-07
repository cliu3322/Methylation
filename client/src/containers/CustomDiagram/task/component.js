// @flow

import React from 'react';
import style from 'styled-components';

import type { DiagComponentProps } from 'react-flow-diagram';

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
  isEditing: boolean,
  isCompleted: boolean,
  toggleEdit: boolean => void,
  refreshName: (SyntheticEvent<HTMLTextAreaElement>) => void,
  handleKeyPress: (SyntheticKeyboardEvent<HTMLTextAreaElement>) => void,
  handleRef: HTMLTextAreaElement => void,
};
const Task = (props: TaskProps) => (
  <TaskStyle
    width={props.model.width}
    height={props.model.height}
    isEditing={props.isEditing}
    isCompleted={props.isCompleted}
  >

    <Name
      onClick={() => props.toggleEdit(true)}
      style={{ display: !props.isEditing ? 'block' : 'none' }}
    >
      {props.model.name}
    </Name>
  </TaskStyle>
);

/*
 * Container
 * ==================================== */

type TaskComponentProps = DiagComponentProps;
type TaskComponentState = {
  isEditing: boolean,
  name: string,
  isCompleted: boolean,
};
class TaskComponent extends React.PureComponent<
  TaskComponentProps,
  TaskComponentState
> {
  textarea: ?HTMLTextAreaElement;

  state = {
    isEditing: false,
    name: this.props.model.name,
    isCompleted: false,
  };

  componentWillUnmount() {
    this.textarea = null;
  }

  handleRef = (textarea: HTMLTextAreaElement) => {
    if (!this.textarea) {
      this.textarea = textarea;
    }
  };

  toggleEdit = (isEditing: boolean) => {
  };

  refreshName = (ev: SyntheticEvent<HTMLTextAreaElement>) => {
    this.setState({ name: ev.currentTarget.value });
  };

  handleKeyPress = (ev: SyntheticKeyboardEvent<HTMLTextAreaElement>) => {
  };
  uploadFastQC = () => {
    const file = this.fileUpload.files[0];
    console.log(file);
    this.setState({ isCompleted: true});

    console.log(this.state);
  }
  render() {
    return (
      <div>
        <Task
          {...this.props}
          isEditing={this.state.isEditing}
          name={this.state.name}
          toggleEdit={this.toggleEdit}
          refreshName={this.refreshName}
          handleKeyPress={this.handleKeyPress}
          handleRef={this.handleRef}
          isCompleted = {this.state.isCompleted}
        />
        <div>
          <input type="file" ref={(ref) => this.fileUpload = ref}/>
          <br/>
          <button onClick={this.uploadFastQC} style={{marginRight: 17 + 'em'}} >Submit</button>
        </div>
      </div>



    );
  }


}

export default TaskComponent;
